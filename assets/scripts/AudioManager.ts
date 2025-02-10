import { _decorator, Component, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioClip)
    backgroundMusic: AudioClip = null!;

    @property
    private bgmVolume: number = 0.5;

    private bgmAudioSource: AudioSource | null = null;

    start() {
        this.bgmAudioSource = this.addComponent(AudioSource);
        
        if (this.bgmAudioSource) {
            this.bgmAudioSource.clip = this.backgroundMusic;
            this.bgmAudioSource.loop = true;  
            this.bgmAudioSource.volume = this.bgmVolume;
            this.bgmAudioSource.play();
        }
    }
    onEnable() {
        if (this.bgmAudioSource) {
            this.bgmAudioSource.play(); 
        }
    }
    onDisable() {
        if (this.bgmAudioSource) {
            this.bgmAudioSource.stop(); 
        }
    }
}