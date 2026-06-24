/* hero3d.js — Three.js r128 compatible
   Figura atlética 3D com partículas e linhas de energia
   CapsuleGeometry REMOVIDA (não existe no r128)
   Substituída por CylinderGeometry + SphereGeometry compostas
*/

(function() {

  const heroCanvas = document.getElementById('hero-canvas');
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x060608, 1);
  camera.position.set(0, 0, 22);

  // ── CÂMERA STATE (controlada pelo GSAP scroll) ──
  window.camState = {
    posX: 0, posY: 0, posZ: 22,
    lookY: 1, rotY: 0
  };

  // ── GRUPO DA FIGURA ──
  const figureGroup = new THREE.Group();
  scene.add(figureGroup);

  // Helpers
  function addSphere(group, x, y, z, r, mat) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  }

  function addCylinder(group, x1, y1, z1, x2, y2, z2, r, mat) {
    const dir = new THREE.Vector3(x2-x1, y2-y1, z2-z1);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(r, r * 0.9, len, 12);
    const m   = new THREE.Mesh(geo, mat);
    dir.normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
    m.position.set((x1+x2)/2, (y1+y2)/2, (z1+z2)/2);
    group.add(m);
    return m;
  }

  // SUBSTITUTO de CapsuleGeometry (r128 safe)
  // Cria cápsula = cilindro + 2 esferas nas pontas
  function addCapsule(group, x, y, z, radiusX, height, mat) {
    const halfH = height / 2;
    // Cilindro central
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusX, radiusX, height, 16, 1),
      mat
    );
    cyl.position.set(x, y, z);
    group.add(cyl);
    // Topo
    const top = new THREE.Mesh(new THREE.SphereGeometry(radiusX, 16, 8, 0, Math.PI*2, 0, Math.PI/2), mat);
    top.position.set(x, y + halfH, z);
    group.add(top);
    // Base
    const bot = new THREE.Mesh(new THREE.SphereGeometry(radiusX, 16, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2), mat);
    bot.position.set(x, y - halfH, z);
    group.add(bot);
  }

  // ── MATERIAIS ──
  const bodyMat   = new THREE.MeshPhongMaterial({ color: 0x1a1a22, transparent: true, opacity: 0.92, shininess: 40 });
  const wireMat   = new THREE.MeshBasicMaterial({ color: 0xE8213A, wireframe: true,  transparent: true, opacity: 0.22 });
  const muscleMat = new THREE.MeshPhongMaterial({ color: 0x2a1418, transparent: true, opacity: 0.85, shininess: 80 });
  const glowMat   = new THREE.MeshBasicMaterial({ color: 0xE8213A, transparent: true, opacity: 0.55 });
  const skelMat   = new THREE.MeshBasicMaterial({ color: 0x661020, transparent: true, opacity: 0.4 });

  // ── CABEÇA ──
  addSphere(figureGroup, 0, 7.2, 0, 0.9,  bodyMat);
  addSphere(figureGroup, 0, 7.2, 0, 0.92, wireMat);

  // ── PESCOÇO ──
  addCylinder(figureGroup, 0,6.4,0, 0,6.0,0, 0.28, bodyMat);

  // ── CLAVÍCULA ──
  addCylinder(figureGroup, -2,5.8,0, 2,5.8,0, 0.14, skelMat);

  // ── DELTÓIDES (ombros) ──
  addSphere(figureGroup, -1.8, 5.8, 0, 0.7, muscleMat);
  addSphere(figureGroup,  1.8, 5.8, 0, 0.7, muscleMat);
  addSphere(figureGroup, -1.8, 5.8, 0, 0.72, wireMat);
  addSphere(figureGroup,  1.8, 5.8, 0, 0.72, wireMat);

  // ── PEITORAL ──
  addSphere(figureGroup, -0.8, 4.8, 0.6, 1.0, muscleMat);
  addSphere(figureGroup,  0.8, 4.8, 0.6, 1.0, muscleMat);
  addSphere(figureGroup, -0.8, 4.8, 0.62, 0.95, wireMat);
  addSphere(figureGroup,  0.8, 4.8, 0.62, 0.95, wireMat);

  // ── COLUNA (spine) ──
  addCylinder(figureGroup, 0,5.6,0, 0,1.5,0, 0.22, skelMat);

  // ── ABDÔMEN (6-pack) ──
  for (let i = 0; i < 3; i++) {
    for (let s = -1; s <= 1; s += 2) {
      addSphere(figureGroup, s * 0.35, 4.2 - i * 0.9, 0.72, 0.28, muscleMat);
    }
  }

  // ── DORSAIS (lats) ──
  addSphere(figureGroup, -1.5, 4.0, -0.1, 0.85, muscleMat);
  addSphere(figureGroup,  1.5, 4.0, -0.1, 0.85, muscleMat);
  addCylinder(figureGroup, -1.8,5.8,0, -1.4,3.5,-0.1, 0.3, muscleMat);
  addCylinder(figureGroup,  1.8,5.8,0,  1.4,3.5,-0.1, 0.3, muscleMat);

  // ── BRAÇOS SUPERIORES (bíceps/tríceps) ──
  addCylinder(figureGroup, -1.8,5.8,0, -2.4,3.8,0, 0.42, bodyMat);
  addCylinder(figureGroup,  1.8,5.8,0,  2.4,3.8,0, 0.42, bodyMat);
  addSphere(figureGroup, -2.1, 4.8, 0.1, 0.5, muscleMat);
  addSphere(figureGroup,  2.1, 4.8, 0.1, 0.5, muscleMat);

  // ── COTOVELOS ──
  addSphere(figureGroup, -2.4, 3.8, 0, 0.38, bodyMat);
  addSphere(figureGroup,  2.4, 3.8, 0, 0.38, bodyMat);

  // ── ANTEBRAÇOS ──
  addCylinder(figureGroup, -2.4,3.8,0, -2.6,2.0,0.1, 0.28, bodyMat);
  addCylinder(figureGroup,  2.4,3.8,0,  2.6,2.0,0.1, 0.28, bodyMat);

  // ── MÃOS ──
  addSphere(figureGroup, -2.6, 1.7, 0.1, 0.32, bodyMat);
  addSphere(figureGroup,  2.6, 1.7, 0.1, 0.32, bodyMat);

  // ── PELVE ──
  addSphere(figureGroup, 0, 1.5, 0, 0.9, bodyMat);

  // ── GLÚTEOS ──
  addSphere(figureGroup, -0.7, 1.3, -0.4, 0.7, muscleMat);
  addSphere(figureGroup,  0.7, 1.3, -0.4, 0.7, muscleMat);

  // ── COXAS (quadríceps) ──
  addCylinder(figureGroup, -0.6,1.5,0, -0.8,-1.0,0, 0.55, bodyMat);
  addCylinder(figureGroup,  0.6,1.5,0,  0.8,-1.0,0, 0.55, bodyMat);
  addSphere(figureGroup, -0.7, 0.2,  0.4, 0.5, muscleMat);
  addSphere(figureGroup,  0.7, 0.2,  0.4, 0.5, muscleMat);

  // ── JOELHOS ──
  addSphere(figureGroup, -0.8, -1.0, 0, 0.44, bodyMat);
  addSphere(figureGroup,  0.8, -1.0, 0, 0.44, bodyMat);

  // ── PANTURRILHAS ──
  addCylinder(figureGroup, -0.8,-1.0,0, -0.8,-3.2,-0.1, 0.38, bodyMat);
  addCylinder(figureGroup,  0.8,-1.0,0,  0.8,-3.2,-0.1, 0.38, bodyMat);
  addSphere(figureGroup, -0.85, -2.0, -0.25, 0.38, muscleMat);
  addSphere(figureGroup,  0.85, -2.0, -0.25, 0.38, muscleMat);

  // ── TORNOZELOS & PÉS ──
  addSphere(figureGroup, -0.8, -3.2, -0.1, 0.28, bodyMat);
  addSphere(figureGroup,  0.8, -3.2, -0.1, 0.28, bodyMat);
  addCylinder(figureGroup, -0.8,-3.2,-0.1, -0.8,-3.2,0.7, 0.22, bodyMat);
  addCylinder(figureGroup,  0.8,-3.2,-0.1,  0.8,-3.2,0.7, 0.22, bodyMat);

  // ── SILHUETA WIREFRAME do corpo inteiro (r128 safe: CylinderGeometry) ──
  // Usamos uma cápsula manual: cilindro central + esferas nos extremos
  addCapsule(figureGroup, 0, 2.0, 0, 1.85, 9.5,
    new THREE.MeshBasicMaterial({ color: 0xE8213A, wireframe: true, transparent: true, opacity: 0.05 })
  );

  // ── ANÉIS DE ENERGIA ──
  const ringMeshes = [6, 3, -1].map(y => {
    const geo = new THREE.TorusGeometry(2.4, 0.012, 8, 64);
    const mat = new THREE.MeshBasicMaterial({ color: 0xE8213A, transparent: true, opacity: 0.15 });
    const m   = new THREE.Mesh(geo, mat);
    m.position.y = y;
    m.rotation.x = Math.PI / 2;
    figureGroup.add(m);
    return m;
  });

  // ── PONTOS DE ATIVAÇÃO MUSCULAR (glow) ──
  const glowPoints = [
    [-0.8, 4.8,  0.62], [ 0.8, 4.8,  0.62],
    [-1.5, 4.0, -0.1 ], [ 1.5, 4.0, -0.1 ],
    [-2.1, 4.8,  0.1 ], [ 2.1, 4.8,  0.1 ],
    [-0.7, 0.2,  0.4 ], [ 0.7, 0.2,  0.4 ],
  ];
  const glowMeshes = glowPoints.map(([x,y,z]) => addSphere(figureGroup, x, y, z, 0.15, glowMat));

  // ── LINHAS DE ENERGIA (esqueleto luminoso) ──
  function makeELine(p1, p2, opacity) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...p1),
      new THREE.Vector3(...p2)
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: 0xE8213A, transparent: true, opacity,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geo, mat);
    figureGroup.add(line);
    return mat;
  }

  const eMats = [
    makeELine([0,7.2,0],[0,6.0,0], 0.3),
    makeELine([0,6.0,0],[-1.8,5.8,0], 0.3),
    makeELine([0,6.0,0],[ 1.8,5.8,0], 0.3),
    makeELine([-1.8,5.8,0],[-2.4,3.8,0], 0.25),
    makeELine([ 1.8,5.8,0],[ 2.4,3.8,0], 0.25),
    makeELine([-0.8,4.8,0.6],[0.8,4.8,0.6], 0.2),
    makeELine([0,5.6,0],[0,1.5,0], 0.3),
    makeELine([0,1.5,0],[-0.6,1.5,0], 0.25),
    makeELine([0,1.5,0],[ 0.6,1.5,0], 0.25),
    makeELine([-0.6,1.5,0],[-0.8,-1.0,0], 0.2),
    makeELine([ 0.6,1.5,0],[ 0.8,-1.0,0], 0.2),
    makeELine([-0.8,-1.0,0],[-0.8,-3.2,-0.1], 0.2),
    makeELine([ 0.8,-1.0,0],[ 0.8,-3.2,-0.1], 0.2),
  ];

  // ── PARTÍCULAS DE FUNDO ──
  const pCount = 3000;
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const i3 = i * 3;
    pPos[i3]   = (Math.random() - 0.5) * 100;
    pPos[i3+1] = (Math.random() - 0.5) * 80;
    pPos[i3+2] = (Math.random() - 0.5) * 80 - 20;
    if (Math.random() < 0.12) {
      pCol[i3]=0.91; pCol[i3+1]=0.13; pCol[i3+2]=0.23;
    } else {
      const v = 0.06 + Math.random() * 0.15;
      pCol[i3]=v; pCol[i3+1]=v; pCol[i3+2]=v * 1.1;
    }
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.18, vertexColors: true,
    transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  scene.add(particles);

  // ── GRID CHÃO ──
  const grid = new THREE.GridHelper(60, 30, 0x1a0306, 0x0e0105);
  grid.position.y = -3.5;
  scene.add(grid);

  // ── ILUMINAÇÃO ──
  scene.add(new THREE.AmbientLight(0x111118, 2));
  const redLight = new THREE.PointLight(0xE8213A, 4, 30);
  redLight.position.set(3, 6, 6);
  scene.add(redLight);
  scene.add(Object.assign(new THREE.PointLight(0x0a1aff, 1.5, 25), { position: new THREE.Vector3(-4,2,4) }));
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(-5, 8, -5);
  scene.add(rimLight);

  // ── PARALLAX MOUSE ──
  let mParX = 0, mParY = 0;
  document.addEventListener('mousemove', e => {
    mParX = (e.clientX / innerWidth  - 0.5);
    mParY = (e.clientY / innerHeight - 0.5);
  });

  // ── RENDER LOOP ──
  const clock = new THREE.Clock();
  function renderHero() {
    requestAnimationFrame(renderHero);
    const t = clock.getElapsedTime();
    const cs = window.camState;

    // Câmera suave
    camera.position.x += (cs.posX + mParX * 1.2 - camera.position.x) * 0.06;
    camera.position.y += (cs.posY - mParY * 0.6   - camera.position.y) * 0.06;
    camera.position.z += (cs.posZ                  - camera.position.z) * 0.06;
    camera.lookAt(cs.rotY * 2, cs.lookY, 0);

    // Figura flutua suavemente
    figureGroup.position.y = Math.sin(t * 0.4) * 0.18;
    figureGroup.rotation.y = cs.rotY + Math.sin(t * 0.2) * 0.04;

    // Piscada dos pontos de ativação muscular
    glowMeshes.forEach((m, i) => {
      m.material.opacity = 0.3 + Math.sin(t * 2.5 + i * 0.7) * 0.25;
    });

    // Anéis de energia giram
    ringMeshes.forEach((r, i) => {
      r.rotation.z  = t * (0.2 + i * 0.1);
      r.material.opacity = 0.08 + Math.sin(t * 1.8 + i * 1.2) * 0.07;
    });

    // Linhas de energia flicker
    eMats.forEach((mat, i) => {
      mat.opacity = 0.15 + Math.sin(t * 3 + i * 0.9) * 0.2;
    });

    // Partículas giram
    particles.rotation.y = t * 0.015;
    particles.rotation.x = t * 0.008;

    // Luz vermelha orbita
    redLight.position.x = Math.sin(t * 0.5) * 6;
    redLight.position.z = Math.cos(t * 0.5) * 6;

    renderer.render(scene, camera);
  }
  renderHero();

  // ── RESIZE ──
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

})();
