import { app, Menu, Tray, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import moment from 'moment'
import {
  checkConfig,
  loadConfig,
  showConfigFile,
  isStartedAtLogin,
  toggleStartAtLogin,
  getGames
} from './lib/config'
import { backupAll } from './lib/backup'
import { restoreAll } from './lib/restore'

const formatTime = () => {
  return moment().format('h:mm a')
}

let tray = null
const buildMenu = infoText => {
  let infoLabelItems = []
  if (infoText) {
    infoLabelItems = [
      { label: infoText, enabled: false },
      { type: 'separator' }
    ]
  }

  // Build games menu
  let gamesMenu = []
  const games = getGames()
  if (games) {
    const gameList = []
    for (let gameName in games) {
      const currentGame = games[gameName]
      const { fileList } = currentGame
      const submenu = [
        {
          label: 'Show save folder',
          click: () => {
            for (let i = 0; i < fileList.length; i++) {
              const sourcePath = fileList[i].sourcePath
              sourcePath && shell.showItemInFolder(sourcePath)
            }
          }
        },
        {
          label: 'Show backup folder',
          click: () => {
            for (let i = 0; i < fileList.length; i++) {
              const destPath = fileList[i].destPath
              destPath && shell.showItemInFolder(destPath)
            }
          }
        }
      ]
      gameList.push({
        label: gameName,
        submenu
      })
    }
    gamesMenu = [{ label: 'Games', submenu: gameList }, { type: 'separator' }]
  }

  const contextMenu = Menu.buildFromTemplate([
    ...infoLabelItems,
    {
      label: 'Backup all',
      click: () => {
        const config = loadConfig()
        backupAll(config) && buildMenu(`Backed up all at ${formatTime()}`)
      }
    },
    {
      label: 'Restore all',
      click: () => {
        const config = loadConfig()
        restoreAll(config) && buildMenu(`Restored all at ${formatTime()}`)
      }
    },
    { type: 'separator' },
    ...gamesMenu,
    {
      label: 'Show config file',
      click: () => showConfigFile()
    },
    {
      label: 'Reload config',
      click: () => {
        loadConfig()
        buildMenu()
      }
    },
    {
      label: 'Start at login',
      type: 'checkbox',
      checked: isStartedAtLogin(),
      click: () => {
        toggleStartAtLogin()
        buildMenu()
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setContextMenu(contextMenu)
}

app.once('ready', () => {
  const iconPath = path.join(__dirname, '..', 'img', 'iconTemplate.png')
  tray = new Tray(iconPath)
  tray.setToolTip('Game Save Backup')

  // Check that config file exists
  checkConfig()
  // Build tray menu
  buildMenu()
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify()
})
