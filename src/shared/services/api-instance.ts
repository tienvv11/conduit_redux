import axios from "axios";

const conduitApiInstance = axios.create({
  baseURL: "https://conduit.productionready.io/api",
});

export default conduitApiInstance;
