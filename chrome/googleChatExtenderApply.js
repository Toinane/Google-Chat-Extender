function initGCE() {
  console.log('Initialize GCE..');
}

// INIT GCE
(function(){
  console.log('check if GC')
  const location = window.location.hostname;

  if(location.includes('chat.google.com')) {
    initGCE();
  }
})();