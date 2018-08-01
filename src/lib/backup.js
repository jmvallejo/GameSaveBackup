import fs from 'fs-extra'
import path from 'path'
import { readFiles } from './files'

const backupGame = fileList => {
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
    const foundFiles = readFiles(sourcePath)
    console.log('Copying files', foundFiles)

    for (
      let j = 0, foundFilesLength = foundFiles.length, currentFileInfo;
      j < foundFilesLength;
      j++
    ) {
      currentFileInfo = foundFiles[j]
      const { fileName, subdir } = currentFileInfo || {}
      if (!fileName) {
        continue
      }
      if (subdir) {
        fs.ensureDirSync(path.join(destPath, subdir))
      }
      const fileSourcePath = subdir ? path.join(sourcePath, subdir) : sourcePath
      const fileDestPath = subdir ? path.join(destPath, subdir) : destPath
      fs.copyFileSync(path.join(fileSourcePath, fileName), path.join(fileDestPath, fileName))
      console.log(`Copied ${path.join(fileSourcePath, fileName)} to ${path.join(fileDestPath, fileName)}`)
    }
  }
}

export const backupAll = config => {
  if (!config) {
    console.error('Invalid config, could not backup')
    return
  }

  const { games } = config
  if (!games) {
    console.error('No games present in config file, no backups were created')
    return
  }

  for (let gameName in games) {
    const gameConfig = games[gameName]
    const { ignore, fileList } = gameConfig || {}
    if (ignore) {
      console.log(`Ignoring ${gameName}...`)
      continue
    }
    console.log(`Backing up ${gameName}...`)
    backupGame(fileList)
  }
}
