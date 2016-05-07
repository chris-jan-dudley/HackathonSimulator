var game = new Phaser.Game(1920,1080 , Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});

function preload(){
  game.load.spritesheet('hacker',assets/hacker.png,100,100);
  game.load.image('floor',assets/floor.png);
  game.load.image('goldsmith',assets/goldsmith.png);
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
}

function update(){

}
