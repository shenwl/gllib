const path = require('path')
const fs = require('fs')

const demos = fs.readdirSync(path.resolve(__dirname, "demo"))
const menus = require('./menus.json')

const entry = {}
demos.forEach(app => {
  entry[app] = path.resolve(__dirname, "demo", app, 'index.ts')
})
module.exports = {
  entry,
  output: {
    filename: '[name].js'
  },
  devtool: "eval-source-map",
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      loader: "ts-loader",
    },
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
    {
      test: /\.jpg|.jpeg|.png$/,
      loader: 'file-loader'
    }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "static"),
    watchOptions: {
      poll: true
    },
    before: (app) => {
      app.get('/', (req, res) => {
        let content = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        const menuStr = Object.entries(menus).map(([key, name]) => {
          return `<li><a class='menu-item' data-link='${key}'>${name}</a></li>`
        }).join('\n')
        content = content.replace("__MENU__", menuStr)

        res.send(content)
      })

      demos.forEach(dir => {
        if (dir === 'common') return;
        app.get('/' + dir, (req, res) => {
          let content = fs.readFileSync(path.resolve(__dirname, 'demo', dir, "index.html"), 'utf-8')
          content = content.replace("__APP__", dir)
          res.send(content)
        })
      })
    },
    compress: true,
    port: 3001
  }
}
