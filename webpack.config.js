/**
 * Webpack allows you to define externals - modules that should not be bundled.

When bundling with Webpack for the backend - you usually don't want to bundle its node_modules dependencies. This library creates an externals function that ignores node_modules when bundling in Webpack.
 */
const appRoot = require("app-root-path");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const config = {
  mode: process.env.NODE_ENV,
  target: "node",
  externals: [nodeExternals()],
  entry: {
    index: "./src/index.ts"
  },
  output: {
    path: path.join(appRoot.path, "dist"),
    filename: "[name].bundle.js",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        /** awesome-typescript-loader
         *  웹팩이 ts표준 설정파일인 tsconfig.json을 활용해서 컴파일 하게 도와주는 로더. {module es2015 설정해야함}.
         * Babel 을 통해 ES5로 변환
         * 캐시 활용 webpack 컴파일을 더빠르게 해줌
         * */
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      },
      /** source-map-loader
       * webpack이 여러 라이브러리를 관리하는 과정에서
       * 소스맵 데이터의 연속성을 유지하기 위해 필요
       * 소스맵이 변경될때 마다 웹패에게 알려줌
       */
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { enforce: "pre", test: /\.ts$/, loader: "tslint-loader" }
    ]
  },
  resolve: {
    // import시 확장자 생략
    extensions: [".ts", ".js", ".json"]
  }
};

module.exports = config;
