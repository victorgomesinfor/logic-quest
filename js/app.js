import { startPlayerTransition } from './animation.js';


// ========================================
// ELEMENTOS
// ========================================

const button = document.getElementById('btn-start');
const modal = document.getElementById('dialog-name');
const close = document.getElementById('close');
const form = document.getElementById('form');
const input = document.getElementById('input');


// ========================================
// ESTADO DO JOGADOR
// ========================================

const playerData = localStorage.getItem('player');

let player = null;

if (playerData) {
    try {
        player = JSON.parse(playerData);
    } catch (error) {
        console.error('Não foi possível recuperar o jogador:', error);
        localStorage.removeItem('player');
    }
}


// ========================================
// MODAL
// ========================================

button.addEventListener('click', () => {
    modal.showModal();
    input.focus();
});

close.addEventListener('click', () => {
    modal.close();
});


// ========================================
// CRIAÇÃO DO JOGADOR
// ========================================

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = input.value.trim();

    if (name === '') {
        alert('Digite seu nome!');
        input.focus();
        return;
    }

    player = {
        name,
        level: 1,
        xp: 0,
        score: 0
    };

    localStorage.setItem(
        'player',
        JSON.stringify(player)
    );

    modal.close();

    startPlayerTransition(player, () => {
        console.log('Transição concluída.');
        console.log('Jogador:', player);

        // Próxima etapa:
        // iniciar a Fase 01
    });
});