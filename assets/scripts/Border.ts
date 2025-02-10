import { _decorator, Component, UITransform, view, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Border')
export class Border extends Component {
    start() {
        const screenSize = view.getVisibleSize();
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            return;
        }

        transform.setContentSize(screenSize.width, screenSize.height);
        console.log('border: ',screenSize);
        const widget = this.node.getComponent(Widget) || this.node.addComponent(Widget);
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;

        widget.updateAlignment();
    }

    onResize() {
        const screenSize = view.getVisibleSize();
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(screenSize.width, screenSize.height);
        }
    }
    
}