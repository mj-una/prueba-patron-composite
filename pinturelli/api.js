const initDateNow = Date.now();

import createGlobal from "./global.js";
import runSketch from "./rx/sketch.js";

export default function createPinturelli(res = 540, dbg = false) {

	if (dbg && (typeof res !== "number" || res < 10)) {
		throw new Error(`Resolution must be a number greater than 10.`)
	}

	const GLOBAL = createGlobal(res, dbg);
	runSketch(GLOBAL, initDateNow);

	return GLOBAL.UI_ROOT;
}
