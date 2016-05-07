function Player(game) {
	this.game = game;
	this.sprite = null;
}

Player.prototype.initialize = function initialize() {
	this.sprite = this.game.add.sprite(game.world.width / 2, game.world.height - 150, 'hacker');
	this.game.physics.arcade.enable(this.sprite);

	this.sprite.body.gravity.y = 1000;
	this.sprite.body.collideWorldBounds = true;

	this.sprite.animations.add('dude', [0, 1, 2, 3], 3, true);
	this.sprite.animations.play('dude');
};

Player.prototype.move = function move(dirSpd) {
	this.sprite.body.velocity.x = dirSpd;
};

Player.prototype.jump = function jump() {
	this.sprite.body.velocity.y = -500;
};



};
