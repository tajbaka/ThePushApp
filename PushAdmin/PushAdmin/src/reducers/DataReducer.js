import { DATA_FETCH_SUCCESS } from '../actions/types';

const INITIAL_STATE = { 
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DATA_FETCH_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};
