var Phaser = window.Phaser
var game = window.game

var textStyle = {
  font: '20px sans-serif',
  fill: '#fff'
}

function randomInt(a, b) {
  return game.rnd.integerInRange(a, b)
}

function isHeadOnLeft(key) {
  return parseInt(key.slice(1), 10) % 2 !== 0
}

var playState = {
  create: function() {
    this.bg = game.add.image(0, 0, 'bg')

    this.fishes = game.add.group()
    this.fishes.enableBody = true
    this.fishes.physicsBodyType = Phaser.Physics.ARCADE
    for (var i = 0; i < 10; i++) {
      var r = randomInt(1, 12)
      var headOnLeft = r % 2 !== 0 // 单数
      var x = headOnLeft ? randomInt(580, 620) : randomInt(-20, 20)
      var y = randomInt(500, 800)
      var fishItem = this.fishes.create(x, y, 'f' + r)
      fishItem.body.velocity.x = headOnLeft ? -1 * randomInt(0, 100) : randomInt(0, 100)
      fishItem.body.gravity.x = 0
      fishItem.checkWorldBounds = true
    }
    this.fishes.callAll('animations.add', 'animations', 'swim')
    this.fishes.callAll('animations.play', 'animations', 'swim', 10, true)
    this.fishes.setAll('checkWorldBounds', true)
    this.fishes.setAll('outOfBoundsKill', true)

    game.time.events.loop(500, this._updateFishes, this)


    this.betPop = game.add.group()
    this.betPopBg = game.add.sprite(53, 650, 'bet_pop')
    this.betPop1000Coin = game.add.sprite(77, 670, 'bet_1000')
    this.betPop500Coin = game.add.sprite(77, 715, 'bet_100_200_500')
    this.betPop200Coin = game.add.sprite(77, 760, 'bet_100_200_500')
    this.betPop100Coin = game.add.sprite(77, 805, 'bet_100_200_500')
    this.betPop50Coin = game.add.sprite(77, 845, 'bet_10_50')
    this.betPop10Coin = game.add.sprite(77, 885, 'bet_10_50')

    this.betPop1000Text = game.add.text(0, 0, '1000', textStyle)
    this.betPop500Text = game.add.text(0, 0, '500', textStyle)
    this.betPop200Text = game.add.text(0, 0, '200', textStyle)
    this.betPop100Text = game.add.text(0, 0, '100', textStyle)
    this.betPop50Text = game.add.text(0, 0, '50', textStyle)
    this.betPop10Text = game.add.text(0, 0, '10', textStyle)

    this.betPop1000Text.setTextBounds(115, 670, 70, 20)
    this.betPop500Text.setTextBounds(115, 715, 70, 20)
    this.betPop200Text.setTextBounds(115, 760, 70, 20)
    this.betPop100Text.setTextBounds(115, 805, 70, 20)
    this.betPop50Text.setTextBounds(115, 845, 70, 20)
    this.betPop10Text.setTextBounds(115, 885, 70, 20)

    this.betPop1000Text.inputEnabled = true
    this.betPop500Text.inputEnabled = true
    this.betPop200Text.inputEnabled = true
    this.betPop100Text.inputEnabled = true
    this.betPop50Text.inputEnabled = true
    this.betPop10Text.inputEnabled = true

    this.betPop1000Text.events.onInputDown.add(this._changeBet.bind(this, 1000), this)
    this.betPop500Text.events.onInputDown.add(this._changeBet.bind(this, 500), this)
    this.betPop200Text.events.onInputDown.add(this._changeBet.bind(this, 200), this)
    this.betPop100Text.events.onInputDown.add(this._changeBet.bind(this, 100), this)
    this.betPop50Text.events.onInputDown.add(this._changeBet.bind(this, 50), this)
    this.betPop10Text.events.onInputDown.add(this._changeBet.bind(this, 10), this)

    this.betPop.add(this.betPopBg)
    this.betPop.add(this.betPop1000Coin)
    this.betPop.add(this.betPop500Coin)
    this.betPop.add(this.betPop200Coin)
    this.betPop.add(this.betPop100Coin)
    this.betPop.add(this.betPop50Coin)
    this.betPop.add(this.betPop10Coin)
    this.betPop.add(this.betPop1000Text)
    this.betPop.add(this.betPop500Text)
    this.betPop.add(this.betPop200Text)
    this.betPop.add(this.betPop100Text)
    this.betPop.add(this.betPop50Text)
    this.betPop.add(this.betPop10Text)
    this.betPop.y = 270

    this.woodTable = game.add.image(0, game.world.height, 'wood_table')
    this.woodTable.anchor.set(0, 1)

    this.throwBtn = game.add.sprite(game.world.centerX, game.world.height - 15, 'throw_btn')
    this.throwBtn.anchor.set(0.5, 1)
    this.throwBtn.animations.add('push')
    this.throwBtn.inputEnabled = true
    this.throwBtn.events.onInputDown.add(this._throwBtnDown, this)
    this.throwBtn.events.onInputUp.add(this._throwBtnUp, this)

    this.notchBet = game.add.image(35, 942, 'notch_bet')
    this.notchBet.inputEnabled = true
    this.notchBet.events.onInputDown.add(this._notchBetDown, this)
    this.notchBetText = game.add.text(92, 959, this._currentBet, textStyle)

    this.notchWin = game.add.image(430, 942, 'notch_win')
    this.notchWinText = game.add.text(483, 959, '赢得: ' + this._currentWin, textStyle)

    this.fishPole = game.add.sprite(game.world.width, 300, 'fish_pole')
    this.fishPole.anchor.set(1, 0.5)
    this.fishPole.angle = 90

    this.jackpot = game.add.image(420, 100, 'jackpot')

    this.jackpotText = game.add.text(0, 0, this._jackpot, {
      fontSize: '32px',
      fill: '#F8F042',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.jackpotText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5)
    this.jackpotText.setTextBounds(440, 168, 170, 32)


    this.currentCoin = game.add.image(110, 20, 'current_coin')
    this.currentCoinText = game.add.text(0, 0, this._currentCoin, {
      fontSize: '20px',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.currentCoinText.setTextBounds(172, 35 ,110, 44)

    this.luckyValue = game.add.image(30, 70, 'lucky_value')
    this.luckyValuePro = game.add.image(103, 100, 'lucky_value_p')

    this.user = game.add.image(10, 10, 'user')
    this.userName = game.add.text(0, 0, '用户名', {
      fontSize: '12px',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.userName.setTextBounds(10, 70, 85, 24)

    this.fishCount = game.add.sprite(0, 285, 'fish_count')
    this.fishCountText = game.add.text(95, 265, this._fishCount, {
      fill: '#fff',
      stroke: '#003248',
      strokeThickness: 4,
      fontSize: 64
    })
    this.fishCountText.setShadow(2, 2, 'rgba(6,68,142,0.7)', 1)

    this.fishScoreText = game.add.text(15, 180, '+ ' + this._fishScore, {
      fill: '#fff',
      stroke: '#003248',
      strokeThickness: 4,
      fontSize: 50
    })
    this.fishScoreText.setShadow(2, 2, 'rgba(6,68,142,0.7)', 1)

    this.ddd = new Phaser.Rectangle(172, 35 ,109, 44)
  },

  update: function() {
    // var d = this.fishes.getFirstDead()
    // if (d) {
    //   console.log(d)
    // }
  },

  render: function() {
    // game.debug.geom(this.ddd,'#0fffff');
  },

  _fishing: false,
  _fishScore: 20,
  _fishCount: 2,
  _currentCoin: 88888888,
  _jackpot: 12345678,
  _currentBet: 100,
  _currentWin: 0,
  _changeBet: function(v) {
    this._currentBet = v
    this.notchBetText.setText(v)
    game.add.tween(this.betPop.position).to({
      y: 270
    }, 500, Phaser.Easing.Back.Out, true)
  },

  _throwBtnDown: function() {
    if (this._fishing) {
      this._withdrawPole()
      return
    }
    this.throwBtn.animations.frame = 1
    
    this._throwPole()
  },

  _throwPole: function() {
    this._fishing = true
    this.throwBtn.alpha = 0.5
    game.add.tween(this.fishPole).to({
      angle: 0
    }, 500, Phaser.Easing.Back.Out, true)
  },

  _withdrawPole: function() {
    this._fishing = false
    this.throwBtn.alpha = 1
    game.add.tween(this.fishPole).to({
      angle: 90
    }, 500, Phaser.Easing.Back.Out, true)
  },

  _throwBtnUp: function() {
    this.throwBtn.animations.frame = 0
  },

  _notchBetDown: function() {
    // toggle bet pop
    var y = this.betPop.y
    var nY = 0

    if (y === 0) {
      nY = 270
    }
    game.add.tween(this.betPop.position).to({
      y: nY
    }, 500, Phaser.Easing.Back.Out, true)
  },

  _updateFishes: function() {
    this.fishes.forEach(function(item) {
      if (item.alive && game.rnd.sign() === 1) {
        var headOnLeft = isHeadOnLeft(item.key)
        item.body.velocity.x = headOnLeft ? -1 * randomInt(0, 200) : randomInt(0, 200)
        item.body.gravity.x = headOnLeft ? -1 * randomInt(0, 100) : randomInt(0, 100)
      }
    })
  }
}