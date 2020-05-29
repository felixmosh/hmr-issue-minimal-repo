const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

module.exports = {
  name: "server",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../node_modules"),
      "node_modules",
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  mode: "development",
  node: {
    fs: "empty",
    dns: "mock",
    net: "mock",
    tls: "mock",
  },
  entry: {
    app: ["./src/frontend-entry-point.tsx"],
    vendor: ["react"],
  },

  output: {
    path: path.resolve(__dirname, "../dist/assets/"),
    publicPath: "/assets",
    pathinfo: false,
    filename: "[name].js",
  },

  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },

  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.ts(?:x?)$/u,
        exclude: /node_modules/u,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
      {
        exclude: /node_modules/u,
        test: /\.css$/u,
        use: ["css-loader"],
      },
    ],
  },
  externals: [
    "module",
    "pnpapi",
    "fsevents",
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../node_modules"),
    }),
    "child_process",
    "babel_loader",
    "webpack",
    "loader-runner",
  ],
  plugins: [
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "DEBUG",
      "JWT_PUBLIC_KEY",
      "APP_LOG_LEVEL",
    ]),
  ],
};
