import { Howl, Howler } from 'howler';

/**
 * Sound manager for handling game audio using Howler.js
 */
class SoundManager {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.isMuted = false;
    this.isMusicMuted = false;
    this.volume = 0.7;
    this.musicVolume = 0.5;
    this.currentMusic = null;
  }

  /**
   * Initialize all game sounds
   */
  init() {
    // Only load the music.mp3 file that exists
    this.loadMusic('ambient', '/sounds/music.mp3', { volume: this.musicVolume, loop: true });
    
    // Create dummy sound objects with all necessary methods
    const createDummySound = () => ({
      play: () => -1,
      stop: () => {},
      volume: () => {},
      mute: () => {},
      fade: () => {},
      loop: () => {},
      rate: () => {},
      on: () => {},
      once: () => {}
    });
    
    // Create dummy sound objects for all sound effects
    const soundNames = [
      'typewriter', 'error', 'success', 'alert', 'warning', 'glitch',
      'uiOpen', 'uiClose', 'uiToggle', 'uiHover', 'uiClick',
      'levelUp', 'unlock', 'missionAccept', 'missionComplete', 'itemUse'
    ];
    
    this.sounds = {};
    soundNames.forEach(name => {
      this.sounds[name] = createDummySound();
    });
    
    console.log('Sound manager initialized with music only');
  }

  /**
   * Load a sound file
   * @param {string} id - Sound identifier
   * @param {string} src - Sound file path
   * @param {object} options - Howler options
   */
  loadSound(id, src, options = {}) {
    // Set default options
    const defaultOptions = {
      src: [src],
      volume: this.volume,
      preload: true,
      html5: false, // Better performance for short sounds
      pool: 1, // Number of simultaneous instances
    };
    
    // Merge options
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Create Howl instance
    this.sounds[id] = new Howl(mergedOptions);
    
    // Log loading error
    this.sounds[id].on('loaderror', (id, err) => {
      console.error(`Error loading sound ${id}:`, err);
    });
  }

  /**
   * Load a music file
   * @param {string} id - Music identifier
   * @param {string} src - Music file path
   * @param {object} options - Howler options
   */
  loadMusic(id, src, options = {}) {
    // Set default options
    const defaultOptions = {
      src: [src],
      volume: this.musicVolume,
      preload: true,
      html5: true, // Better for streaming longer files
      loop: true,
    };
    
    // Merge options
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Create Howl instance
    this.music[id] = new Howl(mergedOptions);
    
    // Log loading error
    this.music[id].on('loaderror', (id, err) => {
      console.error(`Error loading music ${id}:`, err);
    });
  }

  /**
   * Play a sound
   * @param {string} id - Sound identifier
   * @param {object} options - Play options
   * @returns {number} Sound ID or -1 if failed
   */
  playSound(id, options = {}) {
    if (this.isMuted || !this.sounds[id]) return -1;
    
    // Get the sound
    const sound = this.sounds[id];
    
    // Set volume if the method exists
    try {
      if (options.volume && typeof sound.volume === 'function') {
        sound.volume(options.volume);
      } else if (typeof sound.volume === 'function') {
        sound.volume(this.volume);
      }
    } catch (error) {
      console.log(`Could not set volume for sound ${id}:`, error);
    }
    
    // Play the sound
    try {
      const soundId = sound.play();
      
      // Apply options if methods exist
      try {
        if (options.loop && typeof sound.loop === 'function') sound.loop(options.loop, soundId);
        if (options.rate && typeof sound.rate === 'function') sound.rate(options.rate, soundId);
      } catch (optionError) {
        console.log(`Could not apply options to sound ${id}:`, optionError);
      }
      
      return soundId;
    } catch (err) {
      console.error(`Error playing sound ${id}:`, err);
      return -1;
    }
  }

  /**
   * Play music
   * @param {string} id - Music identifier
   * @param {object} options - Play options
   * @returns {number} Sound ID or -1 if failed
   */
  playMusic(id, options = {}) {
    if (this.isMusicMuted || !this.music[id]) return -1;
    
    // Stop current music if playing
    if (this.currentMusic && this.music[this.currentMusic] && 
        typeof this.music[this.currentMusic].playing === 'function' && 
        this.music[this.currentMusic].playing()) {
      this.stopMusic();
    }
    
    // Get the music
    const music = this.music[id];
    
    // Set volume if the method exists
    try {
      if (options.volume && typeof music.volume === 'function') {
        music.volume(options.volume);
      } else if (typeof music.volume === 'function') {
        music.volume(this.musicVolume);
      }
    } catch (error) {
      console.log(`Could not set volume for music ${id}:`, error);
    }
    
    // Play the music
    try {
      const musicId = music.play();
      this.currentMusic = id;
      
      // Apply options if methods exist
      try {
        if (options.loop !== undefined && typeof music.loop === 'function') {
          music.loop(options.loop, musicId);
        }
        if (options.rate && typeof music.rate === 'function') {
          music.rate(options.rate, musicId);
        }
      } catch (optionError) {
        console.log(`Could not apply options to music ${id}:`, optionError);
      }
      
      return musicId;
    } catch (err) {
      console.error(`Error playing music ${id}:`, err);
      return -1;
    }
  }

  /**
   * Stop a sound
   * @param {string} id - Sound identifier
   * @returns {void}
   */
  stopSound(id) {
    if (!this.sounds[id]) return;
    try {
      if (typeof this.sounds[id].stop === 'function') {
        this.sounds[id].stop();
      }
    } catch (error) {
      console.log(`Could not stop sound ${id}:`, error);
    }
  }

  /**
   * Stop current music
   * @returns {void}
   */
  stopMusic() {
    if (this.currentMusic && this.music[this.currentMusic]) {
      try {
        if (typeof this.music[this.currentMusic].stop === 'function') {
          this.music[this.currentMusic].stop();
        }
        this.currentMusic = null;
      } catch (error) {
        console.log('Could not stop music:', error);
        this.currentMusic = null;
      }
    }
  }

  /**
   * Fade out current music
   * @param {number} duration - Fade duration in milliseconds
   * @returns {void}
   */
  fadeOutMusic(duration = 1000) {
    if (this.currentMusic && this.music[this.currentMusic]) {
      try {
        const music = this.music[this.currentMusic];
        
        if (typeof music.volume !== 'function' || typeof music.fade !== 'function') {
          this.stopMusic();
          return;
        }
        
        const currentVolume = music.volume();
        
        music.fade(currentVolume, 0, duration);
        
        music.once('fade', () => {
          music.stop();
          music.volume(currentVolume);
          this.currentMusic = null;
        });
      } catch (error) {
        console.log('Could not fade out music:', error);
        this.stopMusic();
      }
    }
  }

  /**
   * Crossfade to new music
   * @param {string} id - New music identifier
   * @param {number} duration - Fade duration in milliseconds
   * @returns {void}
   */
  crossfadeMusic(id, duration = 1000) {
    if (!this.music[id]) return;
    
    try {
      // If music is already playing, fade it out
      if (this.currentMusic && this.music[this.currentMusic] && 
          typeof this.music[this.currentMusic].playing === 'function' && 
          this.music[this.currentMusic].playing()) {
        
        const currentMusic = this.music[this.currentMusic];
        
        if (typeof currentMusic.volume === 'function' && typeof currentMusic.fade === 'function') {
          const currentVolume = currentMusic.volume();
          
          // Fade out current music
          currentMusic.fade(currentVolume, 0, duration);
          
          currentMusic.once('fade', () => {
            currentMusic.stop();
            if (typeof currentMusic.volume === 'function') {
              currentMusic.volume(currentVolume);
            }
          });
        } else {
          // If fade methods don't exist, just stop the current music
          this.stopMusic();
        }
      }
      
      // Start new music at volume 0 and fade in
      const newMusic = this.music[id];
      
      if (typeof newMusic.volume === 'function' && typeof newMusic.fade === 'function') {
        newMusic.volume(0);
        const newMusicId = newMusic.play();
        newMusic.fade(0, this.musicVolume, duration, newMusicId);
      } else {
        // If fade methods don't exist, just play at normal volume
        newMusic.play();
      }
      
      this.currentMusic = id;
    } catch (error) {
      console.log('Error during crossfade:', error);
      // Fallback: stop current music and play new music
      this.stopMusic();
      this.playMusic(id);
    }
  }

  /**
   * Set the volume for all sounds
   * @param {number} level - Volume level (0-1)
   * @returns {void}
   */
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    
    // Update volume for all sounds that have a volume method
    Object.values(this.sounds).forEach(sound => {
      if (sound && typeof sound.volume === 'function') {
        sound.volume(this.volume);
      }
    });
  }

  /**
   * Set the volume for all music
   * @param {number} level - Volume level (0-1)
   * @returns {void}
   */
  setMusicVolume(level) {
    this.musicVolume = Math.max(0, Math.min(1, level));
    
    // Update volume for all music that have a volume method
    Object.values(this.music).forEach(music => {
      if (music && typeof music.volume === 'function') {
        music.volume(this.musicVolume);
      }
    });
  }

  /**
   * Toggle mute state for sounds
   * @returns {boolean} New mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    // Mute/unmute all sounds
    Howler.mute(this.isMuted);
    
    return this.isMuted;
  }

  /**
   * Toggle mute state for music only
   * @returns {boolean} New music mute state
   */
  toggleMusicMute() {
    this.isMusicMuted = !this.isMusicMuted;
    
    // Mute/unmute all music
    Object.values(this.music).forEach(music => {
      if (music && typeof music.mute === 'function') {
        music.mute(this.isMusicMuted);
      }
    });
    
    return this.isMusicMuted;
  }
}

// Create and export a singleton instance
const soundManager = new SoundManager();
export default soundManager;
