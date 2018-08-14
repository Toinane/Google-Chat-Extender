/*
NAME: Customoji
DESCRIPTION: add custom emoji/gifs to google chat! drag and drop your image to publish it. Use only *.googleusercontent.com/* link! You can create an Album on Google Photo for this.
VERSION: 0.3
AUTHOR: Toinane
*/

const __images = ""; /* You can use ',' to separate links */

(function() {
  let menuOpened = false;

  function setCSS() {
    const css = `
      .X9KLPc { position: relative; }
      @keyframes slidein { from {transform: translateY(100%);} to {transform: translateY(0);} }
      @keyframes slideout { from {transform: translateY(0);} to {transform: translateY(100%);} }
      .customoji {
        transform: translateY(100%);
        animation: slideout 0.7s;
        background: white; border-top: 1px solid #dadce0;
        width: 100%; height: 100%;
        position: absolute; top: 0; left: 0;
        z-index: 100;
      }
      .customoji.open { animation: slidein 0.7s; transform: translateY(0); }
      .customoji h1 {
        padding: 15px 2px;
        text-align: center; font-size: 1.1em;
      }
      .customoji-list {
        display: flex; align-content: flex-start;
        width: 100%; height: calc(100% - 50px);
        flex-wrap: wrap; overflow-y: auto;
        justify-content: center;
      }
      .customoji-list img {
        width: 50px; height: 50px; margin: 3px; cursor: move;
      }
      .customoji-button {
        width: 40px; height: 40px;
        border-radius: 40px; fill: #5f6368;
        transition: 0.2s; cursor: pointer;
      }
      .customoji-button:hover {
        background: rgba(95,99,104,0.078); fill: black;
      }
      .customoji-button svg {
        position: relative; top: 9px; left: 8px;
      }
    `;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.insertBefore(style, document.head.lastChild);
  }

  function showButton () {
    let list = document.querySelector('.is2u3');
    if(!list) return setTimeout(showButton, 1000);

    const button = document.createElement('div');
    button.classList.add('customoji-button');
    button.innerHTML = `
      <svg viewBox="0 0 26 26">
        <path d="M 7.5 1 C 3.9160714 1 1 3.9160714 1 7.5 C 1 11.083929 3.9160714 14 7.5 14 C 11.083929 14 14 11.083929 14 7.5 C 14 3.9160714 11.083929 1 7.5 1 z M 7.5 2 C 10.543488 2 13 4.4565116 13 7.5 C 13 10.543488 10.543488 13 7.5 13 C 4.4565116 13 2 10.543488 2 7.5 C 2 4.4565116 4.4565116 2 7.5 2 z M 5 5.0214844 A 1 1 0 0 0 4 6.0214844 A 1 1 0 0 0 5 7.0214844 A 1 1 0 0 0 6 6.0214844 A 1 1 0 0 0 5 5.0214844 z M 10 5.0214844 A 1 1 0 0 0 9 6.0214844 A 1 1 0 0 0 10 7.0214844 A 1 1 0 0 0 11 6.0214844 A 1 1 0 0 0 10 5.0214844 z M 9.5332031 8.9433594 C 9.5332031 8.9433594 9.4480111 9.1781331 9.1464844 9.4550781 C 8.8449572 9.7320232 8.3600861 10.021484 7.5 10.021484 C 6.604707 10.021484 6.1240568 9.7310429 5.8339844 9.4589844 C 5.543912 9.1869259 5.4726564 8.9628906 5.4726562 8.9628906 L 4.5273438 9.2871094 C 4.5273438 9.2871094 4.695713 9.7610585 5.1503906 10.1875 C 5.6050682 10.613942 6.374293 11.021484 7.5 11.021484 C 8.5979139 11.021484 9.3632928 10.612961 9.8222656 10.191406 C 10.281238 9.7698516 10.466797 9.3066406 10.466797 9.3066406 L 9.5332031 8.9433594 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"/>
      </svg>
    `;

    list.insertBefore(button, list.firstChild);
    document.querySelector('.customoji-button').addEventListener('click', showCustomoji);

    let menu = document.createElement('div');
    let sidebar = document.querySelector('.X9KLPc');
    menu.classList.add('customoji');
    menu.innerHTML = `<h1>Customoji</h1><div class="customoji-list">${parseCustomoji()}</div>`;

    sidebar.insertBefore(menu, sidebar.firstChild);
  }

  function showCustomoji() {
    let menu = document.querySelector('.customoji');
    menu.classList.toggle('open')
  }

  function parseCustomoji() {
    if(!__images.length) return '<p>no custom emoji</p>';
    let images = __images.split(',');
    
    return images.map(image => `<img src="${image.trim()}" alt="customoji" />`).join('');
  }

  setCSS();
  showButton();
})()