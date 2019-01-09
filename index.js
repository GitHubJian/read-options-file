const path = require('path')
const fs = require('fs')
const extend = require('extend')
const root = process.cwd()

const APP_CONFIG_FOLDER = 'setting'
const SEPARATOR = '-'
let NODE_ENV, APP_CONFIG_ENV, APP_CONFIG_DIR, APP_CONFIG_INSTANCE

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

function mergeOptions() {
  let args = Array.prototype.slice.call(arguments)
  let res = extend(true, ...[{}].concat(args))

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
    console.warn(`[AppConfig Warn]: File Not Found, \n${fullFilename}`)
    return {}
  }
}

function initParam(argName, defaultValue) {
  let value = getCmdLineArg(argName) || process.env[argName] || defaultValue

  return value
}

function load(fileName /*, configDir*/) {
  NODE_ENV = initParam('NODE_ENV', 'development')
  APP_CONFIG_ENV = initParam('APP_CONFIG_ENV', NODE_ENV)
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

  let baseNames = [fileBaseName].concat(
    [fileBaseName, APP_CONFIG_ENV].join(SEPARATOR)
  )

  if (NODE_ENV !== 'production' && APP_CONFIG_INSTANCE) {
    baseNames = baseNames.concat(
      [fileBaseName, APP_CONFIG_ENV, APP_CONFIG_INSTANCE].join(SEPARATOR)
    )
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

module.exports = { load }
