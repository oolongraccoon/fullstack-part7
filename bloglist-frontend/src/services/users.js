import axios from "axios";
const baseUrl = "/api/users";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });
};

export default { getAll };
