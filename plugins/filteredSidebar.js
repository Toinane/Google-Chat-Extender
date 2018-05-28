/*
NAME: Filtered Sidebar
DESCRIPTION: Set users at top or bottom of channels in Recent category. /!\ a bit buggy.
VERSION: 0.1
AUTHOR: Toinane
*/

const __usersBefore = true; /* if users should be before channels */
const __period = 1000; /* the period between each filter */

(function() {
  function filterSidebar() {
    let parent = document.querySelector('div[aria-labelledby="utyvUb/tJHJj"]');
    parent.childNodes.forEach(function(item) {
      if(item.classList.contains('WD3P7')) {
        if(parent.firstChild === item && __usersBefore) return;
        let firstChannel = document.querySelector('div[aria-labelledby="utyvUb/tJHJj"] content.IL9EXe.PL5Wwe:not(.WD3P7)')
        if(__userBefore) parent.insertBefore(item, firstChannel);
        if(!__usersBefore) parent.appendChild(item);
      }
    });
    setTimeout(filterSidebar, __period);
  }

  filterSidebar();
})()
