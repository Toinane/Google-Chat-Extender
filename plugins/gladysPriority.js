(function() {
  const regex = /Gladys/gmi

  setInterval(function() {
    let items = document.querySelectorAll('.IL9EXe');
    for(let item of items) {
      if(regex.exec(item.innerHTML)) {
        if(/0&nbsp;notification/gmi.exec(item.innerHTML)) {
          
        } else {
          new Notification("GLADYS T'A ENVOYÉ UN MESSAGE !!!");
        }
      }
    }
  }, 5000)
})()
