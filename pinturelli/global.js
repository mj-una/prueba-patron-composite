import Channel from "./rx/Channel.js";
import Emitter from "./rx/Emitter.js";

import Root from "./ui/Root.js";

export default function createGlobal(resolution, debug) {

	const GLOBAL = {};

	GLOBAL.CONFIG = { resolution, debug };
	GLOBAL.MEMO_KY = {}; // key="id": value={}. {id: {id, type...}, id: {...}}
	GLOBAL.DRAW_LS = []; // list in render order. [{id, type...}, {...}, {...}]
	GLOBAL.EMITTER = Emitter; // initialize in sketch -> setup. 
	GLOBAL.CHANNEL = new Channel(GLOBAL); // reactive paradigm for events
	GLOBAL.UI_ROOT = new Root(GLOBAL); // composite pattern for ui tree

  return GLOBAL;
}