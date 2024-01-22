/**
 * @module preload
 */

import {contextBridge, ipcRenderer} from 'electron';

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

export interface OutplantElectronAPI {
  openChainFile: (fileAbsolutePath: string) => Promise<any>;
  getCurrentChainsDirectory: () => Promise<any>;
  getChainsFilenames: (chainsDirectory: string) => Promise<any>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  openChainFile: (fileAbsolutePath: string) =>
    ipcRenderer.invoke('files:openChainFile', fileAbsolutePath),
  getCurrentChainsDirectory: () => ipcRenderer.invoke('files:getCurrentChainsDirectory'),
  getChainsFilenames: (chainsDirectory: string) =>
    ipcRenderer.invoke('files:getChainsFilenames', chainsDirectory),
});
