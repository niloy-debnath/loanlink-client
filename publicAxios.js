// src/publicAxios.js
import axios from "axios";

const publicAxios = axios.create({
  withCredentials: false,
});

export default publicAxios;
