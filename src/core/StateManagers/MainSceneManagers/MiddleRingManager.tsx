import { useCallback, useEffect, useMemo } from "react";
import { useMiddleRingStore } from "../../../store";

const MiddleRingManager = (props: any) => {
  const setTransformState = useMiddleRingStore(
    (state) => state.setTransformState
  );
  const setAnimDuration = useMiddleRingStore((state) => state.setAnimDuration);
  const setRotating = useMiddleRingStore((state) => state.setRotating);
  const setMainRingVisible = useMiddleRingStore(
    (state) => state.setMainRingVisible
  );
  const setPartSeparatorVal = useMiddleRingStore(
    (state) => state.setPartSeparatorVal
  );

  const rotate = useCallback(
    (direction: string) => {
      const rotValues = direction === "right" ? [-0.07, 0.03] : [0.07, -0.03];

      setTimeout(() => {
        setTransformState(rotValues[0], "rotZ");
      }, 2300);

      setTimeout(() => {
        setTransformState(rotValues[1], "rotZ");
      }, 3500);

      setTimeout(() => {
        setTransformState(0, "rotZ");
      }, 4500);
    },
    [setTransformState]
  );

  const moveDown = useCallback(() => {
    // set the anim duration value to match that of the site's
    setAnimDuration(1200);

    // make noise appear again
    setTimeout(() => {
      setTransformState(0.06, "noiseStrength");
    }, 800);

    // disable rotation of the ring
    setTimeout(() => {
      setRotating(false);
    }, 700);

    setTimeout(() => {
      setTransformState(1.39, "posY");
    }, 1300);

    // set ring rotation on x axis to craete motion effect
    setTimeout(() => {
      setTransformState(0.3, "rotX");
    }, 1500);

    setTimeout(() => {
      setAnimDuration(600);
    }, 2900);

    setTimeout(() => {
      setTransformState(-0.31, "posY");
    }, 3000);

    setTimeout(() => {
      setTransformState(-0.11, "posY");
    }, 3150);

    // rotate it again, set ring noise to 0
    setTimeout(() => {
      setTransformState(-0.1, "rotX");
      setTransformState(0, "noiseStrength");
    }, 3500);

    // rotate it back AGAIN (holy fuk psx game)
    setTimeout(() => {
      setTransformState(0.05, "rotX");
    }, 4500);

    // reset value, set noise to 0
    setTimeout(() => {
      setTransformState(0, "rotX");
      setRotating(true);
    }, 4800);

    // enable noise again in about 11-12 secs
    setTimeout(() => {
      setTransformState(0.03, "noiseStrength");
    }, 11600);
  }, [setAnimDuration, setRotating, setTransformState]);

  const moveUp = useCallback(() => {
    // change noise to 0, make the ring bend downwards
    setTimeout(() => {
      setTransformState(0, "noiseStrength");
      setTransformState(0.2, "wobbleStrength");
    }, 300);

    // disable rotation of the ring
    setTimeout(() => {
      setRotating(false);
    }, 700);

    // make the ring bend upwards
    setTimeout(() => {
      setTransformState(-0.3, "wobbleStrength");
      // the middle ring stays in place, therefore we animate it
      // in the same direction as the site, creating that illusion.

      // set the anim duration value to match that of the site's
      setAnimDuration(1200);
      // animate it after
      setTransformState(-1.39, "posY");
    }, 1300);

    // reset the ring bend, set the rotation to slightly curve
    // to replicate a motion effect (since its moving upwards)
    // and enable rotation again
    setTimeout(() => {
      setTransformState(0, "wobbleStrength");
      setTransformState(-0.2, "rotX");
      setRotating(true);
    }, 1500);

    // reset anim duration back to default
    setTimeout(() => {
      setAnimDuration(600);
    }, 2300);

    setTimeout(() => {
      setTransformState(0.09, "posY");
    }, 2900);

    // reset the rotation value to 0
    setTimeout(() => {
      setTransformState(0, "rotX");
      setTransformState(-0.11, "posY");
    }, 3150);

    // enable noise again in about 8~ secs
    setTimeout(() => {
      setTransformState(0.03, "noiseStrength");
    }, 7800);
  }, [setAnimDuration, setRotating, setTransformState]);

  const animatePause = useCallback(() => {
    setTransformState(0.5, "posY");
    setTimeout(() => {
      setMainRingVisible(false);
    }, 600);
    setTimeout(() => {
      setPartSeparatorVal(0.9);
      // move the hidden (main) ring below, cuz when the pause exists it needs to jump back up
      // instead of reappearing
      setTransformState(-2.5, "posY");
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
      setMainRingVisible(true);
      setPartSeparatorVal(1);
    }, 3800);
  }, [setMainRingVisible, setPartSeparatorVal, setTransformState]);

  const animateUnpause = useCallback(() => {
    setTimeout(() => {
      setTimeout(() => {
        setTransformState(0, "wobbleStrength");
        setTransformState(-0.4, "rotX");
        setRotating(true);
      }, 500);

      // reset anim duration back to default
      setTimeout(() => {
        setAnimDuration(600);
      }, 900);

      setTimeout(() => {
        setTransformState(0.13, "posY");
      }, 900);

      // reset the rotation value to 0
      setTimeout(() => {
        setTransformState(0, "rotX");
        setTransformState(-0.11, "posY");
      }, 1150);
    }, 1000);
  }, [setAnimDuration, setRotating, setTransformState]);

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
