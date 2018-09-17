#!/usr/bin/env node

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');
const axios = require('axios');

const log = {
  blue: message => console.log('\x1b[34m', message, '\x1b[0m'),
  green: message => console.log('\x1b[32m', message, '\x1b[0m'),
  red: message => console.log('\x1b[31m', message, '\x1b[0m'),
}

const onCancel = prompt => {
  log.red('Aborted by user!');
  process.exit(0);
}

const GCE_LINK = 'https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/googleChatExtender.js';
const GCE_PLUGIN_LINK = 'https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/googleChatExtenderPlugin.js';
const THEME_PLUGIN_LINK = 'https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/plugins/themeLoader.js';
const PLUGIN_LIST = 'https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/pluginList.json';

let globalPath = '/Applications/iAdvize\ Chat.app';

function getArguments() {
  if(argv.p === true) {
    log.red(`
Invalid options: -p
Usage: gce -p <path>      The relative/absolute path of Chat.app

Use "gce help" for complete list of options
    `);
    process.exit(0);
  }

  if(argv.p) globalPath = argv.p;
}

async function checkPath(path) {
  try {
    fs.readdirSync('/Applications/' + path);
    log.blue('Chat.app found!');
    return '/Applications/' + path;
  } catch(err) {}
  try {
    log.blue(`Searching ${path}...`);
    fs.readdirSync(path + '/Contents/Resources/app');
    log.blue('Chat.app found!');
    return path + '/Contents/Resources/app';
  } catch(err) {
    response = await prompts({
      type: 'text',
      name: 'path',
      message: 'it seems we can\'t find Chat.app. Can you give the relative/absolute path'
    }, {onCancel: onCancel});

    return checkPath(response.path);
  }
}

async function checkGCE(path) {
  try {
    const dir = fs.readFileSync(path + '/Contents/Resources/app/googleChatExtender.js');
    response = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'it seems GCE is already installed. Should overwrite it?'
    }, {onCancel: onCancel});
    if(!response.value) onCancel();

    return true;
  } catch(err) {
    log.blue('GCE isn\'t already installed.');
    return true;
  }
}

async function installGCE(path) {
  log.blue('Fetch GCE files..');
  const gce = await axios.get(GCE_LINK);
  const gcePlugin = await axios.get(GCE_PLUGIN_LINK);
  const themePlugin = await axios.get(THEME_PLUGIN_LINK);
  log.blue('Files fetched!');

  try {
    log.blue('Trying to update Chat\'s files..');
    const main = fs.readFileSync(path + '/main.js');
    fs.writeFileSync(path + '/main.js', 'require(__dirname + \'/googleChatExtender.js\');' + main);
    log.blue('Chat\'s files updated!');
  } catch(err) { throw new Error('It seem we cannot modify Chat\'s files.. Retry with sudo!'); }
  try {
    log.blue('Installing GCE files..');
    fs.writeFileSync(path + '/googleChatExtender.js', gce.data);
    fs.writeFileSync(path + '/googleChatExtenderPlugin.js', gcePlugin.data);
    log.blue('GCE files installed!');
    try {
      log.blue('Installing ThemeLoader Plugin..');
      fs.readdirSync(path + '/plugins');
    } catch(err) { fs.mkdirSync(path + '/plugins'); }
    fs.writeFileSync(path + '/plugins/themeLoader.js', themePlugin.data);
    log.blue('ThemeLoader Plugin installed!');
  }
  catch(err) { throw new Error(err); }
}

async function info() {
  log.green(`
###################
# GCE Information #
###################
`);
  let path = await checkPath(globalPath);
}

async function install() {
  log.green(`
####################
# GCE Installation #
####################
`);
  try {
    let path = await checkPath(globalPath);
    await checkGCE(path);
    await installGCE(path + '/Contents/Resources/app');
    log.green('GCE is now installed! You can launch Google Chat.');
  } catch(err) {
    log.red(err);
  }
}

async function add() {
  log.green(`
#####################
# GCE Plugin Adding #
#####################
`);
  let path = await checkPath(globalPath);
}

async function remove() {
  log.green(`
#######################
# GCE Plugin Removing #
#######################
`);
  let path = await checkPath(globalPath);
}

async function list() {
  log.green(`
##########################
# GCE Plugins availables #
##########################
`);

  const plugins = await axios.get(PLUGIN_LIST);
}

function help() {
  console.log(`
gce controls the Google Chat Extender.
Find more information at https://github.com/Toinane/Google-Chat-Extender.

Commands:
  install [arguments]                     Launch the installation of GCE
  info [arguments]                        Show informations about your GCE's plugins
  add <plugin_name> [arguments]           Add a plugin for your GCE installation
  remove <plugin_name> [arguments]        Remove a plugin of your GCE installation
  list                                    List all plugins availables
  help                                    Show this help

Arguments:
  -p <path>       The relative/absolute path of Chat.app
  `);
}


/* Start CLI */
getArguments();

switch(argv._[0]) {
  case 'info': info();
  break;
  case 'install': install();
  break;
  case 'add': add();
  break;
  case 'remove': remove();
  break;
  case 'list': list();
  break;
  default: help();
  break;
}