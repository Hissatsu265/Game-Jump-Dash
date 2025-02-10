import { _decorator, Component,  UITransform, view, BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {
    @property
    private fall_Speed: number = 500; 
    @property
    private width: number = 90; 
    private height: number = 90; 

    private isFalling: boolean = true; 

    start() {
        const canvasWidth = view.getVisibleSize().width; 
        const adjustedWidth = canvasWidth - 300;
        const possibleWidths = [90, 150, 250, adjustedWidth];    
        this.width = possibleWidths[Math.floor(Math.random() * possibleWidths.length)];
        this.height = 90; 
        const transform = this.node.getComponent(UITransform);

        transform.width = this.width;
        transform.height = this.height;
        
        const collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.size.width = this.width; 
            collider.size.height = this.height;
        }

    }

    setFallSpeed(speed: number) {
        this.fall_Speed = speed;
    }

    update(deltaTime: number) {

        if (this.isFalling) {
            this.node.setPosition(this.node.position.x, this.node.position.y - this.fall_Speed * deltaTime, this.node.position.z);
            if (this.node.position.y < -1000) { 
                this.node.destroy(); 
            }
        }
    }
    onDisable() {
        this.node.destroy(); 
    }
}
