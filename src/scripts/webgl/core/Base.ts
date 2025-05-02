import * as THREE from 'three'

export abstract class Base {
	protected readonly renderer: THREE.WebGLRenderer
	protected readonly clock: THREE.Clock
	private readonly abortController: AbortController

	constructor(
		protected readonly canvas: HTMLCanvasElement,
		rendererParams?: THREE.WebGLRendererParameters
	) {
		this.renderer = this.createRenderer(rendererParams)
		this.clock = new THREE.Clock()

		this.abortController = new AbortController()
		document.addEventListener('visibilitychange', this.handleVisibilitychange.bind(this), {
			signal: this.abortController.signal,
		})
	}

	private createRenderer(rendererParams?: THREE.WebGLRendererParameters) {
		const renderer = new THREE.WebGLRenderer({ ...rendererParams, canvas: this.canvas })
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(window.devicePixelRatio)
		return renderer
	}

	protected enableShadowMap() {
		this.renderer.shadowMap.enabled = true
	}

	protected resize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	private handleVisibilitychange() {
		if (document.visibilityState === 'visible') {
			this.clock.start()
		} else {
			this.clock.stop()
		}
	}

	protected get size(): [number, number] {
		const { width, height } = this.renderer.domElement
		return [width, height]
	}

	protected get resolution(): [number, number] {
		const { width, height } = this.renderer.domElement
		const dpr = this.renderer.getPixelRatio()
		return [width * dpr, height * dpr]
	}

	dispose() {
		this.abortController.abort()
		this.renderer.setAnimationLoop(null)
		this.renderer.dispose()
	}
}
