const merge = require("webpack-merge");

const baseConfig = require("./webpack.base");
const devConfig = require("./webpack.dev");
const prodConfig = require("./webpack.prod");


module.exports = env => {
  if (env && env.production) {
    return merge(baseConfig, prodConfig);
  }
  return merge(baseConfig, devConfig);
};
