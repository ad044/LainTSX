import React, { Suspense } from "react";
import Ring0 from "./Ring0";

type HubProps = {
  lowerRingPositionY: number;
  lowerRingRotationY: number;
};

const Hub = (props: HubProps) => {
  return (
    <>
      <Suspense fallback={<React.Fragment>loading...</React.Fragment>}>
        <Ring0
          lowerRingPositionY={props.lowerRingPositionY}
          lowerRingRotationY={props.lowerRingRotationY}
        />
      </Suspense>
    </>
  );
};

export default Hub;
