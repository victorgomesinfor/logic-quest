
const button = document.getElementById('btn-start');
const modal = document.getElementById('dialog-name');
const close = document.getElementById('close');

//abre janela modal
button.onclick = function() {
    modal.showModal();
}

//Fecha janela modal
close.onclick = function() {
    modal.close();
}

//Pega o nome do jogador e exibe uma mensagem de boas-vindas.
enviar.onclick = function(){
    const button = document.getElementById('enviar');
    let name = document.getElementById('input').value;
    alert("Bem-vindo ao Logic Quest!" + " " + name + " vamos começar nossa aventura!");

}
