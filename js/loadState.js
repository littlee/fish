var game = window.game

var loadState = {
  preload: function() {
    game.load.image('bet_1000', 'images/bet_1000.png')
    game.load.image('bet_100_200_500', 'images/bet_100_200_500.png')
    game.load.image('bet_10_50', 'images/bet_10_50.png')
    game.load.image('bet_pop', 'images/bet_pop.png')
    game.load.image('bg', 'images/bg.jpg')
    game.load.image('current_coin', 'images/current_coin.png')
    game.load.image('fish_count', 'images/fish_count.png')
    game.load.image('fish_pole', 'images/fish_pole.png')
    game.load.image('jackpot', 'images/jackpot.png')
    game.load.image('lucky_value', 'images/lucky_value.png')
    game.load.image('lucky_value_p', 'images/lucky_value_p.png')
    game.load.image('notch_bet', 'images/notch_bet.png')
    game.load.image('notch_win', 'images/notch_win.png')
    game.load.image('user', 'images/user.png')
    game.load.image('wood_table', 'images/wood_table.png')
    game.load.spritesheet('f1', 'images/f1.png', 200, 111, 3);
    game.load.spritesheet('f2', 'images/f2.png', 200, 111, 3);
    game.load.spritesheet('f3', 'images/f3.png', 143, 90, 3);
    game.load.spritesheet('f4', 'images/f4.png', 143, 90, 3);
    game.load.spritesheet('f5', 'images/f5.png', 109, 50, 3);
    game.load.spritesheet('f6', 'images/f6.png', 109, 50, 3);
    game.load.spritesheet('f7', 'images/f7.png', 64, 49, 3);
    game.load.spritesheet('f8', 'images/f8.png', 64, 49, 3);
    game.load.spritesheet('f8', 'images/f8.png', 64, 49, 3);
    game.load.spritesheet('f9', 'images/f9.png', 47, 39, 3);
    game.load.spritesheet('f10', 'images/f10.png', 47, 39, 3);
    game.load.spritesheet('f11', 'images/f11.png', 55, 24, 3);
    game.load.spritesheet('f12', 'images/f12.png', 55, 24, 3);
    game.load.spritesheet('throw_btn', 'images/throw_btn.png', 180, 130, 2)
  },

  create: function() {
    game.state.start('play')
  }
}