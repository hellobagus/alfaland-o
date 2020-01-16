import axios from "axios";
import { configConstants } from "../_constants";

export const authService = {
    login,
    changePass
};

const { urlApi, headers } = configConstants;
const api = `${urlApi}/c_auth`;

async function login(datas) {
    const data = datas;
    return await axios
        .post(`${api}/Login`, data, { headers })
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('err',err);
        });
}

async function changePass(datas) {
    const data = JSON.stringify(datas);
    return await axios
        .post(`${api}/ChangePass`, data, { headers })
        .then(res => {
            return res.data;
        });
}
