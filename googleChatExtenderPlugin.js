'use strict';

let gce = {
  plugins: {}
};

const googleChatExtenderCss = `
    #custom-button:hover{ background: #F5F5F5; }
    #custom-box{ z-index: 1000; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;}
    #custom-zone{ z-index: 999; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); }
    #custom-menu{ z-index: 1001; position: relative; background: rgb(240, 240, 240); width: 80vw; height: 90vh; border-radius: 5px; box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24); overflow: auto; }
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

function log(text, type) {
  let css = {
    'warn': 'color: red; background: yellow;text-transform:uppercase;font-size:2em;',
    'error': 'color: white; background: red;text-transform:uppercase;font-size:2em;',
    'ok': 'color: white; background: #52CE80;text-transform:uppercase;font-size:2em;'
  }
  console.log("%c"+text, css[type]);
}

function getGCE() {
  if(localStorage.getItem('gce')) gce = JSON.parse(localStorage.getItem('gce'));
  for(let variable in gce.plugins) {
    if(gce.plugins[variable] == 'false') gce.plugins[variable] = false;
    else if(gce.plugins[variable] == 'true') gce.plugins[variable] = true;
  }
}

function addGCEOption() {
  const optionsElement = document.querySelector('.qC1oJf');
  let item = document.createElement('content');
  item.classList.add('z80M1');
  item.id = 'custom-button';
  item.innerHTML = '<div class="uyYuVb"><div class="j07h3c">Google Chat Extender</div></div>';

  let style = document.createElement('style');
  style.innerHTML = googleChatExtenderCss;
  document.head.insertBefore(style, document.head.lastChild);

  optionsElement.parentElement.insertBefore(item, optionsElement);
  optionsElement.parentElement.insertBefore(document.querySelector('.kCtYwe').cloneNode(), optionsElement);
  document.getElementById('custom-button').addEventListener('click', createMenu);
}

function createMenu() {
  const pluginsList = createPluginsList();
  let menu = document.createElement('div');
  menu.id = 'custom-box';
  menu.innerHTML = `
    <div id="custom-zone"></div>
    <div id="custom-menu">
      <h1>Google Chat Extender - v1.0</h1>
      <div class="custom-separator" id="plugins-list">
        ${pluginsList}
      </div>
      <div id="custom-save">Save configuration</div>
    </div>
  `;
  document.body.appendChild(menu);
  document.getElementById('custom-zone').addEventListener('click', function(){ document.getElementById('custom-box').remove(); });
  document.getElementById('custom-save').addEventListener('click', function(){
    let inputs = document.querySelectorAll('#custom-box input, #custom-box textarea');
    
    saveConfiguration(inputs);
    document.getElementById('custom-box').remove();
  });
}

function updatePluginsConfiguration() {
  getGCE();
  plugins.forEach(plugin => {
    (gce.plugins[plugin.codeName+'-enabled'] !== undefined) ? plugin.enabled = gce.plugins[plugin.codeName+'-enabled'] : plugin.enabled = true;
    plugin.variables.forEach(variable => {
      if(gce.plugins[plugin.codeName+'.'+variable.name] === undefined) return;
      changePluginContent(plugin, variable, gce.plugins[plugin.codeName+'.'+variable.name]);
      variable.content = gce.plugins[plugin.codeName+'.'+variable.name];
      
    })
  })
}

function changePluginContent(plugin, variable, value) {
  const regex = new RegExp(`(const __${variable.name} = .*;)`, 'mi');
  let parser = '';
  if(variable.type === 'text' || variable.type === 'textarea') parser = '`';
  value = String(value).replace(/`/gmi, '"');
  plugin.content = plugin.content.replace(regex, `const __${variable.name} = ${parser}${value}${parser};`);
}

function createPluginsList() {
  let str = '';
  updatePluginsConfiguration();
  plugins.forEach(plugin => {
    let checked = '';
    if(plugin.enabled) checked = 'checked';
    str += `
      <div class="plugin">
        <h2>${plugin.name} -  v${plugin.version} <span>by ${plugin.author}</span></h2>
        <h3>${plugin.description}</h3>
        <p class="plugin-enabled">
          <label for="${plugin.codeName}-enabled">Enabled</label> 
          <input type="checkbox" id="${plugin.codeName}-enabled" ${checked} />
        </p>
        <div class="plugin-variables">
          <h4>Configuration</h4>
    `;
    plugin.variables.forEach(variable => {
      let input;
      switch(variable.type) {
        case 'textarea':
          input = `<textarea id="${plugin.codeName}.${variable.name}">${variable.content}</textarea>`;
          break;
        case 'checkbox':
          let checked;
          if(variable.content) checked = 'checked';
          input = `<input type="checkbox" id="${plugin.codeName}.${variable.name}" ${checked} />`;
          break;
        case 'number':
          input = `<input type="number" id="${plugin.codeName}.${variable.name}" value="${variable.content}" />`;
          break;
        default:
          input = `<input type="text" id="${plugin.codeName}.${variable.name}" value="${variable.content}" />`;
          break;
      }
      str += `
        <div>
          <p class="var-name"><label for="${plugin.codeName}.${variable.name}">${variable.name.replace(/([A-Z])/g, ' $1').trim()}</label> <span>${variable.description}</span></p>
          <p>${input}</p>
        </div>
      `;
    })
    str += '</div></div>';
  });
  return str;
}

function saveConfiguration(inputs) {
  inputs.forEach(input => {
    if(input.value === '' && input.type !== 'checkbox') {
      return delete(gce.plugins[input.id]);
    }
    if(input.type === 'checkbox') input.value = input.checked;
    gce.plugins[input.id] = input.value;
  });
  localStorage.setItem('gce', JSON.stringify(gce));

  window.location.reload();
}

function launchPlugins() {
  log('initializing plugins', 'warn');
  plugins.forEach(plugin => {
    if(!plugin.enabled) return;
    try {
      const el = document.createElement('script');
      el.innerHTML = plugin.content;
      el.setAttribute('nonce', window.IJ_values[8]);
      document.head.appendChild(el);
      log(plugin.name + ' is loaded!', 'ok');
    }
    catch (err) {
      log(plugin.name + 'is crashed: ' + err, 'error');
    }
  })
}

(function() {
  getGCE();
  addGCEOption();
  createPluginsList();
  launchPlugins();
})()
