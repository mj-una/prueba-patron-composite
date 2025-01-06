// app//ui/componentes/Boton.js
/////////////////////////////////////

import Nodo from "../Nodo.js";
import { EVNT } from "../../sketch.js";

/////////////////////////////////////

// Clase concreta: PENDIENTE
export default class Boton extends Nodo {
  constructor(_x, _y, _t) {

    super({
      x: _x,
      y: _y,
      w: 60,
      h: 90,
    });
    
    this.texto = _t;
    this.fillA = 50;
  }

  actualizarNodo() {
    if (!EVNT.m_isp.d) return;
    // else EVNT.m_isp.d = false;

    if (!this.colisionRect(mouseX, mouseY)) return;
    
    this.fillA = (this.fillA + 5) %  255;

    // const despl = [mouseX - this.w * 0.5, mouseY - this.h * 0.5];
    // this.calcularAcumulado(despl);
  }

  dibujarNodo() {
		fill(255, 200, 200, this.fillA);
		rect(this.ax, this.ay, this.w, this.h, 10);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.texto, this.cx, this.cy);
    noFill();
  }
}
