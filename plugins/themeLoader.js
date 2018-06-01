/*
NAME: Theme Loader
DESCRIPTION: This plugin allows you to have CSS Theme on Google Chat.
VERSION: 1.0
AUTHOR: Toinane
*/

const __theme = ""; /* Paste your theme CSS here. */

(function() {
  let style = document.createElement('style');
  style.id = 'custom-style';
  style.innerHTML = __theme;

  document.head.appendChild(style);
})()
