export default class Emitter {
	constructor(CHANNEL) {
		this.CHN = CHANNEL;
		this.proto = null;
	}

	protoUserEvent(_strn) {
		return {
			type: _strn,
			state: null,
		}
	}

	touchStarted(_evnt, {t, x, y}) {
		this.proto = {
			
		}

		this.emitir("tapInit")
	}

	touchEnded(_evnt, _info) {
	}

	touchDragged(_evnt, _info) {
	}
}