!function() {
  var previousPosition
    , direction

  game.on('input', processBoard)

  spawn()

  function processBoard(data) {
    if(playerDied(data.events)) return spawn()

    var pos = data.snakes[0].sections[0].slice()
      , newDirection

    direction = trackMovement(pos)

    newDirection = avoidWall(pos, data.grid)

    if(direction !== newDirection) game.emit('output', newDirection)
  }

  function spawn() {
    previousPosition = null
    direction = null

    game.emit('spawn')
  }

  function playerDied(events) {
    return events.length && events.some(died)

    function died(x) {
      return x.type === 'snake-die'
    }
  }

  function avoidWall(pos, grid) {
    var x = pos[0]
      , y = pos[1]

    var maxX = grid[0].length - 1
      , maxY = grid.length - 1

    if(direction === 'UP' && y === 0) return 'RIGHT'
    if(direction === 'DOWN' && y === maxY) return 'LEFT'
    if(direction === 'RIGHT' && x === maxX) return 'DOWN'
    if(direction === 'LEFT' && x === 0) return 'UP'

    return direction
  }

  function trackMovement(pos) {
    if(!previousPosition) return previousPosition = pos.slice()

    var direction = calculateDirection(previousPosition, pos)

    previousPosition = pos.slice()

    return direction
  }

  function calculateDirection(a, b) {
    if(a[0] > b[0]) return 'LEFT'
    if(a[0] < b[0]) return 'RIGHT'
    if(a[1] > b[1]) return 'UP'
    if(a[1] < b[1]) return 'DOWN'
  }
}()
