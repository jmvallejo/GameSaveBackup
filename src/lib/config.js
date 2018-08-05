import fs from 'fs-extra'
import path from 'path'
import { shell, app } from 'electron'
import deepEqual from 'deep-equal'

const SampleGameTitle = {
  ignore: true,
  fileList: [
    {
      sourcePath: 'C:\\path\\to\\your\\save\\folder',
      destPath: 'C:\\path\\to\\your\\backup\\folder',
      files: ['*']
    }
  ]
}
const SAMPLE_CONFIG = {
  games: {
    SampleGameTitle
  }
}

const CONFIG_DIRECTORY = path.join(
  app.getPath('appData'),
  app.getName(),
  'config'
)
const CONFIG_FILE_NAME = 'config.json'
const CONFIG_FILE_OPTIONS = {
  spaces: 2
}
let config = null

export const createSampleConfig = () => {
  fs.ensureDirSync(CONFIG_DIRECTORY)
  fs.writeJsonSync(
    path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME),
    SAMPLE_CONFIG,
    CONFIG_FILE_OPTIONS
  )
  console.log(
    `Created config file ${path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME)}`
  )
}

export const checkConfig = () => {
  if (!fs.existsSync(path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME))) {
    createSampleConfig()
  } else {
    // Load and add the latest sample config key to it if necessary
    loadConfig()
    if (
      config &&
      config.games &&
      !deepEqual(config.games.SampleGameTitle, SampleGameTitle, { strict: true })
    ) {
      config.games.SampleGameTitle = { ...SampleGameTitle }
      saveConfig()
    }
  }
}

export const loadConfig = () => {
  config = fs.readJsonSync(path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME))
  console.log('Loaded config file', config)
  return { ...config }
}

export const saveConfig = () => {
  if (!config) {
    return false
  }
  fs.ensureDirSync(CONFIG_DIRECTORY)
  fs.writeJsonSync(
    path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME),
    config,
    CONFIG_FILE_OPTIONS
  )
  console.log('Saved config file', config)
  return true
}

export const getConfig = () => {
  if (config) {
    return { ...config }
  } else {
    return {}
  }
}

export const showConfigFile = () => {
  shell.showItemInFolder(path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME))
}

/**
 * Returns true if application is set to start on login
 *
 * @returns {Boolean}
 */
export const isStartedAtLogin = () => {
  const options = app.getLoginItemSettings()
  const { openAtLogin } = options
  return openAtLogin
}
/**
 * Toggles setting to start app on login
 *
 * @returns {Boolean}
 */
export const toggleStartAtLogin = () => {
  const options = app.getLoginItemSettings()
  const { openAtLogin } = options
  app.setLoginItemSettings({ openAtLogin: !openAtLogin })
  return !openAtLogin
}