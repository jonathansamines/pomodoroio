/**
 * pomodoroview.js
 * Renderización de la vista para el reloj pomodoro
 * @author Jonathan Samines
 */

function formatTime(time){
	return time <= 9 ? '0' + time : time;
}

function PomodoroView(config){
	config = config || {};
	this.container = document.querySelector(config.container);
}

PomodoroView.prototype.render = function(data){
	this.container.getElementsByClassName('seconds')[0].textContent = formatTime(data.seconds);
	this.container.getElementsByClassName('minutes')[0].textContent = formatTime(data.minutes);
	this.container.getElementsByClassName('hours')[0].textContent = formatTime(data.hours);
};

module.exports = PomodoroView;