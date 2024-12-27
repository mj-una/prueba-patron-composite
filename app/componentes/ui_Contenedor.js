import Componente from "./Componente.js";

// Clase concreta: PENDIENTE
export default class Contenedor extends Componente {
	constructor() {
		super({x: 10, y: 200, w: 480, h: 380});
	}

	actualizarNodo() {
		// hola
	}

	dibujarNodo() {
		fill(255, 50);
		rect(this.ax, this.ay, this.w, this.h, 10);
	}
}


