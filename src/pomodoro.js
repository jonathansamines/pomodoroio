/**
 * pomodoro.io
 * Representación básica de una aplicación de pomodoro
 * @author Jonathan Samines
 */
var PubSub = require('./pubsub.js'),
	pomodoroStatus = {
		started : 'started',
		stopped : 'stopped',
		paused : 'paused'
	};

/**
 * Constructor de la clase Pomodoro
 * @param {Object} config Configuración de los parametros base de la aplicación
 */
function Pomodoro(config){
	PubSub.apply(this);
	config = config || {};

	// parametrización de tiempos en minutos
	this.pomodoroTime = config.pomodoroTime || 25;
	this.shortBreakTime = config.shortBreakTime || 5;
	this.longBreakTime = config.longBreakTime || 15;

	// parametrización de tiempo de reporte del progreso ( segundos )
	this.progressReportTime = config.progressReportTime || 60;

	this.status = pomodoroStatus.stopped;
	this.startTime = null;
	this.endTime = null;
	this.timerId = null;
}

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
			this.stop();
		}

		this.publish('pomodoro:progress', elapsedTime);
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


Pomodoro.prototype = new PubSub();

/**
 * Inicia el conteo para el pomodoro
 */
Pomodoro.prototype.start = function(){
	this.status = 'started';
	this.startTime = new Date();

	this.publish('pomodoro:start');
	startReportingTimeElapsed.call(this);
};

Pomodoro.prototype.stop = function(){
	this.status = 'stopped';
	this.stopTime = new Date();
	this.publish('pomodoro:stop');

	stopReportingTimeElapsed.call(this);
};

Pomodoro.prototype.pauseOrResume = function(){	
	// pause pomodoro
	if(this.status === 'started'){
		this.status = 'paused';
		this.publish('pomodoro:pause');

		stopReportingTimeElapsed.call(this);

	// resume pomodoro
	}else if(this.status === 'paused'){
		this.status = 'started';
		this.publish('pomodoro:resume');

		startReportingTimeElapsed.call(this);
	}
};

module.exports = Pomodoro;