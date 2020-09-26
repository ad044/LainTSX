import React, { memo } from "react";
import { useRecoilValue } from "recoil";
import { a, useSpring } from "@react-spring/three";
import { lightPosYAtom, lightRotYAtom } from "./LightsAtom";

const Lights = memo(() => {
    const lightRotY = useRecoilValue(lightRotYAtom);
    const lightPosY = useRecoilValue(lightPosYAtom);

    const lightState = useSpring({
        lightRotY: lightRotY,
        lightPosY: lightPosY,
        config: { duration: 1200 },
    });

    return (
        <a.group
            position-y={lightState.lightPosY}
            rotation-y={lightState.lightRotY}
        >
            <ambientLight color={0x808080} intensity={0.6} />
            <pointLight color={0xffffff} position={[0, 0, 7]} intensity={0.7} />
            <pointLight color={0x7f7f7f} position={[0, 10, 0]} intensity={1.5} />
            <pointLight color={0xffffff} position={[-8, 0, 0]} intensity={0.3} />
            <pointLight color={0xffffff} position={[8, 0, 0]} intensity={0.3} />
        </a.group>
    );
});

export default Lights;
