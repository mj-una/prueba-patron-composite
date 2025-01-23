// un mixin es una funcion que 1. recibe una clase,
// 2. la extiende y 3. retorna la clase extendida.
// sirve para simular herencia multiple sin interfaces.
// otra solucion posible es composicion para clases
// o composicion para funciones (con objetos literales).
// esta opcion seria mas acorde a la idea de prototipos
// (y en javascript es una forma mucho mas escalable)
// pero se me hace poco intuitivo y dificil de usar

export default (base) => (class extends base{

	logClick(_mx, _my) {
		console.log(`CLICK!!! ${_mx} ${_my}`);
	}
})
