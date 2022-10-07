import { useReducer } from "react";
import AppContext from "./AppContext";

import appReducer from "./appReducer";
const token = localStorage.getItem("token") || "";
const user = JSON.parse(localStorage.getItem("user")) || {};
const defaultUserState = {
  jwt: token,
  user: user,
  isAuth: token ? true : false,
};

const AppContextProvider = (props) => {
  const [appState, dispatch] = useReducer(appReducer, defaultUserState);

  const setUserDataHandler = (item) => {
    dispatch({ type: "LOGIN", item });
  };

  const restart = () => {
    dispatch({ type: "RESET" });
  };
  const context = {
    token: appState.token,
    user: appState.user,
    isAuth: appState.isAuth,
    setUser: setUserDataHandler,
    onReset: restart,
  };

  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
