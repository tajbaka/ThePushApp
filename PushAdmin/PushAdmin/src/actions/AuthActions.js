import firebase from 'firebase';
import { EMAIL_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER, LOGOUT_USER, LOGOUT_USER_SUCCESS, LOGOUT_USER_ERROR } from './types';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const loginUser = ({ email, password }) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user){
            console.log('success', user);
            loginUserSuccess(dispatch, user)
        })
        .catch((error) => {
            console.log('error');
            loginUserFail(dispatch)
        });
    }
};

export const logoutUser = () => {
    return (dispatch) => {
        dispatch({ type: LOGOUT_USER });
        firebase.auth().signOut().then(function() {
            dispatch({ type: LOGOUT_USER_SUCCESS });
        }, 
        function(error) {
            dispatch({ type: LOGOUT_USER_ERROR });
        });
    }
};

export const quickLogin = () => {
    return (dispatch) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                loginUserSuccess(dispatch, user);
            }
            else{
                loginUserFail(dispatch, user);
            }
        });
    }
}

const loginUserFail = (dispatch) => {
    console.log('fail login');
    dispatch({
        type: LOGIN_USER_FAIL
    });
};

const loginUserSuccess = (dispatch, user) => {
    console.log('success login');
    dispatch({
        type: LOGIN_USER_SUCCESS, 
        payload: user
    });
};