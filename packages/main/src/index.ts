import {app, ipcMain} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {platform} from 'node:process';
import {promises as fs} from 'fs';
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(() => {
    ipcMain.handle('files:openChainFile', openChainFile);
    ipcMain.handle('files:updateChainFile', updateChainFile);
    ipcMain.handle('files:getCurrentChainsDirectory', getCurrentChainsDirectory);
    ipcMain.handle('files:getChainsFilenames', getChainsFilenames);
  })
  .then(restoreOrCreateWindow)
  .catch(e => console.error('Failed create window:', e));

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
// if (import.meta.env.DEV) {
//   app
//     .whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(module => {
//       const {default: installExtension, VUEJS3_DEVTOOLS} =
//         // @ts-expect-error Hotfix for https://github.com/cawa-93/vite-electron-builder/issues/915
//         typeof module.default === 'function' ? module : (module.default as typeof module);
//
//       return installExtension(VUEJS3_DEVTOOLS, {
//         loadExtensionOptions: {
//           allowFileAccess: true,
//         },
//       });
//     })
//     .catch(e => console.error('Failed install extension:', e));
// }

/**
 * Check for app updates, install it in background and notify user that new version was installed.
 * No reason run this in non-production build.
 * @see https://www.electron.build/auto-update.html#quick-setup-guide
 *
 * Note: It may throw "ENOENT: no such file app-update.yml"
 * if you compile production app without publishing it to distribution server.
 * Like `npm run compile` does. It's ok 😅
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() =>
      /**
       * Here we forced to use `require` since electron doesn't fully support dynamic import in asar archives
       * @see https://github.com/electron/electron/issues/38829
       * Potentially it may be fixed by this https://github.com/electron/electron/pull/37535
       */
      require('electron-updater').autoUpdater.checkForUpdatesAndNotify(),
    )
    .catch(e => console.error('Failed check and install updates:', e));
}

function getCurrentChainsDirectory(): string {
  return '/Users/ROMAN/Documents/git-repos/unnamed-game/chains'; // TODO make this an env var, or CLI argument
}

async function getChainsFilenames(
  event: IpcMainInvokeEvent,
  chainsDirectory: string,
): Promise<string[]> {
  return await fs
    .readdir(chainsDirectory)
    .then(files => files.filter(f => f.includes('.json') && f !== 'schema.json'));
}

async function openChainFile(event: IpcMainInvokeEvent, fileAbsolutePath: string) {
  let file;
  try {
    file = await fs.readFile(fileAbsolutePath, {
      encoding: 'utf8',
      flag: 'r',
    });
  } catch (e) {
    console.log('error while reading Chain file: ' + e);
  }
  return file;
}

async function updateChainFile(
  event: IpcMainInvokeEvent,
  fileAbsolutePath: string,
  content: string,
) {
  let promise;
  try {
    promise = await fs.writeFile(fileAbsolutePath, content, {
      encoding: 'utf8',
      flag: 'w',
    });
  } catch (e) {
    console.log('error while writing Chain file: ' + e);
  }
  return promise;
}
