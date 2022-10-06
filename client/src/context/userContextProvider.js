import { useReducer } from "react";
import UserContext from "./UserContext";
import userReducer from "./userReduser";

const defaultUserState = {
  jwt: "",
  user: {},
  isAuth: false,
};

const UserContextProvider = (props) => {
  const [userState, dispatchUser] = useReducer(userReducer, defaultUserState);

  const setUserDataHandler = (item) => {
    dispatchUser({ type: "ADD", item });
  };

  const restart = () => {
    dispatchUser({ type: "RESET" });
  };
  const context = {
    token: userState.token,
    user: userState.user,
    isAuth: userState.isAuth,
    setUser: setUserDataHandler,
    onReset: restart,
  };

  return (
    <UserContext.Provider value={context}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
