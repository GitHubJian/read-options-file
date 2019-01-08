const path = require('path')
const fs = require('fs')
const extend = require('extend')
const root = process.cwd()

const _ENV_ = {}
const APP_CONFIG_FOLDER = 'setting'
const SEPARATOR = '-'
let NODE_ENV, CONFIG_DIR, APP_INSTANCE

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
  let res = extend.call(this, [{}].concat(args))

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
    return {}
  }
}

function initParam(argName, defaultValue) {
  let value = getCmdLineArg(argName) || process.env[argName] || defaultValue

  _ENV_[argName] = value

  return value
}

function load(fileName) {
  NODE_ENV = initParam('NODE_ENV', 'development')
  NODE_ENV = initParam('APP_CONFIG_ENV', NODE_ENV)
  CONFIG_DIR =
    configDir || initParam('APP_CONFIG_DIR', path.join(root, APP_CONFIG_FOLDER))

  if (CONFIG_DIR.indexOf('.') === 0) {
    CONFIG_DIR = path.join(root, CONFIG_DIR)
  }

  APP_INSTANCE = initParam('APP_CONFIG_INSTANCE')

  let extname = path.extname(fileName),
    fileBaseName = path.basename(fileName, extname)

  let baseNames = [fileBaseName].concat(
    `${fileBaseName}${SEPARATOR}${NODE_ENV}`
  )

  let configObj = baseNames.reduce((prev, cur) => {
    let config = {}
    let fullFilename = path.join(CONFIG_DIR, `${cur}${extname}`)
    let optionObj = parseFile(fullFilename)
    if (optionObj) {
      config = mergeOptions(config, optionObj)
    }

    if (APP_INSTANCE) {
      fullFilename = path.join(
        CONFIG_DIR,
        `${cur}${SEPARATOR}${APP_INSTANCE}${extname}`
      )

      optionObj = parseFile(fullFilename)
      if (optionObj) {
        config = mergeOptions(config, optionObj)
      }
    }

    return config
  }, {})

  return configObj
}

module.exports = { load }
