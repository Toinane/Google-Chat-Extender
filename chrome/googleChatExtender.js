document.querySelector('#plugin').addEventListener('click', function() {
  this.classList.toggle('active');
  document.querySelector('#market').classList.toggle('active');
  document.querySelector('#plugins').classList.toggle('active');
  document.querySelector('#marketplace').classList.toggle('active');
});
document.querySelector('#market').addEventListener('click', function() {
  this.classList.toggle('active');
  document.querySelector('#plugin').classList.toggle('active');
  document.querySelector('#plugins').classList.toggle('active');
  document.querySelector('#marketplace').classList.toggle('active');
});