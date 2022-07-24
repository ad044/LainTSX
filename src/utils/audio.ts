import { Audio as ThreeAudio, AudioAnalyser, AudioListener } from "three";

export const playAudio = (filename: string, loop = false) => {
  const path = `/media/sfx/${filename}`;
  const audio = new Audio(path);

  audio.currentTime = 0;
  audio.volume = 0.5;
  audio.loop = loop;
  audio.play();

  return audio;
};

export const createAudioAnalyser = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;
  const listener = new AudioListener();
  const audio = new ThreeAudio(listener);

  audio.setMediaElementSource(mediaElement);

  return new AudioAnalyser(audio, 2048);
};
