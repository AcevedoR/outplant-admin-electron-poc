/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

export interface OutplantElectronAPI {
  openChainFile: (fileAbsolutePath: string) => Promise<unknown>;
  updateChainFile: (fileAbsolutePath: string, content: string) => Promise<unknown>;
  getCurrentChainsDirectory: () => Promise<unknown>;
  getChainsFilenames: (chainsDirectory: string) => Promise<unknown>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  openChainFile: (fileAbsolutePath: string) =>
    ipcRenderer.invoke('files:openChainFile', fileAbsolutePath),
  updateChainFile: (fileAbsolutePath: string, content: string) => ipcRenderer.invoke('files:updateChainFile', fileAbsolutePath, content),
  getCurrentChainsDirectory: () => ipcRenderer.invoke('files:getCurrentChainsDirectory'),
  getChainsFilenames: (chainsDirectory: string) =>
    ipcRenderer.invoke('files:getChainsFilenames', chainsDirectory),
});
