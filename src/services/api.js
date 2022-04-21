import axios from "axios";

const api = axios.create({
  baseURL: "https://kb4pn20gg2.execute-api.us-east-1.amazonaws.com/dev",
});

export default api;