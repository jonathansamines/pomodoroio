/**
 * pomodoroview.js
 * Renderización de la vista para el reloj pomodoro
 * @author Jonathan Samines
 */
function PomodoroView(config){
	config = config || {};
	this.el = document.querySelector(config.container);
}

PomodoroView.prototype.render = function(data){
	console.dir(this);
	this.el.innerHTML = data;
};

module.exports = PomodoroView;