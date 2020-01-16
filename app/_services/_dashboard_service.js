import axios from "axios";
import { configConstants } from "../_constants";
import { sessions } from "../_helpers";

export const dashboardService = {
    getInvoice
};

const { urlApi, headers } = configConstants;
const api = `${urlApi}/c_dashboard`;

async function getInvoice(param) {
    headers.token = await sessions.getSess("@Token");
    return await axios
        .get(`${api}/getInvoice/${param.cons}/${param.email}`, {
            headers
        })
        .then(res => {
            return res.data;
        });
}
