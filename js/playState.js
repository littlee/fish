var Phaser = window.Phaser
var game = window.game

var textStyle = {
  font: '20px sans-serif',
  fill: '#fff'
}

var fishWidth = {
  f1: 200,
  f2: 200,
  f3: 143,
  f4: 143,
  f5: 109,
  f6: 109,
  f7: 64,
  f8: 64,
  f9: 47,
  f10: 47,
  f11: 55,
  f12: 55
}

var fishFactor = {
  f1: 15,
  f2: 15,
  f3: 3,
  f4: 3,
  f5: 2,
  f6: 2,
  f7: 1,
  f8: 1,
  f9: 0.6,
  f10: 0.6,
  f11: 0.3,
  f12: 0.3
}

function randomInt(a, b) {
  return game.rnd.integerInRange(a, b)
}

function isHeadOnLeft(key) {
  return parseInt(key.slice(1), 10) % 2 !== 0
}

function getInitFishX(headOnLeft, key) {
  return headOnLeft
    ? 640 + fishWidth[key] / 2 - 10
    : 0 - fishWidth[key] / 2 + 10
}

function getInitFishY() {
  return randomInt(500, 800)
}

function getInitFishVelocity(headOnLeft) {
  return headOnLeft ? -1 * randomInt(10, 100) : randomInt(10, 100)
}

function getInitFishGravity(headOnLeft) {
  return headOnLeft ? -10 : 10
}

var playState = {
  create: function() {
    this.bg = game.add.image(0, 0, 'bg')

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

    this.fishes = game.add.group()
    this.fishes.enableBody = true
    this.fishes.physicsBodyType = Phaser.Physics.ARCADE
    // for (var i = 0; i < 10; i++) {
    //   var r = randomInt(1, 12)
    //   var headOnLeft = r % 2 !== 0
    //   var key = 'f' + r
    //   var x = getInitFishX(headOnLeft, key)
    //   var y = getInitFishY()
    //   var fishItem = this.fishes.create(x, y, key)
    //   fishItem.body.velocity.x = getInitFishVelocity(headOnLeft)
    //   fishItem.body.gravity.x = getInitFishGravity(headOnLeft)
    // }
    // this.fishes.callAll('animations.add', 'animations', 'swim')
    // this.fishes.callAll('animations.play', 'animations', 'swim', 10, true)
    // this.fishes.setAll('checkWorldBounds', true)
    // this.fishes.setAll('outOfBoundsKill', true)
    // this.fishes.setAll('anchor.x', 0.5)
    // this.fishes.setAll('anchor.y', 0.5)

    // game.time.events.loop(1000, this._updateFishesMove, this)
    // game.time.events.loop(500, this._updateFishesAdd, this)
    // game.time.events.loop(500, this._updateFishesCatch, this)

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

    this.betPop1000Text.events.onInputDown.add(
      this._changeBet.bind(this, 1000),
      this
    )
    this.betPop500Text.events.onInputDown.add(
      this._changeBet.bind(this, 500),
      this
    )
    this.betPop200Text.events.onInputDown.add(
      this._changeBet.bind(this, 200),
      this
    )
    this.betPop100Text.events.onInputDown.add(
      this._changeBet.bind(this, 100),
      this
    )
    this.betPop50Text.events.onInputDown.add(
      this._changeBet.bind(this, 50),
      this
    )
    this.betPop10Text.events.onInputDown.add(
      this._changeBet.bind(this, 10),
      this
    )

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

    this.throwBtn = game.add.sprite(
      game.world.centerX,
      game.world.height - 15,
      'throw_btn'
    )
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
    this.notchWinText = game.add.text(
      483,
      959,
      '赢得: ' + this._currentWin,
      textStyle
    )

    this.luckyValue = game.add.image(30, 70, 'lucky_value')
    this.luckyValuePro = game.add.image(103, 100, 'lucky_value_p')
    this.luckyValuePro.scale.x = 0

    this.user = game.add.image(10, 10, 'user')
    this.userName = game.add.text(0, 0, '用户名', {
      fontSize: '12px',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.userName.setTextBounds(10, 70, 85, 24)

    this.currentCoin = game.add.image(110, 20, 'current_coin')
    this.currentCoinText = game.add.text(0, 0, this._currentCoin, {
      fontSize: '20px',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.currentCoinText.setTextBounds(172, 35, 110, 44)

    this.coins = game.add.group()
    this.coinsTween = []
    this.coinsTweenChain = []
    for (var j = 0; j < 10; j++) {
      var coinItem = this.coins.create(100, 100, 'coin')
      this.coinsTween[j] = game.add.tween(coinItem).to({
        x: 200,
        y: 50
      }, 500, Phaser.Easing.Cubic.Out, false, 100 + j * 150)
      this.coinsTweenChain[j] = game.add.tween(coinItem).to({
        alpha: 0
      }, 500, Phaser.Easing.Cubic.Out, false)
      this.coinsTween[j].chain(this.coinsTweenChain[j])
    }
    this.coins.setAll('alpha', 0)

    this.fishCountGroup = game.add.group()
    this.fishCount = game.add.sprite(0, 285, 'fish_count')
    this.fishCountText = game.add.text(95, 265, this._fishCount, {
      fill: '#fff',
      stroke: '#003248',
      strokeThickness: 4,
      fontSize: 64
    })
    this.fishCountText.setShadow(2, 2, 'rgba(6,68,142,0.7)', 1)
    this.fishCountGroup.add(this.fishCount)
    this.fishCountGroup.add(this.fishCountText)
    this.fishCountGroup.x = -187
    this.fishCountGroup.alpha = 0

    this.fishScoreText = game.add.text(15, 180, '+ ' + this._fishScore, {
      fill: '#fff',
      stroke: '#003248',
      strokeThickness: 4,
      fontSize: 50
    })
    this.fishScoreText.setShadow(2, 2, 'rgba(6,68,142,0.7)', 1)
    this.fishScoreText.x = -100
    this.fishScoreText.alpha = 0

    /* 宝箱界面 */
    this.overlay = game.add.image(0, 0, 'overlay')

    this.ddd = new Phaser.Rectangle(172, 35, 109, 44)
  },

  update: function() {
    var d = this.fishes.getFirstDead()
    if (d) {
      this.fishes.remove(d, true, true)
    }
  },

  render: function() {
    // game.debug.geom(this.ddd,'#0fffff');
  },

  _fishing: false,
  _fishScore: 0,
  _fishCount: 0,
  _currentCoin: 1000,
  _jackpot: 12345678,
  _currentBet: 100,
  _currentWin: 0,
  _currentLuckValue: 0,
  _t3: null,
  _t10: null,


  _updateFishCount: function() {
    this._fishCount++
    this.fishCountText.setText(this._fishCount)

    this.fishCountGroup.x = -187
    this.fishCountGroup.alpha = 0
    game.add.tween(this.fishCountGroup).to(
      {
        x: 0,
        alpha: 1
      },
      500,
      Phaser.Easing.Cubic.Out,
      true
    )
  },

  _updateFishScore: function(sprite, tween, score) {
    this._fishScore += score
    this.fishScoreText.setText('+ ' + this._fishScore)
    this.fishScoreText.x = -100
    this.fishScoreText.alpha = 0
    game.add.tween(this.fishScoreText).to({
      x: 15,
      alpha: 1
    }, 500, Phaser.Easing.Cubic.Out, true)
  },

  _changeBet: function(v) {
    this._currentBet = v
    this.notchBetText.setText(v)
    game.add.tween(this.betPop.position).to(
      {
        y: 270
      },
      500,
      Phaser.Easing.Back.Out,
      true
    )
  },

  _throwBtnDown: function() {
    if (this._fishing) {
      return
    }
    this.throwBtn.animations.frame = 1

    this._throwPole()
  },

  _throwPole: function() {
    this._fishing = true
    this.throwBtn.alpha = 0.5
    game.add.tween(this.fishPole).to(
      {
        angle: 0
      },
      500,
      Phaser.Easing.Back.Out,
      true
    )

    this._t3 = game.time.events.add(3000, this._after3, this)
    this._t10 = game.time.events.add(10000, this._after10, this)
  },

  _after3: function() {
    if (this._fishCount === 0) {
      this._withdrawPole()
      game.time.events.remove(this._t10)
      // 增加幸运值
      if (this._currentLuckValue === 10) {
        // 打开宝箱
      }
      else {
        this._currentLuckValue++
        this.luckyValuePro.scale.x = this._currentLuckValue / 10
      }
    }
  },

  _after10: function() {
    this._withdrawPole()

    // 增加金币
  },

  _slideCoins: function() {
    this.coins.setAll('alpha', 1)
    this.coins.setAll('x', 100)
    this.coins.setAll('y', 100)
    this.coinsTween.forEach(function(item) {
      item.start()
    })
  },

  _withdrawPole: function() {
    this._fishing = false
    this.throwBtn.alpha = 1

    this._fishScore = 0
    this._fishCount = 0

    this._slideCoins()

    game.add.tween(this.fishPole).to(
      {
        angle: 90
      },
      500,
      Phaser.Easing.Back.Out,
      true
    )

    game.add.tween(this.fishCountGroup).to(
      {
        x: -187,
        alpha: 0
      },
      500,
      Phaser.Easing.Cubic.Out,
      true
    )

    game.add.tween(this.fishScoreText).to(
      {
        x: -100,
        alpha: 0
      },
      500,
      Phaser.Easing.Cubic.Out,
      true
    )

    this.fishes.forEach(function(item) {
      if (item.catched) {
        item.kill()
      }
    })
  },

  _throwBtnUp: function() {
    this.throwBtn.animations.frame = 0
  },

  _notchBetDown: function() {
    if (this._fishing) {
      return
    }
    // toggle bet pop
    var y = this.betPop.y
    var nY = 0

    if (y === 0) {
      nY = 270
    }
    game.add.tween(this.betPop.position).to(
      {
        y: nY
      },
      500,
      Phaser.Easing.Back.Out,
      true
    )
  },

  _updateFishesMove: function() {
    this.fishes.forEach(function(item) {
      if (item.alive && game.rnd.sign() === 1 && !item.catched) {
        var headOnLeft = isHeadOnLeft(item.key)
        item.body.velocity.x = headOnLeft
          ? -1 * randomInt(10, 200)
          : randomInt(10, 200)
        item.body.gravity.x = headOnLeft
          ? -1 * randomInt(10, 100)
          : randomInt(10, 100)
      }
    })
  },

  _updateFishesAdd: function() {
    var r = randomInt(1, 12)
    var headOnLeft = r % 2 !== 0
    var key = 'f' + r
    var x = getInitFishX(headOnLeft, key)
    var y = getInitFishY()
    var fishItem = this.fishes.create(x, y, key)
    fishItem.body.velocity.x = getInitFishVelocity(headOnLeft)
    fishItem.body.gravity.x = getInitFishGravity(headOnLeft)
    fishItem.animations.add('swim')
    fishItem.animations.play('swim', 10, true)
    fishItem.checkWorldBounds = true
    fishItem.outOfBoundsKill = true
    fishItem.anchor.setTo(0.5, 0.5)
  },

  _updateFishesCatch: function() {
    if (!this._fishing) {
      return
    }

    var len = this.fishes.children.length
    var index = randomInt(0, len - 1)

    var fish = this.fishes.children[index]
    var headOnLeft = isHeadOnLeft(fish.key)
    var get = false

    // console.log(fish.x)

    if (headOnLeft) {
      if (
        fish.x > game.world.centerX + fish.width / 2 &&
        fish.x < game.world.centerX + fish.width + 50
      ) {
        get = true
      }
    } else {
      if (
        fish.x > game.world.centerX - fish.width - 50 &&
        fish.x < game.world.centerX - fish.width / 2
      ) {
        get = true
      }
    }

    if (get) {
      fish.catched = true
      fish.body.velocity.x = 0
      fish.body.gravity.x = 0
      var tw = game.add.tween(fish).to(
        {
          angle: headOnLeft ? 90 : -90,
          x: game.world.centerX + 10,
          y: 480
        },
        500,
        Phaser.Easing.Linear.None,
        true
      )
      tw.onComplete.addOnce(this._updateFishCount, this)
      // 计算金币
      tw.onComplete.addOnce(this._updateFishScore, this, 1, 10)
    }
  }
}
