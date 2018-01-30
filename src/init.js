import Game from './game'

let canvas = document.getElementById('scene');
canvas.width  = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

let game = Game(canvas);