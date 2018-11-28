const electron = require('electron')
const app = electron.app
const Tray = electron.Tray
const image = electron.nativeImage
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')

let gTray,gTrayMenu
let gMainWindow
let gEditWindow

function createWindow () {
  let tSize=electron.screen.getPrimaryDisplay().size
  gMainWindow = new BrowserWindow({
    left:10,top:-10,
    width: tSize.width, minWidth: tSize.width+10,
    height: tSize.height, minHeight: tSize.height,
    alwaysOnTop: true,
    frame: false,
    hasShadow: false,
    transparent: true,
    // titleBarStyle: "hidden"
  })
  gMainWindow.center()
  gMainWindow.setIgnoreMouseEvents(true)

  gMainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Open the DevTools.
  // gMainWindow.webContents.openDevTools()

  gMainWindow.on('closed', function () {
    electron.session.defaultSession.clearCache(() => {})
    gMainWindow = null;
  })
}
function edit(){
  setTrayMenu([
    {index:0,item:{ label: "edit", enabled: false}},
  ])
  // let tSize=electron.screen.getPrimaryDisplay().size
  gEditWindow = new BrowserWindow({
    width: 500, minWidth: 10,
    height: 500, minHeight: 10,
    frame: false,
    hasShadow: false,
    transparent: true,
    resizable: false
  })
  gEditWindow.center()

  gEditWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/editor.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // gEditWindow.webContents.openDevTools()

  gEditWindow.on('closed', function () {
    electron.session.defaultSession.clearCache(() => {})
    gEditWindow = null;
    setTrayMenu([
      {index:0,item:{ label: "edit", click: edit}},
    ])
  })
}
//メニューバーにアイコン追加
function createTray(){
  gTray = new Tray(image.createFromPath(__dirname+"/icon/icon.png").resize({width:18,height:18}));
  setTrayMenu()
}
//Trayのメニュー設定
function setTrayMenu(aReplace){
  if(aReplace!=null){
    for(tItem of aReplace){
      gTrayMenu[tItem.index]=tItem.item
    }
  }
  gTray.setContextMenu(Menu.buildFromTemplate(gTrayMenu));
}

app.on('ready', ()=>{
  gTrayMenu=[
    { label: "edit", click: edit },
    { label: "quit", click: quit },
  ]
  createTray()
  createWindow()
  app.dock.hide()
  gMainWindow.showInactive()
})
function quit(){
  app.quit()
}
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (gMainWindow === null) {
    createWindow()
  }
})

//editorWindowサイズ設定
ipcMain.on("resize",(e,a)=>{
  gEditWindow.setSize(a.width,a.height)
})
//edit終了
ipcMain.on("editEnd",()=>{
  gEditWindow.close()
  gMainWindow.send("readProperty")
})
