import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import Tempus from 'tempus'
import { Canvas } from './webgl/Canvas'

gsap.registerPlugin(Draggable, InertiaPlugin)

// Remove GSAP's internal RAF
gsap.ticker.remove(gsap.updateRoot)
// Add to Tempus
Tempus.add((time) => gsap.updateRoot(time / 1000))

const instances = Draggable.create('.box', {
	bounds: '.box-container',
	inertia: true,
})

window.addEventListener('resize', () => {
	instances.forEach((ins) => ins.update(true))
})

function anime() {
	for (const ins of instances) {
		ins.target.querySelector<HTMLElement>('.coord .x')!.innerText = ins.x.toFixed(1)
		ins.target.querySelector<HTMLElement>('.coord .y')!.innerText = (-ins.y).toFixed(1)
	}
}

Tempus.add(anime)

//
new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)
