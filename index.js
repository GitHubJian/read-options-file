const path = require('path')
const fs = require('fs')
const merge = require('deepmerge')
const root = process.cwd()

const APP_CONFIG_FOLDER = 'setting'
const SEPARATOR = '-'

function getCmdLineArg(searchFor) {
  let cmdLineArgs = process.argv.slice(2, process.argv.length),
    argName = `--${searchFor}=`

  for (let argvIt = 0; argvIt < cmdLineArgs.length; argvIt++) {
    if (cmdLineArgs[argvIt].indexOf(argName) === 0) {
      return cmdLineArgs[argvIt].substr(argName.length)
    }
  }

  return false
}

// function mergeOptions2() {
//   let args = Array.prototype.slice.call(arguments)
//   let res = extend(...args)

//   return res
// }

const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

function mergeOptions() {
  let args = Array.prototype.slice.call(arguments)
  let res = merge.all(args, { arrayMerge: overwriteMerge })

  return res
}

function parseFile(fullFilename) {
  let configObject = {}
  try {
    let stat = fs.statSync(fullFilename)
    if (!stat || stat.size < 1) {
      return {}
    }

    configObject = require(fullFilename)

    return configObject
  } catch (e) {
    console.warn(`[Read-Options-File Warn]: File Not Found, \n${fullFilename}`)
    return {}
  }
}

function initParam(argName, defaultValue) {
  let value = getCmdLineArg(argName) || process.env[argName] || defaultValue

  return value
}

function load(fileName /*, configDir*/) {
  let NODE_ENV,
    APP_CONFIG_ENV, // 环境
    APP_CONFIG_DIR, // 目录
    APP_CONFIG_INSTANCE, // instance 名称
    APP_CONFIG_ENABLED // 开启

  NODE_ENV = initParam('NODE_ENV', 'development')
  APP_CONFIG_ENV = initParam('APP_CONFIG_ENV', NODE_ENV)
  APP_CONFIG_ENABLED = initParam('APP_CONFIG_ENABLED', 'false')
  APP_CONFIG_DIR = /*configDir || */ initParam(
    'APP_CONFIG_DIR',
    path.join(root, APP_CONFIG_FOLDER)
  )

  if (APP_CONFIG_DIR.indexOf('.') === 0) {
    APP_CONFIG_DIR = path.join(root, APP_CONFIG_DIR)
  }

  APP_CONFIG_INSTANCE = initParam('APP_CONFIG_INSTANCE')

  let extname = path.extname(fileName),
    fileBaseName = path.basename(fileName, extname)

  let baseNames = [fileBaseName]

  // 是否开启，灵活控制
  if (APP_CONFIG_ENABLED.toLowerCase() === 'true') {
    baseNames.push([fileBaseName, APP_CONFIG_ENV].join(SEPARATOR))

    if (APP_CONFIG_INSTANCE) {
      baseNames.push(
        [fileBaseName, APP_CONFIG_ENV, APP_CONFIG_INSTANCE].join(SEPARATOR)
      )
    }
  }

  let configObj = baseNames.reduce((prev, cur) => {
    let fullFilename = path.join(APP_CONFIG_DIR, `${cur}${extname}`)
    let optionObj = parseFile(fullFilename)
    if (optionObj) {
      config = mergeOptions(prev, optionObj)
    }

    return config
  }, {})

  return configObj
}

module.exports = {
  load,
  extend: mergeOptions
}
