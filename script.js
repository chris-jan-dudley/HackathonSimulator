var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

  game.load.image('bgrnd', 'assets/brick.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/sandwich.png');
  game.load.spritesheet('dude', 'assets/hacker.png', 32, 48);
  game.load.image('coffee', 'assets/coffee.png',32,48);
  game.load.image('bullet','assets/bull1.png',20,20);
  game.load.image('wall','assets/wall.png')
  game.load.image('foodbar', 'assets/foodbar.png');
  game.load.image('cafbar', 'assets/cafbar.png');


}

var player;
var platforms;
var cursors;
var space;
var coffees;
var foods;
var bground;
var bullet;
var bullets;
var bulletTime = 0;
var ledge1;
var ledge2;

var walls;

var foodbar;
var cafbar;

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  bground = game.add.sprite(0, 0, 'bgrnd');

  foodbar = game.add.sprite(180,50,'foodbar');
  foodbar.scale.setTo(0.5,1);
  cafbar = game.add.sprite(620,50,'cafbar');
  cafbar.scale.setTo(0.5,1);


  platforms = game.add.group();
  platforms.enableBody = true;

  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(3, 2);
  ground.body.immovable = true;

  var ledge = platforms.create(400, 400, 'ground');
  ledge.scale.setTo(0.7,1);
  ledge.body.immovable = true;
  ledge.body.velocity.x = 50;

  var ledge = platforms.create(50, 250, 'ground');
  ledge.scale.setTo(0.7,1);
  ledge.body.immovable = true;
  ledge.body.velocity.x = -80;

  var ledge = platforms.create(500, 100, 'ground');
  ledge.scale.setTo(0.7,1);
  ledge.body.immovable = true;
  ledge.body.velocity.x = 100;

  walls = game.add.group();
  walls.enableBody = true;

  var wall = walls.create(0,0,'wall');
  wall.body.immovable = true;
  wall.scale.setTo(1,1.1);
  var wall = walls.create(950,0,'wall');
  wall.body.immovable = true;
  wall.scale.setTo(1,1.1);


  player = game.add.sprite(100, game.world.height - 200, 'dude');

  player.scale.setTo(1.6,1.5);

  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.2;
  player.body.gravity.y = 550;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [3,4], 10, true);
  player.animations.add('right', [0,1], 10, true);

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(10, 'bullet');
  bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);
  bullets.setAll('checkWorldBounds', true);

  foods = game.add.group();
  coffees = game.add.group();

  foods.enableBody = true;
  coffees.enableBody = true;

  game.time.events.repeat(2000, 10000, createStuffs, this);

  cursors = game.input.keyboard.createCursorKeys();
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

}

function update() {

  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.collide(foods, platforms);
  game.physics.arcade.collide(coffees, platforms);
  game.physics.arcade.collide(bullets, platforms);
  game.physics.arcade.collide(bullets, player);
  game.physics.arcade.collide(foods, walls);
  game.physics.arcade.collide(coffees, walls);

  game.physics.arcade.overlap(player, foods, gotFood, null, this);
  game.physics.arcade.overlap(player, coffees, gotCoffee, null, this);
  game.physics.arcade.overlap(platforms, walls, toggleDir, null, this);
  game.physics.arcade.overlap(bullets, walls, resetBullet, null, this);

  player.body.velocity.x = 0;

  if (cursors.left.isDown){
    player.body.velocity.x = -180;
    player.animations.play('left');
  }else if (cursors.right.isDown){
    player.body.velocity.x = 180;
    player.animations.play('right');
  }else{
    player.animations.stop();
    player.frame = 2;
  }
  if (cursors.up.isDown && player.body.touching.down){
    player.body.velocity.y = -500;
  }
  if (space.isDown){
    fireBullet();
  }

  var scale1 = foodbar.scale.x;
  if (scale1 > 0){
    foodbar.scale.setTo(scale1-0.0002,1);
  }else if (scale1 < 0.01){
    player.kill();
  }
  var scale2 = cafbar.scale.x;
  if (scale2 < 0){
    cafbar.scale.setTo(scale2-0.0002,1);
  }else if (scale2 < 0.01){
    player.kill();
  }
}

function gotFood (player, foods) {
  foods.kill();
  var scale = foodbar.scale.x;
  if (scale < 0.6){
    foodbar.scale.setTo(scale+0.01,1);
  }
}

function gotCoffee (player, coffees) {
  coffees.kill();
  var scale = cafbar.scale.x;
  if (scale < 0.6){
    cafbar.scale.setTo(scale+0.01,1);
  }
}

function fireBullet () {

  if (game.time.now > bulletTime){
    bullet = bullets.getFirstExists(false);
    if (bullet){
      bullet.reset(player.x + 6, player.y - 8);
      bullet.body.velocity.y = -200;
      bullet.body.velocity.x = (player.body.velocity.x*2);
      bullet.body.bounce.y = 0.2;
      bullet.body.bounce.x = 0.2;
      bullet.body.gravity.y = 400;
      bulletTime = game.time.now + 250;
    }
  }

}

function resetBullet (bullets, walls) {
  bullets.kill();
}

function createStuffs(){
  var star = foods.create(Math.random()*1000, -50, 'star');
  star.body.gravity.y = 350;
  star.body.bounce.y = 0.7 + Math.random() * 0.2;

  var coffee = coffees.create(Math.random()*1000, -50, 'coffee');
  coffee.body.gravity.y = 350;
  coffee.body.bounce.y = 0.7 + Math.random() * 0.2;
}

function toggleDir(ledge, wall){
  ledge.body.velocity.x *= (-1);
}
