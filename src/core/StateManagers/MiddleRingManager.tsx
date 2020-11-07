import { useCallback, useEffect, useMemo } from "react";
import { useMiddleRingStore } from "../../store";

const MiddleRingManager = (props: any) => {
  const setMiddleRingWobbleStrength = useMiddleRingStore(
    (state) => state.setMiddleRingWobbleStrength
  );
  const setMiddleRingRotating = useMiddleRingStore(
    (state) => state.setMiddleRingRotating
  );
  const setMiddleRingNoise = useMiddleRingStore(
    (state) => state.setMiddleRingNoise
  );
  const addToMiddleRingPosY = useMiddleRingStore(
    (state) => state.addToMiddleRingPosY
  );
  const setMiddleRingRotX = useMiddleRingStore(
    (state) => state.setMiddleRingRotX
  );
  const setMiddleRingRotZ = useMiddleRingStore(
    (state) => state.setMiddleRingRotZ
  );
  const setMiddleRingAnimDuration = useMiddleRingStore(
    (state) => state.setMiddleRingAnimDuration
  );

  const rotateMiddleRingRight = useCallback(() => {
    setTimeout(() => {
      setMiddleRingRotZ(-0.07);
    }, 2300);

    setTimeout(() => {
      setMiddleRingRotZ(0.03);
    }, 3500);

    setTimeout(() => {
      setMiddleRingRotZ(0);
    }, 4500);
  }, [setMiddleRingRotZ]);

  const rotateMiddleRingLeft = useCallback(() => {
    setTimeout(() => {
      setMiddleRingRotZ(0.07);
    }, 2300);

    setTimeout(() => {
      setMiddleRingRotZ(-0.03);
    }, 3500);

    setTimeout(() => {
      setMiddleRingRotZ(0);
    }, 4500);
  }, [setMiddleRingRotZ]);

  const moveMiddleRingDown = useCallback(() => {
    // set the anim duration value to match that of the site's
    setMiddleRingAnimDuration(1200);

    // make noise appear again
    setTimeout(() => {
      setMiddleRingNoise(0.06);
    }, 800);

    // disable rotation of the ring
    setTimeout(() => {
      setMiddleRingRotating(false);
    }, 700);

    setTimeout(() => {
      addToMiddleRingPosY(1.5);
    }, 1300);

    // set ring rotation on x axis to craete motion effect
    setTimeout(() => {
      setMiddleRingRotX(0.3);
    }, 1500);

    setTimeout(() => {
      setMiddleRingAnimDuration(600);
    }, 2900);

    setTimeout(() => {
      addToMiddleRingPosY(-1.7);
    }, 3000);

    setTimeout(() => {
      addToMiddleRingPosY(0.2);
    }, 3150);

    // rotate it again, set ring noise to 0
    setTimeout(() => {
      setMiddleRingRotX(-0.1);
      setMiddleRingNoise(0);
    }, 3500);

    // rotate it back AGAIN (holy fuk psx game)
    setTimeout(() => {
      setMiddleRingRotX(0.05);
    }, 4500);

    // reset value, set noise to 0
    setTimeout(() => {
      setMiddleRingRotX(0);
      setMiddleRingRotating(true);
    }, 4800);

    // enable noise again in about 11-12 secs
    setTimeout(() => {
      setMiddleRingNoise(0.03);
    }, 11600);
  }, [
    addToMiddleRingPosY,
    setMiddleRingAnimDuration,
    setMiddleRingNoise,
    setMiddleRingRotX,
    setMiddleRingRotating,
  ]);

  const moveMiddleRingUp = useCallback(() => {
    // change noise to 0, make the ring bend downwards
    setTimeout(() => {
      setMiddleRingNoise(0);
      setMiddleRingWobbleStrength(0.2);
    }, 300);

    // disable rotation of the ring
    setTimeout(() => {
      setMiddleRingRotating(false);
    }, 700);

    // make the ring bend upwards
    setTimeout(() => {
      setMiddleRingWobbleStrength(-0.3);
      // the middle ring stays in place, therefore we animate it
      // in the same direction as the site, creating that illusion.

      // set the anim duration value to match that of the site's
      setMiddleRingAnimDuration(1200);
      // animate it after
      addToMiddleRingPosY(-1.5);
    }, 1300);

    // reset the ring bend, set the rotation to slightly curve
    // to replicate a motion effect (since its moving upwards)
    // and enable rotation again
    setTimeout(() => {
      setMiddleRingWobbleStrength(0.0);
      setMiddleRingRotX(-0.2);
      setMiddleRingRotating(true);
    }, 1500);

    // reset anim duration back to default
    setTimeout(() => {
      setMiddleRingAnimDuration(600);
    }, 2300);

    setTimeout(() => {
      addToMiddleRingPosY(1.7);
    }, 2400);

    // reset the rotation value to 0
    setTimeout(() => {
      setMiddleRingRotX(0);
      addToMiddleRingPosY(-0.2);
    }, 2650);

    // enable noise again in about 8~ secs
    setTimeout(() => {
      setMiddleRingNoise(0.03);
    }, 7800);
  }, [
    addToMiddleRingPosY,
    setMiddleRingAnimDuration,
    setMiddleRingNoise,
    setMiddleRingRotX,
    setMiddleRingRotating,
    setMiddleRingWobbleStrength,
  ]);

  const dispatcherObjects = useMemo(
    () => ({
      move_up: { action: moveMiddleRingUp },
      move_down: { action: moveMiddleRingDown },
      move_left: { action: rotateMiddleRingLeft },
      move_right: { action: rotateMiddleRingRight },
    }),
    [
      moveMiddleRingDown,
      moveMiddleRingUp,
      rotateMiddleRingLeft,
      rotateMiddleRingRight,
    ]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject =
        dispatcherObjects[eventAction as keyof typeof dispatcherObjects];

      if (dispatchedObject) {
        dispatchedObject.action();
      }
    }
  }, [
    dispatcherObjects,
    props.eventState,
    setMiddleRingAnimDuration,
    setMiddleRingNoise,
    setMiddleRingRotX,
    setMiddleRingRotZ,
    setMiddleRingRotating,
    setMiddleRingWobbleStrength,
  ]);

  return null;
};

export default MiddleRingManager;
