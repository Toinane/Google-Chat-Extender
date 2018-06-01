/*
NAME: Google Chat Extender
DESCRIPTION: GCE allow you to customize your Google Chat app with theme, plugins and tweaks.
VERSION: 0.5
AUTHOR: Toinane
*/

/*

  DEEP CUSTOMIZATION IN MAIN.JS

  # How to change the "@" bagde on the Dock icon?
    search and find "ld.dock.setBadge("@");" in main.js
    Change "@" with another char/number. Done.

  # How to use ipcMain/ipcRenderer from Electron?
    search and find "nodeIntegration: !1" in main.js
    Change "!1" to "true". Done. /!\ Use this as a last resort!
    All plugins will can use NodeJS and can be a risk for users.

*/
'use strict'

const util = require('util');
const fs = require('fs');
const {app, webContents} = require('electron');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let chat;

log('Google Chat Extender found');


function log(text, type) {
  let css = {
    'warn': 'color: red; background: yellow;text-transform:uppercase;font-size:2em;',
    'error': 'color: white; background: red;text-transform:uppercase;font-size:2em;',
    'ok': 'color: white; background: #52CE80;text-transform:uppercase;font-size:2em;'
  }
  console.log('['+process.uptime().toFixed(3).padStart(10)+'][INFO ][GCE    ###]', text);
  if(chat !== undefined) chat.executeJavaScript('console.log("%c'+text+'", "'+css[type]+'");');
}

async function findPlugins(chat) {
  let files = await readdir(__dirname + '/plugins');
  let plugins = await Promise.all(files.map(async file => {
    if(!(/.*.js/gm.exec(file))) return log(file + ' is not a plugin. Plugin must be a .js file.', 'error')

    let content = await readFile(__dirname + `/plugins/${file}`, 'utf-8');
    return getPluginConfig(file, content);
  }));

  return plugins;
}

function getPluginVariables(plugin) {
  const regex = /(const __)(.*)( = )(.*)(;)(.*\/\*)(.*)(.*\*\/)/gm;
  let m, vars = [];

  while ((m = regex.exec(plugin)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++;
    let current = [];
    let type = 'text';
    m.forEach(function(match, groupIndex) { current.push(match) });
    let content = current[4].trim();

    if(content.charAt(0) === '"' && content.charAt(content.length-1) === '"') {
      type = 'textarea';
      content = content.slice(1).slice(0, -1);
    }
    else if(content === 'true' || content === 'false') type = 'checkbox';
    else if(Number.isInteger(parseInt(content))) type = 'number';
    else if(content.charAt(0) === "'" && content.charAt(content.length-1) === "'") content = content.slice(1).slice(0, -1);

    vars.push({
      name: current[2].trim(),
      content: content,
      description: current[7].trim(),
      type: type
    })
  }

  return vars;
}

function getPluginConfig(file, plugin) {
  let name = /(NAME: )(.*)/gm.exec(plugin);
  let description = /(DESCRIPTION: )(.*)/gm.exec(plugin);
  let version = /(VERSION: )(.*)/gm.exec(plugin);
  let author = /(AUTHOR: )(.*)/gm.exec(plugin);
  let vars = getPluginVariables(plugin);

  if(!name[2]) return log(file + '\'s name missing. We can\'t add this plugin in parameters.', 'warn');
  
  return {
    name: name[2],
    codeName: name[2].replace(' ', '.').toLowerCase(),
    description: description[2],
    version: version[2],
    author: author[2],
    variables: vars,
    content: plugin
  };
}

app.on('browser-window-created', function(event, win) {
  let web = win.webContents;

  //web.openDevTools();
  web.on('dom-ready', async () => {
    if(web.history[0] !== 'https://chat.google.com/') return; // Load GCE only on Chat window. Delete this line if GCE doesn't work.
    chat = web;
    log('Initializing Google Chat Extender', 'warn');

    let plugins = await findPlugins(chat);

    const googleChatExtenderCss = `
      #custom-button:hover{ background: #F5F5F5; }
      #custom-box{ z-index: 1000; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;}
      #custom-zone{ z-index: 999; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); }
      #custom-menu{ z-index: 1001; position: relative; background: rgb(240, 240, 240); width: 80vw; height: 90vh; border-radius: 2px; box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24); overflow: auto; }
      #custom-menu h1{ padding: 15px 37px; font-weight: normal; font-size: 1.4em; background: white; }
      .custom-separator{ padding: 15px 20px; border-top: 1px solid #e0e0e0; }
      .plugin{ padding: 10px 20px; position: relative; background:white; margin: 10px 0; border-radius: 2px; box-shadow: 0px 1px 4px 1px #dedede; }
      .plugin h2{ font-size: 1.3em; margin-bottom: 5px; }
      .plugin h2 span{ font-size: 0.8em; color: rgb(100, 100, 100); }
      .plugin h3{ color: rgb(142, 142, 142); font-size: 0.9em; }
      .plugin-enabled{ position: absolute; top: 10px; right: 20px; }
      .plugin h4{ font-size: 1.1em; margin: 12px 0; }
      .plugin-variables div{ display: inline-block; margin: 10px; }
      .plugin-variables input{ margin-top: 5px; width: 200px; padding: 5px 3px; font-size: 0.8em; border-radius: 2px; border: none; background: #e4e4e4;}
      .plugin-variables textarea{ padding: 5px; font-size: 0.8em; border: none; border-radius: 2px; background: rgb(225, 225, 225); width: 50vw; resize: vertical; }
      .var-name label{ text-transform: capitalize; margin-right: 10px; }
      .var-name span{ font-size: 0.8em; color: rgb(100, 100, 100); }
      #custom-text{ margin-top: 10px; width: 45vw; min-height: 150px; border: none; background: #E1E1E1; padding: 5px; border-radius: 2px; resize: none; }
      #custom-save{ display: inline-block; float: right; margin-right: 20px; padding: 10px 40px; margin-bottom: 30px; border-radius: 3px; color: #00897b; font-weight: bold; font-size: 0.9em; text-transform: uppercase; cursor: pointer; }
      #custom-save:active, #custom-save:focus{ background: rgba(0,137,123,0.2); }
    `;

    let googleChatExtenderCore = await readFile(__dirname+'/googleChatExtenderPlugin.js', 'utf-8');

    chat.insertCSS(googleChatExtenderCss);
    chat.executeJavaScript(`const plugins = ${JSON.stringify(plugins)}; ` + googleChatExtenderCore);
    log('Google Chat Extender Loaded!', 'ok')
  });
})

