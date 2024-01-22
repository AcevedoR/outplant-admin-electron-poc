import type {Chain} from '../model/Chain';
import type {OutplantElectronAPI} from '#preload';

declare global {
  interface Window {
    electronAPI: OutplantElectronAPI;
  }
}
export async function getChain(chainAbsolutePath: string): Promise<Chain> {
  const input: Promise<string> = window.electronAPI.openChainFile(chainAbsolutePath);
  return input.then(x => JSON.parse(x) as Chain);
}

export async function getCurrentChainsDirectory(): Promise<string> {
  return window.electronAPI.getCurrentChainsDirectory() as Promise<string>;
}

export async function getChainsFilenames(chainsDirectory: string): Promise<string[]> {
  return window.electronAPI.getChainsFilenames(chainsDirectory) as Promise<string[]>;
}
