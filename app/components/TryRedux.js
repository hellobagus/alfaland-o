import {createStore} from 'redux'

//REDUCEr
const reducer = function(state,action){
    if(action.type == "INC"){
        return state + action.payload;
    }
    if(action.type == "DEC"){
        return state - action.payload;
    }
    return state;
}

const store = createStore(reducer, 0);

//SUBSCRIPBTION
store.subscribe(()=>{
    console.log('store changed', store.getState())
})

//DISPATCH
store.dispatch({type : "INC",payload:1});
store.dispatch({type : "INC",payload:10});
store.dispatch({type : "DEC",payload:11});