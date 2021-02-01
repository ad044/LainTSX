import { useStore } from "../../../../store";

const idleManager = (eventState: any) => {
  const dispatchAction = (eventState: {
    media: string;
    images?: { "1": string; "2": string; "3": string };
  }) => {
    if (eventState.images) {
      return {
        action: () =>
          useStore.setState({
            idleMedia: eventState.media,
            idleImages: eventState.images,
          }),
      };
    } else {
      return {
        action: () =>
          useStore.setState({
            idleMedia: eventState.media,
          }),
      };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default idleManager;
