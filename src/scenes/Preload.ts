import { Scene } from 'phaser';

export class Preload extends Scene
{

    constructor ()
    {
        super('Preload');
    }
    
    preoad()
    {
        this.load.image('sky', 'assets/sky.png');
    }

    create() {
        this.add.image(400, 300, 'sky');
    }

}
