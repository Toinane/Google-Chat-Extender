function initGCE() {
  console.log('Initialize GCE..');
}

// INIT GCE
(function(){
  const location = window.location.hostname;

  if(location.includes('chat.google.com')) {
    initGCE();
  }
})();
