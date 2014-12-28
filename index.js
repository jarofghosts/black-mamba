!function() {
  var input = document.querySelector('[name=input-msg]')
    , send = document.querySelector('.send-msg')

  var direction

  game.on('input', processBoard)

  respawn()

  function processBoard(data) {
    var newDirection
      , sections
      , target
      , pos

    if(playerDied(data.events)) {
      return respawn()
    }

    if(killedPlayer(data.events)) {
      tauntPlayer()
    }

    sections = data.snakes[0].sections
    pos = sections[sections.length - 1]
    direction = data.snakes[0].direction

    var directions = getPossibleMoves(data, pos, direction)

    target = findNearestFood(pos, data.grid)
    newDirection = navigate(pos, target, directions)

    if(!newDirection || newDirection === direction) {
      return false
    }

    game.emit('output', newDirection)
  }

  function getPossibleMoves(data, pos, direction) {
    var positions = ['LEFT', 'UP', 'RIGHT', 'DOWN']

    positions.splice(positions.indexOf(inverse(direction)), 1)

    for(var i = 0; i < 3; ++i) {
      if(collision(applyMove(pos, positions[i]))) {
        positions.splice(i, 1)
      }
    }

    return positions

    function collision(pos) {
      var section

      if(pos[0] < 0 || pos[1] < 0 || pos[0] > 29 || pos[1] > 29) {
        return true
      }

      for(var i = 0, l = data.snakes.length; i < l; ++i) {
        for(var j = 0, k = data.snakes[i].sections.length; j < k; ++j) {
          section = data.snakes[i].sections[j]

          if(posEqual(section, pos)) {
            return true
          }
        }
      }

      return false
    }
  }

  function inverse(direction) {
    return {
        LEFT: 'RIGHT'
      , RIGHT: 'LEFT'
      , UP: 'DOWN'
      , DOWN: 'UP'
    }[direction]
  }

  function applyMove(pos, direction) {
    var x = pos[0]
      , y = pos[1]

    x = x + (direction === 'LEFT' ? -1 : direction === 'RIGHT' ? 1 : 0)
    y = y + (direction === 'UP' ? -1 : direction === 'DOWN' ? 1 : 0)

    return [x, y]
  }

  function navigate(pos, target, positions) {
    if(!positions.length) return console.log('LOL!')

    if(pos[0] > target[0] && positions.indexOf('LEFT') > -1) return 'LEFT'
    if(pos[0] < target[0] && positions.indexOf('RIGHT') > -1) return 'RIGHT'
    if(pos[1] > target[1] && positions.indexOf('UP') > -1) return 'UP'
    if(pos[1] < target[1] && positions.indexOf('DOWN') > -1) return 'DOWN'

    return positions[0]
  }

  function findNearestFood(pos, grid) {
    var x = pos[0]
      , y = pos[1]

    var foods = []
      , diffs = []

    for(var i = 0; i < 30; ++i) {
      for(var j = 0; j < 30; ++j) {
        if(grid[i][j] === 1) {
          foods.push([i, j])
        }
      }
    }

    for(var k = 0, l = foods.length; k < l; ++k) {
      diffs.push(Math.abs(x - foods[k][0]) + Math.abs(y - foods[k][1]))
    }

    return foods[diffs.indexOf(Math.min.apply(Math, diffs))]
  }

  function respawn() {
    game.emit('spawn')
  }

  function killedPlayer(events) {
    return hasEvent(events, 'snake-kill')
  }

  function playerDied(events) {
    return hasEvent(events, 'snake-die')
  }

  function hasEvent(events, name) {
    return events.length && events.some(function(x) {
      return x.type === name
    })
  }

  function tauntPlayer() {
    input.value = 'DIE!'
    send.click()
  }

  function calculateDirection(a, b) {
    if(a[0] > b[0]) return 'LEFT'
    if(a[0] < b[0]) return 'RIGHT'
    if(a[1] > b[1]) return 'UP'
    if(a[1] < b[1]) return 'DOWN'
  }

  function posEqual(a, b) {
    return a[0] === b[0] && a[1] === b[1]
  }
}()
