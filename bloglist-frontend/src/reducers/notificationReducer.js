import { createSlice } from "@reduxjs/toolkit";

const initialState = { content: "", className: "" };
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationError(state, action) {
      return { content: action.payload, className: "error" };
    },
    setNotificationSuccess(state, action) {
      return { content: action.payload, className: "success" };
    },
  },
});

export const notificationModify = (content, type, time) => {
  if (type === "error") {
    return async (dispatch) => {
      dispatch(setNotificationError(content));
      setTimeout(() => {
        dispatch(setNotificationError(""));
      }, time * 1000);
    };
  }
  return async (dispatch) => {
    dispatch(setNotificationSuccess(content));
    setTimeout(() => {
      dispatch(setNotificationSuccess(""));
    }, time * 1000);
  };
};

export const { setNotificationError, setNotificationSuccess } =
  notificationSlice.actions;
export default notificationSlice.reducer;
