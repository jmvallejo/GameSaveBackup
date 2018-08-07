import fs from 'fs-extra'
import { readFiles, copyFiles } from './files'

const backupGame = (fileList, prompt = true) => {
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
    const foundFiles = readFiles({ basePath: sourcePath, filePatterns: files })
    copyFiles(foundFiles, sourcePath, destPath, prompt)
  }
}

export const backupAll = config => {
  if (!config) {
    console.error('Invalid config, could not backup')
    return false
  }

  const { games } = config
  if (!games) {
    console.error('No games present in config file, no backups were created')
    return false
  }

  for (let gameName in games) {
    const gameConfig = games[gameName]
    const { ignore, fileList } = gameConfig || {}
    if (ignore) {
      console.log(`Ignoring ${gameName}...`)
      continue
    }
    console.log(`Backing up ${gameName}...`)
    backupGame(fileList, true)
  }
  return true
}


const watchGame = (gameName, game) => {
  if (!gameName || !game) {
    return
  }
  const { fileList } = game
  if (!fileList || !fileList.length) {
    return
  }

  for (let i = 0, count = fileList.length, currentFilesInfo; i < count; i++) {
    currentFilesInfo = fileList[i]
    const { sourcePath } = currentFilesInfo || {}
    if (sourcePath && fs.existsSync(sourcePath)) {
      fs.watch(sourcePath, (eventType, filename) => {
        console.log(`${gameName}: ${eventType} ${filename}`)
        backupGame(fileList, false)
      })
    }
  }
}

export const configureWatch = config => {
  if (!config) {
    console.error('Invalid config, could not configure watch')
    return false
  }

  const { games } = config
  if (!games) {
    console.error('No games present in config file, could not watch folders')
    return false
  }

  for (let gameName in games) {
    const gameConfig = games[gameName]
    const { ignore, watch } = gameConfig || {}
    if (ignore || !watch) {
      console.log(`Not watching ${gameName}...`)
      continue
    }
    console.log(`Watching ${gameName}...`)
    watchGame(gameName, gameConfig)
  }
  return true
}