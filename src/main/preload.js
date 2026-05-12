const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cypApi', {
  getStartupState: () => ipcRenderer.invoke('app:getStartupState'),
  selectFolder: () => ipcRenderer.invoke('folder:select'),
  rebuildIndex: (folderPath) => ipcRenderer.invoke('scan:rebuild', folderPath),
  search: (keyword) => ipcRenderer.invoke('search:query', keyword),
  openPpt: (filePath) => ipcRenderer.invoke('file:openPpt', filePath),
  openProductInfo: (productName) => ipcRenderer.invoke('product:openInfo', productName),
  openProductDetailUrl: (url) => ipcRenderer.invoke('product:openDetailUrl', url),
  getProductSummary: (productName) => ipcRenderer.invoke('product:getSummary', productName),
  getScanStatus: () => ipcRenderer.invoke('scan:getStatus')
});
