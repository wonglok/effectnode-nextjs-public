// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// })

// /**
//  * A fork of 'next-pwa' that has app directory support
//  * @see https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1332258575
//  */
// const withPWA = require('@ducanh2912/next-pwa').default({
//     dest: 'public',
//     disable: process.env.NODE_ENV === 'development',
// })

const nextConfig = {
  // uncomment the following snippet if using styled components
  // compiler: {
  //   styledComponents: true,
  // },
  reactStrictMode: false, // Recommended for the `pages` directory, default in `app`.
  images: {},
  webpack: (config, { isServer }) => {
    // let found = config.module.rules.filter(ru => {
    //   if (ru.use.some(u => u.includes('post'))) {
    //     return true
    //   }
    //   return false
    // })

    // console.log(found)

    // config.module.rules.push({
    //   test: /\.css$/i,
    //   use: ["style-loader", "css-loader", "postcss-loader"],
    // })

    // console.log(config.module.rules)

    config.module.rules = config.module.rules.filter((rule) => {
      return rule.loader !== "next-image-loader";
    });

    // config.module.rules.push({
    //   test: /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i,
    //   exclude: /node_modules/,
    //   use: [
    //     {
    //       //${config.assetPrefix}
    //       loader: 'file-loader',
    //       options: {
    //         limit: 0, /// config.inlineImageLimit,
    //         fallback: 'file-loader',
    //         publicPath: `/_next/static/images/`,
    //         outputPath: `${isServer ? '../' : ''}static/images/`,
    //         name: '[name]-[hash].[ext]',
    //         esModule: config.esModule || false,
    //       },
    //     },
    //   ],
    // })

    config.module.rules.push({
      test: /\.(glb|gltf|hdr|exr|fbx|ttf|png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/,
      exclude: /node_modules/,
      use: [
        {
          //${config.assetPrefix}
          loader: "file-loader",
          options: {
            limit: 0, /// config.inlineImageLimit,
            fallback: "file-loader",
            publicPath: `/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },

  // webpack(config, { isServer }) {
  //     if (!isServer) {
  //         // We're in the browser build, so we can safely exclude the sharp module
  //         config.externals.push('sharp')
  //     }

  //     let rules = config.module.rules

  //     config.module.rules = rules.filter(r => {
  //         if (r.loader === 'next-image-loader') {
  //             return false
  //         }
  //         return true
  //     })
  //     console.log(rules)

  //     // // audio support
  //     // config.module.rules.push({
  //     //     test: /\.(ogg|mp3|wav|mpe?g)$/i,
  //     //     exclude: config.exclude,
  //     //     use: [
  //     //         {
  //     //             loader: require.resolve('file-loader'),
  //     //             options: {
  //     //                 limit: config.inlineImageLimit,
  //     //                 fallback: require.resolve('file-loader'),
  //     //                 publicPath: `${config.assetPrefix}/_next/static/images/`,
  //     //                 outputPath: `${isServer ? '../' : ''}static/images/`,
  //     //                 name: '[name]-[hash].[ext]',
  //     //                 esModule: config.esModule || false,
  //     //             },
  //     //         },
  //     //     ],
  //     // })

  //     config.module.rules.push({
  //         test: /\.(glb|gltf|hdr|fbx)$/,
  //         exclude: config.exclude,
  //         use: [
  //             {
  //                 //${config.assetPrefix}
  //                 loader: require.resolve('file-loader'),
  //                 options: {
  //                     limit: 0,//,config.inlineImageLimit,
  //                     fallback: require.resolve('file-loader'),
  //                     publicPath: `/_next/static/images/`,
  //                     outputPath: `${isServer ? '../' : ''}static/images/`,
  //                     name: '[name]-[hash].[ext]',
  //                     esModule: config.esModule || false,
  //                 },
  //             },
  //         ],
  //     })

  //     // shader support
  //     config.module.rules.push({
  //         test: /\.(glsl|vs|fs|vert|frag)$/,
  //         exclude: /node_modules/,
  //         use: ['raw-loader', 'glslify-loader'],
  //     })

  //     return config
  // },
};

// const KEYS_TO_OMIT = ['webpackDevMiddleware', 'configOrigin', 'target', 'analyticsId', 'webpack5', 'amp', 'assetPrefix']

export default nextConfig;

// (_phase, { defaultConfig }) => {
//     //[withPWA],
//     const plugins = [[withBundleAnalyzer, {}]]

//     const wConfig = plugins.reduce((acc, [plugin, config]) => plugin({ ...acc, ...config }), {
//         ...defaultConfig,
//         ...nextConfig,
//     })

//     const finalConfig = {}
//     Object.keys(wConfig).forEach((key) => {
//         if (!KEYS_TO_OMIT.includes(key)) {
//             finalConfig[key] = wConfig[key]
//         }
//     })

//     return finalConfig
// }
