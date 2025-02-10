import { _decorator, Component, Node, v3, view, tween, UITransform, Collider2D, Contact2DType, CircleCollider2D, input, Input, Prefab, instantiate, find, AudioClip, AudioSource } from 'cc';
import { Bestscore } from './Bestscore';
import { ClickCounter } from './Score';

const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property({type: Prefab})
    private bestScorePrefab: Prefab | null = null;

    @property(Node)
    LabelScore: Node = null!;
    
    @property(AudioClip)
    backgroundMusic: AudioClip = null!;

    private bestScoreInstance: Node | null = null;

    @property
    private speed_ball: number = 1400;
    private score:number =0;
    private isRightEdge: boolean = true; 
    private isMoving: boolean = false;
    private readonly MARGIN: number = 20; 
    public static readonly BALL_COLLISION_EVENT = 'ball-collision';
    private x_position:number=0.1;
    private bgmAudioSource: AudioSource | null = null;
    
    start() {

        this.spawnBestScore();
        this.score=0;
        this.speed_ball = 1400;
        const canvasWidth = view.getVisibleSize().width;
        const ballWidth = this.node.getComponent(UITransform).contentSize.width;
        this.x_position=canvasWidth / 2 - ballWidth / 2 - this.MARGIN;
        this.node.setPosition(this.x_position, -200, 0);
        
        input.on(Input.EventType.MOUSE_DOWN, this.onClick, this);
        this.scheduleOnce(() => {
            this.schedule(() => {
                this.speed_ball += 100;
            }, 10);
        }, 0);

        const collider = this.getComponent(CircleCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this.bgmAudioSource = this.addComponent(AudioSource);
        
        if (this.bgmAudioSource) {
            this.bgmAudioSource.clip = this.backgroundMusic;
            this.bgmAudioSource.loop = false;  
            this.bgmAudioSource.volume = 0.8;
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const highScore = parseInt(localStorage.getItem('highScore'));
        if (!highScore) {
            localStorage.setItem('highScore', this.score.toString());
        }else{
            if (highScore<this.score){
                 localStorage.setItem('highScore', this.score.toString());
                 this.updateScore(this.score);
            }
        }
        this.node.emit(Ball.BALL_COLLISION_EVENT, {
            selfCollider,
            otherCollider
        });
    }

    onClick() {
        if (this.isMoving) return;
        console.log('1');
        const canvasWidth = view.getVisibleSize().width;
        const ballWidth = this.node.getComponent(UITransform).contentSize.width;
        
        const targetX = this.isRightEdge 
            ? -canvasWidth / 2 + ballWidth / 2 + this.MARGIN  
            : canvasWidth / 2 - ballWidth / 2 - this.MARGIN;  

        if (this.isRightEdge || this.node.position.x <= -canvasWidth / 2 + ballWidth / 2 + this.MARGIN) {
            this.isMoving = true; 
            const distance = Math.abs(this.node.position.x - targetX);        
            const duration = distance / this.speed_ball; 
            this.score++;
            const scorelabel = this.LabelScore.getComponent(ClickCounter);
            scorelabel.updatescore(this.score);
            tween(this.node)
                .to(duration, { position: v3(targetX, this.node.position.y, this.node.position.z) })
                .call(() => {
                    this.isMoving = false; 
                    this.isRightEdge = !this.isRightEdge;
                    this.bgmAudioSource.play();
                })
                .start();
        }
    }
    private spawnBestScore() {
        if (this.bestScorePrefab) {
            this.bestScoreInstance = instantiate(this.bestScorePrefab);
            const canvas = find('Canvas');
            if (canvas) {
                canvas.addChild(this.bestScoreInstance);
            } else {
                console.error('Canvas not found');
            }
        }
    }
    public updateScore(score: number) {
        if (this.bestScoreInstance) {
            const bestScoreComponent = this.bestScoreInstance.getComponent(Bestscore);
            if (bestScoreComponent) {
                bestScoreComponent.updateBestScore(score);
            }
        }
    }
    public updatescoreafterrestart(){
        this.score=0;
    }
    onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.onClick, this); 
    }
    protected onEnable(): void {
        this.isMoving=false;
        this.isRightEdge=true;
        this.node.setPosition(this.x_position, -200, 0);
    }

}