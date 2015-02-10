/**
 * pomodoro.js
 * Representación básica de una aplicación de pomodoro
 * @author Jonathan Samines
 */
var PubSub = require('../helpers/pubsub.js'),
	pomodoroNS = 'pomodoro',
	pomodoroStatus = {
		started : 'started',
		stopped : 'stopped',
		paused : 'paused',
		finished : 'finished',
		progress : 'progress'
	};

/**
 * Constructor de la clase Pomodoro
 * @param {Object} config Configuración de los parametros base del modulo de pomodoro
 */
function Pomodoro(config){
	PubSub.call(this);
	config = config || {};

	// parametrización de tiempos de duración de un pomodoro ( duración, descanso, receso )
	this.pomodoroTime = config.pomodoroTime || 25;
	this.shortBreakTime = config.shortBreakTime || 5;
	this.longBreakTime = config.longBreakTime || 15;

	// parametrización de tiempo de reporte del progreso en segundos
	this.progressReportTime = config.progressReportTime || 60;

	this.status = pomodoroStatus.stopped;
	this.startTime = null;
	this.endTime = null;
	this.timerId = null;
}

Pomodoro.prototype = new PubSub();

/**
 * Inicia el conteo para el pomodoro
 */
Pomodoro.prototype.start = function(){
	this.status = pomodoroStatus.started;
	this.startTime = new Date();

	this.publish(resolvePomodoroNamespace(pomodoroStatus.started));
	startReportingTimeElapsed.call(this);
};

Pomodoro.prototype.stop = function(){
	this.status = pomodoroStatus.stopped;
	this.stopTime = new Date();
	this.publish(resolvePomodoroNamespace(pomodoroStatus.stopped));

	stopReportingTimeElapsed.call(this);
};

Pomodoro.prototype.pauseOrResume = function(){	
	// pause pomodoro
	if(this.status === pomodoroStatus.started){
		this.status = pomdoroStatus.paused;
		this.publish(resolvePomodoroNamespace(pomodoroStatus.paused));

		stopReportingTimeElapsed.call(this);

	// resume pomodoro
	}else if(this.status === pomdoroStatus.paused){
		this.status = pomodoroStatus.started;
		this.publish(resolvePomodoroNamespace(pomodoroStatus.resumed));

		startReportingTimeElapsed.call(this);
	}
};


/**
 * Inicia o continua el proceso de reporte del tiempo transcurrido
 */
function startReportingTimeElapsed(){
	var elapsedTime = 0, currentDate, timeProgressFactor = this.progressReportTime * 1000;

	// se reporta el progreso de tiempo del pomodoro
	this.timerId = setInterval((function(){
		currentDate = new Date();
		elapsedTime = new Date(Math.abs(currentDate.getTime() - this.startTime.getTime()));

		if(elapsedTime.getMinutes() >= this.pomodoroTime){
			this.publish(resolvePomodoroNamespace(pomodoroStatus.finished));
			this.stop();
		}

		this.publish(resolvePomodoroNamespace(pomodoroStatus.progress), elapsedTime);
	}).bind(this),

	// la propiedad progressReportTime está configurada en minutos, 
	// por lo que se convierte siempre a milisegundos
	timeProgressFactor);
}

/**
 * Finaliza el proceso de reporte de tiempo transcurrido
 */
function stopReportingTimeElapsed(){
	clearInterval(this.timerId);
}

/**
 * resuleve el namespace para un evento especifico de pomodoro
 * @param  {String} eventName Nombre del evento a resolver
 * @return {String}           Nombre completo del evento junto a su namespace
 */
function resolvePomodoroNamespace(eventName){
	return pomodoroNS + ':' + eventName;
}

module.exports = Pomodoro;