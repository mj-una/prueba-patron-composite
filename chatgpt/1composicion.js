
// Ejemplo 1: Composición simple con funciones puras y objetos literales
// En este ejemplo se crea un objeto que representa un personaje de un juego. En lugar de definir una jerarquía de clases, se definen funciones que aportan comportamientos concretos (como hablar y moverse) y se combinan para formar el objeto final. Este enfoque enfatiza la modularidad y la facilidad para reutilizar o modificar cada comportamiento por separado.

// Función que aporta la capacidad de hablar
const hablar = (estado) => ({
  hablar: () => console.log(`${estado.nombre} dice: ¡Hola mundo!`)
});

// Función que aporta la capacidad de moverse
const moverse = (estado) => ({
  mover: (direccion) => console.log(`${estado.nombre} se mueve hacia ${direccion}`)
});

// Función de fábrica que crea un objeto personaje
// Se crea un estado interno (nombre) y se compone con las funciones 'hablar' y 'mover'
const crearPersonaje = (nombre) => {
  // Estado interno del personaje
  const estado = { nombre };

  // Composición: se unen los comportamientos en un solo objeto
  return Object.assign({}, hablar(estado), moverse(estado));
};

// Uso del objeto compuesto
const personaje = crearPersonaje('Alex');
personaje.hablar();   // Imprime: "Alex dice: ¡Hola mundo!"
personaje.mover('norte');  // Imprime: "Alex se mueve hacia norte"

// En este ejemplo se utiliza la composición para inyectar comportamientos específicos en el objeto creado. Cada función actúa como un "mixin" independiente, pero en lugar de depender de la herencia, se combinan de forma explícita con Object.assign.


// Ejemplo 2: Composición mutable vs inmutable con Object.assign
// Aquí se muestra cómo usar Object.assign para componer objetos, diferenciando entre la modificación directa del objeto original (mutable) y la creación de un nuevo objeto (inmutable). Esto es útil para entender cómo el manejo del estado puede afectar el mantenimiento y la previsibilidad del código.

// Supongamos que tenemos dos comportamientos: registrar y notificar.
const registrar = (estado) => ({
  registrar: () => console.log(`Registro: ${estado.info}`)
});

const notificar = (estado) => ({
  notificar: () => console.log(`Notificación: ${estado.info}`)
});

// Objeto base que representa información a compartir
const base = { info: 'Mensaje importante' };

// Enfoque mutable: se modifica el objeto 'base' directamente
// Todas las propiedades se asignan sobre 'base', modificándolo
Object.assign(base, registrar(base));
base.registrar(); // Imprime: "Registro: Mensaje importante"

// Enfoque inmutable: se crea un nuevo objeto combinando 'base' con nuevos comportamientos
const objetoInmutable = Object.assign({}, base, notificar(base));
// 'base' sigue sin el comportamiento 'notificar'
objetoInmutable.notificar(); // Imprime: "Notificación: Mensaje importante"
// Verificamos que 'base' no ha cambiado
if (!base.notificar) {
  console.log('El objeto base permanece sin el comportamiento notificar');
}

// En este caso se evidencia que, usando la asignación inmutable (creando un nuevo objeto), se evita alterar el estado original, lo que puede prevenir errores en sistemas complejos. Por el contrario, el enfoque mutable puede ser más directo pero arriesgado en contextos donde se comparta el objeto en múltiples partes del programa.


// Ejemplo 3: Composición en un sistema más complejo (modelo híbrido entre POO y paradigma funcional)
// Imagina que queremos modelar un objeto “vehículo” que combine diferentes comportamientos, como encender un motor y activar un sistema de navegación. En lugar de construir una jerarquía de clases que herede sucesivamente, se utilizan funciones que retornan fragmentos de comportamiento y se combinan para formar el objeto final. Esto permite cambiar o extender comportamientos de forma modular sin alterar la estructura central del objeto.

// Comportamiento para manejar el motor
const motorEncendido = (estado) => ({
  encenderMotor: () => {
    estado.motorEncendido = true;
    console.log(`El motor de ${estado.modelo} está encendido`);
  },
  apagarMotor: () => {
    estado.motorEncendido = false;
    console.log(`El motor de ${estado.modelo} está apagado`);
  }
});

// Comportamiento para el sistema de navegación
const sistemaNavegacion = (estado) => ({
  iniciarNavegacion: (destino) => {
    estado.destino = destino;
    console.log(`Navegando hacia ${destino} con ${estado.modelo}`);
  }
});

// Comportamiento para registrar el estado del vehículo (ejemplo de inyección de dependencias)
const estadoBasico = (modelo) => ({ modelo, motorEncendido: false, destino: null });

// Función de fábrica que compone el vehículo
// Aquí se utiliza la composición para armar el objeto con comportamientos independientes
const crearVehiculo = (modelo) => {
  // Crear el estado base
  const estado = estadoBasico(modelo);
  
  // Se decide crear un nuevo objeto (inmutable) combinando el estado con comportamientos
  return Object.assign({}, 
    motorEncendido(estado),
    sistemaNavegacion(estado),
    { getEstado: () => ({ ...estado }) }  // Método para obtener una copia del estado
  );
};

// Uso del objeto compuesto
const miAuto = crearVehiculo('Sedán 2025');
miAuto.encenderMotor(); // Imprime: "El motor de Sedán 2025 está encendido"
miAuto.iniciarNavegacion('Ciudad Central'); // Imprime: "Navegando hacia Ciudad Central con Sedán 2025"
console.log(miAuto.getEstado()); // Muestra el estado interno sin exponerlo directamente

// En este tercer ejemplo se combina la filosofía de la POO (uso de métodos y encapsulación del estado) con el paradigma funcional (funciones puras que devuelven fragmentos de comportamiento). La inyección de dependencias se aprecia en la forma en que el objeto estado se crea y se comparte entre las funciones que aportan comportamientos, lo que facilita pruebas unitarias y la modificación de cada parte de forma aislada.


// Cada uno de estos ejemplos ilustra cómo la composición puede servir para construir sistemas más modulares, claros y mantenibles, evitando los enredos que a veces surgen de las jerarquías de herencia profundas o el uso incontrolado de mixins. La elección entre asignaciones mutables o inmutables dependerá del contexto y la necesidad de preservar el estado original, siempre con el objetivo de mantener el código lo más predecible y fácil de modificar posible.


// A continuación se presentan cuatro ejemplos adicionales de composición en JavaScript. Cada uno ilustra cómo combinar pequeñas piezas de funcionalidad para armar objetos complejos sin recurrir a jerarquías profundas de herencia o a mixins desordenados. Se explican los objetivos y el rol de la composición en cada caso, junto con comentarios en el código para facilitar la comprensión.


// Ejemplo 1: Composición para modelar un usuario con múltiples roles
// Imagina que queremos crear un objeto “usuario” que pueda actuar tanto como moderador como editor en una aplicación. En lugar de crear una jerarquía de clases para cada rol, se definen funciones que inyectan comportamientos específicos y se combinan en un único objeto. Esto permite que el usuario tenga solo las capacidades que realmente necesita, sin atarse a una cadena de herencia.

// Función que añade la capacidad de moderar
const puedeModerar = (estado) => ({
  moderar: () => console.log(`${estado.nombre} está moderando contenido`)
});

// Función que añade la capacidad de editar
const puedeEditar = (estado) => ({
  editar: () => console.log(`${estado.nombre} está editando contenido`)
});

// Función de fábrica que crea un usuario con roles compuestos
const crearUsuario = (nombre) => {
  // Estado interno compartido entre comportamientos
  const estado = { nombre };

  // Se combinan comportamientos de moderador y editor en un nuevo objeto
  return Object.assign({}, puedeModerar(estado), puedeEditar(estado));
};

// Uso del objeto compuesto
const usuario = crearUsuario('Sam');
usuario.moderar(); // Imprime: "Sam está moderando contenido"
usuario.editar();   // Imprime: "Sam está editando contenido"

// En este ejemplo, cada función recibe un estado común y aporta su comportamiento de forma independiente. La composición con Object.assign permite agregar métodos al objeto sin depender de una herencia en cadena.


// Ejemplo 2: Composición con manejo inmutable del estado para un carrito de compras
// Aquí se muestra cómo componer un objeto que gestiona un carrito de compras. Se utiliza la asignación inmutable para preservar el estado original, creando nuevos objetos a medida que se agregan funcionalidades, lo que ayuda a evitar efectos colaterales en aplicaciones de mayor complejidad.

// Función que añade la capacidad de agregar un producto
const agregarProducto = (estado) => ({
  agregar: (producto) => {
    // Se crea un nuevo array sin modificar el original
    const nuevosProductos = [...estado.productos, producto];
    // Se actualiza el estado inmutablemente
    estado.productos = nuevosProductos;
    console.log(`Producto agregado: ${producto}`);
  }
});

// Función que añade la capacidad de calcular el total
const calcularTotal = (estado) => ({
  total: () => {
    // Supongamos que cada producto es un objeto { nombre, precio }
    const suma = estado.productos.reduce((acum, prod) => acum + prod.precio, 0);
    console.log(`Total: $${suma}`);
  }
});

// Función de fábrica para el carrito de compras
const crearCarrito = () => {
  // Estado inicial inmutable
  const estado = { productos: [] };
  // Se compone el carrito con capacidades de agregar y calcular
  return Object.assign({}, agregarProducto(estado), calcularTotal(estado), {
    // Método para obtener una copia del estado actual
    getEstado: () => ({ ...estado })
  });
};

// Uso del objeto compuesto
const carrito = crearCarrito();
carrito.agregar({ nombre: 'Libro', precio: 20 });
carrito.agregar({ nombre: 'Pluma', precio: 5 });
carrito.total(); // Imprime: "Total: $25"
console.log(carrito.getEstado());

// En este ejemplo se destaca la importancia de la inmutabilidad para mantener un estado predecible y facilitar la depuración. Cada operación que modifica el estado lo hace creando una copia o actualizando de forma controlada.


// Ejemplo 3: Composición para un sistema de notificaciones
// En este ejemplo se modela un sistema de notificaciones en el que se pueden combinar distintos canales (correo y SMS, por ejemplo). Cada función aporta la lógica de envío correspondiente, y la composición permite crear un objeto notificador que integra ambas capacidades sin necesidad de herencia.

// Función que añade la capacidad de enviar notificaciones por correo
const notificarPorCorreo = (estado) => ({
  enviarCorreo: (mensaje) => console.log(`Correo a ${estado.email}: ${mensaje}`)
});

// Función que añade la capacidad de enviar notificaciones por SMS
const notificarPorSMS = (estado) => ({
  enviarSMS: (mensaje) => console.log(`SMS a ${estado.telefono}: ${mensaje}`)
});

// Función de fábrica para el notificador
const crearNotificador = (email, telefono) => {
  const estado = { email, telefono };
  // Se compone el objeto notificador con capacidades de ambos canales
  return Object.assign({}, notificarPorCorreo(estado), notificarPorSMS(estado));
};

// Uso del objeto compuesto
const notificador = crearNotificador('ejemplo@mail.com', '123456789');
notificador.enviarCorreo('Tu pedido ha sido enviado.');
notificador.enviarSMS('Tu código es 9876.');

// Este ejemplo ilustra cómo la composición permite integrar múltiples servicios de notificación en un solo objeto, manteniendo el código modular y fácil de extender o modificar.


// Ejemplo 4: Composición en un sistema de registro y análisis de eventos
// Imagina un objeto encargado de registrar eventos y analizarlos en una aplicación. Se utilizan funciones para encapsular el registro y el análisis, y se combinan para formar un objeto robusto que puede ser ampliado fácilmente. En este caso se mezcla un enfoque funcional con una pequeña dosis de POO para mantener el estado.

// Función que añade la capacidad de registrar eventos
const registrarEvento = (estado) => ({
  registrar: (evento) => {
    // Se registra el evento de forma inmutable, creando un nuevo array
    estado.eventos = [...estado.eventos, evento];
    console.log(`Evento registrado: ${evento}`);
  }
});

// Función que añade la capacidad de analizar eventos
const analizarEventos = (estado) => ({
  analizar: () => {
    // Ejemplo simple: contar la cantidad de eventos registrados
    console.log(`Se han registrado ${estado.eventos.length} eventos.`);
  }
});

// Función de fábrica para el objeto de eventos
const crearRegistroDeEventos = () => {
  const estado = { eventos: [] };
  // Se compone el objeto con funciones de registro y análisis, y un método para ver el estado
  return Object.assign({}, registrarEvento(estado), analizarEventos(estado), {
    getEventos: () => [...estado.eventos]
  });
};

// Uso del objeto compuesto
const registro = crearRegistroDeEventos();
registro.registrar('Inicio del sistema');
registro.registrar('Error en módulo X');
registro.analizar(); // Imprime: "Se han registrado 2 eventos."
console.log(registro.getEventos());

// Este cuarto ejemplo muestra cómo la composición permite separar claramente las responsabilidades (registro y análisis) en funciones independientes que, al combinarse, crean un sistema flexible y fácil de mantener.



/*
Sobre el uso de funciones flecha para definir métodos

Observa que en estos ejemplos se han utilizado funciones flecha para definir los métodos que se agregan a los objetos compuestos. Esto se hace principalmente por varias razones relacionadas con el paradigma funcional y la composición:

Primero, las funciones flecha capturan el contexto léxico, lo que significa que no crean su propio objeto this. En escenarios de composición, donde se inyecta un estado a través de cierres, esto ayuda a evitar la confusión que puede generar el uso de this. Muchas veces se recomienda evitar this en JavaScript porque su valor puede variar dependiendo de cómo se invoque la función, lo que puede derivar en errores difíciles de rastrear en sistemas complejos. Al utilizar funciones flecha, el acceso a variables como el estado se realiza de manera explícita a través del cierre, lo que aporta claridad y previsibilidad.

Por otro lado, el uso de funciones flecha se alinea con el paradigma funcional, ya que favorece la escritura de funciones anónimas, inmutables y sin efectos colaterales inesperados. Esto resulta especialmente ventajoso en ejemplos donde cada función cumple una única responsabilidad y no depende del contexto de un objeto mayor. Cuando se tiene un método muy corto o simple, el uso de una función flecha es totalmente recomendable porque reduce el | y evita posibles problemas con this.

Sin embargo, no se debe pensar que las funciones flecha son una solución mágica para todos los casos. Si se requiere un método que, por ejemplo, utilice herencia basada en clases o tenga una lógica compleja que implique la reutilización de this (como en ciertos patrones de diseño en POO), es posible que una función tradicional resulte más adecuada. Además, en métodos que formen parte de objetos cuyos comportamientos puedan necesitar acceso al objeto completo (por ejemplo, cuando se desea usar super o modificar propiedades del objeto de forma dinámica), la función tradicional puede ofrecer mayor flexibilidad.

En resumen, el uso de funciones flecha para definir métodos en ejemplos de composición es una elección deliberada que ayuda a:

Evitar problemas asociados a la vinculación de this.

Resaltar la inyección de dependencias mediante cierres, lo que hace el código más predecible.

Alinear el código con principios del paradigma funcional, especialmente en ejemplos donde las funciones son pequeñas, puras y de única responsabilidad.


Cada estilo tiene su lugar: para métodos muy sencillos y con lógica encapsulada en un cierre, las flechas son ideales; para casos en los que la complejidad del método requiere acceso dinámico al contexto del objeto, se podría optar por métodos tradicionales. La clave es ser consciente de las implicancias de cada elección y utilizar la herramienta que mejor se adapte a la situación.
*/