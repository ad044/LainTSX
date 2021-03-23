import * as THREE from "three";

const createAudioAnalyser = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;
  const listener = new THREE.AudioListener();
  const audio = new THREE.Audio(listener);

  audio.setMediaElementSource(mediaElement);

  return new THREE.AudioAnalyser(audio, 2048);
};

export default createAudioAnalyser;
