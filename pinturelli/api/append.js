import { temporal } from "./index.js";

export default append = function(_node) {

  if (typeof _node === "object") {
    appendTemporalNode(this, _node);
    return;
  }

  if (typeof _node !== "string") {
    throw new Error(`Expected a string as a route. Invalid: ${route}`)
  }

  
}

//________
const appendTemporalNode = function(parent, child) {

  if (_dbg) {
    if (!Object.hasOwn(child, 'id') || typeof child.id !== "string") {
      throw new Error(``)
    }

    if (temporalMemo.has(child.id)) {
      throw new Error(`The id "${child}" is already used`)
    }
  }

  if (!Object.hasOwn(child, 'nested') || typeof child.nested !== "array") {
    child.nested = [];
  }

  if (!Object.hasOwn(child, 'append') || typeof child.append !== "function") {
    child.append = append;
  }

  temporalMemo.add(child.id, child);
  parent.nested.push(child);
}