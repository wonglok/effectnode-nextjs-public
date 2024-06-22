import * as THREE from "three";
import {
  uv,
  vec4,
  color,
  mix,
  range,
  pass,
  timerLocal,
  add,
  positionLocal,
  attribute,
  buffer,
  tslFn,
  uniform,
  texture,
  instanceIndex,
  float,
  vec3,
  storage,
  SpriteNodeMaterial,
  If,
} from "three/nodes";

import WebGPU from "three/addons/capabilities/WebGPU.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";
import StorageInstancedBufferAttribute from "three/addons/renderers/common/StorageInstancedBufferAttribute.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { rand } from "/tester/rand.js";
// import * as happy from "@/happy.js";
// console.log(happy);
// import PostProcessing from "three/addons/renderers/common/PostProcessing.js";

let rAFID = 0;
const particleCount = 512 * 512;

const gravity = uniform(-0.0098);
const bounce = uniform(0.999);
const friction = uniform(0.999);
const size = uniform(0.14);

const clickPosition = uniform(new THREE.Vector3());

let postProcessing;
let camera, scene, renderer;
let controls, stats;
let computeParticles;
let mixer, clock;

let computeHit;

const timestamps = document.createElement("div");
// document.appendChild(te)

new FBXLoader().load("/tester/raw-guy.fbx", function (gltf) {
  new FBXLoader().load(`/tester/mma-warmup.fbx`, (anim) => {
    gltf.scene = gltf;
    gltf.animations = anim.animations;
    init({ gltf });
  });
});

function init({ gltf }) {
  let group = new THREE.Group();
  group.scale.setScalar(0.01);
  clock = new THREE.Clock();
  mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(gltf.animations[0]).play();

  gltf.scene.updateMatrixWorld(true);
  let skinnedMesh = false;
  gltf.scene.traverse((it) => {
    if (it.geometry) {
      it.material = new THREE.MeshStandardMaterial({
        roughness: 0,
        transparent: true,
        opacity: 0,
      });
      if (it.name === "Body") {
        if (!skinnedMesh) {
          skinnedMesh = it;
        }
      } else {
        if (it.geometry) {
          it.visible = false;
        }
      }
    }
  });

  //
  skinnedMesh.geometry = skinnedMesh.geometry.toNonIndexed();

  skinnedMesh.material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  let hasWebGPU = WebGPU.isAvailable();
  let hasWebGL2 = WebGL.isWebGL2Available();

  if (hasWebGPU) {
    timestamps.innerText = "Running WebGPU";
  } else if (hasWebGL2) {
    timestamps.innerText = "Running WebGL2";
  } else {
    timestamps.innerText = "No WebGPU or WebGL2 support";
  }

  if (hasWebGPU === false && hasWebGL2 === false) {
    document.body.appendChild(WebGPU.getErrorMessage());
    throw new Error("No WebGPU or WebGL2 support");
  } else {
  }

  const { innerWidth, innerHeight } = window;

  camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(1.5, 2, 4);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000");
  group.add(gltf.scene);

  scene.add(group);
  // textures

  const textureLoader = new THREE.TextureLoader();
  const map = textureLoader.load("/tester/sprite1.png");

  const createBuffer = ({ itemSize = 3, type = "vec3" }) => {
    let attr = new StorageInstancedBufferAttribute(particleCount, itemSize);
    let node = storage(attr, type, particleCount);
    return {
      node,
      attr,
    };
  };

  //
  //

  const positionBuffer = createBuffer({ itemSize: 3, type: "vec3" });
  const velocityBuffer = createBuffer({ itemSize: 3, type: "vec3" });
  const colorBuffer = createBuffer({ itemSize: 3, type: "vec3" });
  const lifeBuffer = createBuffer({ itemSize: 3, type: "vec3" });

  const birthPositionBuffer = createBuffer({ itemSize: 3, type: "vec3" });
  const birthNormalBuffer = createBuffer({ itemSize: 3, type: "vec3" });

  const bindMatrixNode = uniform(skinnedMesh.bindMatrix, "mat4");
  const bindMatrixInverseNode = uniform(skinnedMesh.bindMatrixInverse, "mat4");
  const boneMatricesNode = {
    node: buffer(
      skinnedMesh.skeleton.boneMatrices,
      "mat4",
      skinnedMesh.skeleton.bones.length
    ),
  };

  const skinIndexNode = createBuffer({ itemSize: 4, type: "vec4" });
  const skinWeightNode = createBuffer({ itemSize: 4, type: "vec4" });
  const processedPositionBuffer = createBuffer({
    itemSize: 3,
    type: "vec3",
  });

  let geo = skinnedMesh.geometry;
  let localCount = geo.attributes.position.count;

  {
    for (let i = 0; i < particleCount; i++) {
      let yo = i % localCount;

      let x =
        geo.attributes.position.getX(yo) + (Math.random() * 2 - 1.0) * 2.0;
      let y =
        geo.attributes.position.getY(yo) + (Math.random() * 2 - 1.0) * 2.0;
      let z =
        geo.attributes.position.getZ(yo) + (Math.random() * 2 - 1.0) * 2.0;
      birthPositionBuffer.attr.setXYZ(i, x, y, z);
      birthPositionBuffer.attr.needsUpdate = true;
    }
  }
  {
    for (let i = 0; i < particleCount; i++) {
      let yo = i % localCount;

      let x = geo.attributes.normal.getX(yo);
      let y = geo.attributes.normal.getY(yo);
      let z = geo.attributes.normal.getZ(yo);

      birthNormalBuffer.attr.setXYZ(i, x, y, z);
      birthNormalBuffer.attr.needsUpdate = true;
    }
  }
  {
    for (let i = 0; i < particleCount; i++) {
      let yo = i % localCount;

      lifeBuffer.attr.setXYZ(i, Math.random(), Math.random(), Math.random());
      lifeBuffer.attr.needsUpdate = true;
    }
  }
  {
    for (let i = 0; i < particleCount; i++) {
      let yo = i % localCount;

      let x = geo.attributes.skinIndex.getX(yo);
      let y = geo.attributes.skinIndex.getY(yo);
      let z = geo.attributes.skinIndex.getZ(yo);
      let w = geo.attributes.skinIndex.getW(yo);
      skinIndexNode.attr.setXYZ(i, x, y, z, w);
      skinIndexNode.attr.needsUpdate = true;
    }
  }

  {
    for (let i = 0; i < particleCount; i++) {
      let yo = i % localCount;

      let x = geo.attributes.skinWeight.getX(yo);
      let y = geo.attributes.skinWeight.getY(yo);
      let z = geo.attributes.skinWeight.getZ(yo);
      let w = geo.attributes.skinWeight.getW(yo);
      skinWeightNode.attr.setXYZ(i, x, y, z, w);
      skinWeightNode.attr.needsUpdate = true;
    }
  }

  // compute
  const computeInit = tslFn(() => {
    const position = positionBuffer.node.element(instanceIndex);
    const birth = birthPositionBuffer.node.element(instanceIndex);
    const color = colorBuffer.node.element(instanceIndex);

    const randX = instanceIndex.hash();
    const randY = instanceIndex.add(2).hash();
    const randZ = instanceIndex.add(3).hash();

    position.x.assign(birth.x);
    position.y.assign(birth.y);
    position.z.assign(birth.z);

    color.assign(vec3(randX, randY, randZ));
  })().compute(particleCount);

  const computeUpdate = tslFn(() => {
    const time = timerLocal();
    const color = colorBuffer.node.element(instanceIndex);
    const position = positionBuffer.node.element(instanceIndex);
    const velocity = velocityBuffer.node.element(instanceIndex);

    // velocity.addAssign(vec3(0.0, gravity.mul(life.y), 0.0));
    position.addAssign(velocity);

    // velocity.mulAssign(friction);

    // floor
    // position.addAssign(birth)
    // position.y.addAssign(15)

    // If(velocity.xz.length().lessThan(0.01), () => {
    // 	position.assign(birth)
    // })

    const skinPosition = processedPositionBuffer.node.element(instanceIndex);

    const life = lifeBuffer.node.element(instanceIndex);
    life.addAssign(rand(position.xy).mul(-5.0 / 60.0));

    If(life.y.lessThan(0.1), () => {
      life.xyz.assign(vec3(1.0, 1.0, 1.0));

      velocity.assign(skinPosition.sub(position).normalize().mul(0.1));

      position.assign(skinPosition.xyz);

      // if (WebGPU.isAvailable()) {
      // } else {
      // 	position.assign(birth)
      // 	// velocity.y = float(1).mul(rand(position.xz))
      // }
    });
  });

  computeParticles = computeUpdate().compute(particleCount);

  // create nodes
  const textureNode = texture(map, uv());

  const avgColor = add(textureNode.r, textureNode.g, textureNode.b).div(3);

  // create particles
  const particleMaterial = new SpriteNodeMaterial();

  // const finalColor = mix(color('orange'), color('blue'), range(0, 1));
  let colorNode = velocityBuffer.node
    .toAttribute()
    .normalize()
    .mul(0.5)
    .add(0.5)
    .mul(1.5);

  particleMaterial.colorNode = vec4(colorNode.r, colorNode.g, colorNode.b, 1.0)
    .mul(vec4(avgColor, avgColor, avgColor, textureNode.a))
    .mul(vec4(2.0, 2.0, 2.0, 1.0));

  particleMaterial.positionNode = positionBuffer.node.toAttribute();

  particleMaterial.scaleNode = size.mul(50).div(colorNode.length());
  particleMaterial.opacity = 1.0; //(float(0.14).add(lifeBuffer.node.toAttribute().length().mul(-1).mul(size)))
  particleMaterial.depthTest = true;
  particleMaterial.depthWrite = false;
  particleMaterial.transparent = true;

  const particles = new THREE.Mesh(
    new THREE.CircleGeometry(0.05, 12),
    particleMaterial
  );
  particles.isInstancedMesh = true;
  particles.count = particleCount;
  particles.frustumCulled = false;

  group.add(particles);

  const helper = new THREE.GridHelper(60, 40, 0x303030, 0x303030);
  scene.add(helper);

  const geometry = new THREE.PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);

  const plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ visible: false })
  );
  scene.add(plane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer = new WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  renderer.compute(computeInit);

  computeHit = tslFn(() => {
    // const birth = birthPositionBuffer.node.element(instanceIndex);
    const position = processedPositionBuffer.node.element(instanceIndex);
    // const velocity = velocityBuffer.node.element(instanceIndex);
    // const color = colorBuffer.node.element(instanceIndex);
    // const dist = position.distance(clickPosition);
    // const direction = position.sub(clickPosition).normalize();
    // const distArea = float(6).sub(dist).max(0);

    // const power = distArea.mul(.01);
    // const relativePower = power.mul(instanceIndex.hash().mul(.5).add(.5));

    // velocity.addAssign(direction.mul(relativePower));

    const birth = birthPositionBuffer.node.element(instanceIndex);

    const skinIndex = skinIndexNode.node.element(instanceIndex);
    const boneMatX = boneMatricesNode.node.element(skinIndex.x);
    const boneMatY = boneMatricesNode.node.element(skinIndex.y);
    const boneMatZ = boneMatricesNode.node.element(skinIndex.z);
    const boneMatW = boneMatricesNode.node.element(skinIndex.w);

    const skinVertex = bindMatrixNode.mul(birth);

    const skinWeight = skinWeightNode.node.element(instanceIndex);
    const skinned = add(
      boneMatX.mul(skinWeight.x).mul(skinVertex),
      boneMatY.mul(skinWeight.y).mul(skinVertex),
      boneMatZ.mul(skinWeight.z).mul(skinVertex),
      boneMatW.mul(skinWeight.w).mul(skinVertex)
    );

    const skinPosition = bindMatrixInverseNode.mul(skinned).xyz;

    // velocity.assign(skinPosition.sub(position).normalize().mul(0.1));
    position.assign(skinPosition);
    // ;

    /*

					//normal
					let skinMatrix = add(
						skinWeight.x.mul(boneMatX),
						skinWeight.y.mul(boneMatY),
						skinWeight.z.mul(boneMatZ),
						skinWeight.w.mul(boneMatW)
					);

					const myNormal = birthNormalBuffer.node.element(instanceIndex);

					skinMatrix = bindMatrixInverseNode.mul(skinMatrix).mul(bindMatrixNode);

					const skinNormal = skinMatrix.transformDirection(myNormal).xyz;

					// velocity.mulAssign(-0.5)
					// velocity.xyz.addAssign(skinNormal.mul(1.5))

					// velocity.y = velocity.y.add(float(gravity).mul(200))
					position.assign(skinPosition);

					*/
  })().compute(particleCount);

  function onMove(event) {
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects([plane], false);

    if (intersects.length > 0) {
      const { point } = intersects[0];

      // move to uniform

      clickPosition.value.copy(point);
      clickPosition.value.y = -1;

      // renderer.compute(computeHit);
    }
  }

  renderer.domElement.addEventListener("pointermove", onMove);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();

  setInterval(() => {
    gltf.scene
      .getObjectByName("mixamorigHead")
      .getWorldPosition(controls.target);

    controls.update();
  });

  //

  window.addEventListener("resize", onWindowResize);

  // gui

  const gui = new GUI();

  gui.add(gravity, "value", -0.0098, 0, 0.0001).name("gravity");
  gui.add(bounce, "value", 0.1, 1, 0.01).name("bounce");
  gui.add(friction, "value", 0.96, 0.99, 0.01).name("friction");
  gui.add(size, "value", 0.02, 0.5, 0.01).name("size");

  // post-processing

  rAFID = requestAnimationFrame(animate);
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
}

async function animate() {
  stats.update();

  mixer.update(clock.getDelta());

  await renderer.computeAsync(computeParticles);
  await renderer.computeAsync(computeHit);
  await renderer.renderAsync(scene, camera);

  // throttle the logging
  rAFID = requestAnimationFrame(animate);
}

export function close() {
  // cancelAnimationFrame(rAFID);
  // document.body.innerHTML = "";
}
//

//

//
