import * as THREE from 'three'
import Tempus from 'tempus'
import { Base } from './core/Base'
import { OrthographicCamera } from './core/OrthographicCamera'
import { RawShaderMaterial } from './core/ExtendedMaterials'
import vertexShader from './shader/plane.vs'
import fragmentShader from './shader/plane.fs'

export class Canvas extends Base {
	private readonly scene: THREE.Scene
	private readonly camera: OrthographicCamera
	private readonly boxMap = new WeakMap<
		HTMLElement,
		{ mesh: THREE.Mesh<THREE.PlaneGeometry, RawShaderMaterial>; screen: HTMLElement }
	>()
	private readonly boxes: HTMLElement[] = []

	constructor(canvas: HTMLCanvasElement) {
		super(canvas)

		this.scene = new THREE.Scene()

		this.camera = OrthographicCamera.createWindowAspect(this.renderer, 'width', window.innerWidth, 0.1, 10)
		this.camera.position.z = 1

		this.boxes.push(...document.querySelectorAll<HTMLElement>('.box-container .box'))

		this.loadAssets().then((textures) => {
			this.createPlane(textures)

			window.addEventListener('resize', this.resize.bind(this))
			Tempus.add(this.render.bind(this))
		})
	}

	private async loadAssets() {
		const loader = new THREE.TextureLoader()
		const textures: THREE.Texture[] = []
		for (const box of this.boxes) {
			const fileName = box.dataset.img!
			const texture = await loader.loadAsync(import.meta.env.BASE_URL + `img/${fileName}`)
			texture.name = fileName
			texture.userData.aspect = texture.source.data.width / texture.source.data.height
			textures.push(texture)
		}
		return textures
	}

	private createPlane(textures: THREE.Texture[]) {
		for (const box of this.boxes) {
			const texture = textures.find((t) => t.name === box.dataset.img)!

			const geo = new THREE.PlaneGeometry()
			const mat = new RawShaderMaterial({
				uniforms: {
					resolution: { value: this.size },
					imgUnit: { value: texture },
					imgAspect: { value: texture.userData.aspect },
				},
				vertexShader,
				fragmentShader,
			})
			const mesh = new THREE.Mesh(geo, mat)

			const screen = box.querySelector<HTMLElement>('.screen')!

			this.calcPlaneTransform(screen, mesh)

			this.scene.add(mesh)
			this.boxMap.set(box, { mesh, screen })
		}
	}

	private calcPlaneTransform(screen: HTMLElement, mesh: THREE.Mesh) {
		const rect = screen.getBoundingClientRect()

		mesh.scale.set(rect.width, rect.height, 1)
		const x = rect.x + rect.width * 0.5 - window.innerWidth * 0.5
		const y = -(rect.y + rect.height * 0.5 - window.innerHeight * 0.5)
		mesh.position.set(x, y, 0)
	}

	protected resize() {
		super.resize()
		this.camera.updateFrustum(window.innerWidth, window.innerHeight)

		for (const box of this.boxes) {
			this.boxMap.get(box)!.mesh.material.uniforms.resolution.value = this.size
		}
	}

	private render() {
		for (const box of this.boxes) {
			const data = this.boxMap.get(box)!
			this.calcPlaneTransform(data.screen, data.mesh)

			data.mesh.renderOrder = Number(box.style.getPropertyValue('z-index'))
		}

		this.renderer.render(this.scene, this.camera)
	}
}
