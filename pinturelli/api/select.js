
// - globalElementos es el objeto global con los nodos indexados por id.
// - nodoRaiz es el nodo raíz.

import memoriaTemporal from "./index.js";

export default seleccionar = function(selector) {

  // validaciones
  if (typeof selector !== "string") {
    throw new Error(`El selector debe ser un string. Invalido: ${selector}`);
  }
  if (selector === "") {
    console.log(`Selector vacio retorna la raiz. Mejor usarla directamente(?)`);
    return nodoRaiz;
  }

  let nodosActuales = [];
  let indiceInicio = 0;

  // separa segmentos de anidados
  const partes = selector.split("/");

  // procesa primer segmento
  if (partes[0].startsWith("#")) { // caso "#" -> comienza por una id
    const id = partes[0].substring(1);

    if (!memoriaTemporal[id]) {
      throw new Error(`No existe un nodo con id "${id}".`);
    }
    
    nodosActuales = [memoriaTemporal[id]];
    indiceInicio = 1;
  }
  else if (partes[0] === "") { // caso "/" -> comienza por anidados de la raiz
    nodosActuales = [nodoRaiz];
    indiceInicio = 1;
  }
  else {
    throw new Error(`Inicio invalido en el selector. Solo puede ser "#" o "/"`);
  }

  // procesa segmentos restantes
  for (let i = indiceInicio; i < partes.length; i++) {
    const parte = partes[i].trim();
    if (parte === "") continue;
    let tipo = null;
    let indice = null;
    let match = parte.match(/^([^\[\]]+)(\[(\-?\d+)\])?$/);
    if (match) {
      tipo = match[1];
      if (match[3] !== undefined) indice = parseInt(match[3], 10);
    } else {
      match = parte.match(/^\[(\-?\d+)\]$/);
      if (match) {
        indice = parseInt(match[1], 10);
      } else {
        throw new Error("Sintaxis inválida en segmento: " + parte);
      }
    }

    // Si se detecta un selector de id en medio, es error.
    if (tipo && tipo.startsWith("#")) {
      throw new Error("El selector de id solo puede estar al inicio.");
    }

    const nuevosNodos = [];
    // Para cada nodo actual se filtran los anidados según el segmento
    for (const nodo of nodosActuales) {
      const hijos = nodo.anidados || [];
      let seleccionados = [];

      if (tipo !== null) {
        // Si se inició desde id, se devuelven TODOS los hijos que coincidan
        // Si no, se devuelve el PRIMER hijo que coincida (por defecto)
        if (selector.startsWith("#")) {
          seleccionados = hijos.filter(hijo => hijo.tipo === tipo);
        } else {
          for (const hijo of hijos) {
            if (hijo.tipo === tipo) {
              seleccionados.push(hijo);
              break;
            }
          }
        }
      } else {
        // Si no se especifica tipo, se toman todos los hijos
        seleccionados = hijos;
      }

      // Si se indica un índice, se selecciona el nodo en esa posición
      if (indice !== null) {
        if (seleccionados.length === 0) continue;
        const idx = indice < 0 ? seleccionados.length + indice : indice;
        if (idx < 0 || idx >= seleccionados.length) continue;
        nuevosNodos.push(seleccionados[idx]);
      } else {
        nuevosNodos.push(...seleccionados);
      }
    }
    nodosActuales = nuevosNodos;
    if (nodosActuales.length === 0) break;
  }

  return nodosActuales;
}
