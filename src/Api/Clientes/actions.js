import * as actionTypes from './actionTypes';
import { connector } from '../Connector/connector.js';

export const getAllClientes = () => {
    return async (dispatch) => {
        const result = await connector(`clientes/activos`, 'GET', {},{}).then((response) => {
            dispatch({
                type: actionTypes.GET_ALL_CLIENTES,
                payload: response.data,
            });
            return response;
        }).catch(err => {
            dispatch({
                type: actionTypes.GET_ALL_CLIENTES,
                payload: err.data,
            });
            return err.response;
        });
        return result && result.response ? result.response.data : result.data;
    }
}

export const addCliente = (body) => {
    return async (dispatch) => {
        const result = await connector(`clientes`, 'POST', body, {}).then((response) => {
            dispatch({
                type: actionTypes.ADD_CLIENTE,
                payload: response.data,
            });
            return response;
        }).catch(err => {
            dispatch({
                type: actionTypes.ADD_CLIENTE,
                payload: err.data,
            });
            return err.response;
        });
        return result && result.response ? result.response.data : result.data;
    }
}

export const deleteCliente = (id) => {
    return async (dispatch) => {
        const result = await connector(`clientes?id=${id}`, 'DELETE', {}, {}).then((response) => {
            dispatch({
                type: actionTypes.DELETE_CLIENTE,
                payload: response.data,
            });
            return response;
        }).catch(err => {
            dispatch({
                type: actionTypes.DELETE_CLIENTE,
                payload: err.data,
            });
            return err.response;
        });
        return result && result.response ? result.response.data : result.data;
    }
}

export const alterCliente = (body) => {
    return async (dispatch) => {
        const result = await connector(`clientes`, 'PUT', body, {}).then((response) => {
            dispatch({
                type: actionTypes.ALTER_CLIENTE,
                payload: response.data,
            });
            return response;
        }).catch(err => {
            dispatch({
                type: actionTypes.ALTER_CLIENTE,
                payload: err.data,
            });
            return err.response;
        });
        return result && result.response ? result.response.data : result.data;
    }
}