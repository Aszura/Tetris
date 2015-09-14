//Global values
var globals = {
    intervalTime: 1,
    fieldSize: 20
};

//Vector 2D helper
function Vector2() {
    this.x = 0;
    this.y = 0;    
}

Vector2.prototype.init = function (x, y) {
	this.x = x;
	this.y = y;
	return this;
};

function Block() {
    this.lastPosition = new Vector2();
    this.position = new Vector2();
    this.color;
    this.alpha = 1;
    var _size = new Vector2();
}

//Init vars
Block.prototype.init = function (x, y, color, context) {
	this.position.x = x;
	this.position.y = y;
	this.lastPosition.x = this.position.x;
	this.lastPosition.y = this.position.y;
	this.color = color;
	context.beginPath();
	this.draw(context);
	return this;
};

//Drop block for field size
Block.prototype.drop = function (context) {
	this.position.y += globals.fieldSize;
};

//Clear rect of block
Block.prototype.clear = function (context) {
	context.clearRect(this.lastPosition.x+1, this.lastPosition.y+1, globals.fieldSize, globals.fieldSize);
};

//Draw block
Block.prototype.draw = function (context) {
	context.globalAlpha = this.alpha;
	context.fillStyle = 'black';
	context.fillRect(this.position.x+1, this.position.y+1, globals.fieldSize, globals.fieldSize);
	context.fillStyle = this.color;
	context.fillRect(this.position.x+2, this.position.y+2, globals.fieldSize - 2, globals.fieldSize - 2);
	this.lastPosition.x = this.position.x;
	this.lastPosition.y = this.position.y;
	context.globalAlpha = 1;
};

function Stone(){
    this.blocks = new Array();
    this.dropMultiplicator = 1;
    var _counter = 0;

    //Drop stone
    this.update = function (deltaTime, context) {
        _counter += deltaTime * this.dropMultiplicator;

        if (_counter >= globals.intervalTime) {
            _counter = 0;

            for (var i = 0; i < this.blocks.length; ++i) {
                this.blocks[i].drop(context);
            }
        }
    };
}

//Generate random stone
Stone.prototype.init = function (context) {
	var stoneType = Math.floor((Math.random() * 7));;
	switch (stoneType) {
		case 0:
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "red", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "red", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize * 2, "red", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize * 3, "red", context));
			break;
		case 1:
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "yellow", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "yellow", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize * 2, "yellow", context));
			this.blocks.push(new Block().init(globals.fieldSize * 5, globals.fieldSize * 2, "yellow", context));
			break;
		case 2:
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "green", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "green", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize * 2, "green", context));
			this.blocks.push(new Block().init(globals.fieldSize * 3, globals.fieldSize * 2, "green", context));
			break;
		case 3:
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "blue", context));
			this.blocks.push(new Block().init(globals.fieldSize * 3, 0, "blue", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "blue", context));
			this.blocks.push(new Block().init(globals.fieldSize * 5, globals.fieldSize, "blue", context));
			break;
		case 4:
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "pink", context));
			this.blocks.push(new Block().init(globals.fieldSize * 5, 0, "pink", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "pink", context));
			this.blocks.push(new Block().init(globals.fieldSize * 3, globals.fieldSize, "pink", context));
			break;
		case 5:
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "brown", context));
			this.blocks.push(new Block().init(globals.fieldSize * 5, 0, "brown", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "brown", context));
			this.blocks.push(new Block().init(globals.fieldSize * 5, globals.fieldSize, "brown", context));
			break;
		case 6:
			this.blocks.push(new Block().init(globals.fieldSize * 4, 0, "cyan", context));
			this.blocks.push(new Block().init(globals.fieldSize * 3, globals.fieldSize, "cyan", context));
			this.blocks.push(new Block().init(globals.fieldSize * 4, globals.fieldSize, "cyan", context));
			this.blocks.push(new Block().init(globals.fieldSize * 5, globals.fieldSize, "cyan", context));
			break;
		default:
			break;
	}

	return this;
};

//Move every block right and redraw
Stone.prototype.moveRight = function (context) {

	for (var i = 0; i < this.blocks.length; ++i) {
		if (this.blocks[i].position.x > globals.fieldSize * 8) {
			return;
		}
	}

	context.beginPath();

	for (var i = 0; i < this.blocks.length; ++i) {
		this.blocks[i].clear(context);
		this.blocks[i].position.x += globals.fieldSize;
		this.blocks[i].lastPosition.x = this.blocks[i].position.x;
		this.blocks[i].draw(context);
	}
};

//Move every block left and redraw
Stone.prototype.moveLeft = function (context) {
	for (var i = 0; i < this.blocks.length; ++i) {
		if (this.blocks[i].position.x < globals.fieldSize) {
			return;
		}
	}

	context.beginPath();

	for (var i = 0; i < this.blocks.length; ++i) {
		this.blocks[i].clear(context);
		this.blocks[i].position.x -= globals.fieldSize;
		this.blocks[i].lastPosition.x = this.blocks[i].position.x;
		this.blocks[i].draw(context);
	}
};

//Rotate every block and redraw
Stone.prototype.rotate = function (context, checkCollision) {
	var centerX = this.blocks[0].position.x;
	var centerY = this.blocks[0].position.y;

	this.blocks[1].clear(context);
	this.blocks[2].clear(context);
	this.blocks[3].clear(context);

	this.blocks[1].position = rotate_point(centerX, centerY, 90 * (Math.PI / 180), this.blocks[1].position);
	this.blocks[2].position = rotate_point(centerX, centerY, 90 * (Math.PI / 180), this.blocks[2].position);
	this.blocks[3].position = rotate_point(centerX, centerY, 90 * (Math.PI / 180), this.blocks[3].position);
	
	if (checkCollision(this) == true) {
		this.blocks[1].position = rotate_point(centerX, centerY, -90 * (Math.PI / 180), this.blocks[1].position);
		this.blocks[2].position = rotate_point(centerX, centerY, -90 * (Math.PI / 180), this.blocks[2].position);
		this.blocks[3].position = rotate_point(centerX, centerY, -90 * (Math.PI / 180), this.blocks[3].position);
	}

	this.blocks[1].draw(context);
	this.blocks[2].draw(context);
	this.blocks[3].draw(context);
};

//Redraw blocks
Stone.prototype.draw = function (context) {
	context.beginPath();

	for (var i = 0; i < this.blocks.length; ++i) {
		this.blocks[i].clear(context);
		this.blocks[i].draw(context);
	}
};

function rotate_point(cx,cy,angle,p)
{
    //Calculate sinus/cosinus, translate to center, rotate, translate back and return
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    p.x -= cx;
    p.y -= cy;
    var xnew = Math.round(p.x * c - p.y * s);
    var ynew = Math.round(p.x * s + p.y * c);
    return new Vector2().init(xnew + cx, ynew + cy);
}

$().ready(function () {
    var _canvas = $('.gameScreen')[0];
	var _context = _canvas.getContext('2d'); 

	var _date;
	var _currentStone;
	var _landedStones;
	var _animationsRunning = 0;
	var _gameOver = false;
	var _music = new Audio('tetris.mp3');

    //Main loop
	var _draw = function () {
	    var now = Date.now();
	    var deltaTime = (now - _date) / 1000;

        //Only update logic when no animations are running
	    if (_animationsRunning == 0) {
	        _context.beginPath();
	        _currentStone.update(deltaTime, _context);

	        if (!_checkCollision(_currentStone)) {
	            _currentStone.draw(_context);
	        } else {
	            for (var i = 0; i < _currentStone.blocks.length; ++i) {
	                _currentStone.blocks[i].position.y -= globals.fieldSize;

	                var posX = _currentStone.blocks[i].position.x / globals.fieldSize;
	                var posY = _currentStone.blocks[i].position.y / globals.fieldSize;

	                _landedStones[posX][posY] = _currentStone.blocks[i];
	            }

	            _destroyRows();
	            _currentStone = new Stone().init(_context);
	            if (_checkCollision(_currentStone)) {
	                _showGameOver();
	            }
	        }
	    }

	    _date = now;

        //Only call for next frame when game not over
	    if (!_gameOver) {
	        requestAnimationFrame(_draw);
	    }
	};

    //Check collisions for each block of stone
	var _checkCollision = function (stone) {
	    for (var i = 0; i < stone.blocks.length; ++i) {
	        if (stone.blocks[i].position.y > globals.fieldSize * 19
                || stone.blocks[i].position.y < 0
                || stone.blocks[i].position.x > globals.fieldSize * 9
                || stone.blocks[i].position.x < 0) {
	            return true;
	        }

	        var posX = stone.blocks[i].position.x / globals.fieldSize;
	        var posY = stone.blocks[i].position.y / globals.fieldSize;

	        if (_landedStones[posX][posY] != null) {
	            return true;
	        }
	    }

	    return false;
	};

    //Start destruction of full rows
	var _destroyRows = function () {
	    for (var y = 19; y >= 0; --y) {
            if (_checkCompleteRow(y)) {
                _animationsRunning++;
                _animateRow(y);
	        }
	    }
	};

    //Play fade out animation for row
	var _animateRow = function (row) {
	    for (var x = 0; x < 10; ++x) {
	        if (_landedStones[x][row]) {
	            _landedStones[x][row].clear(_context);
	            _landedStones[x][row].alpha -= 0.05;
	            _landedStones[x][row].draw(_context);
	        }
	    }

	    if (_landedStones[0][row].alpha <= 0) {
	        for (var x = 0; x < 10; ++x) {
	            _landedStones[x][row].clear(_context);
	            _landedStones[x][row] = null;
	        }
	        _animationsRunning--;
	        if (_animationsRunning == 0) {
	            _deleteEmptyRows();
	        }
	    } else {
	        window.setTimeout(function () {
	            _animateRow(row);
	        }, 1000/60);
	    }
	};

    //Delete empty rows and move rows above down
	var _deleteEmptyRows = function () {
	    var _emptySpace = true;

	    for (var row = 0; row < 20; ++row) {
	        if (!_checkEmptyRow(row)) {
	            _emptySpace = false;
	        }

	        if (!_emptySpace && _checkEmptyRow(row)) {
	            for (var y = row; y >= 0; --y) {
	                for (var x = 0; x < 10; ++x) {
	                    if (y - 1 >= 0) {
	                        _landedStones[x][y] = _landedStones[x][y - 1];
	                        _landedStones[x][y - 1] = null;

	                        if (_landedStones[x][y]) {
	                            _landedStones[x][y].clear(_context);
	                            _landedStones[x][y].position.y += globals.fieldSize;
	                            _landedStones[x][y].draw(_context);
	                        }
	                    } else {
	                        _landedStones[x][y] = null;
	                    }
	                }
	            }

	            _deleteEmptyRows();
	        }
	    }
	};

    //Return true if row is complete
	var _checkCompleteRow = function (rowIndex) {
	    for (var x = 0; x < 10; ++x) {
	        if (!_landedStones[x][rowIndex]) {
	            return false;
	        }
	    }

	    return true;
	};

    //Return true if row is empty
	var _checkEmptyRow = function (rowIndex) {
	    for (var x = 0; x < 10; ++x) {
	        if (_landedStones[x][rowIndex]) {
	            return false;
	        }
	    }

	    return true;
	};

    //Create new landed stones array, draw board and start main loop
	var _startGame = function () {
	    _landedStones = new Array();

	    for (var x = 0; x < 10; ++x) {
	        _landedStones[x] = new Array();
	    }

	    _date = Date.now();
	    _context.beginPath();
	    _context.rect(0, 0, globals.fieldSize * 10 + 2, globals.fieldSize * 20 + 2);
	    _context.lineWidth = 2;
	    _context.strokeStyle = 'black';
	    _context.stroke();
	    _currentStone = new Stone().init(_context);
	    requestAnimationFrame(_draw);
	};

    //Show game over screen
	var _showGameOver = function () {
	    _gameOver = true;
	    _context.shadowBlur = 5;
	    _context.shadowOffsetX = 2;
	    _context.shadowOffsetY = 2;
	    _context.shadowColor = "black";
	    _context.fillStyle = "red";
	    _context.font = "30px Verdana";
	    _context.fillText("Game Over!", 10, 200);

	    _context.shadowBlur = 0;
	    _context.shadowOffsetX = 0;
	    _context.shadowOffsetY = 0;
	};

    //Clear when starting new game
	var _clearGame = function () {
	    _context.clearRect(0, 0, globals.fieldSize * 10 + 2, globals.fieldSize * 20 + 2);
	    _animationsRunning = 0;
	    _gameOver = false;
	};

    //Controls
	$(document).keydown(function (e) {
	    if (e.which == 40) {
	        e.preventDefault();
	        _currentStone.dropMultiplicator = 10;
	    }
	});

	$(document).keyup(function (e) {
	    if (e.which == 40) {
	        e.preventDefault();
	        _currentStone.dropMultiplicator = 1;
	    }
	});

	$(document).keyup(function (e) {
	    if (e.which == 39) {
	        e.preventDefault();
	        _currentStone.moveRight(_context);
	    }
	});

	$(document).keyup(function (e) {
	    if (e.which == 38) {
	        e.preventDefault();
	        _currentStone.rotate(_context, _checkCollision);
	    }
	});

	$(document).keyup(function (e) {
	    if (e.which == 37) {
	        e.preventDefault();
	        _currentStone.moveLeft(_context);
	    }
	});

	$(document).click(function () {
	    if (_gameOver) {
	        _clearGame();
	        _startGame();
	    }
	});

    //Loop music
	_music.addEventListener('ended', function () {
	    this.currentTime = 0;
	    this.play();
	}, false);
	_music.play();

    //Start game in beginning
	_startGame();
});