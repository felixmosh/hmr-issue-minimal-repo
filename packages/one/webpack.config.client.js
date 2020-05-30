const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

const PATH_DELIMITER = "[\\\\/]"; // match 2 antislashes or one slash

const safePath = (module) => module.split(/[\\\/]/g).join(PATH_DELIMITER);

const generateIncludes = (modules) => {
  return [
    new RegExp(`(${modules.map(safePath).join("|")})$`),
    new RegExp(
      `(${modules.map(safePath).join("|")})${PATH_DELIMITER}(?!.*node_modules)`
    ),
  ];
};

const transpileModules = ["@minimal/two"];

module.exports = {
  name: "client",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    symlinks: false
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  mode: "development",
  target: "web",
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
        include: generateIncludes(transpileModules),
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  "@babel/preset-env",
                  { targets: { browsers: "last 2 versions" } } // or whatever your project requires
                ],
                "@babel/preset-typescript",
                "@babel/preset-react"
              ],
              plugins: [
                "react-hot-loader/babel"
              ]
            }
          }
        ],
      },
      {
        exclude: /node_modules/u,
        test: /\.css$/u,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "DEBUG",
      "JWT_PUBLIC_KEY",
      "APP_LOG_LEVEL",
    ]),
  ],
};
