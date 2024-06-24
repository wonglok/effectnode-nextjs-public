import * as THREE from "three";
import WebGPU from "three/addons/capabilities/WebGPU.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";

function onEvent(event, fnc, onClean) {
  window.addEventListener(event, fnc);
  onClean(() => {
    window.removeEventListener(event, fnc);
  });
}

function makeGPU({ onClean }) {
  let api = {};

  let clock = new THREE.Clock();
  api.clock = clock;

  let renderer = new WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  api.renderer = renderer;

  onEvent(
    "resize",
    () => {
      renderer.setSize(window.innerWidth, innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
    },
    onClean
  );

  const { innerWidth, innerHeight } = window;

  const camera = new THREE.PerspectiveCamera(
    50,
    innerWidth / innerHeight,
    0.1,
    1000
  );
  api.camera = camera;

  onEvent(
    "resize",
    () => {
      camera.aspect = window.innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    },
    onClean
  );

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000");
  api.scene = scene;

  const timestamps = document.createElement("div");
  const hasWebGPU = WebGPU.isAvailable();
  const hasWebGL2 = WebGL.isWebGL2Available();

  api.timestamps = timestamps;
  api.hasWebGL2 = hasWebGL2;
  api.hasWebGPU = hasWebGPU;

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
  }

  return api;
}

export const setup = async ({ onClean, useCore, ...api }) => {
  let gpuMod = makeGPU({ onClean });
  let ready = false;
  for (let kn in gpuMod) {
    useCore.setState({ [kn]: gpuMod[kn] });
  }

  api.onLoop(() => {
    if (ready) {
      let { renderer, scene, camera } = useCore.getState();
      renderer.render(scene, camera);
    }
  });

  //
};
