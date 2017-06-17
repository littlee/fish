var Phaser = window.Phaser
var game = window.game
var req = window.superagent

function getFishCoin(data, cb) {
  /*req
    .get('/get/fish/coin')
    .query(data)
    .end(function(err, res) {
      if (err) {
        return err
      }
      cb && cb(res.text)
    })*/

  // 模拟随机返回 100 - 500 金币
  setTimeout(function() {
    cb(game.rnd.between(100, 500))
  }, 100)
}

function getLeftBoxNum(data, cb) {
  /*req
    .get('/get/left/num')
    .query(data)
    .end(function(err, res) {
      if (err) {
        return err
      }
      cb && cb(res.text)
    })*/

  // 模拟随机返回 0 - 9
  setTimeout(function() {
    cb(game.rnd.between(0, 9))
  }, 100)
}

function getRightBoxNum(data, cb) {
  /*req
    .get('/get/right/num')
    .query(data)
    .end(function(err, res) {
      if (err) {
        return err
      }
      cb && cb(res.text)
    })*/

  // 模拟随机返回 0 - 9
  setTimeout(function() {
    cb(game.rnd.between(0, 9))
  }, 100)
}

function compareNum(left, right) {
  // 没有相等的情况
  if (left - right > 0) {
    return 'lt'
  }
  return 'gt'
}


var WITHDRAW_TIME = 10000

var textStyle = {
  font: '20px sans-serif',
  fill: '#fff'
}

var pearlNumStyle = {
  fill: '#fff',
  stroke: '#181D3B',
  strokeThickness: 5,
  fontSize: 72,
  boundsAlignH: 'center',
  boundsAlignV: 'middle'
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
    for (var i = 0; i < 10; i++) {
      var r = randomInt(1, 12)
      var headOnLeft = r % 2 !== 0
      var key = 'f' + r
      var x = getInitFishX(headOnLeft, key)
      var y = getInitFishY()
      var fishItem = this.fishes.create(x, y, key)
      fishItem.body.velocity.x = getInitFishVelocity(headOnLeft)
      fishItem.body.gravity.x = getInitFishGravity(headOnLeft)
    }
    this.fishes.callAll('animations.add', 'animations', 'swim')
    this.fishes.callAll('animations.play', 'animations', 'swim', 10, true)
    this.fishes.setAll('checkWorldBounds', true)
    this.fishes.setAll('outOfBoundsKill', true)
    this.fishes.setAll('anchor.x', 0.5)
    this.fishes.setAll('anchor.y', 0.5)

    this._tMove = game.time.events.loop(1000, this._updateFishesMove, this)
    this._tAdd = game.time.events.loop(500, this._updateFishesAdd, this)

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

    this.throwBtn = game.add.button(
      game.world.centerX,
      game.world.height - 15,
      'throw_btn',
      this._throwBtnDown,
      this,
      0,
      0,
      1,
      0
    )
    this.throwBtn.anchor.set(0.5, 1)

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
    this.currentCoinText.setTextBounds(172, 40, 110, 44)

    this.coins = game.add.group()
    this.coinsTween = []
    this.coinsTweenChain = []
    for (var j = 0; j < 10; j++) {
      var coinItem = this.coins.create(100, 100, 'coin')
      this.coinsTween[j] = game.add.tween(coinItem).to(
        {
          x: 200,
          y: 50
        },
        500,
        Phaser.Easing.Cubic.Out,
        false,
        100 + j * 150
      )
      this.coinsTweenChain[j] = game.add.tween(coinItem).to(
        {
          alpha: 0
        },
        500,
        Phaser.Easing.Cubic.Out,
        false
      )
      this.coinsTween[j].chain(this.coinsTweenChain[j])
    }
    this.coins.setAll('alpha', 0)

    this.fishCountGroup = game.add.group()
    this.fishCount = game.add.sprite(0, 285, 'fish_count')
    this.fishCountText = game.add.text(0, 0, '22', {
      fill: '#fff',
      stroke: '#003248',
      strokeThickness: 4,
      fontSize: 50,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.fishCountText.setTextBounds(85, 280, 70, 55)
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
    this.boxMainGroup = game.add.group()
    this.overlay = game.add.image(0, 0, 'overlay')
    this.boxFrame = game.add.image(21, 25, 'box_frame')
    this.boxQuitBtn = game.add.button(
      25,
      60,
      'box_quit_btn',
      this._quitBox,
      this
    )
    this.boxAddCoinBtn = game.add.button(
      417,
      350,
      'box_add_coin',
      this._boxAddCoin,
      this
    )
    this.boxCoinText = game.add.text(0, 0, this._boxCoin, {
      fontSize: 30,
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.boxCoinText.setTextBounds(270, 350, 120, 50)
    this.boxMainGroup.add(this.overlay)
    this.boxMainGroup.add(this.boxFrame)
    this.boxMainGroup.add(this.boxQuitBtn)
    this.boxMainGroup.add(this.boxAddCoinBtn)
    this.boxMainGroup.add(this.boxCoinText)
    this.boxMainGroup.visible = false

    // 步骤文字
    this.boxStepText = game.add.text(0, 0, '', {
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 4,
      fontSize: 24,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.boxStepText.setTextBounds(100, 500, 450, 55)
    this.boxMainGroup.add(this.boxStepText)

    // 盒子左
    this.boxLeft = game.add.sprite(75, 640, 'box')
    this.boxMainGroup.add(this.boxLeft)

    // 珍珠左
    this.pearlLeftGroup = game.add.group()
    this.pearlLeft = game.add.image(104, 600, 'pearl')
    this.pearlLeftNum = game.add.text(0, 0, this._pearlLeftNum, pearlNumStyle)
    this.pearlLeftNum.setShadow(0, 0, 'rgba(255,255,74,0.5)', 10)
    this.pearlLeftNum.setTextBounds(104, 600, 119, 119)
    this.pearlLeftGroup.add(this.pearlLeft)
    this.pearlLeftGroup.add(this.pearlLeftNum)
    this.pearlLeftGroup.visible = false
    this.boxMainGroup.add(this.pearlLeftGroup)

    // 盒子右
    this.boxRight = game.add.sprite(375, 640, 'box')
    this.boxMainGroup.add(this.boxRight)

    // 珍珠右
    this.pearlRightGroup = game.add.group()
    this.pearlRight = game.add.image(412, 600, 'pearl')
    this.pearlRightNum = game.add.text(0, 0, this._pearlRightNum, pearlNumStyle)
    this.pearlRightNum.setShadow(0, 0, 'rgba(255,255,74,0.5)', 10)
    this.pearlRightNum.setTextBounds(412, 600, 119, 119)
    this.pearlRightGroup.add(this.pearlRight)
    this.pearlRightGroup.add(this.pearlRightNum)
    this.pearlRightGroup.visible = false
    this.boxMainGroup.add(this.pearlRightGroup)

    // 猜大小
    this.boxGuessGroup = game.add.group()
    this.boxGuessPanel = game.add.image(
      game.world.centerX,
      580,
      'box_guess_panel'
    )
    this.boxGuessPanel.anchor.setTo(0.5, 0)
    this.boxGreatBtn = game.add.button(
      game.world.centerX,
      597,
      'box_great_btn',
      this._guessGreat,
      this
    )
    this.boxGreatBtn.anchor.setTo(0.5, 0)
    this.boxLessBtn = game.add.button(
      game.world.centerX,
      712,
      'box_less_btn',
      this._guessLess,
      this
    )
    this.boxLessBtn.anchor.setTo(0.5, 0)
    this.boxGuessGroup.add(this.boxGuessPanel)
    this.boxGuessGroup.add(this.boxGreatBtn)
    this.boxGuessGroup.add(this.boxLessBtn)
    this.boxGuessGroup.visible = false
    this.boxMainGroup.add(this.boxGuessGroup)

    // 星星
    this.starGroup = game.add.group()
    for (var k = 0; k < 10; k++) {
      this.starGroup.create(54 + k * 54, 900, 'star')
    }
    this.boxMainGroup.add(this.starGroup)

    // 退出确认
    this.boxQuitGroup = game.add.group()
    this.boxQuitOverlay = game.add.image(0, 0, 'overlay')
    this.boxQuitFrame = game.add.image(
      game.world.centerX,
      game.world.centerY,
      'box_quit_frame'
    )
    this.boxQuitFrame.anchor.setTo(0.5, 0.5)
    this.boxConfirmBtn = game.add.button(
      112,
      560,
      'confirm_btn',
      this._confirmQuit,
      this
    )
    this.boxContinueBtn = game.add.button(
      339,
      560,
      'continue_btn',
      this._continueBox,
      this
    )
    this.boxQuitGroup.add(this.boxQuitOverlay)
    this.boxQuitGroup.add(this.boxQuitFrame)
    this.boxQuitGroup.add(this.boxConfirmBtn)
    this.boxQuitGroup.add(this.boxContinueBtn)
    this.boxQuitGroup.visible = false
    this.boxMainGroup.add(this.boxQuitGroup)

    // 消息
    this.messageGroup = game.add.group()
    this.messageOverlay = game.add.image(0, 0, 'overlay')
    this.message = game.add.image(0, game.world.centerY, 'message')
    this.message.anchor.setTo(0, 0.5)
    this.messageText = game.add.text(0, 0, '消息文字', {
      fill: '#fff',
      fontSize: 28,
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    })
    this.messageText.setTextBounds(0, 450, 640, 132)
    this.messageGroup.add(this.messageOverlay)
    this.messageGroup.add(this.message)
    this.messageGroup.add(this.messageText)
    this.messageGroup.visible = false
    this.boxMainGroup.add(this.messageGroup)

    this.ddd = new Phaser.Rectangle(90, 280, 70, 55)
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
  _tMove: null,
  _tAdd: null,
  _tCatch: null,

  // 宝箱
  _boxCoin: 100,
  _pearlLeftNum: 0,
  _pearlRightNum: 0,
  _boxStar: 0,

  // 一竿多少鱼
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

  // 钓鱼投注
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

  // 点击钓鱼按钮
  _throwBtnDown: function() {
    if (this._fishing) {
      return
    }
    this._throwPole()
  },

  // 抛下鱼竿
  _throwPole: function() {
    this._fishing = true
    this.throwBtn.inputEnabled = false
    this.throwBtn.alpha = 0.5
    game.add.tween(this.fishPole).to(
      {
        angle: 0
      },
      500,
      Phaser.Easing.Back.Out,
      true
    )

    // 减去投注金币
    this._currentCoin -= this._currentBet
    this.currentCoinText.setText(this._currentCoin)

    // 重置分数
    this._fishScore = 0
    this._fishCount = 0

    // this._t3 = game.time.events.add(3000, this._after3, this)
    this._t10 = game.time.events.add(WITHDRAW_TIME, this._after10, this)

    this._tCatch = game.time.events.loop(200, this._updateFishesCatch, this)
  },

  _updateLuckyValue: function() {
    if (this._currentLuckValue < 10) {
      this._currentLuckValue++
    }
    else {
      this._currentLuckValue = 0
    }
    this.luckyValuePro.scale.x = this._currentLuckValue / 10
  },

  // 3 秒钟后
  _after3: function() {
    if (this._fishCount === 0) {
      game.time.events.remove(this._t10)
      this._withdrawPole()
    }
  },

  // 10 秒钟后
  _after10: function() {
    this._withdrawPole()
  },

  // 金币注入
  _slideCoins: function(score) {
    // 弹出分数
    this._fishScore = score
    this.fishScoreText.setText('+ ' + this._fishScore)
    this.fishScoreText.x = -100
    this.fishScoreText.alpha = 0
    var tw = game.add.tween(this.fishScoreText).to(
      {
        x: 15,
        alpha: 1
      },
      500,
      Phaser.Easing.Cubic.Out,
      true
    )
    tw.onComplete.addOnce(function() {
      game.time.events.add(
        1000,
        function() {
          this.fishScoreText.x = -100
          this.fishScoreText.alpha = 0
          this.fishCountGroup.x = -187
          this.fishCountGroup.alpha = 0
        },
        this
      )
    }, this)

    this.coins.setAll('alpha', 1)
    this.coins.setAll('x', 100)
    this.coins.setAll('y', 100)
    this.coinsTween.forEach(function(item) {
      item.start()
    })

    this.coinsTween[this.coinsTween.length - 1].onComplete.addOnce(function() {
      this._currentCoin += score
      this.currentCoinText.setText(this._currentCoin)

      this._currentWin += score
      this.notchWinText.setText('赢得：' + this._currentWin)

      if (this._fishCount >= 3) {
        //==== 进入宝箱 =====
        this._entetBox()
      }
    }, this)
  },

  // 收回鱼竿
  _withdrawPole: function() {
    this._fishing = false
    this.throwBtn.inputEnabled = true
    this.throwBtn.alpha = 1

    game.time.events.remove(this._tCatch)

    if (this._fishCount === 0) {
      this._updateLuckyValue()
    }
    else {
      // 在这里发请求获取获得金币
      getFishCoin(
        {},
        function(score) {
          this._slideCoins(score)
        }.bind(this)
      )
    }

    game.add.tween(this.fishPole).to(
      {
        angle: 90
      },
      500,
      Phaser.Easing.Back.Out,
      true
    )

    this.fishes.forEach(function(item) {
      if (item.catched) {
        item.kill()
      }
    })
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

    // if (game.rnd.sign() === 1) {
    //   get = true
    // }

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
    }
  },

  // =========
  // 宝箱函数
  _entetBox: function() {
    this.boxMainGroup.visible = true
    this.notchBet.inputEnabled = false
    game.time.events.remove(this._tMove)
    game.time.events.remove(this._tAdd)

    this._boxCoin = this._fishScore
    this.boxCoinText.setText(this._boxCoin)

    this._startBox()
  },

  _startBox: function() {
    // 重置界面
    this.pearlRightGroup.visible = false
    this.boxGuessGroup.visible = false
    this.boxRight.frame = 0

    if (this._boxStar >= 10) {
      this._showMessage('宝箱游戏结束', function() {
        this._confirmQuit()
      }.bind(this))
      return
    }

    //发请求获取左边数字
    getLeftBoxNum({}, function(num) {
      this._incStar()
      this._pearlLeftNum = num
      this.pearlLeftNum.setText(this._pearlLeftNum)
      this.pearlLeftGroup.visible = true
      this.boxLeft.frame = 1
      this.boxGuessGroup.visible = true
      this.boxStepText.setText('猜猜另一个箱子比' + num + '大还是小（范围0-9）')

    }.bind(this))
  },

  _quitBox: function() {
    console.log('quit')
    this.boxQuitGroup.visible = true
  },

  _incStar: function() {
    this._boxStar++
    this.starGroup.children[this._boxStar - 1].frame = 1
  },

  _boxAddCoin: function() {
    this._boxCoin *= 2
    this.boxCoinText.setText(this._boxCoin)
  },
  
  _openBoxRight: function(guess) {

    // 获取右边数字
    getRightBoxNum({}, function(num) {
      this._pearlRightNum = num
      this.pearlRightNum.setText(this._pearlRightNum)
      this.pearlRightGroup.visible = true
      this.boxRight.frame = 1
      
      if (compareNum(this._pearlLeftNum, this._pearlRightNum) === guess) {
        // 猜对了
        this.boxStepText.setText('恭喜您猜对了，获得' + this._boxCoin + '金币')
        this._boxAddCoin()
        game.time.events.add(2000, function() {
          this._startBox()
        }, this)
      }
      else {
        // 猜错了
        this.boxStepText.setText('很抱歉您猜错了，3秒后自动退出')
        game.time.events.add(3000, function() {
          this._confirmQuit()
        }, this)
      }

    }.bind(this))

  },

  _guessGreat: function() {
    console.log('great')
    this._openBoxRight('gt')
  },

  _guessLess: function() {
    console.log('less')
    this._openBoxRight('lt')
  },

  _confirmQuit: function() {
    console.log('confirm')
    this.boxMainGroup.visible = false
    this.notchBet.inputEnabled = true
    this._tMove = game.time.events.loop(1000, this._updateFishesMove, this)
    this._tAdd = game.time.events.loop(500, this._updateFishesAdd, this)
  },

  _continueBox: function() {
    console.log('continue')
    this.boxQuitGroup.visible = false
  },

  _showMessage: function(text, cb) {
    this.messageText.setText(text)
    this.messageGroup.visible = true
    game.time.events.add(3000, function() {
      this.messageGroup.visible = false
      cb && cb()
    }, this)
  }
}
