import { _decorator, Component, instantiate, Prefab, view } from 'cc';
import { Obstacle } from './Obstacle';
const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    @property(Prefab)
    obstaclePrefab: Prefab = null;

    @property
    private readonly MARGIN: number = 20;
    private spawnInterval: number = 0.95; 
    private currentspeed: number = 600; 
    private timer: number = 0; 
    private positions = [-view.getVisibleSize().width / 2+this.MARGIN, 
        -view.getVisibleSize().width / 2+this.MARGIN, 
        -view.getVisibleSize().width / 2+this.MARGIN, 
        view.getVisibleSize().width / 2-this.MARGIN, 
        100,
        150, 
        200,
        250];
    private isStop:Boolean=false
    start() {
        this.spawnInterval=0.8;
        this.timer = this.spawnInterval; 
        this.scheduleOnce(() => {
            this.schedule(() => {
                this.currentspeed+=10;
            }, 10);
        }, 0);
    }

    update(deltaTime: number) {
        this.timer -= deltaTime;
        if (this.timer <= 0 && !this.isStop) {
            this.spawnObstacle();
            this.timer = this.spawnInterval; 
        }
    }

    private spawnObstacle() {
        const obstacle = instantiate(this.obstaclePrefab);
        const randomX = this.positions[Math.floor(Math.random() * this.positions.length)]; 

        const obstacleComponent = obstacle.getComponent(Obstacle);
        if (obstacleComponent) {
            obstacleComponent.setFallSpeed(this.currentspeed);
        }
        obstacle.setPosition(randomX, 1000, 0); 
        this.node.addChild(obstacle);
    }
    protected onDisable(): void {
        this.isStop=true;
    }
    protected onEnable(): void {
        this.isStop=false;
    }
}