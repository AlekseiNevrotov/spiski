const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector('.three-container');
container.appendChild(renderer.domElement);
const geometry = new THREE.BufferGeometry();
const positions = [];
const count = 200;
const formParams = [
    { radius: 1.4, wave: 5, useSin: true },   
    { radius: 1.0, wave: 8, useSin: false },   
    { radius: 1.2, wave: 3, useSin: true },    
    { radius: 0.8, wave: 6, useSin: false }    
];
const numForms = formParams.length;
const forms = [];
const startAngles = []; 
function getPosition(angle, radius, wave, useSin = true) {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = useSin ? Math.sin(angle * wave) : Math.cos(angle * wave);
    return [x, y, z];
}
for (let i = 0; i < count; i++) {
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI * 2;
    startAngles.push(angle1, angle2);
}
for (let formIndex = 0; formIndex < numForms; formIndex++) {
    const params = formParams[formIndex];
    const formPositions = [];
    for (let i = 0; i < count; i++) {
        const angle1 = startAngles[i * 2];
        const angle2 = startAngles[i * 2 + 1];
        
        const [x1, y1, z1] = getPosition(angle1, params.radius, params.wave, params.useSin);
        const [x2, y2, z2] = getPosition(angle2, params.radius, params.wave, params.useSin);
        
        formPositions.push(x1, y1, z1, x2, y2, z2);
    }
    forms.push(formPositions);
}
positions.push(...forms[0]);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3bca98 });
const lineSegments = new THREE.LineSegments(geometry, lineMaterial);
scene.add(lineSegments);
camera.position.z = 5;
let currentFormIndex = 0;
let nextFormIndex = 1;    
let morphing = false;
let progress = 0;
let lastMorphEndTime = 0;
const morphDuration = 100; 
const pauseDuration = 2000; 
function animate() {
    requestAnimationFrame(animate);
    lineSegments.rotation.x += 0.01;
    lineSegments.rotation.y += 0.01;
    const positionAttribute = lineSegments.geometry.attributes.position.array;
    const totalCoords = positionAttribute.length;
    if (morphing) {
        const deltaTime = 1 / morphDuration;
        progress += deltaTime;
        if (progress >= 1) {
            progress = 1;
            morphing = false;
            positions.splice(0, totalCoords, ...forms[nextFormIndex]);
            currentFormIndex = nextFormIndex;
            nextFormIndex = (currentFormIndex + 1) % numForms;
            lastMorphEndTime = performance.now();
        }
        const t = Math.sin(progress * Math.PI / 2);
        for (let i = 0; i < totalCoords; i++) {
            const startCoord = forms[currentFormIndex][i];
            const endCoord = forms[nextFormIndex][i];
            positionAttribute[i] = startCoord * (1 - t) + endCoord * t;
        }
    } else {
        if (performance.now() - lastMorphEndTime > pauseDuration) {
            morphing = true;
            progress = 0;
        }
    }
    lineSegments.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
setTimeout(() => {
    if (!morphing) {
        morphing = true;
        progress = 0;
        lastMorphEndTime = performance.now() - pauseDuration;
    }
}, 2000);
animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});