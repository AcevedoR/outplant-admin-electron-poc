import type {Chain} from './model/Chain';
import type {OutplantElectronAPI} from '#preload';

declare global {
  interface Window {
    electronAPI: OutplantElectronAPI;
  }
}

export async function getChain(
  chainFileAbsolutePath: string,
): Promise<{chain: Chain; chainFileAbsolutePath: string}> {
  const input: Promise<string> = window.electronAPI.openChainFile(
    chainFileAbsolutePath,
  ) as Promise<string>;
  return {
    chain: await input.then(x => JSON.parse(x) as Chain),
    chainFileAbsolutePath: chainFileAbsolutePath,
  };
}

export async function updateChainFile(chainAbsolutePath: string, content: string): Promise<void> {
  return window.electronAPI.updateChainFile(chainAbsolutePath, content) as Promise<void>;
}

export async function getCurrentChainsDirectory(): Promise<string> {
  return window.electronAPI.getCurrentChainsDirectory() as Promise<string>;
}

export async function getChainsFilenames(chainsDirectory: string): Promise<string[]> {
  return window.electronAPI.getChainsFilenames(chainsDirectory) as Promise<string[]>;
}
