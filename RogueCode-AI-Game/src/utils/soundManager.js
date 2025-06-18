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
    // UI sounds
    this.loadSound('typewriter', '/sounds/typewriter.mp3', { volume: 0.3, pool: 5 });
    this.loadSound('error', '/sounds/error.wav', { volume: 0.5 });
    this.loadSound('success', '/sounds/success.wav', { volume: 0.5 });
    this.loadSound('alert', '/sounds/alert.wav', { volume: 0.6 });
    this.loadSound('warning', '/sounds/warning.wav', { volume: 0.6 });
    this.loadSound('glitch', '/sounds/glitch.mp3', { volume: 0.5 });
    
    // UI interaction sounds
    this.loadSound('uiOpen', '/sounds/ui_open.wav', { volume: 0.4 });
    this.loadSound('uiClose', '/sounds/ui_close.wav', { volume: 0.4 });
    this.loadSound('uiToggle', '/sounds/ui_toggle.wav', { volume: 0.4 });
    this.loadSound('uiHover', '/sounds/ui_hover.wav', { volume: 0.2 });
    this.loadSound('uiClick', '/sounds/ui_click.wav', { volume: 0.4 });
    
    // Game event sounds
    this.loadSound('levelUp', '/sounds/level_up.wav', { volume: 0.7 });
    this.loadSound('unlock', '/sounds/unlock.wav', { volume: 0.6 });
    this.loadSound('missionAccept', '/sounds/mission_accept.wav', { volume: 0.6 });
    this.loadSound('missionComplete', '/sounds/mission_complete.wav', { volume: 0.7 });
    this.loadSound('itemUse', '/sounds/item_use.wav', { volume: 0.5 });
    
    // Ambient music
    this.loadMusic('ambient', '/assets/audio/ambient.mp3', { volume: this.musicVolume, loop: true });
    this.loadMusic('hacking', '/assets/audio/hacking.mp3', { volume: this.musicVolume, loop: true });
    this.loadMusic('mission', '/assets/audio/mission.mp3', { volume: this.musicVolume, loop: true });
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
    
    // Set volume
    if (options.volume) {
      sound.volume(options.volume);
    } else {
      sound.volume(this.volume);
    }
    
    // Play the sound
    try {
      const soundId = sound.play();
      
      // Apply options
      if (options.loop) sound.loop(options.loop, soundId);
      if (options.rate) sound.rate(options.rate, soundId);
      
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
    if (this.currentMusic && this.music[this.currentMusic].playing()) {
      this.stopMusic();
    }
    
    // Get the music
    const music = this.music[id];
    
    // Set volume
    if (options.volume) {
      music.volume(options.volume);
    } else {
      music.volume(this.musicVolume);
    }
    
    // Play the music
    try {
      const musicId = music.play();
      this.currentMusic = id;
      
      // Apply options
      if (options.loop !== undefined) music.loop(options.loop, musicId);
      if (options.rate) music.rate(options.rate, musicId);
      
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
    this.sounds[id].stop();
  }

  /**
   * Stop current music
   * @returns {void}
   */
  stopMusic() {
    if (this.currentMusic && this.music[this.currentMusic]) {
      this.music[this.currentMusic].stop();
      this.currentMusic = null;
    }
  }

  /**
   * Fade out current music
   * @param {number} duration - Fade duration in milliseconds
   * @returns {void}
   */
  fadeOutMusic(duration = 1000) {
    if (this.currentMusic && this.music[this.currentMusic]) {
      const music = this.music[this.currentMusic];
      const currentVolume = music.volume();
      
      music.fade(currentVolume, 0, duration);
      
      music.once('fade', () => {
        music.stop();
        music.volume(currentVolume);
        this.currentMusic = null;
      });
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
    
    // If music is already playing, fade it out
    if (this.currentMusic && this.music[this.currentMusic].playing()) {
      const currentMusic = this.music[this.currentMusic];
      const currentVolume = currentMusic.volume();
      
      // Fade out current music
      currentMusic.fade(currentVolume, 0, duration);
      
      currentMusic.once('fade', () => {
        currentMusic.stop();
        currentMusic.volume(currentVolume);
      });
    }
    
    // Start new music at volume 0 and fade in
    const newMusic = this.music[id];
    newMusic.volume(0);
    const newMusicId = newMusic.play();
    newMusic.fade(0, this.musicVolume, duration, newMusicId);
    
    this.currentMusic = id;
  }

  /**
   * Set the volume for all sounds
   * @param {number} level - Volume level (0-1)
   * @returns {void}
   */
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    
    // Update volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.volume);
    });
  }

  /**
   * Set the volume for all music
   * @param {number} level - Volume level (0-1)
   * @returns {void}
   */
  setMusicVolume(level) {
    this.musicVolume = Math.max(0, Math.min(1, level));
    
    // Update volume for all music
    Object.values(this.music).forEach(music => {
      music.volume(this.musicVolume);
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
      music.mute(this.isMusicMuted);
    });
    
    return this.isMusicMuted;
  }
}

// Create and export a singleton instance
const soundManager = new SoundManager();
export default soundManager;
