const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            }
          },
          'less-loader',
          'postcss-loader'
        ],
      },
    ]
  },
  devServer: {
    overlay: true,
    contentBase: '../dist',
    open: true,
    hot: true,
    hotOnly: true,
    // 支持SPA路由
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
};
