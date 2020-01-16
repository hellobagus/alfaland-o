// import { API_KEY } from 'react-native-dotenv'
import { urlApi } from "../Config";
import { sessions } from "../_helpers";

getToken();
export const configConstants = {
    urlApi: urlApi,
    headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        token: ""
    }
};

async function getToken() {
    configConstants.headers.token = await sessions.getSess("@Token");
}

console.log("configConstants", configConstants.headers);
