/**
 * application.js
 * Aplicación de gestión de tiempo utilizando la técnica pomodoro
 * @author Jonathan Samines
 */
document.addEventListener('DOMContentLoaded', function(){
	var Pomodoro = require('./models/pomodoro.js'),
		PomodoroView = require('./views/pomodoroview.js');

	var pomodoro = new Pomodoro({
		pomodoroTime : 2,
		shortBreakTime : 5,
		longBreakTime : 10,
		progressReportTime : 5
	});

	var pomodoroView = new PomodoroView({
		container : 'main .container'
	});

	pomodoro.subscribe('pomodoro:progress', function(elapsedTime){
		var displayTime = parseInt(elapsedTime.getMinutes() / 60) + ':' +  elapsedTime.getMinutes() + ':' + elapsedTime.getSeconds();
		pomodoroView.render(displayTime);
	});

	pomodoro.subscribe('pomodoro:finished', function(){
		console.info('Pomodoro finalizado completamente.');
	});

	pomodoro.start();
});