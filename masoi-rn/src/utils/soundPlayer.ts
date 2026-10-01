import { createAudioPlayer } from 'expo-audio';

let soundPlayerInstance: ReturnType<typeof createAudioPlayer> | null = null;

/**
 * Plays the bell chime sound (rung-chuong.mp3) when a player wake-up call signal is received
 * Uses Expo SDK 57 modern expo-audio API
 */
export function playRungChuongSound() {
  try {
    if (!soundPlayerInstance) {
      soundPlayerInstance = createAudioPlayer(require('../../assets/rung-chuong.mp3'));
    }
    soundPlayerInstance.volume = 1.0;
    soundPlayerInstance.seekTo(0);
    soundPlayerInstance.play();
  } catch (error) {
    console.log('Error playing rung-chuong sound:', error);
  }
}
