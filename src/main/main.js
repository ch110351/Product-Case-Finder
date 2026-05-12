const path = require('path');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');

const dbService = require('./services/dbService');
const configService = require('./services/configService');
const searchService = require('./services/searchService');
const fileOpenService = require('./services/fileOpenService');
const productInfoService = require('./services/productInfoService');
const pptScannerService = require('./services/pptScannerService');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 860,
    minHeight: 620,
    title: 'CYP Product Case Finder',
    backgroundColor: '#f4f7f6',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

function registerIpcHandlers() {
  ipcMain.handle('app:getStartupState', () => {
    const folderPath = configService.get('pptFolderPath', '');
    const stats = dbService.getIndexStats();

    return {
      folderPath,
      stats
    };
  });

  ipcMain.handle('folder:select', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select PowerPoint Folder',
      properties: ['openDirectory']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return {
        canceled: true,
        folderPath: configService.get('pptFolderPath', '')
      };
    }

    const folderPath = result.filePaths[0];
    configService.set('pptFolderPath', folderPath);

    return {
      canceled: false,
      folderPath
    };
  });

  ipcMain.handle('search:query', (_event, keyword) => {
    return searchService.search(keyword);
  });

  ipcMain.handle('scan:rebuild', async (_event, folderPath) => {
    const targetFolder = folderPath || configService.get('pptFolderPath', '');
    return pptScannerService.rebuildIndex(targetFolder);
  });

  ipcMain.handle('file:openPpt', async (_event, filePath) => {
    return fileOpenService.openPpt(filePath);
  });

  ipcMain.handle('product:openInfo', async (_event, productName) => {
    return productInfoService.openProductInfo(productName);
  });

  ipcMain.handle('product:openDetailUrl', async (_event, url) => {
    return productInfoService.openProductDetailUrl(url);
  });

  ipcMain.handle('product:getSummary', async (_event, productName) => {
    return productInfoService.getProductSummary(productName);
  });

  ipcMain.handle('scan:getStatus', () => {
    return pptScannerService.getStatus();
  });
}

app.whenReady().then(async () => {
  await dbService.initialize();
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch((error) => {
  console.error('Application startup failed:', error);
  app.quit();
});

app.on('window-all-closed', () => {
  dbService.close();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
