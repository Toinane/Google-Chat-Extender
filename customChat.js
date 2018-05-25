'use strict'

const fs = require('fs');
const {app, webContents} = require('electron');

function findPlugins(chat) {
  console.log('Load Custom Plugins...');
  fs.readdir('./plugins', function(err, files) {
    if (err) return console.log('No plugins folded found. Skipping loading plugins..');
    files.forEach(function(file) {
      fs.readFile(`./plugins/${file}`, 'utf-8', function(err, content) {
        if (err) return console.log('Custom Plugin ' + file + ' found, but we can\'t load it. Skipping it..');
        chat.executeJavaScript(content);
        console.log('Loaded Custom Plugin: ' + file)
      })
    })
  })
}

const coreSystemParser = `
  let activate = localStorage.getItem('activate') || '';
  let theme = localStorage.getItem('theme') || '';

  let options = document.querySelector('.JAPqpe');
  let item  = '<content class="z80M1" id="custom-button" jsaction="click:o6ZaF(preventDefault=true); mousedown:lAhnzb; mouseup:Osgxgf; mouseenter:SKyDAe; mouseleave:xq3APb; touchstart:jJiBRc; touchmove:kZeBdd; touchend:VfAz8(preventMouseEvents=true)"><div class="uyYuVb"><div class="j07h3c">Paramètres de personnalisation</div></div></content><div class="kCtYwe" role="separator"></div>';
  options.innerHTML = item + options.innerHTML;

  function openCustomMenu() {
    let menu = document.createElement('div');
    menu.id = 'custom-box';
    menu.innerHTML = '<div id="custom-zone"></div><div id="custom-menu"><h1>Personnalisation</h1><div class="custom-separator"><h2>Activer le thème <input id="custom-activate" type="checkbox" ' + activate + ' /></h2></div><div class="custom-separator"><h2>Thème personnalisé</h2><textarea id="custom-text" placeholder="placez votre code CSS ici..">' + theme + '</textarea></div><div id="custom-save">SAUVEGARDER</div></div>';
    document.body.appendChild(menu);

    document.getElementById('custom-zone').addEventListener('click', function(){
      document.getElementById('custom-box').remove();
    });
    document.getElementById('custom-save').addEventListener('click', function(){
      theme = document.getElementById('custom-text').value;
      if(document.getElementById('custom-activate').checked) {
        activate = 'checked';
        document.getElementById('custom-style').innerHTML = theme;
      } else {
        activate = '';
        document.getElementById('custom-style').innerHTML = '';
      }
      localStorage.setItem('activate', activate);
      localStorage.setItem('theme', theme);

      document.getElementById('custom-box').remove();
    });
  }

  document.getElementById('custom-button').addEventListener('click', openCustomMenu);
`;

const coreCSS = `
  #custom-button:hover{ background: #F5F5F5; }
  #custom-box{
    z-index: 1000; display: flex;
    align-items: center; justify-content: center;
    position: absolute; top: 0; left: 0;
    width: 100vw; height: 100vh;
  }
  #custom-zone{
    z-index: 999; position: absolute;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }
  #custom-menu{
    z-index: 1001; position: relative;
    background: white; width: 40vw; height: 80vh;
    border-radius: 2px; box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24);
    overflow: auto;
  }
  #custom-menu h1{ padding: 25px 20px; font-weight: normal; font-size: 1.4em; }
  .custom-separator{ padding: 15px 20px; border-top: 1px solid #e0e0e0; }
  .custom-separator h2{ font-weight: normal; font-size: 1em; }
  #custom-text{
    margin-top: 10px; width: 90%; min-height: 150px;
    border: none; background: #E1E1E1;
    padding: 5px; border-radius: 2px; resize: none;
  }
  #custom-save{
    display: inline-block;
    margin-left: 20px;
    padding: 10px 10px;
    border-radius: 3px;
    color: #00897b;
    font-weight: bold;
    font-size: 0.9em;
    cursor: pointer;
  }
  #custom-save:active, #custom-save:focus{ background: rgba(0,137,123,0.2); }
`;

app.on('browser-window-created', function(event, win) {
  const chat = win.webContents;
  
  //chat.openDevTools()
  chat.on('dom-ready', function() {
    if(chat.history[0] !== 'https://chat.google.com/') return; // Load CSP & CP only on Chat window. Delete this line if CSP doesn't work.

    console.log("Initializing Custom Styling Parser..");
    chat.insertCSS(coreCSS);
    chat.executeJavaScript(coreSystemParser);

    chat.executeJavaScript(`
      window.onload = function () {
        let activate = localStorage.getItem('activate') || '';
        let theme = localStorage.getItem('theme') || '';
        let style = document.createElement('style');
        style.id = 'custom-style';
        if(activate) { style.innerHTML = theme; }
        document.head.appendChild(style);
      }
    `);

    findPlugins(chat);
    console.log("Custom Styling Parser loaded!");
  });
})

