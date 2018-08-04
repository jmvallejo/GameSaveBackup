import fs from 'fs-extra'
import { readFiles, copyFiles } from './files'

const restoreGame = fileList => {
  if (!fileList || !fileList.length) {
    console.error(`No files have been specified for ${gameName}`)
    return false
  }
  for (let i = 0, count = fileList.length, currentFilesInfo; i < count; i++) {
    currentFilesInfo = fileList[i]
    const { sourcePath, destPath, files } = currentFilesInfo || {}
    if (!sourcePath || !destPath || !files) {
      console.error('Invalid files definition, ignoring...', currentFilesInfo)
      continue
    }
    if (!fs.existsSync(sourcePath)) {
      console.error(`sourcePath: ${sourcePath} does not exist, ignoring...`)
      continue
    }
    if (!fs.existsSync(destPath)) {
      console.error(`destPath: ${sourcePath} does not exist, ignoring...`)
      continue
    }
    // Copy files
    const foundFiles = readFiles({ basePath: destPath, filePatterns: files })
    copyFiles(foundFiles, destPath, sourcePath, true)
  }
}

export const restoreAll = config => {
  if (!config) {
    console.error('Invalid config, could not restore')
    return false
  }

  const { games } = config
  if (!games) {
    console.error('No games present in config file, nothing to restore')
    return false
  }

  for (let gameName in games) {
    const gameConfig = games[gameName]
    const { ignore, fileList } = gameConfig || {}
    if (ignore) {
      console.log(`Ignoring ${gameName}...`)
      continue
    }
    console.log(`Restoring ${gameName}...`)
    restoreGame(fileList)
  }
  return true
}
