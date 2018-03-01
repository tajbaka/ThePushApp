import { EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER, LOGOUT_USER, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAIL } from '../actions/types';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case EMAIL_CHANGED:
            return {...state, email: action.payload};
        case PASSWORD_CHANGED:
            return {...state, password: action.payload};
        case LOGOUT_USER:
            return { ...state, loading: true };
        case LOGOUT_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: null };
        case LOGOUT_USER_FAIL:
            return { ...state, error: action.payload, loading: false}; 
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: action.payload };
        case LOGIN_USER_FAIL:
            return { ...state, error: action.payload, loading: false, password: '' };
        default:
            return state;
    }
};