import * as ACTIONS from "./Constants";

const defaultState = {
  isLoggedIn: false,
  username: undefined,
  displayName: undefined,
  image: undefined,
  password: undefined,
  admin: undefined,
};

const authReducer = (state = { ...defaultState }, action) => {
  if (action.type === ACTIONS.LOGOUT_SUCCES) {
    return defaultState;
  } else if (action.type === ACTIONS.LOGIN_SUCCES) {
    return {
      ...action.payload,
      isLoggedIn: true,
    };
  } else if (action.type === ACTIONS.UPDATE_SUCCESS) {
    return { ...state, ...action.payload };
  }else if (action.type === ACTIONS.UPDATE_ADMIN_STATUS) {
    return { ...state, admin: action.payload.admin };
  }
  return state;
};

export default authReducer;
