// Gestión de suscripciones
class SubscriptionManager {
  constructor() {
    // Almacena: { nodeRef: { eventName: [ { callback, priority, middlewares } ] } }
    this.subscriptions = new Map();
  }

  subscribe(nodeRef, eventName, callback, priority = 0, middlewares = []) {
    if (!this.subscriptions.has(nodeRef)) {
      this.subscriptions.set(nodeRef, {});
    }
    const events = this.subscriptions.get(nodeRef);
    if (!events[eventName]) events[eventName] = [];
    events[eventName].push({ callback, priority, middlewares });
    events[eventName].sort((a, b) => b.priority - a.priority);
  }

  unsubscribe(nodeRef, eventName, callback) {
    if (!this.subscriptions.has(nodeRef)) return;
    const events = this.subscriptions.get(nodeRef);
    if (!events[eventName]) return;
    events[eventName] = events[eventName].filter(sub => sub.callback !== callback);
  }

  getSubscriptions(nodeRef, eventName) {
    if (!this.subscriptions.has(nodeRef)) return [];
    const events = this.subscriptions.get(nodeRef);
    return events[eventName] || [];
  }
}

// Pipeline para middlewares
class MiddlewarePipeline {
  constructor() {
    this.globalMiddlewares = [];
  }

  use(middleware) {
    this.globalMiddlewares.push(middleware);
  }

  runMiddlewares(eventName, eventData, localMiddlewares = []) {
    // Evalúa middlewares globales
    for (const mw of this.globalMiddlewares) {
      if (!mw(eventName, eventData)) return false;
    }
    // Evalúa middlewares locales
    for (const mw of localMiddlewares) {
      if (!mw(eventName, eventData)) return false;
    }
    return true;
  }
}

// Despachador de eventos
class EventDispatcher {
  constructor(subscriptionManager, middlewarePipeline) {
    this.subscriptionManager = subscriptionManager;
    this.middlewarePipeline = middlewarePipeline;
  }

  dispatch(nodeRef, eventName, eventData) {
    const subscriptions = this.subscriptionManager.getSubscriptions(nodeRef, eventName);
    subscriptions.forEach(({ callback, middlewares }) => {
      if (this.middlewarePipeline.runMiddlewares(eventName, eventData, middlewares)) {
        callback(eventData);
      }
    });
  }
}

// Ejemplo de uso:

// Nodo de UI (puede ser un objeto, ID, etc.)
const buttonNode = { id: 'btn1' };

// Instanciar componentes
const subscriptionManager = new SubscriptionManager();
const middlewarePipeline = new MiddlewarePipeline();
const dispatcher = new EventDispatcher(subscriptionManager, middlewarePipeline);

// Middleware global: evita ejecutar "mostrarPopup" si no se cumple cierta condición.
middlewarePipeline.use((eventName, data) => {
  if (eventName === 'mostrarPopup' && !data.shouldShow) return false;
  return true;
});

// Suscribirse al evento "click" con prioridad y middleware local
subscriptionManager.subscribe(
  buttonNode,
  'click',
  data => console.log('Botón clickeado:', data),
  10,
  [
    (eventName, data) => data.enabled // Middleware local: solo si 'enabled' es true.
  ]
);

// Despachar el evento "click"
dispatcher.dispatch(buttonNode, 'click', { enabled: true, info: 'Acción interna' });
