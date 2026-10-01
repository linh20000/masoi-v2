import { createAudioPlayer } from 'expo-audio';

const DASHBOARD_TRACKS = [
  require('../../assets/dashboard-1.mp3'),
  require('../../assets/dashboard-2.mp3'),
  require('../../assets/dashboard-3.mp3'),
  require('../../assets/dashboard-4.mp3'),
];

/**
 * Background Music (BGM) Random Track & Smooth Fade-In Manager
 * Randomly selects one of dashboard-1..4.mp3 tracks on dashboard load,
 * smoothly fading in volume from 0.0 to target volume.
 */
class BGMPlayer {
  private player: ReturnType<typeof createAudioPlayer> | null = null;
  private currentTrackIndex: number = -1;
  private fadeInterval: any = null;
  private targetVolume: number = 0.6;
  private isPlaying: boolean = false;

  public async startDashboardBGM(targetVol: number = 0.6) {
    if (this.isPlaying) return;
    this.targetVolume = targetVol;
    this.isPlaying = true;

    // Pick a random track index when entering dashboard
    this.currentTrackIndex = Math.floor(Math.random() * DASHBOARD_TRACKS.length);
    this.playTrack(this.currentTrackIndex, true);
  }

  private getRandomNextIndex(): number {
    if (DASHBOARD_TRACKS.length <= 1) return 0;
    let nextIndex = this.currentTrackIndex;
    while (nextIndex === this.currentTrackIndex) {
      nextIndex = Math.floor(Math.random() * DASHBOARD_TRACKS.length);
    }
    return nextIndex;
  }

  private playTrack(index: number, fadeIn: boolean = true) {
    try {
      this.stopFade();
      if (this.player) {
        this.player.remove();
        this.player = null;
      }

      if (!this.isPlaying) return;

      this.currentTrackIndex = index;
      const trackAsset = DASHBOARD_TRACKS[this.currentTrackIndex % DASHBOARD_TRACKS.length];
      const initialVolume = fadeIn ? 0.0 : this.targetVolume;

      this.player = createAudioPlayer(trackAsset);
      this.player.volume = initialVolume;
      this.player.loop = true;
      this.player.play();

      if (fadeIn) {
        this.fadeIn(this.targetVolume);
      }
    } catch (err) {
      console.log('Error playing dashboard BGM:', err);
    }
  }

  private fadeIn(finalVolume: number) {
    let currentVol = 0.0;
    const step = finalVolume / 25; // 25 steps over 2.5s (100ms per step)
    this.fadeInterval = setInterval(() => {
      currentVol += step;
      if (currentVol >= finalVolume) {
        currentVol = finalVolume;
        if (this.player) {
          this.player.volume = finalVolume;
        }
        this.stopFade();
      } else {
        if (this.player) {
          this.player.volume = currentVol;
        }
      }
    }, 100);
  }

  private stopFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  public stopBGM() {
    this.isPlaying = false;
    this.stopFade();
    if (this.player) {
      this.player.remove();
      this.player = null;
    }
  }
}

export const bgmPlayer = new BGMPlayer();
