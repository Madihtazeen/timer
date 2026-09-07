// Web Audio API gentle synthesizer for timer completion
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio API not supported or blocked:', e);
    return null;
  }
}

export function playTimerCompletionChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Gentle bell harmonics: C5 (523.25 Hz) then G5 (783.99 Hz) then C6 (1046.5 Hz)
  const notes = [
    { freq: 523.25, time: 0, duration: 0.8, gain: 0.15 },
    { freq: 659.25, time: 0.15, duration: 0.8, gain: 0.18 },
    { freq: 783.99, time: 0.3, duration: 1.2, gain: 0.22 },
  ];

  notes.forEach(({ freq, time, duration, gain: peakGain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + time);

    // Warm soft attack and exponential smooth fade
    gainNode.gain.setValueAtTime(0.0001, now + time);
    gainNode.gain.exponentialRampToValueAtTime(peakGain, now + time + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + duration);
  });
}
