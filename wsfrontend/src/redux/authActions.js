import * as ACTIONS from "./Constants";
import { login, signup, logout,likePostApi,unlikePostApi } from "../api/apiCalls";

export const logoutSucces = () => {
  return async function (dispatch) {
    try {
      await logout();
    } catch (error) {}
    dispatch({
      type: ACTIONS.LOGOUT_SUCCES,
    });
  };
};

export const loginSuccess = (authState) => {
  return {
    type: ACTIONS.LOGIN_SUCCES,
    payload: authState,
  };
};

export const updateSuccess = ({ displayName, image }) => {
  return {
    type: ACTIONS.UPDATE_SUCCESS,
    payload: {
      displayName,
      image,
    },
  };
};

export const updateAdminStatus = (admin) => ({
  type: ACTIONS.UPDATE_ADMIN_STATUS,
  payload: { admin },
});

export const loginHandler = (credentials) => {
  return async function (dispatch) {
    const response = await login(credentials);
    const authState = {
      ...response.data.user,
      password: credentials.password,
      token: response.data.token,
    };
    dispatch(loginSuccess(authState));
    dispatch(updateAdminStatus(response.data.user.admin));
    return response;
  };
};

export const signupHandler = (user) => {
  return async function (dispatch) {
    const response = await signup(user);
    await dispatch(loginHandler(user));
    return response;
  };
};
export const likePost = (postId, loggedInUsername) => {
  return async (dispatch) => {
    try {
      await likePostApi(postId, loggedInUsername);
      dispatch({ type: 'LIKE_POST', payload: postId });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
};


export const unlikePost = (postId, loggedInUsername) => {
  return async (dispatch) => {
    try {
      await unlikePostApi(postId, loggedInUsername);
      dispatch({ type: 'UNLIKE_POST', payload: postId });
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };
};