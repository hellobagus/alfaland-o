import axios from "axios";
import { configConstants } from "../_constants";
import { sessions } from "../_helpers";

export const profilService = {
    getData
};

const { urlApi, headers } = configConstants;
const api = `${urlApi}/c_profil`;

async function getData(param) {
    headers.token = await sessions.getSess("@Token");
    return await axios
        .get(`${api}/getData/IFCAMOBILE/${param.email}/${param.userId}`, {
            headers
        })
        .then(res => {
            return res.data;
        });
}
