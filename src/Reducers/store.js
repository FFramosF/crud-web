import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import ClientesReducer from '../Api/Clientes/clientesReducer';
import thunk from 'redux-thunk';


const ApiReducer = combineReducers({
    ClientesReducer: ClientesReducer,

});

const store = legacy_createStore(ApiReducer, applyMiddleware(thunk));

export default store;