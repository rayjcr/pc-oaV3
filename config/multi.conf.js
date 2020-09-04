const path = require('path')
const pack = require('../package.json')
const argvs = process.argv.slice(2)

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function getParams (key) {
  let item = argvs.find(item => item.split('=')[0] === key)
  return item ? item.split('=') : []
}

function getModuleAlias () {
  let alias = {}
  importModules.forEach(({ name }) => {
    alias[`@${name}`] = resolve(`src/${name}`)
  })
  return alias
}

class MultiModule {
  constructor (name, opts) {
    let datetime = Date.now()
    Object.assign(this, {
      name,
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      port: 8080,
      host: '0.0.0.0',
      proxyTable: null,
      entry: {
        app: ['babel-polyfill', `./src/${name}/main.js`]
      },
      alias: resolve(`src/${name}`),
      index: path.resolve(__dirname, `../dist/${name}/index.html`),
      favicon: path.resolve(__dirname, `../src/${name}/assets/favicon.ico`),
      assetsRoot: path.resolve(__dirname, `../dist/${name}/`),
      pubdate: `${name}_v${pack.version}_${datetime}`,
      publics: [name].concat(opts.statics || []),
      deployConfig: null
    }, opts)
  }
}

function getModuleProcess (name) {
  let mItem = importModules.find(item => item.name === name)
  return mItem || importModules[0]
}

function proxyHandle (proxyReq, req, res, options) {
  let origin = `${options.target.protocol}//${options.target.hostname}`
  proxyReq.setHeader('origin', origin)
  proxyReq.setHeader('referer', origin)
}

function onProxyReq (proxyReq, req, res, options) {
  proxyHandle(proxyReq, req, res, options)
}

function onProxyReqWs (proxyReq, req, socket, options, head) {
  proxyHandle(proxyReq, req, socket, options)
}

function getProxyConfig (target, options) {
  return Object.assign({
    target,
    secure: false,
    changeOrigin: true,
    ws: false,
    cookieDomainRewrite: { '*': '' },
    cookiePathRewrite: { '*': '/' },
    onProxyReq,
    onProxyReqWs
  }, options)
}

// 多模块独立配置
var importModules = [
  new MultiModule('iframe', {
    path:'',
    port: 8091,
    // assetsRoot:'',
    // assetsSubDirectory:'',
    assetsPublicPath:'/iframe/',
    statics: ['static'],
    proxyTable: {
      '/api': getProxyConfig('http://192.168.3.20:8765',{
        pathRewrite:{
          '^/api': '/api'
        }
      })
    }
  }),
  new MultiModule('login', {
    path:'login',
    port: 8092,
    // assetsRoot:'',
    // assetsSubDirectory:'',
    assetsPublicPath:'/login/',
    statics: ['static'],
    proxyTable: {
      '/api': getProxyConfig('http://192.168.3.20:8765',{
        pathRewrite:{
          '^/api': '/api'
        }
      })
    }
  }),
  // new MultiModule('abc', {
  //   path:'aaa',     //应用的首页地址
  //   port: 8093,
  //   // assetsRoot:'',
  //   // assetsSubDirectory:'',
  //   assetsPublicPath:'',
  //   statics: ['static'],
  //   proxyTable: {
  //     '/api': getProxyConfig('http://192.168.3.20:8765',{
  //       pathRewrite:{
  //         '^/api': '/api'
  //       }
  //     })
  //   }
  // }),

  new MultiModule('baseManager', {
    title:'基础信息',
    path:'',     //应用的首页地址
    port: 8094,
    // assetsRoot:'',
    // assetsSubDirectory:'',
    assetsPublicPath:'/baseManager/',
    statics: ['static'],
    proxyTable: {
      '/api': getProxyConfig('http://192.168.3.20:8765',{
        pathRewrite:{
          '^/api': '/api'
        }
      })
    }
  }),

  new MultiModule('qualityAppraisal', {
    title:'综合素质评价',
    path:'',     //应用的首页地址
    port: 8095,
    // assetsRoot:'',
    // assetsSubDirectory:'',
    assetsPublicPath:'/qualityAppraisal/',
    statics: ['static'],
    proxyTable: {
      '/api': getProxyConfig('http://192.168.3.20:8765',{
        pathRewrite:{
          '^/api': '/api'
        }
      })
    }
  }),

  new MultiModule('safeCampus', {
    title:'平安校园',
    path:'',     //应用的首页地址
    port: 8096,
    // assetsRoot:'',
    // assetsSubDirectory:'',
    assetsPublicPath:'/safeCampus/',
    statics: ['static'],
    proxyTable: {
      '/api': getProxyConfig('http://192.168.3.20:8765',{
        pathRewrite:{
          '^/api': '/api'
        }
      })
    }
  }),


]
var lifecycleEvents = String(process.env.npm_lifecycle_event).split(':')
var moduleName = getParams('name')[1] || lifecycleEvents[1]

const multiConfig = {
  modules: importModules,
  moduleAlias: getModuleAlias(),
  process: getModuleProcess(moduleName)
}

module.exports = multiConfig
