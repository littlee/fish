var Phaser = window.Phaser
var game = new Phaser.Game(640, 1029, Phaser.CANVAS, 'root')
game.state.add('boot', window.bootState)
game.state.add('load', window.loadState)
game.state.add('play', window.playState)

game.state.start('boot')