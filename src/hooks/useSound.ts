import { useCallback, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playChord(freqs: number[], duration: number, volume = 0.1) {
  for (const f of freqs) {
    playTone(f, duration, 'sine', volume);
  }
}

export function useSound() {
  const enabled = useThemeStore((s) => s.audio);
  const prevScoreRef = useRef(0);
  const prevComboRef = useRef(1);

  const playPlace = useCallback(() => {
    if (!enabled) return;
    playTone(440, 0.08, 'square', 0.08);
  }, [enabled]);

  const playClear = useCallback((linesCleared: number) => {
    if (!enabled) return;
    // ascending tones for clears
    const base = linesCleared >= 3 ? 660 : linesCleared === 2 ? 550 : 440;
    playChord([base, base * 1.25, base * 1.5], 0.25, 0.1);
    // shimmer on top
    setTimeout(() => {
      playTone(base * 2, 0.15, 'sine', 0.06);
    }, 80);
  }, [enabled]);

  const playCombo = useCallback((combo: number) => {
    if (!enabled) return;
    const base = 330 + combo * 55;
    playChord([base, base * 1.25], 0.15, 0.08);
  }, [enabled]);

  const playGameOver = useCallback(() => {
    if (!enabled) return;
    playTone(330, 0.3, 'sawtooth', 0.12);
    setTimeout(() => playTone(220, 0.4, 'sawtooth', 0.1), 200);
    setTimeout(() => playTone(165, 0.6, 'sawtooth', 0.08), 400);
  }, [enabled]);

  return { playPlace, playClear, playCombo, playGameOver };
}
