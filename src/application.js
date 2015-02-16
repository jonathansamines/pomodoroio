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
		progressReportTime : 1
	});

	var pomodoroView = new PomodoroView({
		container : '#digital'
	});

	pomodoro.subscribe('pomodoro:progress', function(elapsedTime){
		pomodoroView.render({
			seconds : parseInt(elapsedTime.getSeconds(), 10),
			minutes : parseInt(elapsedTime.getMinutes(), 10),
			hours : parseInt(elapsedTime.getMinutes() / 60, 10)
		});
	});

	pomodoro.subscribe('pomodoro:finished', function(){
		console.info('Pomodoro finalizado completamente.');
	});

	pomodoro.start();
});