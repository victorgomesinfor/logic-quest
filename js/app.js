
const button = document.getElementById('btn-start');
const modal = document.getElementById('dialog-name');
const close = document.getElementById('close');

button.onclick = function() {
    modal.showModal();
}

close.onclick = function() {
    modal.close();
}