import React from "react";
import ReactPlayer from "react-player";
import test from "../../static/movie/test.webm";

const MediaPlayer = () => {
  return (
    <ReactPlayer
      className="react-player"
      controls={true}
      url={[{ src: test, type: "video/webm" }]}
    />
  );
};

export default MediaPlayer;
