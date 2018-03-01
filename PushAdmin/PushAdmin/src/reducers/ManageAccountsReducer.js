import { APPROVE_ACCOUNT, APPROVE_ACCOUNT_SUCCESS, APPROVE_ACCOUNT_ERROR } from '../actions/types';

const INITIAL_STATE = { 
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case APPROVE_ACCOUNT:
            return { loading: true };
        case APPROVE_ACCOUNT_ERROR:
            return { ...state, ...INITIAL_STATE, msg: action.payload}
        case APPROVE_ACCOUNT_SUCCESS:
            console.log(action.payload,'success account');
            return { ...state, ...INITIAL_STATE, msg: action.payload}
        default:
            return state;
    }
};
