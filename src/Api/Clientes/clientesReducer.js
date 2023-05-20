import * as actionTypes from './actionTypes';

const initialState = {
    allClientes: undefined,
    addCliente: undefined,
    deleteCliente: undefined,
    alterCliente: undefined,
};

export default function ClientesReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case actionTypes.GET_ALL_CLIENTES:
            return Object.assign({}, state, {
                allClientes: action.payload,
            });
        case actionTypes.ADD_CLIENTE:
            return Object.assign({}, state, {
                addCliente: action.payload,
            });
        case actionTypes.DELETE_CLIENTE:
            return Object.assign({}, state, {
                deleteCliente: action.payload,
            });
        case actionTypes.ALTER_CLIENTE:
            return Object.assign({}, state, {
                alterCliente: action.payload,
            });
        default: return state;
    }
}