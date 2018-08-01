import fs from 'fs-extra'
import path from 'path'

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

export const createSampleConfig = () => {
  fs.ensureDirSync(CONFIG_DIRECTORY)
  fs.writeJsonSync(path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME), SAMPLE_CONFIG)
}

export const checkConfig = () => {
  if (!fs.existsSync(path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME))) {
    console.log(`Creating config file ${path.join(CONFIG_DIRECTORY, CONFIG_FILE_NAME)}`)
    createSampleConfig()
  }
}