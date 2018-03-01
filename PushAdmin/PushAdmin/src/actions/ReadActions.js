import firebase from 'firebase';
import { DATA_FETCH_SUCCESS } from './types';

export const dataFetch = (user) => {
    var d = new Date();
    return (dispatch) => {
        return fetch('https://us-central1-push-b4d4b.cloudfunctions.net/admin_dashboard?uid=' + user.uid)
        .then((response) =>
            response.json()
        )
        .then((responseJson) => {
            dispatch({ type: DATA_FETCH_SUCCESS, payload: responseJson });
        })
        .catch((error) => {
            console.error(error);
        });
    }
}