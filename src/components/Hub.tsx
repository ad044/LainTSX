import React, { Suspense } from "react";
import Ring0 from "./Ring0";
import Ring1 from "./Ring1";

const Hub = (props: any) => {
  return (
    <>
      <Suspense fallback={<>loading...</>}>
        <Ring1 />
        <Ring0 />
      </Suspense>
    </>
  );
};

export default Hub;
