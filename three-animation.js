console.log('Three.js Animation Script Loading...');
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://unpkg.com/three@0.170.0/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'https://unpkg.com/three@0.170.0/examples/jsm/loaders/RGBELoader.js';

// Wait for window load to ensure everything is ready
window.addEventListener('load', () => {
    const container = document.querySelector('.about-img');
    const imagePath = 'hritik.jpg';

    if (!container) {
        console.error('Three.js Error: Container .about-img not found');
        return;
    }

    try {
        initThreeJS(container, imagePath);
    } catch (e) {
        console.error('Three.js Initialization Error:', e);
    }
});

function initThreeJS(container, imagePath) {
    // Parameters (Internal, since GUI is removed)
    const params = {
        shape: 'Square', // Default shape
        segments: 64,
        photoScale: 1.2,
        glassColor: 0xffffff,
        envIntensity: 1.0,
        internalReflect: 1.5,
        opacity: 1.0,
        playing: true,
        globalSpeed: 1.0,
        yAxis: { mode: 'Spin', speed: 0.5, amp: 0.6 },
        xAxis: { enabled: true, speed: 0.4, amp: 0.2 },
        zAxis: { enabled: true, speed: 0.3, amp: 0.1 }
    };

    // Clear existing image
    container.innerHTML = '';

    // --- SCENE ---
    const scene = new THREE.Scene();
    // Transparent background to blend with site
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false; // Disable zoom to keep it neat

    // --- LIGHTS AND ENV ---
    const hdriUrl = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/royal_esplanade_2k.hdr';

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(hdriUrl, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentIntensity = params.envIntensity;
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Additional lights for better definition
    const backLight = new THREE.DirectionalLight(0xffffff, 3.0);
    backLight.position.set(-5, 2, -10);
    scene.add(backLight);
    const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 2, 10);
    scene.add(frontLight);

    const group = new THREE.Group();
    scene.add(group);

    // --- PHOTO MESH ---
    let currentAspectRatio = 1.0;

    const photoGeo = new THREE.PlaneGeometry(1, 1);
    const photoMat = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
        transparent: false,
        depthWrite: true
    });

    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    group.add(photoMesh);

    const textureLoader = new THREE.TextureLoader();

    function updatePhotoScale() {
        const s = params.photoScale;
        const finalScale = s; // Simplified scale logic

        if (currentAspectRatio > 1) {
            photoMesh.scale.set(finalScale, finalScale / currentAspectRatio, 1);
        } else {
            photoMesh.scale.set(finalScale * currentAspectRatio, finalScale, 1);
        }
    }

    // Load the user's image
    textureLoader.load(imagePath, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        photoMat.map = tex;
        photoMat.needsUpdate = true;
        if (tex.image) {
            currentAspectRatio = tex.image.width / tex.image.height;
            updatePhotoScale();
        }
    });

    // --- GLASS MESH ---
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: params.glassColor,
        transmission: 1.0,
        opacity: params.opacity,
        metalness: 0.0,
        roughness: 0.0,
        ior: params.internalReflect,
        thickness: 1.2,
        specularIntensity: 1.0,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const glassMesh = new THREE.Mesh(new THREE.RoundedBoxGeometry(2.1, 2.1, 1.0, 32, 0.25), glassMat);
    glassMesh.renderOrder = 1;
    group.add(glassMesh);


    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (params.playing) {
            time += delta * params.globalSpeed;

            // Spin Y
            group.rotation.y += delta * params.yAxis.speed;

            // Gentle X and Z sway
            group.rotation.x = Math.cos(time * 0.4) * 0.2;
            group.rotation.z = Math.sin(time * 0.3 * 0.7) * 0.1;
        }

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // --- RESIZE HANDLING ---
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}
