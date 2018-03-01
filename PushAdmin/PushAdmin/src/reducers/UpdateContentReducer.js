import { UPDATE_CONTENT, UPDATE_CONTENT_SUCCESS, UPDATE_CONTENT_ERROR, DELETE_CONTENT, DELETE_CONTENT_ERROR, DELETE_CONTENT_SUCCESS } from '../actions/types';

const INITIAL_STATE = { 
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DELETE_CONTENT:
            return { loading: true };
        case DELETE_CONTENT_ERROR:
            return { ...state, ...INITIAL_STATE, msg: action.payload}
        case DELETE_CONTENT_SUCCESS: 
            return { ...state, ...INITIAL_STATE, msg: action.payload}
        case UPDATE_CONTENT:
            return { loading: true };
        case UPDATE_CONTENT_ERROR :
            return { ...state, ...INITIAL_STATE, msg: action.payload}
        case UPDATE_CONTENT_SUCCESS:
            return { ...state, ...INITIAL_STATE, msg: action.payload}
        default:
            return state;
    }
};