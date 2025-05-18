// Audio manager for game sounds
class AudioManager {
    constructor() {
        // Create audio context for better sound management
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds = {
            buttonClick: {
                url: 'sounds/click.mp3',
                buffer: null,
                volume: 0.4
            },
            correct: {
                url: 'sounds/correct.mp3',
                buffer: null,
                volume: 0.5
            },
            wrong: {
                url: 'sounds/wrong.mp3',
                buffer: null,
                volume: 0.4
            },
            hint: {
                url: 'sounds/hint.mp3',
                buffer: null,
                volume: 0.3
            },
            levelComplete: {
                url: 'sounds/level-complete.mp3',
                buffer: null,
                volume: 0.6
            }
        };

        this.isMuted = false;
        this.initSoundToggle();
        this.loadSounds();
    }

    async loadSounds() {
        const soundPromises = Object.entries(this.sounds).map(async ([name, sound]) => {
            try {
                const response = await fetch(sound.url);
                const arrayBuffer = await response.arrayBuffer();
                sound.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.log(`Failed to load sound ${name}:`, error);
                this.useFallbackSound(name);
            }
        });

        await Promise.all(soundPromises);
    }

    useFallbackSound(soundName) {
        const sound = this.sounds[soundName];
        
        // Create oscillator-based sounds as fallbacks
        switch(soundName) {
            case 'buttonClick':
                sound.fallback = () => this.createClickSound();
                break;
            case 'correct':
                sound.fallback = () => this.createCorrectSound();
                break;
            case 'wrong':
                sound.fallback = () => this.createWrongSound();
                break;
            case 'hint':
                sound.fallback = () => this.createHintSound();
                break;
            case 'levelComplete':
                sound.fallback = () => this.createLevelCompleteSound();
                break;
        }
    }

    createClickSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    createCorrectSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    createWrongSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(280, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    createHintSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    createLevelCompleteSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.6);
    }

    initSoundToggle() {
        const soundToggle = document.getElementById('sound-toggle');
        
        // Load muted state from localStorage
        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.updateMuteState();

        soundToggle.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            localStorage.setItem('isMuted', this.isMuted);
            this.updateMuteState();
            
            // Resume audio context on user interaction
            if (!this.isMuted && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Play test sound when unmuting
            if (!this.isMuted) {
                this.play('buttonClick');
            }
        });
    }

    updateMuteState() {
        const soundToggle = document.getElementById('sound-toggle');
        if (this.isMuted) {
            soundToggle.classList.add('muted');
        } else {
            soundToggle.classList.remove('muted');
        }
    }

    play(soundName) {
        if (this.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (!sound) return;

        // Resume audio context if it's suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (sound.buffer) {
            // Play loaded sound
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = sound.buffer;
            gainNode.gain.value = sound.volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start();
        } else if (sound.fallback) {
            // Use fallback sound if buffer isn't loaded
            sound.fallback();
        }
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Function to create base64 audio elements if files are not available
function createFallbackSounds() {
    // Short click sound (base64 encoded)
    const clickSound = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFbgCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVukyWjYgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    
    // Correct answer sound
    const correctSound = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFbgCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVuhI+MDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    
    // Wrong answer sound
    const wrongSound = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFbgCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAQVugyWjYgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';

    // Create audio elements with base64 data
    audioManager.sounds.buttonClick.src = clickSound;
    audioManager.sounds.correct.src = correctSound;
    audioManager.sounds.wrong.src = wrongSound;
    audioManager.sounds.hint.src = clickSound;
    audioManager.sounds.levelComplete.src = correctSound;
}

// Call this function to ensure we have fallback sounds
createFallbackSounds(); 