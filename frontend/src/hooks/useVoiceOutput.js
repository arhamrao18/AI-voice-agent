import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Voice out" — playback ONLY.
 *
 * This hook does not generate any speech itself. It exists purely to play
 * whatever audio the backend (n8n -> OpenAI TTS) already generated and
 * returned as `response.audio` (base64 mp3). No browser SpeechSynthesis,
 * no client-side text-to-speech fallback — if the backend doesn't send
 * audio, nothing is spoken. All "brains" (STT, LLM, TTS) live in n8n;
 * the frontend is a dumb capture/playback surface, by design.
 *
 * Pairs with `useVoiceInput`, which only captures the user's raw speech
 * for the backend to transcribe/interpret.
 */
export function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = typeof Audio !== "undefined" ? new Audio() : null;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsSpeaking(false);
  }, []);

  /** Play base64-encoded mp3 audio exactly as received from the backend. */
  const playAudio = useCallback(
    (base64Audio) => {
      if (!base64Audio || !audioRef.current) return false;
      stop();
      audioRef.current.src = `data:audio/wav;base64,${base64Audio}`;
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => setIsSpeaking(false);
      audioRef.current.onerror = () => setIsSpeaking(false);
      audioRef.current.play().catch(() => setIsSpeaking(false));
      return true;
    },
    [stop]
  );

  return { isSpeaking, playAudio, stop };
}
