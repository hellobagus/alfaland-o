import AsyncStorage from "@react-native-community/async-storage";

export const _storeData = async (name,data) =>{
    try {
        const datas = data ? data : ''
        await AsyncStorage.setItem(name,JSON.stringify(datas))
        console.log('Data Stored');
    } catch (error) {
        console.log('ErrorStoreData', error)
    }
}

export const _getData = async (name) => {
    try {
        const value = await AsyncStorage.getItem(name)
        const item = JSON.parse(value)
        return item
        
    } catch(error) {
        console.log('ErrorGetData', error)
    }
}
