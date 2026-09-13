import * as THREE from 'three';
import { gsap } from 'gsap';
import { createBox } from './box.js';

const transitionScreen = document.getElementById('transition-screen');
const sceneContainer = document.getElementById('scene');
const fade = document.getElementById('fade');


// ========================================
// CENA
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x07070f);


// ========================================
// CÂMERA
// ========================================

const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(6.5, 2.2, 7.2);
camera.lookAt(0, 1.2, 0);


// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

sceneContainer.appendChild(renderer.domElement);


// ========================================
// ESTADO INICIAL
// ========================================

gsap.set(transitionScreen, {
    autoAlpha: 0
});

fade.style.opacity = '0';


// ========================================
// ILUMINAÇÃO
// ========================================

const ambientLight = new THREE.HemisphereLight(
    0x8ca7c7,
    0x080910,
    1.4
);

scene.add(ambientLight);


const keyLight = new THREE.DirectionalLight(
    0xffffff,
    3.2
);

keyLight.position.set(4, 7, 5);
keyLight.castShadow = true;

keyLight.shadow.mapSize.set(1024, 1024);

scene.add(keyLight);


const cyanLight = new THREE.PointLight(
    0x00ffc8,
    35,
    12,
    2
);

cyanLight.position.set(0, 1.5, 1.5);

scene.add(cyanLight);


const rimLight = new THREE.PointLight(
    0x5e75ff,
    18,
    10,
    2
);

rimLight.position.set(-4, 3, -4);

scene.add(rimLight);


// ========================================
// CHÃO
// ========================================

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x05060b,
    metalness: 0.2,
    roughness: 0.8
});

const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(
        5.5,
        5.5,
        0.15,
        64
    ),
    floorMaterial
);

floor.position.y = -1.45;
floor.receiveShadow = true;

scene.add(floor);


// ========================================
// CAIXA
// ========================================

const box = createBox();

box.position.y = 0.1;
box.rotation.y = THREE.MathUtils.degToRad(-8);

scene.add(box);

const {
    lidPivot,
    core
} = box.userData.animationParts;


// ========================================
// CARTÃO
// ========================================

function createCardTexture(playerName) {
    const canvas = document.createElement('canvas');

    canvas.width = 1024;
    canvas.height = 512;

    const context = canvas.getContext('2d');

    context.fillStyle = '#0e0e1e';
    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    context.strokeStyle = '#00ffc8';
    context.lineWidth = 8;

    context.strokeRect(
        12,
        12,
        canvas.width - 24,
        canvas.height - 24
    );

    context.textAlign = 'center';

    context.fillStyle = '#6b7280';
    context.font = 'bold 42px monospace';

    context.fillText(
        'PLAYER',
        canvas.width / 2,
        170
    );

    context.fillStyle = '#00ffc8';

    let fontSize = 82;

    if (playerName.length > 12) {
        fontSize = 68;
    }

    if (playerName.length > 18) {
        fontSize = 54;
    }

    context.font = `bold ${fontSize}px sans-serif`;

    context.fillText(
        playerName.toUpperCase(),
        canvas.width / 2,
        290
    );

    return new THREE.CanvasTexture(canvas);
}


const cardMaterial = new THREE.MeshBasicMaterial({
    map: createCardTexture('PLAYER'),
    transparent: true,
    side: THREE.DoubleSide
});


const card = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 1.0),
    cardMaterial
);

card.position.set(
    0,
    3.0,
    2.2
);

card.rotation.x = THREE.MathUtils.degToRad(-5);
card.rotation.y = THREE.MathUtils.degToRad(-8);

scene.add(card);


// ========================================
// ESTADO
// ========================================

let animationRunning = false;


// ========================================
// ATUALIZA CARTÃO
// ========================================

function updateCardName(playerName) {
    const newTexture = createCardTexture(playerName);

    if (card.material.map) {
        card.material.map.dispose();
    }

    card.material.map = newTexture;
    card.material.needsUpdate = true;
}


// ========================================
// RESET
// ========================================

function resetAnimation() {
    gsap.killTweensOf([
        lidPivot.rotation,
        card.position,
        card.rotation,
        card.scale,
        card.material,
        core.material,
        fade,
        transitionScreen
    ]);

    lidPivot.rotation.x = 0;

    card.visible = true;

    card.position.set(
        0,
        3.0,
        2.2
    );

    card.rotation.set(
        THREE.MathUtils.degToRad(-5),
        THREE.MathUtils.degToRad(-8),
        0
    );

    card.scale.set(1, 1, 1);

    card.material.opacity = 1;

    core.material.emissiveIntensity = 3;

    fade.style.opacity = '0';
}


// ========================================
// TRANSIÇÃO DO JOGADOR
// ========================================

export function startPlayerTransition(
    player,
    onComplete = null
) {
    if (animationRunning) {
        return;
    }

    animationRunning = true;

    resetAnimation();

    updateCardName(player.name);

    gsap.set(transitionScreen, {
        autoAlpha: 1
    });

    const timeline = gsap.timeline({
        onComplete: () => {
            animationRunning = false;

            if (onComplete) {
                onComplete();
            }
        }
    });

    timeline

        // Caixa abre
        .to(lidPivot.rotation, {
            x: THREE.MathUtils.degToRad(-105),
            duration: 0.9,
            ease: 'power3.out'
        })

        // Cartão se aproxima
        .to(card.position, {
            x: 0,
            y: 1.35,
            z: 0.8,
            duration: 0.8,
            ease: 'power3.inOut'
        })

        // Cartão entra
        .to(card.position, {
            y: 0.25,
            z: 0.15,
            duration: 0.8,
            ease: 'power2.in'
        })

        // Cartão diminui
        .to(card.scale, {
            x: 0.7,
            y: 0.7,
            duration: 0.45,
            ease: 'power2.in'
        }, '<')

        // Cartão desaparece
        .to(card.material, {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.out'
        })

        // Tampa fecha
        .to(lidPivot.rotation, {
            x: 0,
            duration: 1,
            ease: 'power3.inOut'
        }, '+=0.12')

        // Pulso
        .to(core.material, {
            emissiveIntensity: 8,
            duration: 0.18,
            ease: 'power2.out'
        })

        .to(core.material, {
            emissiveIntensity: 3,
            duration: 0.45,
            ease: 'power2.inOut'
        })

        // Fade
        .to(fade, {
            opacity: 1,
            duration: 0.75,
            ease: 'power2.in'
        });
}


// ========================================
// RESPONSIVIDADE
// ========================================

window.addEventListener('resize', () => {
    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});


// ========================================
// RENDER
// ========================================

function render() {
    renderer.render(
        scene,
        camera
    );
}

renderer.setAnimationLoop(render);