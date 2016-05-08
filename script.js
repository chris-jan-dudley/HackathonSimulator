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
  game.load.image('border', 'assets/border.png');
  game.load.image('other','assets/rival.png');
  game.load.bitmapFont('font', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');
  game.load.image('octocat','assets/octocat.png');
  game.load.image('floor','assets/plat2.png');
  game.load.audio('rivalD','assets/rivalD.wav');
  game.load.audio('shoot','assets/shoot.wav');
  game.load.audio('eat','assets/pacman.wav');
  game.load.audio('slurp','assets/slurp.wav');
  game.load.audio('end','assets/awesome.mp3');
}
var restarted = false;
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
var border;
var foodbar;
var cafbar;
var restartKey;
var rivals;
var text;
var apocalypse;
var octocat;
var octolife;
var endgame;
var rivalSound;
var shoot;
var eat;
var slurp;
var end;
var music;

function create() {
  worldCreate();
  playerGen();
  bulletGen();
  foodsgen();
  audioSetUp();
  makeRival();
  timerStart();
  cursorSet();
}

function update() {
  physicsSetup()
  keySetup()
  var scale1 = foodbar.scale.x;
  if (scale1 > 0.01){
    foodbar.scale.setTo(scale1-0.0003,1);
  }else if (scale1 < 0.01){
    player.destroy();
    text.visible = true;
  }

  var scale2 = cafbar.scale.x;
  if (scale2 > 0.01){
    cafbar.scale.setTo(scale2-0.0003,1);
  }else if (scale2 < 0.02){
    player.destroy();
    text.visible = true;
  }

  if (endgame){
    rivals.visible = false;
    var star = foods.create(500,250, 'star');
    star.body.gravity.y = 350;
    star.body.velocity.y = -500;
    star.body.velocity.x = game.rnd.integerInRange(-1, 1) * Math.random() * 100;
    star.body.bounce.y = 0.4 + Math.random() * 0.2;

    var coffee = coffees.create(500,250, 'coffee');
    coffee.body.gravity.y = 350;
    coffee.body.velocity.y = -100;
    coffee.body.velocity.x = game.rnd.integerInRange(-1, 1) * Math.random() * 100;
    coffee.body.bounce.y = 0.4 + Math.random() * 0.2;

    cafbar.scale.setTo(0.6,1);
    foodbar.scale.setTo(0.6,1);

  }

}

function cursorSet(){
  cursors = game.input.keyboard.createCursorKeys();
  space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);
  restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
}

function playerGen(){
  player = game.add.sprite(100, game.world.height - 200, 'dude');
  player.revive();
  player.scale.setTo(1.6,1.5);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 700;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [3,4], 10, true);
  player.animations.add('right', [0,1], 10, true);
}

function timerStart(){
  game.time.events.add(20000, bossBattle, this);
  game.time.events.repeat(1500, 10000, createStuffs, this);
  game.time.events.repeat(3000,2000,makeRival,this);
}

function audioSetUp(){
  rivalSound = game.add.audio('rivalD');
  rivalSound.volume = 0.1;
  rivalSound.allowMultiple = true;

  shoot = game.add.audio('shoot');
  shoot.volume = 0.1;
  shoot.allowMultiple = true;

  eat = game.add.audio('eat');
  eat.volume = 0.1;
  eat.allowMultiple = true;

  slurp = game.add.audio('slurp');
  slurp.volume = 0.1;
  slurp.allowMultiple = true;

  end = game.add.audio('end');
  end.volume = 0.4;
  end.allowMultiple = true;
}

function bulletGen(){
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(10, 'bullet');
  bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);
  bullets.setAll('checkWorldBounds', true);

}

function foodsgen(){
  foods = game.add.group();
  coffees = game.add.group();

  foods.enableBody = true;
  coffees.enableBody = true;
}

function worldCreate(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  bground = game.add.sprite(0, 0, 'bgrnd');

  foodbar = game.add.sprite(180,50,'foodbar');
  border = game.add.sprite(180,50,'border');
  foodbar.scale.setTo(0.5,1);
  var fblab = game.add.bitmapText(175, 15, 'font','HUNG-O-METER',18);
  fblab.tint = 0x00cc00;
  fblab.visible = true;

  cafbar = game.add.sprite(620,50,'cafbar');
  border = game.add.sprite(620,50,'border');
  cafbar.scale.setTo(0.5,1);
  var cflab = game.add.bitmapText(615, 15, 'font','CAFFEINATION',18);
  cflab.tint = 0xCC0000;
  cflab.visible = true;

  platforms = game.add.group();
  platforms.enableBody = true;

  var ground = platforms.create(0, game.world.height - 64, 'floor');
  ground.scale.setTo(3, 2);
  ground.body.immovable = true;

  var ledge = platforms.create(400, 400, 'ground');
  ledge.scale.setTo(0.7,0.9);
  ledge.body.immovable = true;
  ledge.body.velocity.x = 50;

  var ledge = platforms.create(100, 250, 'ground');
  ledge.scale.setTo(0.7,0.9);
  ledge.body.immovable = true;
  ledge.body.velocity.x = -80;

  var ledge = platforms.create(500, 100, 'ground');
  ledge.scale.setTo(0.7,0.9);
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

  text = game.add.bitmapText(110, 250, 'font','GAME OVER',75);
  text.tint = 0xb30000;
  text.visible = false;

  octolife = 20;
  endgame = false;

  rivals = game.add.group()
}

function gotFood (player, foods) {
  foods.kill();
  eat.play();
  var scale = foodbar.scale.x;
  if (scale < 0.6){
    foodbar.scale.setTo(scale+0.05,1);
  }

}

function rGotFood(rivals, foods){
  foods.kill();
}

function gotCoffee (player, coffees) {
  coffees.kill();
  var scale = cafbar.scale.x;
  if (scale < 0.6){
    cafbar.scale.setTo(scale+0.05,1);
  }
  slurp.play();
}

function rGotCoffee(rivals, coffees){
  coffees.kill();
}

function fireBullet () {
  if (game.time.now > bulletTime){
    bullet = bullets.getFirstExists(false);
    if (bullet){
      bullet.reset(player.x + 6, player.y - 8);
      bullet.body.velocity.y = -200;
      bullet.body.velocity.x = (player.body.velocity.x*2.5);
      bullet.body.bounce.y = 0.4;
      bullet.body.bounce.x = 0.4;
      bullet.body.gravity.y = 500;
      bulletTime = game.time.now + 250;
      shoot.play();
    }
  }
}

function resetBullet (bullets, walls) {
  bullets.kill();
}

function createStuffs(){
  var star = foods.create(Math.random()*1000, -50, 'star');
  star.body.gravity.y = 350;
  star.body.bounce.y = 0.4 + Math.random() * 0.2;

  var coffee = coffees.create(Math.random()*1000, -50, 'coffee');
  coffee.body.gravity.y = 350;
  coffee.body.bounce.y = 0.4 + Math.random() * 0.2;
}

function toggleDir(ledge, wall){
  ledge.body.velocity.x *= (-1);
}

function toggleDirR(rivals, wall){
  rivals.body.velocity.x *= (-1);
}

function killR(rivals, bullets){
  rivals.kill();
  bullets.kill();
  rivalSound.play();
}

function makeRival(){
  var xcord = Math.random();
  while(xcord<0.06 || xcord>0.94){
    xcord = Math.random();
  }
  var rival = rivals.create(xcord*1000,200,'other');
  game.physics.arcade.enable(rival);
  rival.body.bounce.y = 0.2;
  rival.body.gravity.y = 550;
  rival.body.collideWorldBounds = true;
  rival.body.velocity.x = 100;
}

function ouch(player,rivals){
  var scale = cafbar.scale.x;
  cafbar.scale.setTo(scale-0.005,1);
  var scale2 = foodbar.scale.x;
  foodbar.scale.setTo(scale2-0.005,1);
}

function playerOuch(player,octocats){
  var scale = cafbar.scale.x;
  cafbar.scale.setTo(scale-0.005,1);
  var scale2 = foodbar.scale.x;
  foodbar.scale.setTo(scale2-0.005,1);
}

function octOuch(octocat,bullets){
  bullets.kill();
  if (octolife > 1){
    octolife --;
    rivalSound.play();
  }else if (octolife === 1){
    octocat.visible = false;
    octocat.destroy();
    endgame = true;
    var text2 = game.add.bitmapText(90, 250, 'font','YOU WIN AALLLL\n  THE FOOD',55);
    text2.tint = 0x00cc00;
    text2.visible = true;
    end.play();
  }
}

function physicsSetup(){
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.collide(rivals, platforms);
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
  game.physics.arcade.overlap(rivals, foods, rGotFood, null, this);
  game.physics.arcade.overlap(rivals, coffees, rGotCoffee, null, this);
  game.physics.arcade.overlap(rivals, walls, toggleDirR, null, this);
  game.physics.arcade.overlap(rivals, bullets, killR, null, this);
  game.physics.arcade.overlap(player, rivals, ouch, null, this);
  game.physics.arcade.overlap(bullets, octocat, octOuch, null, this);
  game.physics.arcade.overlap(player, octocat, playerOuch, null, this);

  player.body.velocity.x = 0;

}

function keySetup(){
  if (cursors.left.isDown){
    player.body.velocity.x = -200;
    player.animations.play('left');
  }else if (cursors.right.isDown){
    player.body.velocity.x = 200;
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
  if (restartKey.isDown){
    restart();
  }
}

function bossBattle(){
  octocat = game.add.sprite(350,100,'octocat');
  octocat.scale.setTo(1.5,1.5);
  game.physics.arcade.enable(octocat);
  octocat.enableBody = true;
  octocat.body.velocity.y = 20;
  game.time.events.add(1000,octoTurnUp,this);
}

function octoTurnUp(){
  octocat.body.velocity.y = 20;
  game.time.events.add(2000,octoTurnDown,this);
}

function octoTurnDown(){
  octocat.body.velocity.y = -20;
  game.time.events.add(2000,octoTurnUp,this);
}
