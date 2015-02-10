/**
 * render.js
 * Implementación de nano motor de renderizado
 * @author  Jonathan Samines
 */

var PubSub = require('./pubsub.js');

/**
 * Motor de renderizado de vistas del lado del cliente
 */
function RenderEngine(config){
	PubSub.call(this);
	this.config = config || {};
	
	
}

RenderEngine.prototype = new PubSub();

RenderEngine.prototype.renderToContainer = function(data){
	this.config.container.innerHTML = data;
};