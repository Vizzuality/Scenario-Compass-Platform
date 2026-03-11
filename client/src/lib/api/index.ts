import { IIASA_API_CLIENT } from "@/lib/api/iiasa.client";

const API = new IIASA_API_CLIENT({
  appName: process.env.NEXT_PUBLIC_API_APP_NAME || "",
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
});

await API.init({
  username: "",
  password: "",
});

export default API;
