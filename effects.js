import * as THREE from 'three';

// MindAR coordinate system: image target is normalized so that WIDTH = 1.0.
// For statue.jpg (1000 x 1333, portrait), height = 1.333, so:
//   X range: -0.5  to +0.5   (left to right of image)
//   Y range: -0.666 to +0.666 (bottom to top of image)
//   Z: +Z is out of the image toward the camera
//
// Defaults below are rough starting points. Tune on-site via calibrate.html,
// click "Copy values", paste the numbers back here, and save.

export const DEFAULT_OFFSETS = {
  beam: {
    position: new THREE.Vector3(-0.100, 0.605, 0.000),
    scale: 1.0,
  },
  flower: {
    position: new THREE.Vector3(0.250, -0.200, -0.305),
    scale: 1.0,
  },
};

// Beam: a vertical glowing cylinder pointing up from the raised fist.
// Placeholder — replace with your beam.glb later.
export function buildBeam() {
  const group = new THREE.Group();

  const beamHeight = 0.45;

  const coreGeo = new THREE.CylinderGeometry(0.012, 0.008, beamHeight, 24, 1, true);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x66ddff,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.y = beamHeight / 2;
  group.add(core);

  const glowGeo = new THREE.CylinderGeometry(0.035, 0.018, beamHeight, 24, 1, true);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.y = beamHeight / 2;
  group.add(glow);

  const tipGeo = new THREE.SphereGeometry(0.025, 16, 16);
  const tipMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = beamHeight;
  group.add(tip);

  group.userData.tick = (t) => {
    const pulse = 0.85 + 0.15 * Math.sin(t * 3.5);
    glowMat.opacity = 0.15 + 0.2 * pulse;
    tipMat.opacity = 0.6 + 0.4 * pulse;
    core.rotation.y = t * 0.6;
  };

  return group;
}

// Flower: small bloom of petals emerging at the shoe base.
// Placeholder — replace with your flower.glb later.
export function buildFlower() {
  const group = new THREE.Group();

  const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
  const stemMat = new THREE.MeshBasicMaterial({ color: 0x2e7d32 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.06;
  group.add(stem);

  const petalGeo = new THREE.SphereGeometry(0.035, 12, 12);
  const petalColors = [0xff6b9d, 0xff8cc8, 0xffa5d8, 0xff5588, 0xffcfe0];
  const petals = [];
  const petalCount = 6;
  for (let i = 0; i < petalCount; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: petalColors[i % petalColors.length],
      transparent: true,
      opacity: 0.92,
    });
    const petal = new THREE.Mesh(petalGeo, mat);
    const angle = (i / petalCount) * Math.PI * 2;
    const radius = 0.045;
    petal.position.set(
      Math.cos(angle) * radius,
      0.14,
      Math.sin(angle) * radius
    );
    petals.push(petal);
    group.add(petal);
  }

  const centerGeo = new THREE.SphereGeometry(0.028, 16, 16);
  const centerMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
  const center = new THREE.Mesh(centerGeo, centerMat);
  center.position.y = 0.14;
  group.add(center);

  group.userData.tick = (t) => {
    group.rotation.y = t * 0.25;
    const bloom = 0.8 + 0.2 * Math.sin(t * 1.8);
    petals.forEach((p, i) => {
      const angle = (i / petalCount) * Math.PI * 2;
      const r = 0.045 * bloom;
      p.position.x = Math.cos(angle) * r;
      p.position.z = Math.sin(angle) * r;
    });
  };

  return group;
}
