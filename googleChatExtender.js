/*
NAME: Google Chat Extender
DESCRIPTION: GCE allow you to customize your Google Chat app with theme, plugins and tweaks.
VERSION: 0.6
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

async function launchPlugins(chat) {
  log('Initializing Google Chat Extender', 'warn');
  let plugins = await findPlugins(chat);
  let googleChatExtenderCore = await readFile(__dirname+'/googleChatExtenderPlugin.js', 'utf-8');

  chat.executeJavaScript(`const plugins = ${JSON.stringify(plugins)}; ` + googleChatExtenderCore);
  log('Google Chat Extender Loaded!', 'ok');
}

app.on('browser-window-created', function(event, win) {
  let web = win.webContents;

  //web.openDevTools();
  web.on('dom-ready', () => {
    if(!web.history[0].includes('https://chat.google.com/')) return; // Load GCE only on Chat window. Delete this line if GCE doesn't work.
    launchPlugins(web);
  });
  web.on('will-navigate', () => {
    setTimeout(() => launchPlugins(web), 500);
  });

});
