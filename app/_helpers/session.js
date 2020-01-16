import AsyncStorage from "@react-native-community/async-storage";

export const sessions = {
    setSess,
    getSess,
    destroySess
}

async function setSess(name, data) {
    try {
        const datas = data ? data : "";
        await AsyncStorage.setItem(name, JSON.stringify(datas));
        console.log("Data Stored");
    } catch (error) {
        console.log("ErrorStoreData", error);
    }
}

async function getSess(name) {
    try {
        const value = await AsyncStorage.getItem(name);
        const item = JSON.parse(value);
        return item;
    } catch (error) {
        console.log("ErrorGetData", error);
        return "undifined";
    }
}

async function destroySess() {
    try {
        await AsyncStorage.clear();
        console.log("Data Stored");
    } catch (error) {
        console.log("ErrorStoreData", error);
    }
}