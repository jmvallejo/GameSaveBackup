import fs from 'fs-extra'
import path from 'path'
import { shell } from 'electron'

const SAMPLE_CONFIG = {
  games: {
    game1: {
      ignore: true,
      fileList: [
        {
          sourcePath: '',
          destPath: '',
          files: '*'
        }
      ]
    }
  }
}

const CONFIG_DIRECTORY = path.join(__dirname, '..', 'config')
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
  }
}

export const loadConfig = () => {
  config = fs.readJsonSync(path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME))
  console.log('Loaded config file', config)
  return { ...config }
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