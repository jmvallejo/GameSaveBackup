import fs from 'fs-extra'
import { backupGame } from './backup'
import { restoreGame } from './restore'

const WATCH_BUSY_TIMEOUT = 1000
let busy = false
export const getBusy = () => {
  return busy
}
export const setBusy = () => {
  busy = true
}
export const releaseBusy = () => {
  setTimeout(() => {
    busy = false
  }, WATCH_BUSY_TIMEOUT)
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
    const { sourcePath, destPath } = currentFilesInfo || {}
    if (sourcePath && fs.existsSync(sourcePath)) {
      fs.watch(sourcePath, (eventType, filename) => {
        console.log(`${gameName}: ${eventType} ${filename}`)
        if (!getBusy()) {
          setBusy()
          backupGame(fileList, false)
          releaseBusy()
        }
      })
      fs.watch(destPath, (eventType, filename) => {
        console.log(`${gameName}: ${eventType} ${filename}`)
        if (!getBusy()) {
          setBusy()
          restoreGame(fileList, false)
          releaseBusy()
        }
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