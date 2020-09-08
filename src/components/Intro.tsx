import React, { useEffect, useState, useCallback } from "react";

import networkLogo from "../static/img/network_os_logo.png";
import introBox from "../static/img/load_screen_box.png";
import introTextBetween from "../static/img/intro_text_thing.png";
import introTextArrow from "../static/img/intro_text_arrow.png";
import mask from "../static/img/load_screen_mask.png";
import loop from "../static/img/loop.webp";

import "../static/css/intro.css";

// yes this thing is a mess ITS SUPPOSED TO BE MESSY OK
const FirstMarq: React.FC = () => {
  return (
    <>
      connect : Looking up host <br />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;tachibana.cos
      <br />
      connect : Contacting host <br />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;allen.la <br />
      connect : host tachibana.cos <br /> contacted Waiting for reply <br />
      Socket 172 connection with port <br /> number 2105 established <br />
      Transfer Data from tachibana.cos <br />
      Remote host closed socket
      <br />
      connect : Looking up host <br />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;tachibana.cos
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;allen.la <br />
      connect : host tachibana.cos <br /> contacted Waiting for reply <br />
      connect : Contacting host <br />
      Remote host closed socket Transfer Data from tachibana.cos <br />
      Socket 172 connection with port <br /> number 2105 established <br />
      connect : Looking up host <br />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;tachibana.cos
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;allen.la <br />
      connect : host tachibana.cos <br /> contacted Waiting for reply <br />
      connect : Contacting host <br />
      Remote host closed socket connect : host tachibana.cos <br /> contacted
      Waiting for reply <br />
      connect : Contacting host <br />
      Transfer Data from tachibana.cos <br />
      Socket 172 connection with port <br /> number 2105 established <br />
    </>
  );
};

type IntroProps = {
  setMoveToGame: React.Dispatch<React.SetStateAction<boolean>>;
};

const Intro = (props: IntroProps) => {
  const [looping, setLooping] = useState(true);
  const [isArrowUp, setIsArrowUp] = useState(true);

  const [loadStatusState, setLoadStatusState] = useState(<></>);

  const [introFinished, setIntroFinished] = useState(false);

  const [delayedMarqShown, setDelayedMarqShown] = useState(false);

  const [authorizeActive, setAuthorizeActive] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLooping(false);
    }, 1500);

    setTimeout(() => {
      setLoadStatusState(
        <>
          <div className="connect-container">connect : </div>
          <div className="host-container">
            host tachibana.cos <br /> contacted Waiting for reply
          </div>
        </>
      );
    }, 2500);

    setTimeout(() => {
      setLoadStatusState(
        <>
          Socket 172 connection with port <br /> number 2105 established
        </>
      );
    }, 4500);

    setTimeout(() => {
      setLoadStatusState(<>Transfer Data from tachibana.cos</>);
    }, 6500);

    setTimeout(() => {
      setLoadStatusState(<>Remote host closed socket</>);
    }, 8500);

    setTimeout(() => {
      setIntroFinished(true);
    }, 9500);
    //9500

    setTimeout(() => {
      setDelayedMarqShown(true);
    }, 11900);
    //11900
  }, []);

  useEffect(() => {
    const toggleArrowPos = () => {
      if (Math.random() >= 0.5) setIsArrowUp(!isArrowUp);
    };

    const toggleServerText = () => {
      if (Math.random() >= 0.3)
        setLoadStatusState(
          <>
            <div className="connect-container">connect : </div>
            <div className="host-container">
              Looking up host <br />
              tachibana.cos
            </div>
          </>
        );

      if (Math.random() >= 0.95)
        setLoadStatusState(
          <>
            <div className="connect-container">connect : </div>
            <div className="host-container">
              Contacting host <br /> allen.lab
            </div>
          </>
        );
    };

    const textInterval = setInterval(() => {
      toggleArrowPos();
      toggleServerText();
    }, 50);

    return () => clearInterval(textInterval);
  }, [loadStatusState, isArrowUp]);

  const handleUserKeyPress = useCallback(
    (event) => {
      const { _, keyCode } = event;

      if (keyCode === 40 || keyCode === 38) {
        setAuthorizeActive(!authorizeActive);
      }
      if (keyCode === 13) {
        props.setMoveToGame(true);
      }
    },
    [authorizeActive]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <>
      <p
        className={
          introFinished
            ? "first-marquee-text animate-text-marquee-first"
            : "hidden"
        }
      >
        <FirstMarq />
      </p>
      <p
        className={
          delayedMarqShown
            ? "first-marquee-text animate-text-marquee-first"
            : "hidden"
        }
      >
        <FirstMarq />
      </p>
      <div
        className={
          introFinished
            ? "second-marquee-text animate-text-marquee-second"
            : "hidden"
        }
      ></div>
      <div
        className={
          delayedMarqShown
            ? "second-marquee-text animate-text-marquee-second"
            : "hidden"
        }
      ></div>
      {looping ? (
        <div className="intro-loop">
          <img alt="loop" src={loop}></img>
          <p>
            make
            <br />
            me
            <br />
            sad
          </p>
        </div>
      ) : (
        <>
          <div className={introFinished ? "hidden-fade-out-05s mask" : "mask"}>
            <img alt="mask" src={mask} />
          </div>
          <div className="intro-load-screen">
            <img
              className={
                introFinished ? "animate-to-top-right-1s logo" : "logo"
              }
              alt="logo"
              src={networkLogo}
            ></img>
            <h1 className={introFinished ? "authorize" : "hidden"}>
              <span className={authorizeActive ? "active" : ""}>
                Authorize User
              </span>
            </h1>
            <img
              className={introFinished ? "animate-to-middle-1s box" : "box"}
              alt="box"
              src={introBox}
            ></img>
            <h1 className={introFinished ? "load" : "hidden"}>
              <span className={authorizeActive ? "" : "active"}>Load Data</span>
            </h1>
            <div
              className={
                introFinished ? "hidden-fade-out-05s" : "box-background"
              }
            ></div>
            <div
              className={
                introFinished
                  ? "text-container-left hidden-fade-out-05s"
                  : "text-container-left"
              }
            >
              Copyright (C) dango factory
              <br />
              <img alt="between" src={introTextBetween}></img>
              special thanks : myu-myu
            </div>
            <div
              className={
                introFinished
                  ? "text-container-right hidden-fade-out-05s"
                  : "text-container-right"
              }
            >
              <div className="wrap-to-left">
                <div className="arrow-container">
                  <img
                    style={{ transform: isArrowUp ? "translateY(-15px)" : "" }}
                    src={introTextArrow}
                    alt="arrow"
                  ></img>
                </div>
                <div className="sevrer-container">
                  mISO-sevrer
                  <br />
                  sHIO-sevrer
                </div>{" "}
                <br />
                {loadStatusState}
                <br />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Intro;
