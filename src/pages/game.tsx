import { useStore } from "../store";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MainScene,
  MediaScene,
  IdleMediaScene,
  GateScene,
  BootScene,
  SsknScene,
  PolytanScene,
  TaKScene,
  ChangeDiscScene,
  EndScene,
} from "@canvas/scenes";
import { Canvas } from "@react-three/fiber";
import InputHandler from "@canvas/objects/InputHandler";
import MediaPlayer from "@canvas/objects/MediaPlayer";
import { GameScene } from "@/types";
import Head from "next/head";
import Preloader from "@/components/canvas/objects/Preloader";
import Loading from "@/components/canvas/objects/Loading";

const Game = () => {
  const scene = useStore((state) => state.scene);

  const dispatchScene: { [key: string]: JSX.Element } = useMemo(
    () => ({
      [GameScene.Main]: <MainScene />,
      [GameScene.Media]: <MediaScene />,
      [GameScene.Idle]: <IdleMediaScene />,
      [GameScene.Gate]: <GateScene />,
      [GameScene.Boot]: <BootScene />,
      [GameScene.Sskn]: <SsknScene />,
      [GameScene.Polytan]: <PolytanScene />,
      [GameScene.Tak]: <TaKScene />,
      [GameScene.ChangeDisc]: <ChangeDiscScene />,
      [GameScene.End]: <EndScene />,
    }),
    []
  );

  const [windowDims, setWindowDims] = useState<
    undefined | { width: number; height: number }
  >();
  const [dpr, setDpr] = useState<undefined | number>();

  const handleWindowKeypress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "k":
        setWindowDims(
          (prev) =>
            prev && {
              height: prev.height * 1.1,
              width: prev.width * 1.1,
            }
        );
        break;
      case "j":
        setWindowDims(
          (prev) =>
            prev && {
              height: prev.height / 1.1,
              width: prev.width / 1.1,
            }
        );
    }
  }, []);

  useEffect(() => {
    setWindowDims({
      width: (window.screen.height / 1.8) * 1.3,
      height: window.screen.height / 1.8,
    });
    setDpr(window.devicePixelRatio);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleWindowKeypress);

    return () => {
      window.removeEventListener("keydown", handleWindowKeypress);
    };
  }, [handleWindowKeypress]);

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "visible";
    };
  }, []);

  return (
    windowDims &&
    dpr && (
      <>
        <Head>
          <title>{" < game >"}</title>
          <style global jsx>{`
            html,
            body {
              overflow: hidden;
            }
          `}</style>
        </Head>
        <div className="game" style={{ ...windowDims }}>
          <Canvas
            gl={{ antialias: false }}
            dpr={dpr}
            flat
            linear
            className="main-canvas"
          >
            <Suspense
              fallback={
                scene === GameScene.Main || scene === GameScene.Media ? (
                  <Loading />
                ) : null
              }
            >
              {dispatchScene[scene]}
              <Preloader />
              <InputHandler />
            </Suspense>
          </Canvas>
          {[
            GameScene.Media,
            GameScene.Idle,
            GameScene.Tak,
            GameScene.End,
          ].includes(scene) && (
            <div style={{ marginTop: -windowDims.height }}>
              <MediaPlayer />
            </div>
          )}
        </div>
      </>
    )
  );
};

export default Game;
