import firebase from 'firebase';
import { APPROVE_ACCOUNT, APPROVE_ACCOUNT_SUCCESS, APPROVE_ACCOUNT_ERROR, UPDATE_CONTENT, UPDATE_CONTENT_SUCCESS, UPDATE_CONTENT_ERROR, DELETE_CONTENT, DELETE_CONTENT_ERROR, DELETE_CONTENT_SUCCESS } from './types';
import axios from 'axios';


export const approveAccount = (user, email ) => {
    return (dispatch) => {
        dispatch({ type: APPROVE_ACCOUNT });
        return fetch('https://us-central1-push-b4d4b.cloudfunctions.net/approve_account?uid=' + user.uid,
        {
            method: 'POST',
            body: JSON.stringify({
                email: email
            })
        })
        .then((response) =>
            response.json()
        )
        .then((responseJson) => {
            console.log(responseJson, 'this is the response');
            dispatch({ type: APPROVE_ACCOUNT_SUCCESS, payload: responseJson });
        })
        .catch((error) => {
            console.log(error, 'this is the logged error');
            dispatch({ type: APPROVE_ACCOUNT_ERROR, payload: error });
        });
    }
}

export const whenPracticeChanged = (text) => {
    return {
        type: WHEN_PRACTICE_CHANGED,
        payload: text
    };
};

export const wherePracticeChanged = (text) => {
    return {
        type: WHERE_PRACTICE_CHANGED,
        payload: text
    };
};

export const howPracticeChanged = (text) => {
    return {
        type: HOW_PRACTICE_CHANGED,
        payload: text
    };
};

export const deleteContent = (user, uid) => {
   return (dispatch) => {
        dispatch({ type: DELETE_CONTENT });
        axios.post('https://us-central1-push-b4d4b.cloudfunctions.net/deleteContent?uid=' + user.uid,
        {
            uid: uid,
        }).then(function (response) {
            console.log(response, 'this is the response');
            dispatch({ type: DELETE_CONTENT_SUCCESS, payload: response });
        })
        .catch(function (error) {
            console.log(error, 'error');
            dispatch({ type: DELETE_CONTENT_ERROR, payload: error });
        }); 
   }
}

export const updateContent = (user, primaryImageFile, secondaryImageFile, recordingFile, uid, name, description ) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_CONTENT });
        var storageRef = firebase.storage().ref();
        const primaryImagesRef = storageRef.child('/images/' + uid.level + uid.tool + uid.practice + '/' + 'sourcePrimary');
        const secondaryImagesRef = storageRef.child('/images/' + uid.level + uid.tool + uid.practice + '/' + 'sourceSecondary');
        const recordingsRef = storageRef.child('/recordings/' + uid.level + uid.tool + '/' + uid.recording);

        var imagePrimaryUrl, imageSecondaryUrl;
        var promiseChain = [];
        var referenceChain = [];
        var recording;

        if(primaryImageFile != null){
            promiseChain.push(primaryImagesRef.put(primaryImageFile));
            referenceChain.push('primaryImage');
        }
        if(secondaryImageFile != null){
            promiseChain.push(secondaryImagesRef.put(secondaryImageFile));
            referenceChain.push('secondaryImage');
        }
        if(recordingFile != null){
            if(recordingFile == 'remove'){
                try {
                    promiseChain.push(recordingsRef.delete());
                    recording = 'remove';
                }
                catch(err) {}
            }
            else{
                console.log('here')
                promiseChain.push(recordingsRef.put(recordingFile));
                recording = {
                    duration: '4:00',
                    name: recordingFile.name
                }
            }
            referenceChain.push('recording');
        }

        Promise.all(promiseChain).then(response => {
            primaryImageFile != null ? imagePrimaryUrl = response[referenceChain.indexOf('primaryImage')].downloadURL : null;
            secondaryImageFile != null ? imageSecondaryUrl = response[referenceChain.indexOf('secondaryImage')].downloadURL : null;
            (recordingFile != null && recordingFile != 'remove') ? recording.sourceAudio = response[referenceChain.indexOf('recording')].downloadURL : null; 
            
            // console.log(uid, 'uid');
            axios.post('https://us-central1-push-b4d4b.cloudfunctions.net/newContent?uid=' + user.uid,
            {
                uid: uid,
                name: name,
                description: description,
                imagePrimaryUrl: imagePrimaryUrl,
                imageSecondaryUrl: imageSecondaryUrl,
                recording
            }).then(function (response) {
                console.log(response, 'this is the response');
                dispatch({ type: UPDATE_CONTENT_SUCCESS, payload: response });
            })
            .catch(function (error) {
                console.log(error, 'error');
                dispatch({ type: UPDATE_CONTENT_ERROR, payload: error });
            });
        });
    }
}