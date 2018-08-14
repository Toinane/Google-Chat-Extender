#!/usr/bin/env node

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');

const log = {
  blue: message => console.log('\x1b[34m', message, '\x1b[0m'),
  green: message => console.log('\x1b[32m', message, '\x1b[0m'),
  red: message => console.log('\x1b[31m', message, '\x1b[0m'),
}

const onCancel = prompt => {
  log.red('Aborted by user!');
  process.exit(0);
}

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
    const dir = fs.readFileSync(path + '/googleChatExtender.js');
    response = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'it seems GCE is already installed. Should overwrite it?'
    }, {onCancel: onCancel});
    if(!response.value) onCancel();

    return true;
  } catch(err) { log.red(err); return true; }
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
  let path = await checkPath(globalPath);
  await checkGCE(path);
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

function help() {
  console.log(`
gce controls the Google Chat Extender.
Find more information at https://github.com/Toinane/Google-Chat-Extender.

Commands:
  install [arguments]                     Launch the installation of GCE
  info [arguments]                        Show informations about your GCE's plugins
  add <plugin_name> [arguments]           Add a plugin for your GCE installation
  remove <plugin_name> [arguments]        Remove a plugin of your GCE installation
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
  default: help();
  break;
}