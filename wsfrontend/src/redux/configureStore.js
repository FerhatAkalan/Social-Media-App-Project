import {
  applyMiddleware,
  legacy_createStore as createStore,
  compose,
} from "redux";
import authReducer from "./authReducer";
import SecureLS from "secure-ls";
import thunk from "redux-thunk";
import { setAuthorizationHeader } from "../api/apiCalls";

const secureLS = new SecureLS();

const getStateFormStorage = () => {
  const postAuth = secureLS.get("post-auth");

  let stateInlocalStorage = {
    isLoggedIn: false,
    username: undefined,
    displayName: undefined,
    image: undefined,
    password: undefined,
  };

  if (postAuth) {
    return postAuth;
  }
  return stateInlocalStorage;
};

const updateStateInStorage = (newState) => {
  secureLS.set("post-auth", newState);
};

const configureStore = () => {
  const initialState = getStateFormStorage();
  setAuthorizationHeader(initialState);
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    authReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );

  store.subscribe(() => {
    updateStateInStorage(store.getState());
    setAuthorizationHeader(store.getState());
  });

  return store;
};

export default configureStore;
