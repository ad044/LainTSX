import { isPolytanFullyUnlocked } from "../../store";
import { useStore } from "../../store";

const initialStoreState = useStore.getState();

describe("Idle helpers", () => {
  it("Checks if polytan unlock works properly", () => {
    expect(isPolytanFullyUnlocked()).toEqual(false);

    const fullyUnlocked = {
      body: true,
      head: true,
      leftArm: true,
      rightArm: true,
      leftLeg: true,
      rightLeg: true,
    };

    useStore.setState({ polytanUnlockedParts: fullyUnlocked });
    expect(isPolytanFullyUnlocked()).toEqual(true);

    const partiallyUnlocked = {
      body: false,
      head: true,
      leftArm: false,
      rightArm: true,
      leftLeg: true,
      rightLeg: true,
    };

    useStore.setState({ polytanUnlockedParts: partiallyUnlocked });
    expect(isPolytanFullyUnlocked()).toEqual(false);
  });

  beforeEach(() => {
    useStore.setState(initialStoreState, true);
  });
});
