// Assignment 3
// Joe Hladkowicz - 300723388

// variable declarations
var moveState = "moveRight";
var leftKeyDown = false;  
var rightKeyDown = false; 
var attackKeyDown = false;
var canMove = true;
var shoot = false;
var shooting = false;
var canShoot = true;
var canMoveUp;
var direction;
var boxes = 0;
var canvas;
var ctx;
var canvasWidth;
var canvasHeight;
var level = 0;
var enemies = 0;
var largeEnemies = 0;
var energyBreakPoint = 1.5;
var bullet;
var bulletPosition;
var enemyDirection;
var xSpawn1 = new Array(120, 20, 880, 1200);
var ySpawn1 = new Array(100, 400, 200, 200);
var xSpawn2 = new Array(100, 20, 1120, 1200);
var ySpawn2 = new Array(100, 500, 400, 200);
var xSpawn3 = new Array(100, 20, 900, 1200);
var ySpawn3 = new Array(100, 500, 300, 500);
var spawn = 0;
var enemiesLeft = 20;
var time = 0;
var smallEnemySpeed = 100;
var stopFrame = false;
var playMeleeSound = false;
var playChirp2Sound = true;
var lvl1chirp = 0;
var game = {
	currentLevel: 0,
	player: null,
	energy: 20,
	maxEnergy: 20,
	health: 20,
	maxHealth: 20
};
game.box = new Array();
game.levels = new Array();

// levels
game.levels[0] = [{"type":"player","x":650,"y":600},
{"type":"box","x":650, "y":650, "width":650, "height":15, "rotation":0},
{"type":"box","x":-10,"y":0,"width":5,"height":1000,"rotation":0},
{"type":"box","x":1150,"y":175,"width":125,"height":5,"rotation":0},
{"type":"enemy","x":20,"y":600},
{"type":"enemy","x":300,"y":100},
{"type":"enemy","x":1150,"y":250},
{"type":"enemy","x":1250,"y":600},
{"type":"ignignokt","x":1095,"y":150},
{"type":"err","x":1170,"y":150}, 
{"type":"shake","x":1245,"y":150},
{"type":"box","x":1310,"y":0,"width":5,"height":1000,"rotation":0}];

game.levels[1] = [{"type":"player","x":650,"y":580},
{"type":"box","x":650, "y":650, "width":650, "height":15, "rotation":0},
{"type":"box","x":-10,"y":0,"width":5,"height":1000,"rotation":0},
{"type":"box","x":800,"y":200,"width":125,"height":5,"rotation":0},
{"type":"enemy","x":100,"y":600},
{"type":"enemy","x":300,"y":100},
{"type":"enemy","x":1000,"y":400},
{"type":"enemy","x":1250,"y":600},
{"type":"err","x":745,"y":165},
{"type":"ignignokt","x":810,"y":165},
{"type":"carl","x":880,"y":165},
{"type":"box","x":1310,"y":0,"width":5,"height":1000,"rotation":0}];   

game.levels[2] = [{"type":"player","x":650,"y":650},
{"type":"box","x":650, "y":750, "width":650, "height":15, "rotation":0},
{"type":"box","x":-10,"y":0,"width":5,"height":1000,"rotation":0},
{"type":"box","x":400,"y":150,"width":125,"height":5,"rotation":0},
{"type":"enemy","x":100,"y":600},
{"type":"enemy","x":300,"y":400},
{"type":"enemy","x":1000,"y":400},
{"type":"enemy","x":1200,"y":600},
{"type":"err","x":300,"y":135},
{"type":"ignignokt","x":370,"y":135},
{"type":"meatwad","x":460,"y":135},
{"type":"box","x":1310,"y":0,"width":5,"height":1000,"rotation":0}];

// variable that holds the click event to start game
var handler = function() {
	$(document).keydown(function(e) {
		switch(e.keyCode) {
			case 39: // right arrow
				moveState = "moveRight";  
				rightKeyDown = true;
				break;
							
			case 37: // left arrow
				moveState = "moveLeft";
				leftKeyDown = true;
				break;
								
			case 38: // up arrow
				moveState = "moveUp";
				break;
							
			case 68: // d key
				if (game.energy <= energyBreakPoint) {
					attackKeyDown = false;
				}
				else {
					attackKeyDown = true;
					playMeleeSound = true;
				}
				break;
							
			case 83: // s key
				shoot = true;
				break
		}
	});
	
	// keyup events
	$(document).keyup(function(e) {
		switch(e.keyCode) {
			case 39: // right arrow
				if (leftKeyDown) { 
					moveState = "moveLeft";
				}
				else {
					if (game.player.GetLinearVelocity().y == 0) {
						moveState = "stop";
					}
				}
				rightKeyDown = false;
				break;
								
			case 37: //left arrow
				if (rightKeyDown) {
					moveState = "moveRight";
				}
				else {
					if (game.player.GetLinearVelocity().y == 0) {
						moveState = "stop";
					}
				}
				leftKeyDown = false;
				break;
							
			case 68: // d key
				attackKeyDown = false;
				playMeleeSound = false
				if (direction == "right") {
					imageRight();
				}
				else if (direction == "left") {
					imageLeft();
				}
				break;
		}
	});
	
	// hide intro elements, display game elements, start game
	game.introSound.pause();
	$("#shakeIntro").hide();
	$("#errIntro").hide();
	$("#ignignoktIntro").hide();
	$("#frylockIntro").hide();
	$("#skip").hide();
	direction == "right";
	$("#scoreboard").show();
	start(game.currentLevel);
	step();
}

$(function() {
	// hide game elements for intro
	$("#scoreboard").hide();
	$("#arrow").hide();
	$("#shakeIntro").hide();
	$("#errIntro").hide();
	$("#ignignoktIntro").hide();
	$("#frylockIntro").hide();
	$("#replay").hide();
	$("#skip").hide();
	$("#moonEnd").hide();
	$("#winscreen").hide();
	
	// get sound elements
	game.introSound = document.getElementById("intro");
	game.introSound.volume = 0.3;
	game.laserSound = document.getElementById("laser");
	game.laserSound.volume = 0.02;
	game.meleeSound = document.getElementById("melee");
	game.meleeSound.volume = 0.5;
	game.errHitSound = document.getElementById("errHit");
	game.errHitSound.volume = 0.05;
	game.fryHitSound = document.getElementById("fryHit");
	game.fryHitSound.volume = 0.1;
	game.lvl1backgroundSound = document.getElementById("lvl1background");
	game.lvl1backgroundSound.volume = 0.05;
	game.titleSound = document.getElementById("title");
	game.titleSound.volume = 0.1;
	game.lvl1endSound = document.getElementById("lvl1end");
	game.lvl1endSound.volume = 0.2;
	game.lvl1chirpSound = document.getElementById("chirp");
	game.lvl1chirpSound.volume = 0.1;
	game.lvl2startSound = document.getElementById("lvl2start");
	game.lvl2startSound.volume = 0.4;
	game.lvl2endSound = document.getElementById("lvl2end");
	game.lvl2endSound.volume = 0.4;
	game.lvl3startSound = document.getElementById("lvl3start");
	game.lvl3startSound.volume = 0.4;
	game.chirp2Sound = document.getElementById("chirp2");
	game.chirp2Sound.volume = 0.4;
	game.gameendSound = document.getElementById("gameend");
	game.gameendSound.volume = 0.4;
	
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);
	
	game.titleSound.currentTime = 0;
	game.titleSound.play();
	
	$("#game").click(function(){
		$("#game").removeClass("titlescreen");
		$("#game").addClass("instructionscreen");
		$(".instructionscreen").click(function(){
			$("#game").removeClass("instructionscreen");
			$('#game').unbind("click");
			$(".instructionscreen").unbind("click");
			$("#game").addClass("introscreen");
			$(".introscreen").unbind("click");
			
			// used for determining sound times
			var i = 0;
			setInterval(function(){i++; console.log(i);},1000);
			
			// show intro elements
			$("#shakeIntro").show();
			$("#errIntro").show();
			$("#ignignoktIntro").show();
			$("#frylockIntro").show();
			$("#skip").show();
			game.titleSound.pause();
			game.introSound.currentTime = 0;
			game.introSound.play();
			
			// provides intro animations
			setTimeout(function(){$('#frylockIntro').addClass("frylockMove")},500);	
			setTimeout(function(){$('#ignignoktIntro').addClass("ignignoktTranslate")},11000);
			setTimeout(function(){$('#errIntro').addClass("errTranslate")},11000);
			setTimeout(function(){$('#errIntro').removeClass().addClass("errTranslate2")},21000);
			setTimeout(function(){$('#errIntro').removeClass().addClass("errTranslate3")},24000);
			setTimeout(function(){$('#errIntro').removeClass()},26000);
			setTimeout(function(){$('#ignignoktIntro').removeClass()},26000);
			setTimeout(function(){$('#skip').removeClass().addClass("start")},40000);
			 
			$("#skip").bind('click', handler);
		});
	}); 
});

// functions to alter player image
function imageRight() {
	$("#player").attr("src","images/frylockR.png");
}

function imageLeft() {
	$("#player").attr("src","images/frylockL.png");
}

function meleeRight() {
	$("#player").attr("src","images/attackR1.png");
}

function meleeLeft() {
	$("#player").attr("src","images/attackL1.png");
}

// creates the world
function createWorld() {
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-1500, -1500);
	worldAABB.maxVertex.Set(1500, 1500);
	var gravity = new b2Vec2(0, 1500);
	var doSleep = false;
	var world = new b2World(worldAABB, gravity, doSleep);
	return world;
}

// creates world bodies
function createGround(x, y, width, height, rotation, type) {
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(width, height);
	groundSd.restitution = 0.2;
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(x, y);
	groundBd.rotation = rotation * Math.PI / 180;
	var body = game.world.CreateBody(groundBd);
	return body;
}

// draws the world (copied from Box2D library)
function drawWorld(world, context) {
	for (var b = world.m_bodyList; b != null; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			if (s.GetUserData() != undefined) {
				var img = s.GetUserData();
				var x = s.GetPosition().x;
				var y = s.GetPosition().y;
				var topleftX = - $(img).width()/2;
				var topleftY = - $(img).height()/2;
				context.save();
				context.translate(x,y);
				context.rotate(s.GetBody().GetRotation());
				context.drawImage(img, topleftX, topleftY);
				context.restore();
			} 
			//drawShape(s, context);
		} 
	}
}

// draws shape (copied from Box2D library)
function drawShape(shape, context) {
	context.strokeStyle = '#000000';
	context.beginPath();
	switch (shape.m_type) {
		case b2Shape.e_circleShape:
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta),r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
			context.moveTo(pos.x, pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x, pos2.y);
			break;

		case b2Shape.e_polyShape:
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position,b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position,b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
			break;
	}
	context.stroke();
}

// creates player
function spawnPlayer(x, y) {
	var boxSd = new b2BoxDef();
	boxSd.density = 1.0;
	boxSd.friction = 0.0;  //1.0 or 1.4
	boxSd.restitution = 0.1;  // 0.4
	boxSd.extents.Set(20, 30); // 20 30
	boxSd.userData = document.getElementById('player');
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.preventRotation = true;
	boxBd.position.Set(x,y);
	var playerBody = game.world.CreateBody(boxBd);
	return playerBody;
}

// creates small enemy
function spawnEnemy(x, y) {
	var boxSd = new b2BoxDef();
	boxSd.density = 1.0;
	boxSd.friction = 0.0;  //1.0 or 1.4
	boxSd.restitution = 0.1;  // 0.4
	boxSd.extents.Set(20, 20); // 20 30
	boxSd.userData = document.getElementById('enemy');
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.preventRotation = true;
	boxBd.position.Set(x,y);
	var playerBody = game.world.CreateBody(boxBd);
	return playerBody;
}

// creates large enemy
function spawnLargeEnemy(x, y) {
	var boxSd = new b2BoxDef();
	boxSd.density = 1.0;
	boxSd.friction = 0.0;  //1.0 or 1.4
	boxSd.restitution = 0.1;  // 0.4
	boxSd.extents.Set(30, 30); // 20 30
	boxSd.userData = document.getElementById('largeEnemy');
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.preventRotation = true;
	boxBd.position.Set(x,y);
	var playerBody = game.world.CreateBody(boxBd);
	return playerBody;
}

// creates bullet
function spawnBullet(x, y) {
	var boxSd = new b2BoxDef();
	boxSd.density = 0.1;
	boxSd.friction = 0.0;  //1.0 or 1.4
	boxSd.restitution = 0.1;  // 0.4
	boxSd.extents.Set(2, 2); // 20 30
	boxSd.userData = document.getElementById('bullet');
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.preventRotation = true;
	boxBd.position.Set(x,y);
	var playerBody = game.world.CreateBody(boxBd);
	return playerBody;
}

// creates secondary character bodies
function spawnSecondaryCharacters(x, y, elementId) {
	var boxSd = new b2BoxDef();
	boxSd.density = 0.1;
	boxSd.friction = 0.0;  //1.0 or 1.4
	boxSd.restitution = 0.1;  // 0.4
	boxSd.extents.Set(20, 20); // 20 30
	boxSd.userData = document.getElementById(elementId);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.preventRotation = true;
	boxBd.position.Set(x,y);
	var playerBody = game.world.CreateBody(boxBd);
	return playerBody;
}

//starts game and/or restarts level
function start(level) {
	moveState == "stop";
	game.enemy = new Array();
	game.largeEnemy = new Array();
	spawn = 0;
	boxes = 0;
	direction = "right";
	
	// sets level conditions
	if (level == 0) {
		enemiesLeft = 20; 
		smallEnemySpeed = 100;
		game.lvl1backgroundSound.currentTime = 0;
		game.lvl1backgroundSound.play();
	}
	else if (level == 1) {
		game.lvl1backgroundSound.pause();
		enemiesLeft = 30;
		smallEnemySpeed = 125;
		game.health = 20;
		game.lvl2startSound.currentTime = 0;
		game.lvl2startSound.play();
	}
	else if (level == 2) {
		enemiesLeft = 40;
		smallEnemySpeed = 150;
		game.health = 20;
		game.lvl3startSound.currentTime = 0;
		game.lvl3startSound.play();
		
	}
	
	enemies = 0;
	largeEnemies = 0;
	$("#enemies").html(enemiesLeft);
	game.currentLevel = level;
	$("#level").html(level+1);
	$('#game').removeClass().addClass('lvl'+level);
	game.world = createWorld();
	$(".energyAmount").width('100%');
	$(".healthAmount").width('100%');
	
	// spawns necessary players and objects
	for(var i=0;i<game.levels[level].length;i++) {
		var obj = game.levels[level][i];
		if (obj.type == "player") {
			game.player = spawnPlayer(obj.x,obj.y);
			continue;
		}
		var groundBody = createGround(obj.x, obj.y, obj.width, obj.height, obj.rotation, obj.type);
		
		if (obj.type == "box") {
			game.box[boxes] = groundBody;
			boxes++;
		}
		if (obj.type == "enemy") {
			game.enemy[enemies] = spawnEnemy(obj.x, obj.y);
			enemies++;
		}
		if (obj.type == "shake") {
			game.shake = spawnSecondaryCharacters(obj.x, obj.y, "shake");
		}
		if (obj.type == "err") {
			game.err = spawnSecondaryCharacters(obj.x, obj.y, "err");
		}
		if (obj.type == "ignignokt") {
			game.ignignokt = spawnSecondaryCharacters(obj.x, obj.y, "ignignokt");
		}
		if (obj.type == "carl") {
			game.carl = spawnSecondaryCharacters(obj.x, obj.y, "carl");
		}
		if (obj.type == "meatwad") {
			game.meatwad = spawnSecondaryCharacters(obj.x, obj.y, "meatwad");
		}
	}
	
	// sets initial enemy movement
	for (var i=0;i<game.enemy.length;i++) {
		if (i == 0 || i == 1) {
			game.enemy[i].SetLinearVelocity(new b2Vec2(smallEnemySpeed,0), game.enemy[i].GetCenterPosition()); //200
		}
		else if (i == 2 || i == 3) {
			game.enemy[i].SetLinearVelocity(new b2Vec2(smallEnemySpeed*-1,0), game.enemy[i].GetCenterPosition());
		}
	}
}

function step() {
	game.world.Step(1.0/60, 1);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(game.world, ctx);	
	
	var playerLV = game.player.GetLinearVelocity();
	var position = game.player.GetCenterPosition();
	
	// additional level conditions
	if (game.currentLevel == 0) {
		game.energy = game.energy + 0.012;
		$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
		if (enemiesLeft == 8) {
			if (playChirp2Sound) {
				game.chirp2Sound.currentTime = 0;
				game.chirp2Sound.play();
				playChirp2Sound = false;
			}
		}
	}
	else if (game.currentLevel == 1) {
		game.energy = game.energy + 0.02;
		$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
	}
	else if (game.currentLevel == 2) {
		game.energy = game.energy + 0.03;
		$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
	}
	
	// allows for no over accumulation or negative energy values
	if (game.energy >= 20) {
		game.energy = 20;
		$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
	}
	else if (game.energy <=0) {
		game.energy = 0;
		$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
	}
	
	// provides hesitation in firing when energy is to low
	if (game.energy <= 2) {
	canShoot = false;
	}
	else if (game.energy >2) {
	canShoot = true;
	}
	
	if (spawn == 4) {
		spawn = 0;
	}
	
	if (!playMeleeSound) {
		game.meleeSound.pause();
		game.meleeSound.currentTime = 0;
	}
	
	// provides hesitation for melee attack when energy is to low
	if (game.energy < energyBreakPoint) {
		attackKeyDown = false;
		game.meleeSound.pause();
	}
	
	// melee attack
	if (attackKeyDown) {
		if (game.energy > energyBreakPoint) {
			game.energy = game.energy - 0.1;
			$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
			game.meleeSound.currentTime = 0;
			game.meleeSound.play();
			for (var i=0;i<game.largeEnemy.length;i++) {
				var enemyPosition = game.largeEnemy[i].GetCenterPosition();
				if (direction == "right") {
					if ((position.x + 100) > (enemyPosition.x - 30)) {
						if (enemyPosition.x > position.x) {
							game.largeEnemy[i].SetLinearVelocity(new b2Vec2(400,-500), game.largeEnemy[i].GetCenterPosition());
						}
					}
				}
				if (direction == "left") {
					if (position.x - 100 < enemyPosition.x + 30) {
						if (enemyPosition.x < position.x) {
							game.largeEnemy[i].SetLinearVelocity(new b2Vec2(-400,-500), game.largeEnemy[i].GetCenterPosition());
						}
					}
				}
			}
		
			for (var i=0; i<game.enemy.length;i++) {
				var enemyPosition = game.enemy[i].GetCenterPosition();
				if (direction == "right") {
					if ((position.x + 100) > (enemyPosition.x - 20)) {
						if (enemyPosition.x > position.x) {
							game.enemy[i].SetLinearVelocity(new b2Vec2(400,-500), game.enemy[i].GetCenterPosition());
						}
					}
				}
				if (direction == "left") {
					if (position.x - 100 < enemyPosition.x + 20) {
						if (enemyPosition.x < position.x) {
							//game.world.DestroyBody(game.enemy[i]);
							game.enemy[i].SetLinearVelocity(new b2Vec2(-400,-500), game.enemy[i].GetCenterPosition());
						}
					}
				}
			}
		}
		else {
			game.meleeSound.pause();
		}
	}
 	
	// collision detection
	for (var cn = game.world.GetContactList(); cn != null;cn = cn.GetNext()) {
		var body1 = cn.GetShape1().GetBody();
		var body2 = cn.GetShape2().GetBody();
			
		// player/ small enemy collision
		for (var a = 0; a<game.enemy.length; a++) {
			var enemyPosition = game.enemy[a].GetCenterPosition();
			if ((body1 == game.player && body2 == game.enemy[a]) || (body2 == game.player && body1 == game.enemy[a])) {
				
				game.fryHitSound.currentTime = 0;
				game.fryHitSound.play();
				game.health = game.health - 3; //4
				game.world.DestroyBody(game.enemy[a]);
				$(".healthAmount").width(game.health/game.maxHealth * 100 +'%');
				
				if (game.currentLevel == 0) {
				game.enemy[enemies] = spawnEnemy(xSpawn1[spawn],ySpawn1[spawn]);
				}
				else if (game.currentLevel == 1) {
				game.enemy[enemies] = spawnEnemy(xSpawn2[spawn],ySpawn2[spawn]);
				}
				else if (game.currentLevel == 2) {
				game.enemy[enemies] = spawnEnemy(xSpawn3[spawn],ySpawn3[spawn]);
				}
					
				if (spawn == 0 || spawn == 1) {
					game.enemy[enemies].SetLinearVelocity(new b2Vec2(smallEnemySpeed,0), game.enemy[enemies].GetCenterPosition());
				}
				else {
					game.enemy[enemies].SetLinearVelocity(new b2Vec2(smallEnemySpeed*-1,0), game.enemy[enemies].GetCenterPosition());
				}
				enemies++;
				spawn++;
			}
				
			// small enemy/ small enemy collision
			for (b=0;b<game.enemy.length;b++) {
				if ((body1 == game.enemy[a] && body2 == game.enemy[b]) || (body2 == game.enemy[a] && body1 == game.enemy[b])) {
					var enemy1 = game.enemy[a].GetCenterPosition();
					var enemy2 = game.enemy[b].GetCenterPosition();
					var diff = enemy1.x - enemy2.x;
					
					if (diff <= 0) {
						game.largeEnemy[largeEnemies] = spawnLargeEnemy(enemy1.x + diff/2, enemy1.y)
						game.largeEnemy[largeEnemies].ApplyImpulse(new b2Vec2(200000,-2400000), game.largeEnemy[largeEnemies].GetCenterPosition());
						//game.largeEnemy[largeEnemies].SetLinearVelocity(new b2Vec2(200,0), game.largeEnemy[c].GetCenterPosition());
						largeEnemies++;
					}
					game.world.DestroyBody(game.enemy[a]);
					game.world.DestroyBody(game.enemy[b]);
				}
			}
				
			// small enemy/ large enemy collision
			for (c=0;c<game.largeEnemy.length;c++) {
				var enemy2 = game.largeEnemy[c].GetCenterPosition();
				if ((body1 == game.enemy[a] && body2 == game.largeEnemy[c]) || (body2 == game.enemy[a] && body1 == game.largeEnemy[c])) {
					var enemy1 = game.enemy[a].GetCenterPosition();
					var diff = enemy1.x - enemy2.x;
					
					if (diff < 0) {
						game.enemy[a].SetLinearVelocity(new b2Vec2(smallEnemySpeed*-1,0), game.enemy[a].GetCenterPosition());
						game.largeEnemy[c].SetLinearVelocity(new b2Vec2(200,0), game.largeEnemy[c].GetCenterPosition());
					}
					else {
						game.enemy[a].SetLinearVelocity(new b2Vec2(smallEnemySpeed,0), game.enemy[a].GetCenterPosition());
						game.largeEnemy[c].SetLinearVelocity(new b2Vec2(-200,0), game.largeEnemy[c].GetCenterPosition());
					}
				}
			}
		
			if ( enemyPosition.x <= 50 ) {
				game.enemy[a].SetLinearVelocity(new b2Vec2(smallEnemySpeed,0), game.enemy[a].GetCenterPosition());
			}
			if (enemyPosition.x >= 1250) {
				game.enemy[a].SetLinearVelocity(new b2Vec2(smallEnemySpeed*-1,0), game.enemy[a].GetCenterPosition());
			} 
		}
		
		for (i=0;i<game.largeEnemy.length;i++) {
			var enemy2 = game.largeEnemy[i].GetCenterPosition();
			if ( enemy2.x <= 50 ) {
				game.largeEnemy[i].SetLinearVelocity(new b2Vec2(200,0), game.largeEnemy[i].GetCenterPosition());
			}
			if (enemy2.x >= 1250) {
				game.largeEnemy[i].SetLinearVelocity(new b2Vec2(-200,0), game.largeEnemy[i].GetCenterPosition());
			} 
			
			// player/ large enemy collision
			if ((body1 == game.player && body2 == game.largeEnemy[i]) || (body2 == game.player && body1 == game.largeEnemy[i])) {
				game.fryHitSound.currentTime = 0;
				game.fryHitSound.play();
					
				if (position.x < enemy2.x) {
					game.largeEnemy[i].SetLinearVelocity(new b2Vec2(200,0), game.largeEnemy[i].GetCenterPosition());
				}
				else {
					game.largeEnemy[i].SetLinearVelocity(new b2Vec2(-200,0), game.largeEnemy[i].GetCenterPosition());
				}
				game.health = game.health - 1;  //3
				$(".healthAmount").width(game.health/game.maxHealth * 100 +'%');
			}
			
			// large enemy/ large enemy collision
			for (c=0;c<game.largeEnemy.length;c++) {
				if ((body1 == game.largeEnemy[c] && body2 == game.largeEnemy[i]) || (body2 == game.largeEnemy[c] && body1 == game.largeEnemy[i])) {
					var enemy1 = game.largeEnemy[c].GetCenterPosition();
					var enemy2 = game.largeEnemy[i].GetCenterPosition();
					var diff = enemy1.x - enemy2.x;
					
					if (diff < 0) {
						game.largeEnemy[c].SetLinearVelocity(new b2Vec2(-200,0), game.largeEnemy[c].GetCenterPosition());
						game.largeEnemy[i].SetLinearVelocity(new b2Vec2(200,0), game.largeEnemy[i].GetCenterPosition());
					}
					else {
						game.largeEnemy[c].SetLinearVelocity(new b2Vec2(200,0), game.largeEnemy[c].GetCenterPosition());
						game.largeEnemy[i].SetLinearVelocity(new b2Vec2(-200,0), game.largeEnemy[i].GetCenterPosition());
					}
				}
			}
		}
	}
	
	// attack
	if (canShoot) {
		if (shoot) {
			if (game.energy > energyBreakPoint) {
				$("#bullet").attr("src","images/bullet.png");
				game.laserSound.currentTime = 0;
				game.laserSound.play();
				
				if (lvl1chirp == 0) {
					game.lvl1chirpSound.currentTime = 0;
					game.lvl1chirpSound.play();
				}
				lvl1chirp++;
				
				game.energy = game.energy - 2;
				$(".energyAmount").width(game.energy/game.maxEnergy * 100 +'%');
				if (direction == "right") {
					bullet = spawnBullet(position.x + 5, position.y + 10)
					bullet.SetLinearVelocity(new b2Vec2(1800,-150), bullet.GetCenterPosition());
				}
				else {
					bullet = spawnBullet(position.x + -5, position.y + 10)
					bullet.SetLinearVelocity(new b2Vec2(-1800,-150), bullet.GetCenterPosition());
				}
				shooting = true;
				shoot = false;
				canShoot = false;
			}
		}
	}
	
	// bullet in air
	if (shooting) {
		bulletPosition = bullet.GetCenterPosition();
		var difference = position.x - bulletPosition.x;
		if (difference > 350 || difference < -350) {
			game.world.DestroyBody(bullet);
			canShoot = true;
			shooting = false;
		} 
		
		for (var cn = game.world.GetContactList(); cn != null;cn = cn.GetNext()) {
			var body1 = cn.GetShape1().GetBody();
			var body2 = cn.GetShape2().GetBody();
			
			// bullet hits wall
			for (var a = 0; a<game.box.length; a++) {
				if ((body1 == bullet && body2 == game.box[a]) || (body2 == bullet && body1 == game.box[a])) {
					game.world.DestroyBody(bullet);
					canShoot = true;
				}
			}
			
			// bullet hits small enemy
			for (var b = 0; b<game.enemy.length; b++) {
				if ((body1 == bullet && body2 == game.enemy[b]) || (body2 == bullet && body1 == game.enemy[b])) {
					game.errHitSound.currentTime = 0;
					game.errHitSound.play();
					game.world.DestroyBody(bullet);
					game.world.DestroyBody(game.enemy[b]);
					enemiesLeft--;
					$("#enemies").html(enemiesLeft);
						
					if (game.currentLevel == 0) {
						game.enemy[enemies] = spawnEnemy(xSpawn1[spawn],ySpawn1[spawn]);
					}
					else if (game.currentLevel == 1) {
						game.enemy[enemies] = spawnEnemy(xSpawn2[spawn],ySpawn2[spawn]);
					}
					else if (game.currentLevel == 2) {
						game.enemy[enemies] = spawnEnemy(xSpawn3[spawn],ySpawn3[spawn]);
					}
						
					if (spawn == 0 || spawn == 1) {
						game.enemy[enemies].SetLinearVelocity(new b2Vec2(smallEnemySpeed,0), game.enemy[enemies].GetCenterPosition());
					}
					else {
						game.enemy[enemies].SetLinearVelocity(new b2Vec2(smallEnemySpeed*-1,0), game.enemy[enemies].GetCenterPosition());
					}
					enemies++;
					spawn++;
					canShoot = true;
				}
			}
			
			// bullet hits large enemy
			for (var b = 0; b<game.largeEnemy.length; b++) {
				if ((body1 == bullet && body2 == game.largeEnemy[b]) || (body2 == bullet && body1 == game.largeEnemy[b])) {
					game.errHitSound.currentTime = 0;
					game.errHitSound.play();
					game.world.DestroyBody(bullet);
					game.world.DestroyBody(game.largeEnemy[b]);
					
					for (var z=0;z<2;z++) {
						if (spawn == 4) {
							spawn = 0;
						}
						
						if (game.currentLevel == 0) {
							game.enemy[enemies] = spawnEnemy(xSpawn1[spawn],ySpawn1[spawn]);
						}
						else if (game.currentLevel == 1) {
							game.enemy[enemies] = spawnEnemy(xSpawn2[spawn],ySpawn2[spawn]);
						}
						else if (game.currentLevel == 2) {
							game.enemy[enemies] = spawnEnemy(xSpawn3[spawn],ySpawn3[spawn]);
						}
					
						if (spawn == 0 || spawn == 1) {
							game.enemy[enemies].SetLinearVelocity(new b2Vec2(smallEnemySpeed,0), game.enemy[enemies].GetCenterPosition());
						}
						else {
							game.enemy[enemies].SetLinearVelocity(new b2Vec2(smallEnemySpeed*-1,0), game.enemy[enemies].GetCenterPosition());
						}
						enemies++;
						spawn++;
					}
					canShoot = true;
				}
			}
		}
	}
	
	if (playerLV.y == 0) { // standing on a stationary object
		canMoveUp = true; 
	}
	
	// player controls
	if (canMove) {
		switch ( moveState ) {	
			case "stop":
				if (attackKeyDown) {
					if (game.energy > energyBreakPoint) {
						if (direction == "right") {
							meleeRight();
						}
						if (direction == "left") {
							meleeLeft();
						}
					}
				} 
				game.player.SetLinearVelocity(new b2Vec2(0,0), game.player.GetCenterPosition());
				break;
		
			case "moveRight":  // right key down
				if (rightKeyDown) {
					direction = "right";
					if (!attackKeyDown) {
						imageRight();
					}
					else {
						if (game.energy > energyBreakPoint) {
							meleeRight();
						}
						else {
							imageRight();
						}
					}
					game.player.SetLinearVelocity(new b2Vec2(200,game.player.GetLinearVelocity().y), game.player.GetCenterPosition());
				}
				else {
					if (!attackKeyDown) {
						imageRight();
					}
					else {
						if (game.energy > energyBreakPoint) {
							meleeRight();
						}
						else {
							imageRight();
						}
					}
					if (playerLV.y == 0) {
						game.player.SetLinearVelocity(new b2Vec2(0,game.player.GetLinearVelocity().y), game.player.GetCenterPosition());
					}
				}
				break;
			  
			case "moveLeft":  // left key down
				if (leftKeyDown) {
					direction = "left";
					if (!attackKeyDown) {
						imageLeft();
					}
					else {
						if (game.energy > energyBreakPoint) {
							meleeLeft();
						}
						else {
							imageLeft();
						}
					}
					game.player.SetLinearVelocity(new b2Vec2(-200,game.player.GetLinearVelocity().y), game.player.GetCenterPosition());
				}
				else {
					if (!attackKeyDown) {
						imageLeft();
					}
					else {
						if (game.energy > energyBreakPoint) {
							meleeLeft();
						}
						else {
							imageLeft();
						}
					}
					if (playerLV.y == 0) {
						game.player.SetLinearVelocity(new b2Vec2(0,game.player.GetLinearVelocity().y), game.player.GetCenterPosition());
					}
				}
				break;
			  
			case "moveUp": // up key down
				if (canMoveUp) { 
					game.player.ApplyImpulse(new b2Vec2(0,-1600000), game.player.GetCenterPosition()); 
				}
				canMoveUp = false;
				if (rightKeyDown) {
					moveState = "moveRight";
				}
				else if (leftKeyDown) {
					moveState = "moveLeft";
				}
				else {
					moveState = null;
				}
				break;
				
			case null:
				if (attackKeyDown) { 
					if (direction == "right") {
						if (game.energy > energyBreakPoint) {
							meleeRight(); 
						}
						else {
							imageRight();
						}
					}
					else {
						if (game.energy > energyBreakPoint) {
							meleeLeft();
						}
						else {
							imageLeft();
						}
					}
				}
				else { 
					if (direction == "right") {
						imageRight();
					}
					else {
						imageLeft();
					}
				}
				break;
		}
	}
	
	// no health condition
	if (game.health <= 0) {
		
		for (var i=0;i<game.enemy.length;i++) {
				game.world.DestroyBody(game.enemy[i]);
		}
		for (var i=0;i<game.largeEnemy.length;i++) {
			game.world.DestroyBody(game.largeEnemy[i]);
		}
		$("#replay").show();
		
		$("#replay").click(function(){
			$("#replay").hide();
			$("#replay").unbind("click");
			game.health = 20;
			game.energy = 20;
			start(game.currentLevel);
		});
	}
	
	// win condition
	if (enemiesLeft == 0) {
	
		for (var i=0;i<game.enemy.length;i++) {
			game.world.DestroyBody(game.enemy[i]);
		}
		for (var i=0;i<game.largeEnemy.length;i++) {
			game.world.DestroyBody(game.largeEnemy[i]);
		}
		if (game.currentLevel == 0 || game.currentLevel == 1) {
		if (time == 120) {
			game.ignignokt.SetLinearVelocity(new b2Vec2(0,-2000), game.ignignokt.GetCenterPosition());
			game.err.SetLinearVelocity(new b2Vec2(0,-2000), game.ignignokt.GetCenterPosition());
		}
		if (game.ignignokt.GetCenterPosition().y < 0){
			game.world.DestroyBody(game.ignignokt);
		}
		if (game.err.GetCenterPosition().y < 0){
			game.world.DestroyBody(game.err);
		} 
		}
		
		// post level 1
		if (game.currentLevel == 0) {
			game.lvl1backgroundSound.pause();
			game.lvl1chirpSound.pause();
			game.chirp2Sound.pause();
			if (time == 10) {
				game.lvl1endSound.currentTime = 0;
				game.lvl1endSound.play();
			}
			if (time == 300) {
				game.shake.ApplyImpulse(new b2Vec2(-60000,0), game.shake.GetCenterPosition());
			}
			if (time == 400) {
				game.shake.SetLinearVelocity(new b2Vec2(0,0), game.shake.GetCenterPosition());
			}
			if (time > 440) {
				if (game.shake.GetCenterPosition().x <= game.player.GetCenterPosition().x) {
					$("#shake").attr("src","images/shakeR.png");
				}
				else {
					$("#shake").attr("src","images/shake.png");
				}
			}
			if (time > 1100) {
				$("#arrow").show();
				if (game.player.GetCenterPosition().x < 100) {
					$("#arrow").hide();
					time = 0;
					game.lvl1endSound.pause();
					start(game.currentLevel+1);
				}
			}
		}
		
		// post level 2
		if (game.currentLevel == 1) {
			if (time == 10) {
				game.lvl2startSound.pause();
				game.lvl2endSound.currentTime = 0;
				game.lvl2endSound.play();
			}
			if (time == 300) {
				game.carl.ApplyImpulse(new b2Vec2(-60000,0), game.carl.GetCenterPosition());
			}
			if (time == 400) {
				game.carl.SetLinearVelocity(new b2Vec2(0,0), game.carl.GetCenterPosition());
			}
			if (time > 440) {
				if (game.carl.GetCenterPosition().x <= game.player.GetCenterPosition().x) {
					$("#carl").attr("src","images/carlR.png");
				}
				else {
					$("#carl").attr("src","images/carl.png");
				}
			}
		
			if (time > 600) {
				$("#arrow").removeClass().addClass("arrow2");
				$("#arrow").show();
				if (game.player.GetCenterPosition().x < 100) {
					$("#arrow").hide();
					time = 0;
					game.lvl2endSound.pause();
					start(game.currentLevel+1);
				}
			}
		} 
		
		// game end
		if (game.currentLevel == 2) {   
			$("#moonEnd").show();
	
			if (time == 10) {
				game.world.DestroyBody(game.err);
				game.world.DestroyBody(game.ignignokt);
				game.lvl3startSound.pause();
				game.gameendSound.currentTime = 0;
				game.gameendSound.play();
				$("#moonEnd").removeClass().addClass("moonEnd2");
			}
			if (time == 200) {
				$("#moonEnd").removeClass().addClass("moonEnd3");
			}
			
			if (time == 300) {
				game.meatwad.ApplyImpulse(new b2Vec2(30000,0), game.meatwad.GetCenterPosition());
			}
			if (time == 340) {
				game.meatwad.SetLinearVelocity(new b2Vec2(0,0), game.meatwad.GetCenterPosition());
				
			}
			if (time > 400) {
				if (game.meatwad.GetCenterPosition().x <= game.player.GetCenterPosition().x) {
					$("#meatwad").attr("src","images/meatwadR.png");
				}
				else {
					$("#meatwad").attr("src","images/meatwad.png");
				}
			}
			if (time == 500) {
				$("#moonEnd").removeClass().addClass("moonEnd4");
			}
			
			if (time == 2800) {
				$("#moonEnd").removeClass().addClass("moonEnd5");
			}
			if (time == 3650) {
				$("#moonEnd").removeClass().hide();
				$("#winscreen").show();
				$("#winscreen").click(function(){
					$("#winscreen").hide();
					$("#winscreen").unbind("click");
					game.health = 20;
					game.energy = 20;
					time = 0;
					lvl1chirp = 0;
					playChirp2Sound = true;
					start(0);
				});
			}
		} 
		time++;
	}
	setTimeout(step, 10);
}

