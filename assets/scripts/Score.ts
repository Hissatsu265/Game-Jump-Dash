import { _decorator, Component, Label, view, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('ClickCounter')
export class ClickCounter extends Component {
    private clickCount: number = 0; 
    private labelComponent: Label | null = null; 
  
    start() {
        const screenSize = view.getVisibleSize();
        const transform = this.node.getComponent(UITransform);
        
        transform.width = screenSize.width-100;
        transform.height = 500;
        this.node.setPosition(new Vec3(0, 200, 0));
        this.labelComponent = this.getComponent(Label);

        if (this.labelComponent) {
            this.labelComponent.string = '0';
        }
       
    }
    public updatescore(score:number){
        this.clickCount=score;
        this.labelComponent.string = `${this.clickCount}`;
    }
}
