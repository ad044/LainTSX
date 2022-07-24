export const playMediaElement = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;

  if (mediaElement && mediaElement.paused) mediaElement.play();
};

export const resetMediaElement = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;
  if (mediaElement) {
    mediaElement.pause();

    mediaElement.currentTime = 0;
  }
};
