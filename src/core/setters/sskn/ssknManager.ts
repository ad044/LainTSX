import { useStore } from "../../../store";

const ssknManager = (eventState: any) => {
  const toggleComponentMatrixIdx = useStore.getState()
    .toggleSSknComponentMatrixIdx;
  const setSSknLoading = useStore.getState().setSSknLoading;

  const dispatchAction = (eventState: { event: string }) => {
    switch (eventState.event) {
      case "sskn_ok_down":
      case "sskn_cancel_up":
        return {
          action: () => toggleComponentMatrixIdx(),
        };
      case "sskn_ok_select":
        return {
          action: () => setSSknLoading(true),
        };
      case "sskn_cancel_select":
        return {
          action: () => setSSknLoading(false),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) action();
};

export default ssknManager;
