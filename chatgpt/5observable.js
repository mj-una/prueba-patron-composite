// Clase Observable: representa una secuencia de eventos a la que pueden suscribirse observadores.
class Observable {
  // El constructor recibe una función que define cómo se comportará la suscripción.
  constructor(subscribeFn) {
    // Guardamos la función de suscripción para que se invoque cuando alguien se suscriba.
    this.subscribeFn = subscribeFn;
  }
  
  // Método que permite a un observador suscribirse a esta secuencia de eventos.
  subscribe(observer) {
    // Validación mínima: el observador debe tener al menos el método 'next'.
    if (typeof observer.next !== 'function') {
      throw new Error("El observador debe implementar el método 'next'.");
    }
    // Se invoca la función de suscripción, pasando el observador, y se espera recibir un objeto de suscripción.
    return this.subscribeFn(observer);
  }
  
  // Método para transformar los valores emitidos, creando un nuevo Observable.
  // Se implementa de forma similar a 'map' en otros frameworks reactivos.
  map(projectionFn) {
    // 'this' es el Observable actual.
    return new Observable((observer) => {
      // Nos suscribimos al Observable actual.
      const subscription = this.subscribe({
        next: (value) => {
          try {
            // Aplicamos la función de proyección al valor emitido.
            const projected = projectionFn(value);
            // Emitimos el valor transformado.
            observer.next(projected);
          } catch (e) {
            // Si ocurre un error, y el observador tiene un método 'error', lo invocamos.
            if (typeof observer.error === 'function') {
              observer.error(e);
            }
          }
        },
        error: (err) => {
          // Propagamos el error al observador.
          if (typeof observer.error === 'function') {
            observer.error(err);
          }
        },
        complete: () => {
          // Al completarse la secuencia, notificamos al observador.
          if (typeof observer.complete === 'function') {
            observer.complete();
          }
        }
      });
      // Retornamos la suscripción para que el observador pueda cancelarla si lo desea.
      return subscription;
    });
  }
  
  // Método para filtrar los valores emitidos, creando un nuevo Observable.
  filter(predicateFn) {
    return new Observable((observer) => {
      const subscription = this.subscribe({
        next: (value) => {
          try {
            // Si el valor cumple la condición, se emite.
            if (predicateFn(value)) {
              observer.next(value);
            }
          } catch (e) {
            // Se maneja el error en caso de que falle la evaluación de la condición.
            if (typeof observer.error === 'function') {
              observer.error(e);
            }
          }
        },
        error: (err) => {
          // Propagamos el error.
          if (typeof observer.error === 'function') {
            observer.error(err);
          }
        },
        complete: () => {
          // Notificamos la finalización de la secuencia.
          if (typeof observer.complete === 'function') {
            observer.complete();
          }
        }
      });
      return subscription;
    });
  }
}

// Clase Subscription: representa la suscripción a un Observable y permite cancelarla.
class Subscription {
  // El constructor recibe una función que se ejecuta para cancelar la suscripción.
  constructor(unsubscribeFn) {
    // Se almacena la función de cancelación.
    this.unsubscribeFn = unsubscribeFn;
    // Se marca el estado de la suscripción como activa.
    this.closed = false;
  }
  
  // Método que permite cancelar la suscripción.
  unsubscribe() {
    // Solo se ejecuta la cancelación si aún no se ha cerrado.
    if (!this.closed) {
      this.unsubscribeFn();
      this.closed = true;
    }
  }
}

// Clase IntervalObservable: un ejemplo concreto de Observable que emite valores en intervalos de tiempo.
class IntervalObservable extends Observable {
  // El constructor recibe el intervalo en milisegundos y el número máximo de emisiones.
  constructor(intervalMs, limit) {
    // Se define la función de suscripción que controlará las emisiones.
    super((observer) => {
      let count = 0; // Contador de emisiones.
      // Se crea un intervalo que emitirá valores cada 'intervalMs' milisegundos.
      const intervalId = setInterval(() => {
        count++;
        observer.next(count); // Emitimos el valor actual.
        // Si se alcanza el límite, se detiene el intervalo y se notifica la finalización.
        if (count >= limit) {
          clearInterval(intervalId);
          if (typeof observer.complete === 'function') {
            observer.complete();
          }
        }
      }, intervalMs);
      
      // Se retorna una instancia de Subscription que permite cancelar el intervalo.
      return new Subscription(() => {
        clearInterval(intervalId);
      });
    });
    // Guardamos parámetros para posible uso futuro o referencia.
    this.intervalMs = intervalMs;
    this.limit = limit;
  }
}

// ------------------ Ejemplo de Uso Completo ------------------

// Se crea una instancia de IntervalObservable que emitirá valores cada 1 segundo, hasta 5 emisiones.
const observable = new IntervalObservable(1000, 5);

// Se define un observador con métodos para manejar los valores, errores y la finalización.
const observer = {
  // Método que se ejecuta en cada emisión.
  next: (value) => console.log("Valor recibido:", value),
  // Método para manejar posibles errores.
  error: (err) => console.error("Error:", err),
  // Método que se ejecuta cuando la secuencia termina.
  complete: () => console.log("Secuencia completada")
};

// Se suscribe el observador al observable.
const subscription = observable.subscribe(observer);

// Se utiliza el método 'map' para transformar los valores y luego 'filter' para filtrar algunos valores.
const transformedObservable = observable
  .map(value => value * 10)      // Multiplica cada valor por 10.
  .filter(value => value % 20 === 0);  // Solo deja pasar los valores divisibles por 20.

// Se suscribe a la secuencia transformada.
transformedObservable.subscribe({
  next: (value) => console.log("Valor transformado:", value),
  complete: () => console.log("Transformación completada")
});
