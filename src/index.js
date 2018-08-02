import { app, Menu, Tray } from 'electron'
import path from 'path'
import moment from 'moment'
import { checkConfig, loadConfig } from './lib/config'
import { backupAll } from './lib/backup'

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
  const contextMenu = Menu.buildFromTemplate([
    ...infoLabelItems,
    {
      label: 'Backup all',
      click: () => {
        const config = loadConfig()
        backupAll(config) &&
          buildMenu(`Backed up all at ${formatTime()}`)
      }
    },
    { label: 'Restore all' },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setContextMenu(contextMenu)
}

app.once('ready', () => {
  const iconPath = path.join(__dirname, '..', 'img', 'iconTemplate.png')
  tray = new Tray(iconPath)
  tray.setToolTip('Game Save Backup')
  buildMenu()

  // Check that config file exists
  checkConfig()
  loadConfig()
})
