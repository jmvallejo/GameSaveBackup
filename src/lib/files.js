import fs from 'fs-extra'
import path from 'path'

export const readFiles = (basePath, subdir = null) => {
  const files = fs.readdirSync(basePath)
  const foundFiles = []

  for (let i = 0; i < files.length; i++) {
    const currentFile = path.join(basePath, files[i])
    const stat = fs.statSync(currentFile)
    if (stat.isDirectory()) {
      const currentSubdir = subdir
        ? path.join(subdir, currentFile.replace(/^.*[\\\/]/, ''))
        : currentFile.replace(/^.*[\\\/]/, '')
      const subDirFoundFiles = readFiles(currentFile, currentSubdir)
      if (subDirFoundFiles && subDirFoundFiles.length > 0) {
        for (let j = 0; j < subDirFoundFiles.length; j++) {
          foundFiles.push(subDirFoundFiles[j])
        }
      }
    } else {
      foundFiles.push({
        fileName: currentFile && currentFile.replace(/^.*[\\\/]/, ''),
        subdir
      })
    }
  }

  return foundFiles
}

export const copyFiles = (foundFiles, sourcePath, destPath) => {
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
    fs.copyFileSync(
      path.join(fileSourcePath, fileName),
      path.join(fileDestPath, fileName)
    )
    console.log(
      `Copied ${path.join(fileSourcePath, fileName)} to ${path.join(
        fileDestPath,
        fileName
      )}`
    )
  }
}
