import { _decorator, Component, Label, UITransform, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bestscore')
export class Bestscore extends Component {
    private labelComponent: Label | null = null; 
    start() {
        const screenSize = view.getVisibleSize();
        const transform = this.node.getComponent(UITransform);
        
        transform.width = screenSize.width-100;
        transform.height = 200;
        this.node.setPosition(new Vec3(screenSize.width/2-350, screenSize.height/2-100, 0));


        this.labelComponent = this.getComponent(Label);
        const highScore = localStorage.getItem('highScore');
        if (this.labelComponent) {
            if (!highScore) {
                this.labelComponent.string = `Best score: 0`;
                localStorage.setItem('highScore', '0');
            }else{
                this.labelComponent.string = `Best score: ${highScore}`;
            }
        }
    }
    public updateBestScore(score: number) {
        if (this.labelComponent) {
            this.labelComponent.string = `Best score: ${score}`;
        }
    }
    update(deltaTime: number) {

    }
}


