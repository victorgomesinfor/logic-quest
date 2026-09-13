import * as THREE from 'three';

const COLORS = {
    body: 0x1c2738,
    bodyLight: 0x2b3e59,
    metal: 0x6f7c8e,
    darkMetal: 0x101827,
    gold: 0x9f8356,
    cyan: 0x00ffc8
};

function createBoxMaterial(color, roughness = 0.55, metalness = 0.8) {
    return new THREE.MeshStandardMaterial({
        color,
        metalness,
        roughness
    });
}

function addBoxPart(parent, geometry, material, position = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}

function addNeonBar(parent, position, scale) {
    const material = new THREE.MeshStandardMaterial({
        color: COLORS.cyan,
        emissive: COLORS.cyan,
        emissiveIntensity: 3,
        metalness: 0.2,
        roughness: 0.25
    });

    const bar = addBoxPart(
        parent,
        new THREE.BoxGeometry(...scale),
        material,
        position
    );

    bar.userData.glowMaterial = material;
    return bar;
}

export function createBox() {
    const root = new THREE.Group();
    root.name = 'logicQuestBox';

    const body = new THREE.Group();
    body.name = 'body';
    root.add(body);

    const bodyMaterial = createBoxMaterial(COLORS.body, 0.6, 0.9);
    const lightBodyMaterial = createBoxMaterial(COLORS.bodyLight, 0.5, 0.85);
    const metalMaterial = createBoxMaterial(COLORS.metal, 0.35, 1);
    const darkMetalMaterial = createBoxMaterial(COLORS.darkMetal, 0.7, 0.9);
    const goldMaterial = createBoxMaterial(COLORS.gold, 0.35, 1);

    // Corpo principal
    addBoxPart(
        body,
        new THREE.BoxGeometry(4.2, 2.7, 3.4),
        bodyMaterial,
        [0, 0, 0]
    );

    // Faixa inferior
    addBoxPart(
        body,
        new THREE.BoxGeometry(4.35, 0.22, 3.55),
        darkMetalMaterial,
        [0, -1.13, 0]
    );

    // Painéis laterais
    addBoxPart(
        body,
        new THREE.BoxGeometry(0.18, 1.9, 2.9),
        lightBodyMaterial,
        [-2.1, -0.05, 0]
    );

    addBoxPart(
        body,
        new THREE.BoxGeometry(0.18, 1.9, 2.9),
        lightBodyMaterial,
        [2.1, -0.05, 0]
    );

    // Barras luminosas
    addNeonBar(body, [-2.13, -0.05, 0], [0.06, 1.3, 2.45]);
    addNeonBar(body, [2.13, -0.05, 0], [0.06, 1.3, 2.45]);
    addNeonBar(body, [0, -0.98, 1.72], [2.9, 0.07, 0.08]);

    // Molduras frontais
    addBoxPart(
        body,
        new THREE.BoxGeometry(3.5, 1.7, 0.18),
        darkMetalMaterial,
        [0, -0.05, 1.72]
    );

    // Fechadura
    const lock = new THREE.Group();
    lock.name = 'lock';
    lock.position.set(0, 0.25, 1.93);
    body.add(lock);

    addBoxPart(
        lock,
        new THREE.BoxGeometry(0.9, 0.9, 0.25),
        goldMaterial,
        [0, 0, 0]
    );

    addBoxPart(
        lock,
        new THREE.BoxGeometry(0.42, 0.42, 0.08),
        darkMetalMaterial,
        [0, 0, 0.16]
    );

    const lockGlow = new THREE.MeshStandardMaterial({
        color: COLORS.cyan,
        emissive: COLORS.cyan,
        emissiveIntensity: 2.5,
        metalness: 0.3,
        roughness: 0.2
    });

    addBoxPart(
        lock,
        new THREE.BoxGeometry(0.16, 0.16, 0.05),
        lockGlow,
        [0, 0, 0.22]
    );

    // Tampa com pivô na dobradiça traseira
    const lidPivot = new THREE.Group();
    lidPivot.name = 'lidPivot';
    lidPivot.position.set(0, 1.35, -1.45);
    root.add(lidPivot);

    const lid = new THREE.Group();
    lid.name = 'lid';
    lid.position.set(0, 0.18, 1.45);
    lidPivot.add(lid);

    addBoxPart(
        lid,
        new THREE.BoxGeometry(4.2, 0.36, 3.4),
        bodyMaterial,
        [0, 0, 0]
    );

    addBoxPart(
        lid,
        new THREE.BoxGeometry(3.25, 0.12, 2.45),
        lightBodyMaterial,
        [0, 0.23, 0]
    );

    addBoxPart(
        lid,
        new THREE.BoxGeometry(1.1, 0.12, 1.1),
        goldMaterial,
        [0, 0.32, 0]
    );

    const coreMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.gold,
        emissive: COLORS.cyan,
        emissiveIntensity: 3,
        metalness: 0.25,
        roughness: 0.2
    });

    const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, 0.1, 32),
        coreMaterial
    );
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 0.42, 0);
    core.castShadow = true;
    lid.add(core);

    // Trilhos externos na tampa
    [-1.25, 1.25].forEach((x) => {
        addBoxPart(
            lid,
            new THREE.BoxGeometry(0.36, 0.16, 2.85),
            metalMaterial,
            [x, 0.3, 0]
        );
    });

    // Dobradiças
    const hingeMaterial = createBoxMaterial(COLORS.gold, 0.35, 1);

    [-1.45, 1.45].forEach((x) => {
        const hinge = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.42, 24),
            hingeMaterial
        );
        hinge.rotation.z = Math.PI / 2;
        hinge.position.set(x, 1.35, -1.45);
        hinge.castShadow = true;
        hinge.receiveShadow = true;
        root.add(hinge);
    });

    // Grupo central para referência/controle da animação
    const animations = {
        root,
        body,
        lidPivot,
        lid,
        lock,
        core
    };

    root.userData.animationParts = animations;

    return root;
}
