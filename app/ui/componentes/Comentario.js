// app//ui/componentes/Comentario.js
/////////////////////////////////////

import Nodo from "../Nodo.js";

/////////////////////////////////////

// Clase concreta: PENDIENTE
export default class Comentario extends Nodo {
  constructor(_x, _y, _t) {
  
    super({
      x: _x,
      y: _y,
      w: 46,
      h: 30,
    });

    this.texto = _t;
  }

  actualizarNodo() {
    // .:¨:.:¨:.
  }

  dibujarNodo() {
    noStroke();
    fill(0, 0, 255, 220);
    rect(this.ax, this.ay, this.w, this.h);

    fill(255, 0, 0);
    textSize(20);
    textAlign(LEFT, CENTER);
    text(this.texto, this.ax, this.cy);
    noFill();
  }
}