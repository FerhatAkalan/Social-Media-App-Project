import * as ACTIONS from "./Constants";

const defaultState = {
  isLoggedIn: false,
  username: undefined,
  displayName: undefined,
  image: undefined,
  password: undefined,
  admin: undefined,
  likes: {},
};

const authReducer = (state = { ...defaultState }, action) => {
  if (action.type === ACTIONS.LOGOUT_SUCCES) {
    return defaultState;
  } else if (action.type === ACTIONS.LOGIN_SUCCES) {
    return {
      ...action.payload,
      isLoggedIn: true,
      likes: state.likes,
    };
  } else if (action.type === ACTIONS.UPDATE_SUCCESS) {
    return { ...state, ...action.payload };
  } else if (action.type === ACTIONS.UPDATE_ADMIN_STATUS) {
    return { ...state, admin: action.payload.admin };
  } else if (action.type === "LIKE_POST") {
    const postId = action.payload;
    return {
      ...state,
      likes: {
        ...state.likes,
        [postId]: true, // Beğeni durumunu güncelleyin
      },
    };
  } else if (action.type === "UNLIKE_POST") {
    const postId = action.payload;
    const newLikes = { ...state.likes };
    delete newLikes[postId];
    return { ...state, likes: newLikes };
  } 
  return state;
};

export default authReducer;
