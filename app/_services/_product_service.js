import axios from "axios";
import { configConstants } from "../_constants";
import { sessions } from "../_helpers";

export const productService = {
    getTower
};

const { urlApi, headers } = configConstants;
const api = `${urlApi}/c_product_info`;

async function getTower(param) {
    headers.token = await sessions.getSess("@Token");
    return await axios
        .get(`${api}/getData/IFCAMOBILE/${param.email}/${param.app}`, {
            headers
        })
        .then(res => {
            return res.data;
        });
}
