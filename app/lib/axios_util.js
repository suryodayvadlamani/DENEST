import axios from "axios";

const client = axios.create({ baseUrl: "http://localhost:3000" });

export const request = ({ ...options }) => {
  const onSuccess = (response) => response;
  const onError = (error) => error;
  return client(options).then(onSuccess).catch(onError);
};
