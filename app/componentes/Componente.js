// app/componentes/Componente.js
/////////////////////////////////////

import ER from "./errores.js";
import { CNFG } from "../config/singleton.js";

/////////////////////////////////////

/**  **  **  **  **
 * 
 *	CLASE ABSTRACTA: PATRON COMPOSITE
 * 
 *	Componente --> prototipo de nodo para ui interoperable en canvas
 *	(puede contener otros nodos, formando asi un arbol de jeraquia)
 * 
 *	@constructor --> recibe CONFIG del nodo
 *	@anidarContenido --> recibe nodo a incorporar --> calcularAcumulado
 *	@propagarMetodo --> recibe nombre del metodo (EJECUCIONES RECURSIVAS)
 *	@calcularAcumulado --> recibe posicion contenedor --> propagarMetodo
 *	@actualizarArbol --> acceso desde ciclo principal --> propagarMetodo
 *	@actualizarNodo --> calculos locales del nodo (al inicio del ciclo)
 *	@dibujarNodo --> dibujos locales del nodo (al final, post recursion)
 *	@colisionRect --> compara segun posicion en ejes
 *	@colisionColor --> compara segun color de pixel
 *
 **  **  **  **  **/

export default class Componente {
	constructor(_cnfgLocal) { // _cnfgLocal: id, x, y, w, h, c

		// identificador unico
		this.id = _cnfgLocal.id || "#_25O25";

		// flag de estado
		this.visible = true;

		// ancho y alto (local)
		this.w = _cnfgLocal.w || 0;
		this.h = _cnfgLocal.h || 0;

		// desplazamiento relativo (local)
		this.dx = 0;
    this.dy = 0;

		// posicion aboluta sup-izq (acumulada)
		this.ax = _cnfgLocal.x || 0; // temporal
		this.ay = _cnfgLocal.y || 0; // temporal

		// posicion aboluta central (acumulada)
		this.cx = this.ax + this.w * 0.5;
		this.cy = this.ay + this.h * 0.5;

		// lista nodos internos
		this.anidados = [];

		// paleta de colores
		this.c = _cnfgLocal.c;
		// matriz bidimensional (--> "c[i][j]" --> mutable):
		// - donde el primer eje [i] se refiere a cada muestra
		// - y el segundo eje [j] a los valores que la componen.
		// * puede ser en formato RGB, OKLCH (q5) o HSL (p5)
		// y puede incluir un cuarto valor para canal alpha.

		// color colision
		this.c_CLS = color(
			(_cnfgLocal.c?.[0][1]) || 2,
			(_cnfgLocal.c?.[0][2]) || 5,
			(_cnfgLocal.c?.[0][3]) || 0,
			(_cnfgLocal.c?.[0][0]) || 2,
		);
  }

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	anidarContenido(_nodo) {

		// validar si parametro "_nodo" es una instancia
		if (CNFG.DBG) ER.esInstancia(_nodo, Componente);
		
		// actualizar posicion interna
		_nodo.calcularAcumulado([this.ax, this.ay]);

		// agregar a lista de nodos
		this.anidados.push(_nodo);
	}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	propagarMetodo(_met, _args = [], _regr = -1) {
	const nmbr = this.propagarMetodo.name;

		// caso base: nodo hoja (vacio)
		if (this.anidados.length === 0) return; // salida temprana natural

		// validar si parametro "_regr" es numero entero
		if (CNFG.DBG) ER.sonEnteros([_regr], nmbr, this.id);
		
		// OPCIONAL: cuenta regresiva (para activar: entero positivo en _regr)
		if (_regr === 0) return; // salida temprana artificial
		else if (_regr > 0) _regr--;

		// OPCIONAL: ajustar argumentos (para activar: callback en _args[0])
		if (typeof _args[0] === 'function' && _args.length > 1) {
			for (let i = 1; i < _args.length; i++) {
				_args[i] = _args[0](_args[i], _regr); // mutacion ! ! !
			}
		}

		// recorrer lista de nodos interiores
		this.anidados.forEach(_nodo => {

			// saltar nodos desactivados
			if (!_nodo.visible) return;
			
			// validar si existe el metodo en el nodo
			if (CNFG.DBG) ER.existeMetodo(_nodo, _met, _nodo._id);
			
			// ejecutacion recursiva
			_nodo[_met](_args, _regr);
		});
	}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	calcularAcumulado([_x, _y]) {
	const nmbr = this.calcularAcumulado.name;

		// validar si parametro "[]" solo contiene numeros
		if (CNFG.DBG) ER.sonNumeros([_x, _y], nmbr, this.id);

		// posicion sup-izq
		this.ax += this.dx + _x;
		this.ay += this.dy + _y;

		// posicion central
		this.cx = this.ax + this.w * 0.5;
		this.cy = this.ay + this.h * 0.5;

		// propagar ejecucion
		this.propagarMetodo(nmbr, [this.ax, this.ay]);
	}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	actualizarArbol() {
	const nmbr = this.actualizarArbol.name;

		// calculos locales
		this.actualizarNodo(this.dx, this.dy);

		// propagar ejecucion
		this.propagarMetodo(nmbr);

		// dibujos locales
		push();
		resetMatrix();
		this.dibujarNodo(this.dx, this.dy);
		pop();
	}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	actualizarNodo() {
	const nmbr = this.actualizarNodo.name;

		// forzar implementacion
		if (CNFG.DBG) ER.sobreescribir(nmbr, this.id);
	}
	
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	dibujarNodo() {
	const nmbr = this.dibujarNodo.name;

		// forzar implementacion
		if (CNFG.DBG) ER.sobreescribir(nmbr, this.id);
	}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	colisionRect(_mx, _my) {
		
		// segun posicion
		return (
			_mx > this.ax &&
			_mx < this.ax + this.w &&
			_my > this.ay &&
			_my < this.ay + this.h
		);
	}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
	colisionColor(_mx, _my) {

		// segun color exacto
		const c_MOUS = get(_mx, _my);
		return c_MOUS.equals(this.c_CLS);
	}
}
