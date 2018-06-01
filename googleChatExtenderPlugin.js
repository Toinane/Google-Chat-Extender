'use strict';

let gce = {
  plugins: {}
};

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
  const optionsElement = document.querySelector('.JAPqpe');
  const item = `
    <content class="z80M1" id="custom-button" jsaction="click:o6ZaF(preventDefault=true); mousedown:lAhnzb; mouseup:Osgxgf; mouseenter:SKyDAe; mouseleave:xq3APb; touchstart:jJiBRc; touchmove:kZeBdd; touchend:VfAz8(preventMouseEvents=true)">
      <div class="uyYuVb">
        <div class="j07h3c">Google Chat Extender</div>
      </div>
    </content>
    <div class="kCtYwe" role="separator"></div>
  `;

  optionsElement.innerHTML = item + optionsElement.innerHTML;
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
}

function launchPlugins() {
  log('initializing plugins', 'warn');
  plugins.forEach(plugin => {
    if(!plugin.enabled) return;
    eval(plugin.content);
    log(plugin.name + ' is loaded!', 'ok');
  })
}

(function() {
  getGCE();
  addGCEOption();
  createPluginsList();
  launchPlugins();
})()
