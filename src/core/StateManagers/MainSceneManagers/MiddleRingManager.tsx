import { useCallback, useEffect } from "react";
import { useMainSceneStore } from "../../../store";

const MiddleRingManager = (props: any) => {
  const setRot = useMainSceneStore((state) => state.setMiddleRingRot);
  const setPos = useMainSceneStore((state) => state.setMiddleRingPos);
  const setRotating = useMainSceneStore((state) => state.setMiddleRingRotating);
  const setNoiseAmp = useMainSceneStore((state) => state.setMiddleRingNoiseAmp);
  const setWobbleAmp = useMainSceneStore(
    (state) => state.setMiddleRingWobbleAmp
  );
  const setFakeRingVisible = useMainSceneStore(
    (state) => state.setFakeMiddleRingVisible
  );
  const setPartSeparatorVal = useMainSceneStore(
    (state) => state.setMiddleRingPartSeparatorVal
  );

  const rotate = useCallback(
    (direction: string) => {
      const rotValues = direction === "right" ? [-0.07, 0.03] : [0.07, -0.03];

      setTimeout(() => {
        setRot([0, 0, rotValues[0]]);
      }, 2300);

      setTimeout(() => {
        setRot([0, 0, rotValues[1]]);
      }, 3500);

      setTimeout(() => {
        setRot([0, 0, 0]);
      }, 4500);
    },
    [setRot]
  );

  const moveDown = useCallback(() => {
    // make noise appear again
    // disable rotation of the ring
    setTimeout(() => {
      setNoiseAmp(0.06);
      setRotating(false);
    }, 800);

    setTimeout(() => {
      setPos([0, 1.39, 0]);
    }, 1300);

    // set ring rotation on x axis to craete motion effect
    setTimeout(() => {
      setRot([0.3, 0, 0]);
    }, 1500);

    setTimeout(() => {
      setPos([0, -0.31, 0]);
    }, 3000);

    setTimeout(() => {
      setPos([0, -0.11, 0]);
    }, 3150);

    // rotate it again, set ring noise to 0
    setTimeout(() => {
      setRot([-0.1, 0, 0]);
      setNoiseAmp(0);
    }, 3500);

    // rotate it back AGAIN (holy fuk psx game)
    setTimeout(() => {
      setRot([0.05, 0, 0]);
    }, 4500);

    // reset value, set noise to 0
    setTimeout(() => {
      setRot([0, 0, 0]);
      setRotating(true);
    }, 4800);

    // enable noise again in about 11-12 secs
    setTimeout(() => {
      setNoiseAmp(0.03);
    }, 11600);
  }, [setNoiseAmp, setPos, setRot, setRotating]);

  const moveUp = useCallback(() => {
    // change noise to 0, make the ring bend downwards
    setTimeout(() => {
      setNoiseAmp(0);
      setWobbleAmp(0.2);
    }, 300);

    // disable rotation of the ring
    setTimeout(() => {
      setRotating(false);
    }, 700);

    // make the ring bend upwards
    setTimeout(() => {
      setWobbleAmp(-0.3);
      // the middle ring stays in place, therefore we animate it
      // in the same direction as the site, creating that illusion.
      setPos([0, -1.39, 0]);
    }, 1300);

    // reset the ring bend, set the rotation to slightly curve
    // to replicate a motion effect (since its moving upwards)
    // and enable rotation again
    setTimeout(() => {
      setWobbleAmp(0);
      setRot([-0.2, 0, 0]);
      setRotating(true);
    }, 1500);

    setTimeout(() => {
      setPos([0, 0.09, 0]);
    }, 2900);

    // reset the rotation value to 0
    setTimeout(() => {
      setRot([0, 0, 0]);
      setPos([0, -0.11, 0]);
    }, 3150);

    // enable noise again in about 8~ secs
    setTimeout(() => {
      setNoiseAmp(0.03);
    }, 7800);
  }, [setNoiseAmp, setPos, setRot, setRotating, setWobbleAmp]);

  const animatePause = useCallback(() => {
    setPos([0, 0.5, 0]);
    setTimeout(() => {
      setFakeRingVisible(true);
    }, 600);
    setTimeout(() => {
      setPartSeparatorVal(0.9);
      // move the hidden (main) ring below, cuz when the pause exists it needs to jump back up
      // instead of reappearing
      setPos([0, -2.5, 0]);
    }, 1100);
    setTimeout(() => {
      setPartSeparatorVal(1);
    }, 1500);
    setTimeout(() => {
      setPartSeparatorVal(0.9);
    }, 1900);
    setTimeout(() => {
      setPartSeparatorVal(1);
    }, 2300);

    setTimeout(() => {
      setPartSeparatorVal(0.2);
    }, 3100);

    setTimeout(() => {
      setFakeRingVisible(false);
      setPartSeparatorVal(1);
    }, 3800);
  }, [setFakeRingVisible, setPartSeparatorVal, setPos]);

  const animateUnpause = useCallback(() => {
    setTimeout(() => {
      setTimeout(() => {
        setRot([-0.4, 0, 0]);
        setRotating(true);
      }, 500);

      setTimeout(() => {
        setPos([0, 0.13, 0]);
      }, 900);

      // reset the rotation value to 0
      setTimeout(() => {
        setRot([0, 0, 0]);
        setPos([0, -0.11, 0]);
      }, 1150);
    }, 1000);
  }, [setPos, setRot, setRotating]);

  const dispatchObject = useCallback(
    (eventState: { event: string }) => {
      switch (eventState.event) {
        case "site_up":
        case "select_level_up":
          return { action: moveUp };
        case "select_level_down":
        case "site_down":
          return { action: moveDown };
        case "site_left":
          return { action: rotate, value: ["left"] };
        case "site_right":
          return { action: rotate, value: ["right"] };
        case "pause_game":
          return { action: animatePause };
        case "pause_exit_select":
        case "pause_change_select":
          return { action: animateUnpause };
      }
    },
    [animatePause, animateUnpause, moveDown, moveUp, rotate]
  );
  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as any);
      }
    }
  }, [dispatchObject, props.eventState]);

  return null;
};

export default MiddleRingManager;
