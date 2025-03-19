export default class Element {
  #localX; #localY;
  #w; #h;
  #x; #y;

	//________
  constructor(
		GLOBAL, PARENT,
		{
			id,
			nodoGrafico,
			nodoVisible,
			localWidth,
			localHeight,
			localPosX,
			localPosY,
		}
	) {

    if (GLOBAL.CONFIG.debug) {
			if (new.target === Element) {
				throw new Error(`No se puede instanciar "Element" directamente`);
			}

			if (typeof PARENT.x !== "number" || typeof PARENT.y !== "number") {
				throw new Error(`Invalid position in parent: ${PARENT.x} ${PARENT.y}`);
			}
		}

		this.GLOBAL = GLOBAL;
		this.PARENT = PARENT;

		this.id = id;

    this.#w = localWidth;
    this.#h = localHeight;
		
    this.#localX = localPosX;
    this.#localY = localPosY;
    this.updatePosition();
		
		this.visible = nodoVisible;
		this.apagado = true;
		
    this.capa = nodoGrafico ? createGraphics(this.#w, this.#h) : null;
		this.captura = null;
    
		this.assets = [];
		this.nested = [];
		this.events = {};
  }

	//________
	get x() { return this.#x }
	get y() { return this.#y }
	get w() { return this.#w }
	get h() { return this.#h }
  get localX() { return this.#localX }
	get localY() { return this.#localY }

	//________
  set localX(_numr) {
		if (this.apagado) return;
		if (this.GLOBAL.CONFIG.debug && typeof _numr !== "number") {
			throw new Error(`Este setter solo recibe valor de tipo numerico`);
		}

    this.#localX = _numr;
    this.updatePosition();
  }
	
	//________
  set localY(_numr) {
		if (this.apagado) return;
		if (this.GLOBAL.CONFIG.debug && typeof _numr !== "number") {
			throw new Error(`Este setter solo recibe valor de tipo numerico`);
		}

    this.#localY = _numr;
    this.updatePosition();
  }

	//________
	updatePosition() {
    this.#x = this.PARENT.x + this.#localX;
    this.#y = this.PARENT.y + this.#localY;

		if (
			this.#x > this.GLOBAL.CONFIG.canvasWitdh ||
			this.#y > this.GLOBAL.CONFIG.canvasHeigth ||
			this.#x + this.#w < 0 ||
			this.#y + this.#h < 0
		) this.visible = false;
		else this.visible = true;
  }

	//________
	anidarNodo(_objt) {
		if (this.GLOBAL.CONFIG.debug && !(_objt instanceof Nodo)) {
			throw new Error(`Solo se pueden anidar instancias extendidas de "Nodo"`);
		}

		const	ultimoAnidado = this.nested.at(-1);
		this.nested.push(_objt);
		
		let posicionAnterior;
		if (ultimoAnidado) posicionAnterior = this.GLOBAL.LST.indexOf(ultimoAnidado);
		else posicionAnterior = this.GLOBAL.LST.indexOf(this);

		_objt.apagado = false;
		this.GLOBAL.LST.splice(posicionAnterior + 1, 0, _objt);
	}

	//________
	apagarNodo() {
		const posicionActual = this.GLOBAL.LST.indexOf(this);

		if (this.GLOBAL.CONFIG.debug && posicionActual === -1) {
			throw new Error(`El nodo no se encuentra en la lista`);
		}

		this.apagado = true;
		this.GLOBAL.LST.splice(posicionActual, 1);

		for (const nodo of this.nested) {
			nodo.apagarNodo();
		}
	}

	//________
	propagarPosicion() {
		if (this.captura) this.captura = null;

    for (const nodo of this.nested) {
			if (nodo.apagado) continue;
			nodo.actualizarPosicion()
			nodo.dibujarCapa();
			nodo.propagarPosicion();
    }
  }

	//________
	dibujarCapa() {
		if (!this.visible || !this.capa || this.apagado) return;
		image(this.capa, this.#x, this.#y);
	}

	//________
	borrarCapa() {
		erase();
		rect(this.#x, this.#y, this.#w, this.#h);
		noErase();
	}

	//________
	crearCaptura(inicial = true) {
		if (this.apagado) return;

		if (inicial && this.PARENT) this.PARENT.romperCaptura();

		this.captura = null;
		this.captura.createGraphics(width, height);
		if (this.capa && this.visible) this.captura.image(this.capa, 0, 0);
		
		for (const nodo of this.nested) {
			nodo.capturarCapas(false);
			this.captura.image(nodo.captura, 0, 0);
			nodo.captura = null;
		}
	}

	//________
	romperCaptura() {
		this.captura = null;
		if (this.PARENT) this.PARENT.romperCaptura();	
	}

	//________
	colisionArea(mx, my) {
		if (
			mx < this.#x ||
			mx > this.#x + this.#w ||
			my < this.#y ||
			my > this.#y + this.#h
		) return false;
		return true;
	}

	//________
	colisionPixel(mx, my) {
		if (!this.capa || !this.colisionArea(mx, my)) return false;
    
		const px = mx - this.#x;
		const py = my - this.#y;
    
		return this.capa.get(px, py)[3] < 1;
	}
	
	//________
	emit(eventName) {
		if (this.GLOBAL.CONFIG.debug && typeof eventName !== "string") {
			throw new Error(`Event name must be a string. ${eventName}`);
		}

		// elementChannel = {eventName: [eventSubscribers], eventName: [...]}
		const elementChannel = this.GLOBAL.CHANNEL.internalEvents[this.id];
		if (!elementChannel) {
			if (this.GLOBAL.CONFIG.debug) {
				console.log(`This element has no channel or subscribers. ${this.id}`);
			}
			return;
		}

		// eventSubscribers = [{sub}, {sub}, {...}]
		const eventSubscribers = elementChannel[eventName];
		if (!eventSubscribers || eventSubscribers.length === 0) {
			if (this.GLOBAL.CONFIG.debug) {
				console.log(`There are no subscribers for "${eventName}". ${this.id}`);
			}
			return;
		}

		// sub = {id: string, callback: function, args: array}
		for (sub of eventSubscribers) {
			sub.callback(...sub.args);
		}
	}

	//________
	listen(targetId, eventName, callback, args) {
		if (this.GLOBAL.CONFIG.debug && typeof eventName !== "string") {
			throw new Error(`Event name must be a string. ${eventName}`);
		}

		const channels = this.GLOBAL.CHANNEL.internalEvents;
		channels[targetId] ||= {};
		channels[targetId][eventName] ||= [];

		const event = channels[targetId][eventName];
		event.push({ id: this.id, callback, args });
	}
}
