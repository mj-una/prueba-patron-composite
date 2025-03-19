class Channel {
  constructor() {
  /* Estructura
  {refe: {name: [call, prio, midd], name: [call, prio, midd]}, refe: {name: []}}
  {
    nodeRef: {
      eventName: [
        { callbackFunction, priorityNumber, middlewares: [] },
        { callbackFunction, priorityNumber, middlewares: [] },
      ],
      eventName: [
        { callbackFunction, priorityNumber, middlewares: [] },
        { callbackFunction, priorityNumber, middlewares: [] },
      ],
    },
    nodeRef: {
      eventName: [
        { callbackFunction, priorityNumber, middlewares: [] },
        { callbackFunction, priorityNumber, middlewares: [] },
      ],
      eventName: [
        { callbackFunction, priorityNumber, middlewares: [] },
        { callbackFunction, priorityNumber, middlewares: [] },
      ],
    },
  }
  
  */
    
    this.subscriptions = new Map();
    this.globalMiddlewares = [];
  }

  // Agrega un middleware global que se ejecuta antes de cualquier callback.
  use(middleware) {
    this.globalMiddlewares.push(middleware);
  }

  // Se suscribe a un evento en un nodo con una prioridad y middlewares opcionales.
  subscribe(nodeRef, eventName, callback, priority = 0, middlewares = []) {
    if (!this.subscriptions.has(nodeRef)) {
      this.subscriptions.set(nodeRef, {});
    }
    const events = this.subscriptions.get(nodeRef);
    if (!events[eventName]) events[eventName] = [];
    events[eventName].push({ callback, priority, middlewares });
    // Ordena de mayor a menor prioridad (puedes ajustar el criterio según necesidad)
    events[eventName].sort((a, b) => b.priority - a.priority);
  }

  // Elimina una suscripción
  unsubscribe(nodeRef, eventName, callback) {
    if (!this.subscriptions.has(nodeRef)) return;
    const events = this.subscriptions.get(nodeRef);
    if (!events[eventName]) return;
    events[eventName] = events[eventName].filter(sub => sub.callback !== callback);
  }

  // Despacha un evento asociado a un nodo específico.
  dispatch(nodeRef, eventName, eventData) {
    const subscriptions = this.subscriptions.get(nodeRef);
    if (!subscriptions || !subscriptions[eventName]) return;

    // Evaluación de middlewares globales
    for (const middleware of this.globalMiddlewares) {
      if (!middleware(eventName, eventData)) return; // Cancela si no se cumplen condiciones
    }

    // Ejecuta cada suscripción según su prioridad y middlewares locales
    for (const sub of subscriptions[eventName]) {
      let allow = true;
      for (const mw of sub.middlewares) {
        if (!mw(eventName, eventData)) {
          allow = false;
          break;
        }
      }
      if (allow) {
        sub.callback(eventData);
      }
    }
  }
}

// Ejemplo de uso:

// Nodo de referencia (puede ser un objeto, ID, etc.)
const buttonNode = { id: 'btn1' };

const channel = new Channel();

// Middleware que evita mostrar popup si no se cumple una condición
channel.use((eventName, data) => {
  if (eventName === 'mostrarPopup' && !data.shouldShow) return false;
  return true;
});

// Suscribirse al evento "click" con prioridad y un middleware local
channel.subscribe(
  buttonNode,
  'click',
  data => console.log('Botón clickeado:', data),
  10,
  [
    (eventName, data) => {
      // Middleware local: Solo permite el callback si data.enabled es true
      return data.enabled;
    }
  ]
);

// Dispatch simulado: primero el botón reacciona, luego emite un evento "clicked"
channel.dispatch(buttonNode, 'click', { enabled: true, info: 'Acción interna' });
