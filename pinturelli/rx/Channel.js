export default class Channel {
  constructor() {
    this.internalEvents = {};
  }
}

/*
// Clase base que representa un nodo en el árbol de la interfaz.
// Cada nodo conoce su posición, tamaño y sus nodos anidados.
class Nodo {
  constructor(x, y, w, h) {
    this.x = x;               // Posición horizontal.
    this.y = y;               // Posición vertical.
    this.w = w;               // Ancho del nodo.
    this.h = h;               // Alto del nodo.
    this.anidados = [];       // Array de nodos hijos, que se integran en el árbol.
    // Se puede incluir un buffer gráfico si se requiere renderizado independiente.
    this.capa = createGraphics(w, h);
  }

  // Método para agregar un nodo hijo al árbol.
  agregarAnidado(nodo) {
    this.anidados.push(nodo);
  }

  // Método para determinar si un punto (px, py) se encuentra dentro del área de este nodo.
  contienePunto(px, py) {
    return px >= this.x && px <= this.x + this.w &&
           py >= this.y && py <= this.y + this.h;
  }

  // Método para despachar un evento a este nodo y, recursivamente, a sus hijos.
  // 'evento' es un objeto que contiene información como las coordenadas.
  despacharEvento(evento) {
    // Primero, comprobamos si el evento ocurre dentro de este nodo.
    if (this.contienePunto(evento.x, evento.y)) {
      // Recorremos los nodos hijos en orden inverso (para simular la prioridad de los elementos superiores).
      for (let i = this.anidados.length - 1; i >= 0; i--) {
        // Si un hijo maneja el evento, se puede detener la propagación.
        if (this.anidados[i].despacharEvento(evento)) {
          return true; // Evento consumido por un hijo.
        }
      }
      // Si ningún hijo consumió el evento, el nodo actual lo intenta manejar.
      return this.manejarEvento(evento);
    }
    // Si el evento no ocurre en el área de este nodo, no se procesa aquí.
    return false;
  }

  // Método base para manejar el evento en el nodo actual.
  // Por defecto, no hace nada y devuelve 'false' para indicar que el evento no fue consumido.
  manejarEvento(evento) {
    return false;
  }
}

// Clase Boton, que extiende Nodo y define la lógica específica de un botón.
class Boton extends Nodo {
  constructor(x, y, w, h) {
    super(x, y, w, h); // Inicializa posición, tamaño y demás propiedades de Nodo.
    // Se pueden agregar propiedades específicas del botón, como estado visual.
  }

  // Sobrescribimos manejarEvento para que el botón responda a los eventos.
  manejarEvento(evento) {
    // Aquí se verifica que el evento es un click.
    if (evento.tipo === 'click') {
      // Si el evento ocurrió en este botón, se ejecuta la acción del botón.
      console.log("Botón presionado en (" + this.x + ", " + this.y + ")");
      // Se emite, de forma local o a través del árbol, un mensaje que otros componentes pueden captar.
      // Por ejemplo, el botón notifica que fue presionado, lo que puede ser escuchado por otros nodos.
      this.emitirAccion();
      return true; // Se indica que el evento fue consumido.
    }
    // Si el evento no es del tipo que maneja el botón, no se consume.
    return false;
  }

  // Método que simula la emisión de una acción al ser presionado.
  emitirAccion() {
    // En una arquitectura reactiva, este método podría emitir un evento a un canal o notificar a nodos específicos.
    // Por simplicidad, aquí simplemente mostramos un mensaje.
    console.log("El botón ha emitido su acción reactiva.");
  }
}

// Clase Bloque, que extiende Nodo y reacciona a la acción emitida por el botón.
// Se imagina que el Bloque puede estar en otra rama del árbol y que se suscribe a las acciones de los botones.
class Bloque extends Nodo {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    // Se pueden definir propiedades específicas, como color o animaciones.
  }

  // Sobrescribimos manejarEvento para que el bloque reaccione a un tipo de evento específico.
  // En este ejemplo, supongamos que el bloque está atento a una "acción reactiva" emitida por un botón.
  manejarEvento(evento) {
    // Comprobamos si el evento es del tipo "accionDesdeBoton" o similar.
    // Para esta demostración, imaginamos que el evento viene con un indicador de que es para el bloque.
    if (evento.tipo === 'accionDesdeBoton') {
      // Realiza una acción, por ejemplo, moverse o cambiar de color.
      console.log("Bloque reaccionando a la acción del botón. Cambio de estado.");
      // Se podrían realizar más cambios aquí, como actualizar la posición o redibujar la capa.
      return true;
    }
    return false;
  }
}

// Supongamos que tenemos un nodo raíz que actúa como contenedor de toda la interfaz.
class App extends Nodo {
  constructor() {
    super(0, 0, width, height); // Se asume que 'width' y 'height' son las dimensiones del canvas.
  }

  // Podemos sobrescribir manejarEvento si queremos que el contenedor realice alguna acción
  // cuando ningún elemento específico haya consumido el evento.
  manejarEvento(evento) {
    // Por defecto, el contenedor no consume el evento.
    return false;
  }
}

// Creamos la instancia raíz de la aplicación, que contendrá a todos los demás nodos.
const app = new App();

// Creamos un botón en una posición determinada y lo agregamos al árbol.
const miBoton = new Boton(50, 50, 100, 50);
app.agregarAnidado(miBoton);

// Creamos un bloque en otra parte y lo agregamos al árbol.
const miBloque = new Bloque(200, 200, 80, 80);
app.agregarAnidado(miBloque);

// Funciones globales de p5.js para capturar eventos táctiles.
let tiempoInicioTouch = 0;
function touchStarted() {
  // Registramos el instante en que se inició el toque.
  tiempoInicioTouch = millis();
}

function touchEnded() {
  // Calculamos la duración del toque.
  let duracion = millis() - tiempoInicioTouch;
  // Si el toque es breve, lo consideramos un click.
  if (duracion < 200) {
    // Creamos un objeto de evento con tipo "click" y la posición actual del mouse.
    const evento = { tipo: 'click', x: mouseX, y: mouseY };
    // Despachamos el evento comenzando en el nodo raíz de la aplicación.
    // El árbol se encargará de determinar quién debe manejarlo.
    app.despacharEvento(evento);
    // Además, se puede propagar el evento a otras partes del sistema, si fuera necesario.
  }
}
*/