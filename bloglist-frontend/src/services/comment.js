import axios from "axios";
const baseUrl = "/api/blogs";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
const getAll = (blogId) => {
  const request = axios.get(baseUrl + "/" + blogId + "/comments");
  return request
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
};

const create = async ({newComment,blogId}) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log(newComment)
  const response = await axios.post(
    baseUrl + "/" + blogId + "/comments",
    {content: newComment},
    config
  );
  return response.data;
};

export default { getAll, create,setToken };
