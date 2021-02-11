import React, { useReducer } from "react";
import LoginDialog from "./component/Dialog/LoginDialog";

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "login"; displayName?: string; profileImage?: string }
  | { type: "logout" }
  | { type: "switchTheme"; themeColor: string }
  | { type: "showSnackbar"; successMessage?: string }
  | { type: "hideSnackbar" }
  | { type: "updateProfile"; displayName?: string; phoneNumber?: string }
  | { type: "toggleLoginDialog"; force?: boolean };
type Dispatch = (action: Action) => void;
type State = {
  count: number;
  loggedIn: boolean;
  themeColor: string;
  showSnackbar: boolean;
  successMessage: string;
  displayName: string;
  profileImage: string;
  profileSlug: string;
  firstTimeLogin: boolean;
  loginDialog: { isOpen: boolean; force: boolean };
};

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

function contextReducer(state, action) {
  switch (action.type) {
    case "increment": {
      return { ...state, count: state.count + 1 };
    }
    case "decrement": {
      return { ...state, count: state.count - 1 };
    }
    case "login": {
      return {
        ...state,
        loggedIn: true,
        displayName: action.displayName,
        profileImage: action.profileImage,
      };
    }
    case "logout": {
      return { ...state, loggedIn: false, displayName: "" };
    }
    case "switchTheme": {
      return { ...state, themeColor: action.themeColor };
    }
    case "showSnackbar": {
      return {
        ...state,
        showSnackbar: true,
        successMessage: action.successMessage || "Success",
      };
    }
    case "hideSnackbar": {
      return { ...state, showSnackbar: false, successMessage: "" };
    }
    case "updateProfile": {
      return { ...state, displayName: action.displayName || state.displayName };
    }
    case "toggleLoginDialog": {
      return {
        ...state,
        loginDialog: {
          isOpen: !state.loginDialog.isOpen,
          force: action.force,
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useContextState() {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error("useContextState must be used within a ContextProvider");
  }
  return context;
}

function useContextDispatch() {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("useContextDispatch must be used within a ContextProvider");
  }
  return context;
}

export default function Context({ children, defaultProps }) {
  const {
    displayName,
    profileImage,
    firstTimeLogin,
    profileSlug,
  } = defaultProps;

  const [state, dispatch] = useReducer(contextReducer, {
    count: 0,
    loggedIn: Boolean(displayName),
    themeColor: "light",
    showSnackbar: false,
    successMessage: "",
    displayName,
    profileSlug,
    profileImage,
    firstTimeLogin,
    loginDialog: { isOpen: false, force: false },
  });
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export { useContextState, useContextDispatch };
