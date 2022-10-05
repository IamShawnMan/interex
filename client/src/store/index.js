const { createSlice, configureStore } = require("@reduxjs/toolkit");
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const appSlice = createSlice({
  name: "app",
  initialState: {
    isAuth: token,
    token,
    user,
  },
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.user = action.payload.user;
      state.token = action.payload.jwt;
    },
  },
});
const store = configureStore({ reducer: { app: appSlice.reducer } });

export const appActions = appSlice.actions;

export default store;
