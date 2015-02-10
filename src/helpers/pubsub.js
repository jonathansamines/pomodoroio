/**
 * pubsub.js
 * Implementación del patron publicador/suscriptor
 * @author Jonathan Samines
 */
function PubSub(){
	this.subscribers = {};
}

/**
 * Publica un evento, que llama a todos los suscriptores de dicho evento.
 * @param  {String} event Identificador del Evento
 * @param  {Object} data  Datos a ser pasados como parte del callback
 */
PubSub.prototype.publish = function(event, data){
	var subscribersToEvent = this.subscribers[event], s, subscriber;

	// si no existen suscriptores, se ignora la lista
	if(subscribersToEvent === undefined) return;
	
	//  se buscan todos los suscriptores asociados al evento
	//  y se llama la funcion asociada a cada uno de ellos.
	for(s = 0; s < subscribersToEvent.length; s++){
		subscriber = subscribersToEvent[s];
		
		subscriber.callback.call(subscriber.context, data)
	}
};

/**
 * Método que permite suscribirse a un evento en específico
 * @param  {String}   event    Evento al cual se suscribe
 * @param  {Object}   data     Datos pasados
 * @param  {Function} callback Funcion de llamada de retorno
 * @param  {Object}   context  Contexto de llamada asociado
 */
PubSub.prototype.subscribe = function(event, callback, context){
	// se verifica que la lista de suscriptores para el evento no exista
	if(this.subscribers[event] === undefined){
		this.subscribers[event] = [];
	}

	// se agrega el suscriptor a la lista
	this.subscribers[event].push({
		callback : callback,
		context : context
	});
};

/**
 * Permite eliminar una funcion de la lista de suscriptores
 * @param  {String}   event    [description]
 * @param  {Function} callback [description]
 */
PubSub.prototype.unsubscribe = function(event, callback){
	var s, subscribersToEvent = this.subscribers[event], subscriber;

	// se verifica que existan suscriptores al evento
	if(subscribersToEvent === undefined){ return; }

	for(s = 0; s < subscribersToEvent.length ; s++){
		subscriber = subscribersToEvent[s];

		if(subscriber.callback === callback){
			subscribersToEvent.splice(1, s);
		}
	}
};

module.exports = PubSub;