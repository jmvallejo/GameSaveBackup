import { app, Menu, Tray } from 'electron'
import path from 'path'
import { checkConfig } from  './lib/config'

let tray = null
app.once('ready', () => {
  const iconPath = path.join(__dirname, '..', 'img', 'iconTemplate.png')
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Backup' },
    { label: 'Restore' },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setToolTip('Game Save Backup')
  tray.setContextMenu(contextMenu)

  // Check that config file exists
  checkConfig()
})