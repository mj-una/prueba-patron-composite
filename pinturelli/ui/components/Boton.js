import Nodo from "./Nodo.js";
import click from "../mixins/click.js";

export default class Boton extends click(Nodo) {
	constructor(GLB, SPR) {
		super(GLB, SPR, {
			nodoGrafico: true,
			nodoVisible: true,
			localWidth: 200,
			localHeight: 90,
			localPosX: 100,
			localPosY: 50,
		});
	}
}
