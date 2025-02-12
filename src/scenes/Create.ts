import { Scene } from 'phaser';
import { CONST } from '../const/const';

export class Create extends Scene
{

    constructor ()
    {
        super('Create');
    }

    create()
    {
        //add imgs
        this.add.image(400, 300, 'sky');

        //create platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        //add player
        CONST.player = this.physics.add.sprite(100, 450, 'dude');
        CONST.player.setBounce(0.2);
        CONST.player.setCollideWorldBounds(true);

        //animate going left
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //animate turn around
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        //animate going right
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //add stars
        CONST.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        //make stars bounce 
        CONST.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        //stars and player collides with ground
        this.physics.add.collider(CONST.player, platforms);
        this.physics.add.collider(CONST.stars, platforms);

        //collect stars
        this.physics.add.overlap(CONST.player, CONST.stars, this.collectStar, null, this);

        //add score text
        CONST.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //add bombs
        CONST.bombs = this.physics.add.group();
        this.physics.add.collider(CONST.bombs, platforms);
        this.physics.add.collider(CONST.player, CONST.bombs, this.hitBomb, null, this);
    
    }

    //when hit the bomb
    private hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        CONST.gameOver = true;
    }

    //when collect star
    private collectStar (player, star)
    {
        star.disableBody(true, true);

        CONST.score += 10;
        CONST.scoreText.setText('Score: ' + CONST.score);

        //bomb add logic
        if (CONST.stars.countActive(true) === 0)
        {
            CONST.stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
        
            });
        
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        
            let bomb = CONST.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        
        }
    }

    update()
    {
        let cursors = this.input.keyboard.createCursorKeys();

        //left key
        if (cursors.left.isDown)
        {
            CONST.player.setVelocityX(-160);
            
            CONST.player.anims.play('left', true);
        }
        //right key
        else if (cursors.right.isDown)
        {
            CONST.player.setVelocityX(160);
            
            CONST.player.anims.play('right', true);
        }
        else
        {
            CONST.player.setVelocityX(0);
            
            CONST.player.anims.play('turn');
        }
                
        //jump
        if (cursors.up.isDown && CONST.player.body.touching.down)
        {
            CONST.player.setVelocityY(-330);
        }
    }

}
