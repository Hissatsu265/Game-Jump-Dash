import { _decorator, AudioClip, AudioSource, Button, Component, Node, RigidBody2D, tween, Vec2, Vec3 } from 'cc';
import { Ball } from './Ball';
import { ClickCounter } from './Score';

const { ccclass, property } = _decorator;

@ccclass('Screen_manager')
export class Screen_manager extends Component {
    @property(Node)
    startScreen: Node = null!;

    @property(Node)
    BackgroundMusic: Node = null!;

    @property(Node)
    gameoverScreen: Node = null!;
    
    @property(Node)
    gameContent: Node = null!;

    @property(Button)
    startButton: Button = null!;

    @property(Button)
    restartButton: Button = null!;
    
    @property(Button)
    watchAdButton: Button = null!;

    @property(Node)
    ball: Node = null!;
    @property(Node)
    LabelScore: Node = null!;

    @property(AudioClip)
    backgroundMusic: AudioClip = null!;
    
    private isGameOver: boolean = false;
    private ballRigidbody: RigidBody2D | null = null;
    private bgmAudioSource: AudioSource | null = null;
    start() {
        if (this.ball) {
            this.ballRigidbody = this.ball.getComponent(RigidBody2D);
        }
        this.initializeGame();
        this.setupEventListeners();
    }

    private initializeGame() {
        this.startScreen.active = true;
        this.fadeInNode(this.startScreen);
        this.gameoverScreen.active = false;
        this.gameContent.active = false;
        this.BackgroundMusic.active=false;
        this.isGameOver = false;
        this.bgmAudioSource = this.addComponent(AudioSource);
        
        if (this.bgmAudioSource) {
            this.bgmAudioSource.clip = this.backgroundMusic;
            this.bgmAudioSource.loop = false;  
            this.bgmAudioSource.volume = 0.8;
        }
    }

    private setupEventListeners() {
        this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
        this.restartButton.node.on(Button.EventType.CLICK, this.onRestartGame, this);
        this.watchAdButton.node.on(Button.EventType.CLICK, this.onWatchAd, this);

        if (this.ball) {
            this.ball.on(Ball.BALL_COLLISION_EVENT, this.onBallCollision, this);
        }
    }
 
    private handleGameOver() {
        if (this.ballRigidbody) {
            this.ballRigidbody.linearVelocity = new Vec2(0, 0);
        }
        this.bgmAudioSource.play(); 

        this.gameoverScreen.active = true;
        this.fadeInNode(this.gameoverScreen);
        this.scheduleOnce(() => {
            if (!this.isGameOver) return;
            this.gameContent.active = false;
            this.BackgroundMusic.active=false;
        }, 0.2);
    }
    onBallCollision(event: any) {
        if (!this.isGameOver) {
            console.log('Game Over');
            this.isGameOver = true;
            this.handleGameOver()
        }
    }

    onStartGame() {
        if (this.ballRigidbody) {
            this.ballRigidbody.enabled = true;
        }
        this.fadeOutNode(this.startScreen, () => {
            this.BackgroundMusic.active=true;
            this.gameContent.active = true;
            this.fadeInNode(this.gameContent);
        });
    }

    onRestartGame() {
        this.isGameOver=false;
        this.fadeOutNode(this.gameoverScreen, () => {
            this.gameContent.active = true;
            this.BackgroundMusic.active=true;
            this.fadeInNode(this.gameContent);
            
            if (this.ballRigidbody) {
                this.ballRigidbody.enabled = true;
            }
            
            const ballComponent = this.ball.getComponent(Ball);
            if (ballComponent) {
                ballComponent.updatescoreafterrestart();
            }
            
            const scorelabel = this.LabelScore.getComponent(ClickCounter);
            if (scorelabel) {
                scorelabel.updatescore(0);
            }
        });
    }

    onWatchAd() {
        console.log('Watching Ad...');
        this.isGameOver=false;
        this.fadeOutNode(this.gameoverScreen, () => {
            this.gameContent.active = true;
            this.BackgroundMusic.active=true;
            this.fadeInNode(this.gameContent);
            
            if (this.ballRigidbody) {
                this.ballRigidbody.enabled = true;
            }
        });
    }

    onDestroy() {
        this.startButton.node.off(Button.EventType.CLICK, this.onStartGame, this);
        this.restartButton.node.off(Button.EventType.CLICK, this.onRestartGame, this);
        this.watchAdButton.node.off(Button.EventType.CLICK, this.onWatchAd, this);
        
        if (this.ball) {
            this.ball.off(Ball.BALL_COLLISION_EVENT, this.onBallCollision, this);
        }
    }
    private fadeInNode(node: Node, duration: number = 0.3) {
        node.setScale(new Vec3(0.8, 0.8, 1));
        tween(node)
            .parallel(
                tween().to(duration, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }),
                tween().to(duration, { opacity: 255 })
            )
            .start();
    }
    private fadeOutNode(node: Node, onComplete?: () => void, duration: number = 0.3) {
        tween(node)
            .parallel(
                tween().to(duration, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'backIn' }),
                tween().to(duration, { opacity: 0 })
            )
            .call(() => {
                node.active = false;
                if (onComplete) onComplete();
            })
            .start();
    }
}

