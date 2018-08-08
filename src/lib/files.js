import fs from 'fs-extra'
import path from 'path'
import multimatch from 'multimatch'
import moment from 'moment'
import { dialog, app } from 'electron'

export const readFiles = ({ basePath, subdir, filePatterns }) => {
  filePatterns = filePatterns || ['*']
  const allFiles = fs.readdirSync(basePath)
  const files = multimatch(allFiles, filePatterns)
  const foundFiles = []

  for (let i = 0; i < files.length; i++) {
    const currentFile = path.join(basePath, files[i])
    const stat = fs.statSync(currentFile)
    if (stat.isDirectory()) {
      const currentSubdir = subdir
        ? path.join(subdir, currentFile.replace(/^.*[\\\/]/, ''))
        : currentFile.replace(/^.*[\\\/]/, '')
      const subDirFoundFiles = readFiles({
        basePath: currentFile,
        subdir: currentSubdir,
        filePatterns
      })
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

/**
 * Returns true if file1 has the same mdate as file2
 *
 * @param {String} file1
 * @param {String} file2
 */
const isSameDate = (file1, file2) => {
  if (!file1 || !file2) {
    return false
  }

  try {
    const file1Stat = fs.existsSync(file1) && fs.statSync(file1)
    const file2Stat = fs.existsSync(file2) && fs.statSync(file2)
    if (!file1Stat || !file2Stat) {
      return false
    }
    const file1mdate = file1Stat.mtime
    const file2mdate = file2Stat.mtime
    return moment(file1mdate).isSame(file2mdate)
  } catch (e) {
    return false
  }
}

/**
 * Returns true if file1 is more recent than file2
 *
 * @param {String} file1
 * @param {String} file2
 */
const isMoreRecent = (file1, file2) => {
  if (!file1 || !file2) {
    return false
  }

  try {
    const file1Stat = fs.existsSync(file1) && fs.statSync(file1)
    const file2Stat = fs.existsSync(file2) && fs.statSync(file2)
    if (!file1Stat) {
      return false
    }
    if (!file2Stat) {
      return true
    }
    const file1mdate = file1Stat.mtime
    const file2mdate = file2Stat.mtime
    return moment(file1mdate).isAfter(file2mdate)
  } catch (e) {
    return false
  }
}

export const copyFiles = (foundFiles, sourcePath, destPath, prompt = false) => {
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
    const fileSourcePath = subdir
      ? path.join(sourcePath, subdir, fileName)
      : path.join(sourcePath, fileName)
    const fileDestPath = subdir
      ? path.join(destPath, subdir, fileName)
      : path.join(destPath, fileName)
    if (!fs.existsSync(fileSourcePath)) {
      continue
    }
    if (subdir) {
      fs.ensureDirSync(path.join(destPath, subdir))
    }

    if (isMoreRecent(fileSourcePath, fileDestPath)) {
      fs.copyFileSync(fileSourcePath, fileDestPath)
      console.log(`Copied ${fileSourcePath} to ${fileDestPath}`)
    } else if (isSameDate(fileSourcePath, fileDestPath)) {
      console.log(`Skipping ${fileSourcePath} because it has the same date`)
    } else if(prompt) {
      dialog.showMessageBox(null, {
        type: 'question',
        buttons: ['Yes', 'Cancel'],
        defaultId: 1,
        title: app.getName(),
        detail: `${fileDestPath} is more recent than ${fileSourcePath}, do you want to overwrite it?`,
        cancelId: 1
      }, response => {
        if (response === 0) {
          fs.copyFileSync(fileSourcePath, fileDestPath)
          console.log(`Copied ${fileSourcePath} to ${fileDestPath}`)
        }
      })
    } else {
      console.log(`Skipping ${fileSourcePath}`)
    }
  }
}
