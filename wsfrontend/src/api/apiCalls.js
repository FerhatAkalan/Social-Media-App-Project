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
export const createVerificationRequest = async (username, requestData) => {
  try {
    const response = await axios.post(`/api/1.0/verifications/create/${username}`, requestData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

function arrayBufferToBase64(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export const getProtectedImage = async (filename) => {
  try {
    const response = await axios.get(`/images/verified/${filename}`, {
      responseType: "arraybuffer",
    });

    if (response.status === 200 && response.data instanceof ArrayBuffer) {
      return response; // Sadece yanıtı döndürüyoruz, veriyi ayrıca işlemeye gerek yok
    } else {
      throw new Error("Geçersiz yanıt verisi");
    }
  } catch (error) {
    throw error;
  }
};

export const likePostApi = (postId,username) => {
  return axios.post(`/api/1.0/likes/like/${postId}/${username}`);
};

export const unlikePostApi = (postId,username) => {
  return axios.post(`/api/1.0/likes/unlike/${postId}/${username}`);
};

export const fetchLikeCount = (postId) => {
  return axios.get(`/api/1.0/likes/count/${postId}`);;
};

export const getLikedPosts = async (username, page = 0) => {
  const path = username
    ? `/api/1.0/likes/user/${username}/liked-posts?page=`
    : "/api/1.0/likes/user/liked-posts?page=";
  try {
    const response = await axios.get(path + page);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkLikeStatus = async (postId, username) => {
  try {
    const response = await axios.get(`/api/1.0/likes/check?postId=${postId}&username=${username}`);
    return response.data; // True veya false değeri dönecektir
  } catch (error) {
    console.error("Error while checking like status:", error);
    throw error;
  }
};