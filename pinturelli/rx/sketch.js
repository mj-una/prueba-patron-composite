export default function runSketch(GLOBAL, initDateNow) {

  //________
  window.preload = function() {
   
    // ready = {source: {loaded}, source: {loaded}, {...}}
    const ready = {};

    // assets = [{id, source, q5function, callback, loaded}, {...}]
    for (node in GLOBAL.MEMO_KY) {
      if (node.assets.length === 0) continue;

      node.assets.forEach((_objt) => {
        if (ready[_objt.source]) {
          _objt.loaded = ready[_objt.source].loaded;
          return;
        };

        _objt.loaded = _objt.q5function(_objt.source, _objt.callback);
        ready[_objt.source].loaded = _objt.loaded;
      });
    }
  }

  //________
  window.setup = function() {
    createCanvas(400, 400);
    noLoop();
    clear();

    const ClassEmitter = GLOBAL.EMITTER(GLOBAL);
    GLOBAL.EMITTER = new ClassEmitter(GLOBAL);
    
    if (GLOBAL.CONFIG.debug) {
      console.log(`Setup finished at ${Date.now() - initDateNow}ms`)
    }
  }

  //________
  window.touchStarted = function(_evnt) {
    _evnt.preventDefault();
    GLOBAL.EMITTER.touchStarted(_evnt, {
      t: Date.now() - initDateNow,
      x: mouseX,
      y: mouseY,
    });
  }

  //________
  window.touchEnded = function(_evnt) {
    _evnt.preventDefault();
    GLOBAL.EMITTER.touchEnded(_evnt, {
      t: Date.now() - initDateNow,
      x: mouseX,
      y: mouseY,
    });
  }

  //________
  window.touchDragged = function(_evnt) {
    _evnt.preventDefault();
    GLOBAL.EMITTER.touchDragged(_evnt, {
      t: Date.now() - initDateNow,
      x: mouseX,
      y: mouseY,
    });
  }

  return GLOBAL;
}