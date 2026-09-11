
const button = document.getElementById('btn-start');
const modal = document.getElementById('dialog-name');
const close = document.getElementById('close');
const form = document.getElementById('form');
const submit = document.getElementById('input');
const playerData = localStorage.getItem('player');
let player = null;

if(playerData){
     player = JSON.parse(playerData);
    
}

//abre janela modal
button.onclick = function() {
    modal.showModal();
}

//Fecha janela modal
close.onclick = function() {
    modal.close();
}

//Captura o nome inputado e cria o player, depois mostra um alert mostrando que tudo deu certo.
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = submit.value;

    if(name.trim() === ''){
        alert ('Digite seu nome!')
        return
    }

    const player = {
        name: name,
        level: 1,
        xp: 0,
        score: 0
    };

    localStorage.setItem('player', JSON.stringify(player));
    alert("Bem-vindo ao Logic Quest!" + " " + name + " vamos começar nossa aventura!");

});

