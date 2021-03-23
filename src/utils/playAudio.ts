const playAudio = (audio: HTMLAudioElement) => {
  audio.currentTime = 0;
  audio.volume = 0.5;
  audio.loop = false;
  audio.play();
};

export default playAudio;
