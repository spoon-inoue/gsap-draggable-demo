import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export class OrthographicCamera extends THREE.OrthographicCamera {
  public static createWindowAspect(renderer: THREE.WebGLRenderer, basis: 'width' | 'height', size: number, near = 0.1, far = 100) {
    const aspect = window.innerWidth / window.innerHeight
    let left, right, bottom, top
    if (basis === 'width') {
      left = -size * 0.5
      right = size * 0.5
      bottom = left / aspect
      top = right / aspect
    } else {
      bottom = -size * 0.5
      top = size * 0.5
      left = bottom * aspect
      right = top * aspect
    }
    return new OrthographicCamera(renderer, left, right, top, bottom, near, far)
  }

  private _controls?: OrbitControls

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
  ) {
    super(left, right, top, bottom, near, far)
  }

  get controls() {
    if (!this._controls) {
      this._controls = new OrbitControls(this, this.renderer.domElement)
      this._controls.enabled = true
      this._controls.enableDamping = true
      this._controls.dampingFactor = 0.08
    }
    return this._controls
  }

  updateFrustum(width: number, height: number) {
    this.left = -width * 0.5
    this.right = width * 0.5
    this.bottom = -height * 0.5
    this.top = height * 0.5

    this.updateProjectionMatrix()
  }
}
