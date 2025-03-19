import Element from "./Element.js";

export default class Root extends Element {
	constructor(GLOBAL) {

		const PARENT = {
			x: 0,
			y: 0,
		}

		const LOCAL = {
			id: "root",
			nodoGrafico: false,
			nodoVisible: false,
			localWidth: 500,
			localHeight: 600,
			localPosX: 0,
			localPosY: 0,
		}

		super(GLOBAL, PARENT, LOCAL);

		this.apagado = false;
		
		GLOBAL.MEMO_KY[this.id] = this;
		GLOBAL.DRAW_LS.push(this);
	}

	//________
  agregarElemento({
    tipo,
    superId,
    localId,
    localX = 0,
    localY = 0,
    localW = 50,
    localH = 50,
    reacciones = [],
    grafico = true,
    visible = true,
  }){

    if (this.GLOBAL.CFG.dbg) {
      
    }

    const LOCAL = {
      localId,
			nodoVisible: visible,
			localWidth: localW,
			localHeight: localH,
			localPosX: localX,
			localPosY: localY,
    }
    
    const clase = this.GLOBAL.TIPOS[tipo];
    const elemento = new clase(this.GLOBAL, this.GLOBAL.LST[superId], LOCAL);

    this.GLOBAL.LST[idSuper].anidarNodo(elemento);
  }

	//________
	propagacionAutomatica(_objt, _metd, _args = []) {
		if (this.GLOBAL.CNF.dbg) {
			if (!(_objt instanceof Element)) {
				throw new Error(`El objetivo no es un nodo valido`);
			}

			if (typeof _objt[_metd] !== "function") {
				throw new Error(`El metodo ${_metd} no existe en el objetivo`);
			}

			if (!Array.isArray(_args)) {
				throw new Error(`Los argumentos no estan dentro de un arreglo`);
			}
		}

		_objt[_metd](..._args);

		for (const nodo of _objt.anidados) {
			this.propagacionAutomatica(nodo, _metd, _args);
		}
	}

	//________
	dibujoAutomatico(_objt = this) {
		if (!_objt.visible) return;

		if (_objt.captura) {
			image(_objt.captura, 0, 0);
			return;
		}

		if (_objt.capa) image(_objt.capa, _objt.x, _objt.y);

		for (const nodo of _objt.nested) {
			this.dibujoAutomatico(nodo);
		}
	}

	//________
	dibujoForzado() {
		for (const nodo of this.GLOBAL.LST) {
			nodo.dibujarCapa();
		}
	}
}