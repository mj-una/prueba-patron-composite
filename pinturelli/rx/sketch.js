export default function runSketch(_G_, initDateNow) {

  //________
  window.preload = function() {
   
    // ready = {source: {loaded}, source: {loaded}, {...}}
    const ready = {};

    // assets = [{id, source, q5function, callback, loaded}, {...}]
    for (node in _G_.MEMO_KY) {
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

    const ClassEmitter = _G_.EMITTER(_G_);
    _G_.EMITTER = new ClassEmitter(_G_);
    
    if (_G_.CONFIG.debug) {
      console.log(`Setup finished at ${Date.now() - initDateNow}ms`)
    }
  }

  //________
  window.touchStarted = function(_evnt) {
    _evnt.preventDefault();
    _G_.EMITTER.touchStarted(_evnt, {
      t: Date.now() - initDateNow,
      x: mouseX,
      y: mouseY,
    });
  }

  //________
  window.touchEnded = function(_evnt) {
    _evnt.preventDefault();
    _G_.EMITTER.touchEnded(_evnt, {
      t: Date.now() - initDateNow,
      x: mouseX,
      y: mouseY,
    });
  }

  //________
  window.touchDragged = function(_evnt) {
    _evnt.preventDefault();
    _G_.EMITTER.touchDragged(_evnt, {
      t: Date.now() - initDateNow,
      x: mouseX,
      y: mouseY,
    });
  }
}