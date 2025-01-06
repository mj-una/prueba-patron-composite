// app/sketch.js
/////////////////////////////////////

import "./libs/p5.min.js";
import Boton from "./ui/componentes/Boton.js";
import Comentario from "./ui/componentes/Comentario.js";
import Contenedor from "./ui/componentes/Contenedor.js";

/////////////////////////////////////

export const EVNT = { // flags eventos
  m_isp: {d: false, regr: -1},
  t_sta: {d: false, mx: null, my: null},
  t_end: {d: false, mx: null, my: null},
}

/////////////////////////////////////

let raiz; // arbol ui

window.setup = () => {

	createCanvas(500, 600);
	windowResized();

	const boton1 = new Boton(10, 100, "Aceptar");
	const boton2 = new Boton(160, 200, "Cancelar");
	const boton3 = new Boton(56, 38, "PPP");
  const coment = new Comentario(5, 54, "Hola");

	raiz = new Contenedor();
	raiz.anidarContenido(boton1);
	raiz.anidarContenido(boton2);
  boton2.anidarContenido(boton3);
  boton3.anidarContenido(coment);
}

/////////////////////////////////////

window.draw = () => {
  
  if (mouseIsPressed) EVNT.m_isp.d = true;
  else EVNT.m_isp.d = false;

	background((frameCount % 127) * 2, 100, 255 - (frameCount % 127));
	
  if (raiz) raiz.actualizarArbol();
}

/////////////////////////////////////

let evitarStarted = false;
window.touchStarted = () => {

  if (evitarStarted) return;
  evitarStarted = true;
  setTimeout(function() {
    evitarStarted = false;
  }, 200);

  EVNT.t_sta = {
    d: true,
    mx: mouseX,
    my: mouseY,
  }
}

/////////////////////////////////////

let evitarEnded = false;
window.touchEnded = () => {

  if (evitarEnded) return;
  evitarEnded = true;
  setTimeout(function() {
    evitarEnded = false;
  }, 200);

  EVNT.t_end = {
    d: true,
    mx: mouseX,
    my: mouseY,
  }
}

/////////////////////////////////////

window.windowResized = () => {
  
  let pag = document.getElementsByTagName("body")[0];
  let cnv = document.getElementById("defaultCanvas0");
  
  let mrg = 3.7; // <== EDITABLE
  
  pag.style.backgroundColor = "rgb(120, 180, 120)"; // <== EDITABLE
  
  pag.style.overflow = "hidden";
  pag.style.display = "flex";
  pag.style.justifyContent = "center";
  pag.style.alignItems = "center";
  pag.style.height = "100svh";
 
  if (windowWidth * height > windowHeight * width) { // H
    cnv.style.height = (100 - mrg * 2) + "svh";
    cnv.style.width = ((100 - mrg * 2) / height) * width + "svh";
  }
  else {
    cnv.style.width = (100 - mrg * 2) + "vw"; // V
    cnv.style.height = ((100 - mrg * 2) / width) * height + "vw";
  }
}