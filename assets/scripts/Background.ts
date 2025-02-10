import { _decorator, Component, UITransform, view, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {
    @property
    private padding: number = 20;

    private r: number = 0;
    private g: number = 0;
    private b: number = 0;
    private currentPhase: 'r' | 'g' | 'b' | 'decrease' = 'r';
    private sprite: Sprite | null = null;
    private timer: number = 0;

    start() {
        this.padding = 20;
        this.setupSize();
        
        this.sprite = this.getComponent(Sprite);
        if (this.sprite) {
            this.sprite.color = new Color(0, 0, 0, 255);
        }
    }

    update(deltaTime: number) {
        this.timer += deltaTime;
        
        if (this.timer >= 0.5) {
            this.timer = 0; 
            this.updateColor();
        }
    }

    private updateColor() {
        if (!this.sprite) return;

        switch (this.currentPhase) {
            case 'r':
                if (this.r < 250) {
                    this.r+=2;
                } else {
                    this.currentPhase = 'g';
                }
                break;
            case 'g':
                if (this.g < 250) {
                    this.g+=2;
                } else {
                    this.currentPhase = 'b';
                }
                break;
            case 'b':
                if (this.b < 200) {
                    this.b+=2;
                } else {
                    this.currentPhase = 'decrease';
                }
                break;
            case 'decrease':
                if (this.b > 0) {
                    this.b-=2;
                }
                if (this.g > 0) {
                    this.g-=2;
                }
                if (this.r > 0) {
                    this.r-=2;
                }
                if (this.r === 0 && this.g === 0 && this.b === 0) {
                    this.currentPhase = 'r'; 
                }
                break;
        }
        this.sprite.color = new Color(this.r, this.g, this.b, 255);
    }

    private setupSize() {
        const screenSize = view.getVisibleSize();
        console.log(screenSize);

        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        transform.setContentSize(
            screenSize.width - (this.padding * 2),
            screenSize.height - (this.padding * 2)
        );
    }

    onResize() {
        this.setupSize();
    }
}