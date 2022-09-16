// const path = require("path");
// const webpack = require("webpack");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const dfxJson = require("./dfx.json");
require("dotenv").config();
let localCanister;

try {
  localCanister = require("./.dfx/local/canister_ids.json").idp_service.local;
} catch {}

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters).reduce(
    (acc, [name, _value]) => {
      // Get the network name, or `local` by default.
      const networkName = process.env["DFX_NETWORK"] || "local";
      const outputRoot = path.join(
          __dirname,
          ".dfx",
          networkName,
          "canisters",
          name
      );

      return {
        ...acc,
        ["dfx-generated/" + name]: path.join(outputRoot, name + ".js"),
      };
    },
    {}
);

/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
  if (typeof info.frontend !== "object") {
    return;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const devtool = isProduction ? undefined : "source-map";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      // The public.entrypoint points to the HTML file for this build, so we need
      // to replace the extension to `.js`.
      index: path
          .join(__dirname, info.frontend.entrypoint)
          .replace(/\.html$/, ".tsx"),
    },
    devtool,
    optimization: {
      minimize: isProduction,
    },
    resolve: {
      alias: {
        "@": path.resolve("src"),
        "@bottom": path.resolve("src/components/bottom"),
        "@header": path.resolve("src/components/header"),
        "@home": path.resolve("src/components/home"),
        "@login": path.resolve("src/components/login"),
        "@tabs": path.resolve("src/components/tabs"),
        "@components": path.resolve("src/components"),
        ...aliases,
      },
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      fallback: {
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        events: require.resolve("events/"),
        stream: require.resolve("stream-browserify/"),
        util: require.resolve("util/"),
        crypto: false,
      },
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist"),
    },
    devServer: {
      historyApiFallback: true,
      port: 3001,
      proxy: {
        "/api": {
          target: "https://ic0.app",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
      allowedHosts: [".localhost", ".local", ".ngrok.io"],
      hot: true,
      contentBase: path.resolve(__dirname, "./src"),
      watchContentBase: true,
    },

    // Depending in the language or framework you are using for
    // front-end development, add module loaders to the default
    // webpack configuration. For example, if you are using React
    // modules and CSS as described in the "Adding a stylesheet"
    // tutorial, uncomment the following lines:
    module: {
      rules: [
        { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
        {
          test: /\.(css|less)$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        { test: /\.svg|jpg$/, loader: "file-loader" },
        { test: /\.ttf$/, loader: "file-loader" },
        { test: /\.wasm$/, loader: "file-loader" },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, info.frontend.entrypoint),
        filename: "index.html",
        chunks: ["index"],
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
        process: require.resolve("process/browser"),
        path: require.resolve("path"),
      }),
      new webpack.EnvironmentPlugin(["WEB_DIFIBASE_CANISTER_ID"]),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "src", "public", "assets"),
            to: path.join(__dirname, "dist"),
          },
        ],
      }),
    ],
  };
}

// If you have additional webpack configurations you want to build
//  as part of this configuration, add theme to the section below.
module.exports = [
  ...Object.entries(dfxJson.canisters)
      .map(([name, info]) => {
        return generateWebpackConfigForCanister(name, info);
      })
      .filter((x) => !!x),
];





// const CopyPlugin = require("copy-webpack-plugin");
//
// let localCanisters, prodCanisters, canisters;
//
// function initCanisterIds() {
//   try {
//     localCanisters = require(path.resolve(".dfx", "local", "canister_ids.json"));
//   } catch (error) {
//     console.log("No local canister_ids.json found. Continuing production");
//   }
//   try {
//     prodCanisters = require(path.resolve("canister_ids.json"));
//   } catch (error) {
//     console.log("No production canister_ids.json found. Continuing with local");
//   }
//
//   const network =
//       process.env.DFX_NETWORK ||
//       (process.env.NODE_ENV === "production" ? "ic" : "local");
//
//   canisters = network === "local" ? localCanisters : prodCanisters;
//
//   for (const canister in canisters) {
//     process.env[canister.toUpperCase() + "_CANISTER_ID"] =
//         canisters[canister][network];
//   }
// }
// initCanisterIds();
//
// const isDevelopment = process.env.NODE_ENV !== "production";
// const asset_entry = path.join(
//     "src",
//     "difi_assets",
//     "src",
//     "index.html"
// );
//
// module.exports = {
//   target: "web",
//   mode: isDevelopment ? "development" : "production",
//   entry: {
//     // The frontend.entrypoint points to the HTML file for this build, so we need
//     // to replace the extension to `.js`.
//     index: path.join(__dirname, asset_entry).replace(/\.html$/, ".js"),
//   },
//   devtool: isDevelopment ? "source-map" : false,
//   optimization: {
//     minimize: !isDevelopment,
//     minimizer: [new TerserPlugin()],
//   },
//   resolve: {
//     extensions: [".js", ".ts", ".jsx", ".tsx"],
//     fallback: {
//       assert: require.resolve("assert/"),
//       buffer: require.resolve("buffer/"),
//       events: require.resolve("events/"),
//       stream: require.resolve("stream-browserify/"),
//       util: require.resolve("util/"),
//     },
//   },
//   output: {
//     filename: "index.js",
//     path: path.join(__dirname, "dist", "difi_assets"),
//   },
//
//   // Depending in the language or framework you are using for
//   // front-end development, add module loaders to the default
//   // webpack configuration. For examples, if you are using React
//   // modules and CSS as described in the "Adding a stylesheet"
//   // tutorial, uncomment the following lines:
//   module: {
//    rules: [
//      { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
//      { test: /\.css$/, use: ['style-loader','css-loader'] }
//    ]
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: path.join(__dirname, asset_entry),
//       cache: false
//     }),
//     new CopyPlugin({
//       patterns: [
//         {
//           from: path.join(__dirname, "src", "difi_assets", "assets"),
//           to: path.join(__dirname, "dist", "difi_assets"),
//         },
//       ],
//     }),
//     new webpack.EnvironmentPlugin({
//       NODE_ENV: 'development',
//       DIFI_CANISTER_ID: canisters["difi"]
//     }),
//     new webpack.ProvidePlugin({
//       Buffer: [require.resolve("buffer/"), "Buffer"],
//       process: require.resolve("process/browser"),
//     }),
//   ],
//   // proxy /api to port 8000 during development
//   devServer: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         pathRewrite: {
//           "^/api": "/api",
//         },
//       },
//     },
//     hot: true,
//     contentBase: path.resolve(__dirname, "./src/difi_assets"),
//     watchContentBase: true
//   },
// };
