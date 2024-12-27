
export default  {
	sonNumeros,
	sonEnteros,
	esInstancia,
	existeMetodo,
	sobreescribir,
}

/////////////////////////////////////

export function sonNumeros(_nums, _met, _id) {

	if (!Array.isArray(_nums)) throw new Error(`
		*********************
		*
		* PARAMETRO INCORRECTO (NO ES ARRAY):
		* En funcion "${sonNumeros.name}".
		*
		*********************
	`);

	for (let i = 0; i < _nums.length; i++) {
		if (!Number.isFinite(_nums[i])) throw new Error(`
		*********************
		*
		* PARAMETROS INCORRECTOS (NO SON NUMEROS):
		* En metodo "${_met}" en ${_id}.
		*
		*********************
		`);
	}
}

/////////////////////////////////////

export function sonEnteros(_nums, _met, _id) {

	if (!Array.isArray(_nums)) throw new Error(`
		*********************
		*
		* PARAMETRO INCORRECTO (NO ES ARRAY):
		* En funcion "${sonEnteros.name}".
		*
		*********************
	`);

	for (let i = 0; i < _nums.length; i++) {
		if (!Number.isInteger(_nums[i])) throw new Error(`
		*********************
		*
		* PARAMETROS INCORRECTOS (NO SON ENTEROS):
		* En metodo "${_met}" en ${_id}.
		*
		*********************
		`);
	}
}
/////////////////////////////////////

export function esInstancia(_nodo, _clase) {
	
	if (!(_nodo instanceof _clase)) throw new Error(`
		*********************
		*
		* ANIDANDO OBJETO INVALIDO:
		* No es instancia de clase "${_clase.name}"
		*
		*********************
		`);
	}

/////////////////////////////////////

export function existeMetodo(_nodo, _met, _id) {

	if (typeof _nodo[_met] !== 'function') throw new Error(`
		*********************
		*
		* NOMBRE DE METODO INCORRECTO:
		* No existe "${_met}" en ${_nodo.id}.
		*
		*********************
	`);
}

/////////////////////////////////////

export function sobreescribir(_met, _id) {
	throw new Error(`
		*********************
		*
		*	METODO NO IMPELMENTADO:
		*	Falta "${_met}" en ${_id}.
		*
		*********************
	`);
}
