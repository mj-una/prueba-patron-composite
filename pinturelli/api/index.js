import createGlobal from "../global.js";
import runSketch from "../rx/sketch.js";

import append from "./append.js";
import select from "./select.js";
import plant from "./plant.js";

export default memoriaTemporal = {}; 

window.createPinturelli = function(_res, _dbg = false) {

  if (typeof _dbg !== "boolean") {
    throw new Error(`Invalid second argument: expected a boolean (true for debug mode, false for production). If omitted, it defaults to false.`);
  }

	if (_dbg && (typeof _res !== "number" || _res < 10)) {
		throw new Error(`Resolution must be a number greater than 10.`)
	}
  
  runSketch(createGlobal(_res, _dbg));

  const seed = {
    append: append,
    select: select,
    plant: plant,
    nested: [],
  }

  return seed;
}
