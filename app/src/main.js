import 'source-map-support/register';
import fs from 'fs';
import path from 'path';
import { app, crashReporter, dialog } from 'electron';
import electronDownload from 'electron-dl';

import createLoginWindow from './components/login/loginWindow';
import createMainWindow from './components/mainWindow/mainWindow';
import helpers from './helpers/helpers';
import inferFlash from './helpers/inferFlash';

// import autoUpdater from 'electron-updater';
// import log from 'electron-log';

const { isOSX } = helpers;

electronDownload();

const APP_ARGS_FILE_PATH = path.join(__dirname, '..', 'nativefier.json');
const appArgs = JSON.parse(fs.readFileSync(APP_ARGS_FILE_PATH, 'utf8'));

if (appArgs.processEnvs) {
  Object.keys(appArgs.processEnvs).forEach((key) => {
    /* eslint-env node */
    process.env[key] = appArgs.processEnvs[key];
  });
}

let mainWindow;

if (typeof appArgs.flashPluginDir === 'string') {
  app.commandLine.appendSwitch('ppapi-flash-path', appArgs.flashPluginDir);
} else if (appArgs.flashPluginDir) {
  const flashPath = inferFlash();
  app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
}

if (appArgs.ignoreCertificate) {
  app.commandLine.appendSwitch('ignore-certificate-errors');
}

if (appArgs.ignoreGpuBlacklist) {
  app.commandLine.appendSwitch('ignore-gpu-blacklist');
}

if (appArgs.enableEs3Apis) {
  app.commandLine.appendSwitch('enable-es3-apis');
}

if (appArgs.diskCacheSize) {
  app.commandLine.appendSwitch('disk-cache-size', appArgs.diskCacheSize);
}

// do nothing for setDockBadge if not OSX
let setDockBadge = () => {};

if (isOSX()) {
  setDockBadge = app.dock.setBadge;
}

app.on('window-all-closed', () => {
  if (!isOSX() || appArgs.fastQuit) {
    app.quit();
  }
});

app.on('activate', (event, hasVisibleWindows) => {
  if (isOSX()) {
        // this is called when the dock is clicked
    if (!hasVisibleWindows) {
      mainWindow.show();
    }
  }
});

app.on('before-quit', () => {
  // not fired when the close button on the window is clicked
  if (isOSX()) {
    // need to force a quit as a workaround here to simulate the osx app hiding behaviour
    // Somehow sokution at https://github.com/atom/electron/issues/444#issuecomment-76492576 does not work,
    // e.prevent default appears to persist

    // might cause issues in the future as before-quit and will-quit events are not called
    app.exit(0);
  }
});

if (appArgs.crashReporter) {
  app.on('will-finish-launching', () => {
    crashReporter.start({
      companyName: appArgs.companyName || '',
      productName: appArgs.name,
      submitURL: appArgs.crashReporter,
      autoSubmit: true,
    });
  });
}

app.on('ready', () => {
  mainWindow = createMainWindow(appArgs, app.quit, setDockBadge);
});

app.on('login', (event, webContents, request, authInfo, callback) => {
    // for http authentication
  event.preventDefault();
  createLoginWindow(callback);
});


// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// function sendStatusToWindow(text) {
//   log.info(text);
//   // mainWindow.webContents.send('message', text);
//   // mainWindow.webContents.executeJavaScript(`console.log('${text}')`, true);
// }

// autoUpdater.autoDownload = false;

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// });

// autoUpdater.on('update-available', (info) => {
//   sendStatusToWindow(`Update available: (${app.getVersion()} to ${info.version})`);
//   // dialog.showMessageBox(null, {
//   //   type: 'info',
//   //   buttons: ['Yes', 'No'],
//   //   defaultId: 1,
//   //   title: 'Update Available',
//   //   message: 'A new version of FieldFX Desktop is available.  Would you like to install it now?'
//   // }, (response) => {
//   //   if (response !== 0) {
//   //     return;
//   //   }
//   //   const session = mainWindow.webContents.session;
//   //   session.clearStorageData(() => {
//   //     session.clearCache(() => {
//   //       mainWindow.loadURL(options.targetUrl);
//   //     });
//   //   });
//   // });

//   dialog.showMessageBox(mainWindow, {
//     type: 'info',
//     buttons: ['Yes', 'No'],
//     defaultId: 1,
//     title: 'Update Available',
//     // message: 'Copyright © 2005 - 2016 LiquidFrameworks, Inc. All Rights Reserved.'});
//     message: 'A new version of FieldFX Desktop is available.  Would you like to install it now?'
//   }, (response) => {
//     if (response !== 0) {
//       return;
//     }
//     autoUpdater.downloadUpdate();

//     dialog.showMessageBox(mainWindow, {
//       type: 'info',
//       buttons: [],
//       defaultId: 1,
//       title: 'Downloading Update...',
//       message: 'Downloading Update...\n\nOnce the update is downloaded, the application will quit and automatically install the new version.'
//     });
//   });
// })

// // autoUpdater.on('update-not-available', (info) => {
// //   sendStatusToWindow('Update not available.');
// // })

// // autoUpdater.on('error', (err) => {
// //   sendStatusToWindow('Error in auto-updater.');
// // })
// autoUpdater.on('error', (event, error) => {
//   sendStatusToWindow('Error in auto-updater: ' + error.message);
//   sendStatusToWindow(error.stack);
//   dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
// })

// autoUpdater.on('download-progress', (progressObj) => {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   sendStatusToWindow(log_message);

//   mainWindow.setProgressBar(progressObj.percent/100);
// });

// autoUpdater.on('update-downloaded', (info) => {
//   sendStatusToWindow('Update downloaded; will install in 5 seconds');
//   // dialog.showMessageBox({
//   //   title: 'Install Updates',
//   //   message: 'Updates downloaded, application will be quit for update...'
//   // }, () => {
//   //   setImmediate(() => autoUpdater.quitAndInstall())
//   // });
//   setImmediate(() => autoUpdater.quitAndInstall())
// });

// // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});



if (appArgs.singleInstance) {
  const shouldQuit = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  if (shouldQuit) {
    app.quit();
  }
}
