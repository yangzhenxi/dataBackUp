const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
const vueConfig = {
  assetsDir: 'static',

  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CompressionWebpackPlugin({
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    // if prod, add externals
    externals: {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 8000,
    proxy: {
        '/api/v1': {
          target: 'http://192.168.2.235:8090',
          ws: false,
          changeOrigin: true
        }
      }
  },

  // disable source map in production
  productionSourceMap: false,

  lintOnSave: undefined,

  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],

  publicPath: './'
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
