import { _decorator, Component, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SquarePrefab')
export class SquarePrefab extends Component {
    @property
    private moveDirection: 'up' | 'down' | 'left' | 'right' = 'down';
    @property
    private moveDistance: number = 100; 
    @property
    private duration: number = 0.5; 

    private sprite: Sprite | null = null;
    private startPosition: Vec3 | null = null;

    start() {
        this.sprite = this.getComponent(Sprite);
        this.startPosition = this.node.position.clone(); 

        if (this.sprite) { 
            this.moveAndFade();
        }
    }

    moveAndFade() {
        const targetPosition = this.startPosition.clone();

        switch (this.moveDirection) {
            case 'up':
                targetPosition.y += this.moveDistance;
                break;
            case 'down':
                targetPosition.y -= this.moveDistance;
                break;
            case 'left':
                targetPosition.x -= this.moveDistance;
                break;
            case 'right':
                targetPosition.x += this.moveDistance;
                break;
        }

        const moveTween = tween(this.node)
            .to(this.duration, { position: targetPosition }) 
            .start();

        const fadeTween = tween(this.sprite.color)
            .to(this.duration, { a: 0 }) 
            .start();

        
        moveTween.call(() => {
            this.node.destroy();
        });
    }
}