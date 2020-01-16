import axios from "axios";
import { configConstants } from "../_constants";
import { sessions } from "../_helpers";

export const overtimeService = {
    getUsage,
    getLot,
    getOver,
    getRate,
    getStartHour
};

const { urlApi, headers } = configConstants;
const api = `${urlApi}/c_overtime`;

async function getUsage(data) {
    headers.token = await sessions.getSess("@Token");
    return await axios
        .post(`${api}/getUsage/IFCAPB`, data, {
            headers
        })
        .then(res => {
            return res.data;
        });
}

async function getLot(param) {
    const data = {
        entity_cd: param.entity_cd,
        project_no: param.project_no,
        email : param.email
    };
    headers.token = await sessions.getSess("@Token");

    return await axios
        .post(`${api}/zoom_lot_no/${param.cons}`, data, {
            headers
        })
        .then(res => {
            return res.data;
        });
}

async function getOver(param) {
    const data = {
        entity_cd: param.entity_cd,
        project_no: param.project_no,
    };
    headers.token = await sessions.getSess("@Token");

    return await axios
        .post(`${api}/zoom_over/${param.cons}`, data, {
            headers
        })
        .then(res => {
            return res.data;
        });
}


async function getRate(param) {
    headers.token = await sessions.getSess("@Token");

    return await axios
        .post(`${api}/zoom_rate/${param.cons}`, param, {
            headers
        })
        .then(res => {
            return res.data;
        });
}

async function getStartHour(param) {
    headers.token = await sessions.getSess("@Token");

    return await axios
        .post(`${api}/addStart/${param.cons}`, param, {
            headers
        })
        .then(res => {
            return res.data;
        });
}
