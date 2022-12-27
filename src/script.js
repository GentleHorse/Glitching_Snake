import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { SphereGeometry } from 'three'


//a.gui ================================================================================
const gui = new dat.GUI()

//b.textures ===========================================================================
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/7.png')

//1.canvas, scene, size ================================================================
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


//2.object =============================================================================

const axesHelper = new THREE.AxesHelper()
axesHelper.visible = false
scene.add(axesHelper)

//particle geometry
const particleGeometry = new THREE.BufferGeometry()
const count = 20000
const positionArray = new Float32Array(count * 3)
const colorArray = new Float32Array(count * 3)


for (let i = 0; i < count * 3; i++){
    positionArray[i] = (Math.random() - 0.5) * 10
    colorArray[i] = Math.random()
}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionArray, 3)
)

particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colorArray, 3)
)

//particle material
const particleMaterial = new THREE.PointsMaterial()
particleMaterial.size = 0.1
particleMaterial.sizeAttenuation = true
// particleMaterial.color = new THREE.Color(0x0ff00)
particleMaterial.transparent = true
particleMaterial.alphaMap = particleTexture
// particleMaterial.alphaTest = 0.001
// particleMaterial.depthTest = false
particleMaterial.depthWrite = false
particleMaterial.blending = THREE.AdditiveBlending
particleMaterial.vertexColors = true

//particle mesh
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

gui.add(particles.scale, 'x').min(0.1).max(3).name("Scale - X")
gui.add(particles.scale, 'y').min(0.1).max(3).name("Scale - Y")
gui.add(particles.scale, 'z').min(0.1).max(3).name("Scale - Z")

//3.camera, controls ===================================================================
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//4.renderer ============================================================================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//5.animate =============================================================================
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < count; i++){
        const i3 = i * 3
        
        const x = particleGeometry.attributes.position.array[i3]
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) + Math.random() * 0.3
        particleGeometry.attributes.position.array[i3 + 2] = Math.cos(elapsedTime + x) + Math.random() * 0.3
    }
    particleGeometry.attributes.position.needsUpdate = true

    particles.rotation.y = elapsedTime * 0.08

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

