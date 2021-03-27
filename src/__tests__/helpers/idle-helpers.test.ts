import { isPolytanFullyUnlocked } from "../../store";
import { useStore } from "../../store";

const initialStoreState = useStore.getState();

describe("Idle helpers", () => {
  it("Checks if polytan unlock works properly", () => {
    expect(isPolytanFullyUnlocked()).toEqual(false);

    const fullyUnlocked = {
      body: true,
      head: true,
      left_arm: true,
      right_arm: true,
      left_leg: true,
      right_leg: true,
    };

    const state = useStore.getState();

    useStore.setState({
      gameProgress: {
        ...state.gameProgress,
        polytan_unlocked_parts: fullyUnlocked,
      },
    });
    expect(isPolytanFullyUnlocked()).toEqual(true);

    const partiallyUnlocked = {
      body: false,
      head: true,
      left_arm: false,
      right_arm: true,
      left_leg: true,
      right_leg: true,
    };

    useStore.setState({
      gameProgress: {
        ...state.gameProgress,
        polytan_unlocked_parts: partiallyUnlocked,
      },
    });
    expect(isPolytanFullyUnlocked()).toEqual(false);
  });

  beforeEach(() => {
    useStore.setState(initialStoreState, true);
  });
});
