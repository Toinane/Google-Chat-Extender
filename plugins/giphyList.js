/*
NAME: GiphyList
DESCRIPTION: add custom emoji/gifs to google chat! drag and drop your image to publish it. Use only *.googleusercontent.com/* link! You can create an Album on Google Photo for this.
VERSION: 0.1
AUTHOR: Toinane
*/

const __showButton = false; /* show a button to see your customojis */
const __commandActive = true; /* desactivate it to improve performance and use button instead */
const __command = '/customoji'; /* custom command */

(function() {
  function setCSS() {
    const css = `
      .X9KLPc {
        position: relative;
      }
      .giphyList {
        background: white;
        border-top: 1px solid #dadce0;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0; left: 0;
        z-index: 100;
      }
      .giphyList h1 {
        padding: 15px 2px;
        text-align: center;
        font-size: 1.1em;
      }
      .giphyList .close {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 9px;
        right: 15px;
        border-radius: 20px;
        padding: 8px;
        cursor: pointer;
        transition: background 0.5s;
      }
      .giphyList .close:hover {
        background: rgba(95,99,104,0.078);
      }
      .giphyList .close::before, .customoji .close::after {
        content: '';
        position: absolute;
        height: 1px;
        width: 16px;
        top: 16px;
        left: 8px;
        margin-top: -1px;
        background: #5f6368;
      }
      .giphyList .close::before {
        transform: rotate(45deg);
      }
      .giphyList .close::after {
        transform: rotate(-45deg);
      }
      .giphyList-list {
        display: flex;
        align-content: flex-start;
        width: 100%;
        height: 100%;
        flex-wrap: wrap;
        overflow-y: auto;
        justify-content: center;
      }
      .giphyList-list img {
        width: 50px;
        height: 50px;
        margin: 3px;
        cursor: move;
      }
    `;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.insertBefore(style, document.head.lastChild);
  }

  function setListener() {
    const refresh = 500;
    
    let input = document.activeElement;
    if(!input) return setTimeout(setListener, refresh);
    if(!input.hasAttribute('aria-label') || !input.hasAttribute('contenteditable')) return setTimeout(setListener, refresh);
    if(input.innerHTML !== __command) return setTimeout(setListener, refresh);

    input.innerHTML = '';

    showCustomoji();
    setListener();
  }

  function showButton () {

  }

  function showCustomoji() {
    let menu = document.createElement('div');
    let sidebar = document.querySelector('.X9KLPc');
    menu.classList.add('giphyList');
    menu.innerHTML = `<h1>giphyList <span class="close"></span></h1><div class="giphyList-list"></div>`;

    sidebar.insertBefore(menu, sidebar.firstChild);

    document.querySelector('.customoji .close').addEventListener('click', unshowCustomoji);
  }

  function unshowCustomoji() {
    let menu = document.querySelector('.customoji');
    menu.remove();
  }

  setCSS();
  if(__showButton) showButton();
  if(__commandActive) setListener();
})()