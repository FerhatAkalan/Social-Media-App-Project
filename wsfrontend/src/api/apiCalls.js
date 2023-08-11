import axios from "axios";

export const signup = (body) => {
  return axios.post("/api/1.0/users", body);
};

export const login = (creds) => {
  return axios.post("/api/1.0/auth", creds);
};

export const logout = () => {
  return axios.post("/api/1.0/logout");
};

export const changeLanguage = (language) => {
  axios.defaults.headers["accept-language"] = language;
};

export const getUsers = (page = 0, size = 10) => {
  return axios.get(`/api/1.0/users?page=${page}&size=${size}`);
};

export const setAuthorizationHeader = ({ isLoggedIn, token }) => {
  if (isLoggedIn) {
    const authorizationHeader = `Bearer ${token}`;
    axios.defaults.headers["Authorization"] = authorizationHeader;
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};

export const getUser = (username) => {
  return axios.get(`/api/1.0/users/${username}`);
};

export const updateUser = (username, body) => {
  return axios.put(`/api/1.0/users/${username}`, body);
};

export const postIt = (post) => {
  return axios.post("/api/1.0/posts", post);
};

export const getPosts = (username, page = 0) => {
  const path = username
    ? `/api/1.0/users/${username}/posts?page=`
    : "/api/1.0/posts?page=";
  return axios.get(path + page);
};

export const getOldPosts = (id, username) => {
  const path = username
    ? `/api/1.0/users/${username}/posts/${id}`
    : `/api/1.0/posts/${id}`;
  return axios.get(path);
};

export const getNewPostCount = (id, username) => {
  const path = username
    ? `/api/1.0/users/${username}/posts/${id}?count=true`
    : `/api/1.0/posts/${id}?count=true`;
  return axios.get(path);
};

export const getNewPosts = (id, username) => {
  const path = username
    ? `/api/1.0/users/${username}/posts/${id}?direction=after`
    : `/api/1.0/posts/${id}?direction=after`;
  return axios.get(path);
};

export const postPostAttachment = (attachment) => {
  return axios.post("/api/1.0/post-attachments", attachment);
};

export const deletePost = (id) => {
  return axios.delete(`/api/1.0/posts/${id}`);
};

export const deleteUser = (username) => {
  return axios.delete(`/api/1.0/users/${username}`);
};

export const getVerificationRequests = () => {
  return axios.get("/api/1.0/verifications/applications");
};

export const createVerificationRequest = async (username,requestData) => {
  try {
    const response = await axios.post(`/api/1.0/verifications/create/${username}`, requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveVerificationRequest = (requestId) => {
  return axios.post(`/api/1.0/verifications/${requestId}/approve`);
};

export const rejectVerificationRequest = (requestId) => {
  return axios.post(`/api/1.0/verifications/${requestId}/reject`);
};
export const unVerifyUser = (username) => {
  return axios.post(`/api/1.0/verifications/${username}/unverify`); 
};


export const fetchTranslationFromAPI = async (language) => {
  try {
    const response = await axios.get(`/api/i18n`, {
      params: {
        language: language,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching translations:", error);
    return {}; 
  }
};

