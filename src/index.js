import { app, Menu, Tray } from 'electron'
import path from 'path'
import { checkConfig, loadConfig } from './lib/config'
import { backupAll } from './lib/backup';

let tray = null
app.once('ready', () => {
  const iconPath = path.join(__dirname, '..', 'img', 'iconTemplate.png')
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Backup all',
      click: () => {
        const config = loadConfig()
        backupAll(config)
      }
    },
    { label: 'Restore all' },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setToolTip('Game Save Backup')
  tray.setContextMenu(contextMenu)

  // Check that config file exists
  checkConfig()
  loadConfig()
})
