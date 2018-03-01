'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var _ = require('lodash');
const fbId = "push-b4d4b";
const cors = require('cors')({origin: true});
const UUID = require("uuid/v4");
var serviceAccount = require("./serviceAccountKey.json");
var fs = require('fs');
var mm = require('musicmetadata');
const adminUidArray = ['8KoDAOds7khT5JpYEQQZs1Trae02','vQHYbkMv9OW2YuPNAv8jebCq6j82'];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${fbId}.appspot.com`,
  databaseURL: "https://push-b4d4b.firebaseio.com"
});
var bucket = admin.storage().bucket();

// Dashboard function (INPUT: user uid, OUTPUT: dashboard info obj)
exports.user_dashboard = functions.https.onRequest((req, res) => {
    var d = new Date();
    console.log('this is the getUserData call', d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
    cors(req, res, () => {
        const userUid = req.query.uid;
        getUserData(userUid).then(response => {
            var d = new Date();
            console.log('this is the getUserData Response Time', d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
            console.log(response, 'this is the getUserData Response');
            res.status(200).json(response);
        }).catch(err => {
            console.log(err, 'this is getUserData Error');
            res.status(200).json(err);
        })
    })
})

exports.admin_dashboard = functions.https.onRequest((req, res) => {
    var d = new Date();
    console.log('this is the getAdminData call', d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
    cors(req, res, () => {
        const userUid = req.query.uid;
        getAdminData(userUid).then(response => {
            var d = new Date();
            console.log('this is the getAdminData Response Time', d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
            console.log(response, 'this is the getAdminData Response');
            res.status(200).json(response);
        }).catch(err => {
            console.log(err, 'this is getAdminData Error');
            res.status(200).json(err);
        })
    })
})

exports.practice_modify = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const body = JSON.parse(req.body);
        const userUid = req.query.uid;
       
        handlePracticeNotes(userUid, body).then(response => {
            console.log(response,'handlePracticesNotes Call Success');

            handleFavouritePractices(userUid, body).then(response => {
                console.log(response,'handleFavouritePractices Call Success');

                handleNotificationPractices(userUid, body).then(response => {
                    console.log(response,'handleNotificationPractices Call Success');
                    res.status(200).json('Success');
                })
                .catch((err) => {
                    console.log(err,'handleNotificationPractices Call Error');
                    res.status(400).json(err);
                });
            })
            .catch((err) => {
                console.log(err,'handleFavouritePractices Call Error');
            });

        }).catch((err) => {
            console.log(err,'handlePracticesNotes Practices Call Error');
        });
    })
});

exports.register_account = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const body = JSON.parse(req.body);
        const userUid = req.query.uid;
        admin.database().ref ('/newusers/' + userUid).set({
            email: body['email'],
            firstName: body['firstName'],
            lastName: body['lastName'],
            level: {
                name: body['levelName'],
                index: body['levelIndex'] 
            }
        }).then(response => {
            res.status(200).json('Success');
        }).catch(err => {
            res.status(200).json('Error');
        });
    });
});

exports.approve_account = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const body = JSON.parse(req.body);
        const adminUid = req.query.uid;

       if(adminUidArray.indexOf(adminUid) != -1) {
            admin.database().ref('/newusers/').once('value').then(newusersRaw => {
                var newusers = newusersRaw.val();
                for(var key in newusers){
                    var newuser = newusers[key];
                    if(newuser.email == body.email){
                        var newUserKey = JSON.parse(JSON.stringify(key));

                        console.log(body);
                        console.log(newuser.email);
                        console.log(newUserKey);

                        admin.database().ref('/users/' + newUserKey).set(newuser).then(response => {
                            admin.database().ref('/newusers/' + newUserKey).remove().then(response => {
                                res.status(200).json('Success');
                            }).catch(err => {
                                res.status(200).json('Error');
                            });
                        }).catch(err => {
                            res.status(200).json('Error');
                        });
                    }
                }
            }).catch(err => {
                res.status(200).json('Error');
            });
        }
       else{ 
            res.status(201).json({error: "Non-admin user, cannot create delete content"});
       }
    });
});

exports.deleteContent = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const adminUid = req.query.uid;
        const body = req.body;
        
       // Ensure request is coming from an admin user
       if(adminUidArray.indexOf(adminUid) != -1) {
           const uid = body.uid;
           var location;

            if(uid.practice){
                location = '/generic/levels/' + uid.level + '/tools/' + uid.tool + '/practices/' + uid.practice;
            }
            else if(uid.tool){
                location = '/generic/levels/' + uid.level + '/tools/' + uid.tool;
            }
            else if(uid.level){
                location = '/generic/levels/' + uid.level;
            }

            admin.database().ref(location).remove().then(response => {
                res.status(200).send('New content successfully updated');
            })
           console.log(uid, 'the uid in delete');
       }
       else{ 
            res.status(201).json({error: "Non-admin user, cannot create delete content"});
       }
    })
});

// ADMIN FUNCTIONS
exports.newContent = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const adminUid = req.query.uid;
        const body = req.body;

        // Ensure request is coming from an admin user
        if(adminUidArray.indexOf(adminUid) != -1) {
            const uid = body.uid;
            var location, recordLocation;
            var locationSecond = null;
            
            if(uid.practice){
                location = '/generic/levels/' + uid.level + '/tools/' + uid.tool + '/practices/' + uid.practice;
                locationSecond = '/generic/practices/' + uid.level + uid.tool + uid.practice;
            }
            else if(uid.tool){
                location = '/generic/levels/' + uid.level + '/tools/' + uid.tool;
                recordLocation = location + '/recordings/' + uid.recording;
            }
            else if(uid.level){
                location = '/generic/levels/' + uid.level;
            }

            var promiseChain = [ admin.database().ref(location).update({name: body['name'], description: body['description'], totalUid: uid.level + uid.tool + uid.practice}) ]                      

            if(locationSecond != null){
                promiseChain.push( admin.database().ref(locationSecond).update({name: body['name'], description: body['description'], totalUid: uid.level + uid.tool + uid.practice}) );
            }
            if(body['imagePrimaryUrl']){
                promiseChain.push( admin.database().ref(location).update({sourcePrimary: body['imagePrimaryUrl']}) );
                if(locationSecond != null){
                    promiseChain.push( admin.database().ref(locationSecond).update({sourcePrimary: body['imagePrimaryUrl']}) );
                }
            }
            if(body['imageSecondaryUrl']){
                promiseChain.push( admin.database().ref(location).update({sourceSecondary: body['imageSecondaryUrl']}) );
                if(locationSecond != null){
                    promiseChain.push( admin.database().ref(locationSecond).update({sourceSecondary: body['imageSecondaryUrl']}) );
                }
            }
            if(body['recording']){
                if(body['recording'] == 'remove'){
                    promiseChain.push( admin.database().ref(recordLocation).remove()); 
                }
                else{
                    promiseChain.push( admin.database().ref(recordLocation).update(body['recording']));
                }
            }

            console.log(recordLocation, 'full path');

            Promise.all(promiseChain).then(response => {
                res.status(200).send('New content successfully updated');
            });
        } else {
            res.status(201).json({error: "Non-admin user, cannot create new level"});
        }
    })
});

// exports.add_recording = functions.https.onRequest((req, res) => {
//     cors(req, res, () => {

//         upload('./test.png', 'images/test.png').then( downloadURL => {
//            console.log(downloadURL, 'downloadURL');
//         });

//         var parser = mm(fs.createReadStream('./queen.mp3'), { duration: true }, function (err, metadata) {
//             if (err) throw err;
//             console.log(metadata.duration, 'duration');
//         });

//         res.status(200).json('Success');
//     });
// });

// var upload = (localFile, remoteFile) => {

//   let uuid = UUID();

//   return bucket.upload(localFile, {
//         destination: remoteFile,
//         uploadType: "media",
//         metadata: {
//           contentType: 'image/png',
//           metadata: {
//             firebaseStorageDownloadTokens: uuid
//           }
//         }
//       })
//       .then((data) => {
//           let file = data[0];
//           return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
//       });
// }

function getAdminData(userUid){
    return new Promise((res, rej) => {
        var responseObj = {};
        var promiseChain = [admin.database().ref('/generic').once('value'),  admin.database().ref('/users/').once('value'), admin.database().ref('/newusers/').once('value')]

        Promise.all(promiseChain).then(response => {
            responseObj['levelData'] = response[0].val().levels;
            responseObj['userData'] = response[1].val();
            responseObj['newUserData'] = response[2].val();
            res(responseObj);
        });
    });
}

function getUserData(userUid){
    return new Promise((res, rej) => {
        var responseObj = {};
        var promiseChain = [admin.database().ref('/generic').once('value'),  admin.database().ref('/users/' + userUid).once('value')]

        Promise.all(promiseChain).then(response => {
            responseObj['quote'] = response[0].val().quote;
            responseObj['levelData'] = response[0].val().levels;
            responseObj['practiceData'] = response[0].val().practices;
            responseObj['userData'] = response[1].val();
            res(responseObj);
        });
    });
}

function handlePracticeNotes(userUid, body){

    return new Promise((res, rej) => {

        var whenPractice, wherePractice, howPractice;

        body['whenPractice'] ? whenPractice = body['whenPractice'] : whenPractice = '';
        body['wherePractice'] ? wherePractice = body['wherePractice'] : wherePractice = '';
        body['howPractice'] ? howPractice = body['howPractice'] : howPractice = '';

        admin.database().ref ('/users/' + userUid + '/practiceNotes/' + body['totalUid']).set({
                name: body['practiceName'],
                whenPractice: whenPractice,
                wherePractice: wherePractice,
                howPractice: howPractice
        }).then(response => {
            res(response);
        }).catch(err => {
            rej(err);
        });
    });
}

function handleFavouritePractices(userUid, body){
    return new Promise((res, rej) => {

        admin.database().ref('/users/' + userUid + '/favouritePractices').once('value').then(favPracticesRaw => {
            var favPractices = favPracticesRaw.val();
            const practiceSize = _.size(favPractices);
            var oldestPractice, oldestPracticeKey;

            if (body['priority'] == "YES"){
                if(practiceSize >= 3) {
                    for (var key in favPractices) {
                        if(!oldestPractice || favPractices[key].date < oldestPractice.date){
                            oldestPracticeKey = key;
                            oldestPractice = favPractices[key];
                        }
                    }

                    removeFavPractice(userUid, oldestPracticeKey).then(response => {
                        addFavPractice(userUid, body).then(response => {
                            console.log(response, 'handle removeFavPractice error');
                            res(response);
                        })
                        .catch((err) => {
                            console.log('handle removeFavPractice error');
                            rej(Error("Failed With" + err));
                        })
                    })
                }
                else{
                    addFavPractice(userUid, body).then(response => {
                        res(response);
                    })
                    .catch((err) => {
                        rej(Error("Failed With" + err));
                    })
                }
            }
            else if (body['priority'] == "NO"){
            removeFavPractice(userUid, body['totalUid'])
            .then(response => {
                    console.log(response, 'handle removeFavPractice error');
                    res(response);
                })
                .catch((err) => {
                    console.log('handle removeFavPractice error');
                    rej(Error("Failed With" + err));
                }) 
            }
        });
    });
}

function handleNotificationPractices(userUid, body){

    return new Promise((res, rej) => {

        var timeInSec = false;
        var dayValue = false;
        
        console.log(body['time'], 'time');
        console.log(body['dayValue'], 'dayValue');
        
        if(body['time'] != null){
            var timeArr = body['time'].split(':');
            timeInSec = convertTimeToSeconds(timeArr[0], timeArr[1], 0);
        }

        if(body['dayValue'] != 0){
           dayValue = true
        }

        if(body['reminder'] == 'YES' && timeInSec && dayValue){
            admin.database().ref('/users/' + userUid + '/notifications/' + body['totalUid']).set(
            {
                day: body['dayValue'],
                time: body['time'],
                timeInSec: timeInSec,
            })
            admin.database().ref('/notificationPractices/' + userUid + ':' + body['totalUid']).set(
            {
                day: body['dayValue'],
                time: body['time'],
                timeInSec: timeInSec,
                practiceName: body['practiceName'],
                totalUid: body['totalUid'],
                userUid : userUid,
                notify: true
            }).then(response => {
                res('success');
            }).catch(err => {
                rej(err);
            })
        }
        else if (body['reminder'] == 'YES' && !timeInSec && !dayValue){
            rej('nullDays&TimeError');
        }
        else if (body['reminder'] == 'YES' && !timeInSec){
            rej('nullTimeError');
        }
        else if (body['reminder'] == 'YES' && !dayValue){
            rej('nullDaysError');
        }
        else if (body['reminder'] == 'NO'){
            admin.database().ref('/users/' + userUid + '/notifications/' + body['totalUid']).remove().then(response => {
                admin.database().ref('/notificationPractices/' + userUid + ':' + body['totalUid']).remove();
            }).then(response => {
                res('success');
            }).catch(err => {
                rej(err);
            })
        }
        console.log(timeInSec, 'timeinsec', dayValue, 'dayvalue')
    });
} 

function convertTimeToSeconds(hour, min, sec){
    return(hour * 3600 + min * 60 + sec * 1);
}

function convertSecondsToTime(seconds){
    const hour = Math.floor(seconds/3600);
    const decimal = seconds/3600 - hour;
    const min = Math.floor(60 * decimal);
    const sec = (60 * decimal - min) * 60;

    return time = {
        hour:   hour,
        minute: min,
        second: sec
    };
}
function getFormattedDate() {

   var today = new Date();
   today.setHours(today.getHours() - 5);

   var yyyy = today.getFullYear();
   
   var mm = today.getMonth() + 1;
   if(mm < 10) { mm = '0' + mm}
   
   var dd = today.getDate();
   if(dd < 10) { dd = '0' + dd}

   var day = today.getDay();
   var hour = today.getHours();
   var min = today.getMinutes();

    switch(day){
        case 0: 
            day = 64;
            break;
        case 1: 
            day = 1;
            break;
        case 2: 
            day = 2;
            break;
        case 3: 
            day = 4;
            break;
        case 4: 
            day = 8;
            break;
        case 5: 
            day = 16;
            break;
        case 6: 
            day = 32;
            break;
        default:
            break;
    }

//    console.log(day, 'here is the day');

   var date = {
       year: yyyy,
       month: mm,
       day: dd,
       dayOfWeek: day,
       hour: hour,
       min: min,
   }
   return date;
}



function removeFavPractice(userUid, practiceKey){
    return new Promise((res, rej) => {
        admin.database().ref('/users/' + userUid + '/favouritePractices/' + practiceKey).remove()
        .then(response => {
            console.log(response,'removeFavPractice reponse');
            res(response);
        })
        .catch((err) => {
            console.log('removeFavPractice error');
            rej(Error("Failed With" + err));
        })
    });
}

function addFavPractice(userUid, body){
    return new Promise((res, rej) => {
        admin.database().ref('/users/' + userUid + '/favouritePractices/' + body['totalUid']).set(
        {
            name: body['practiceName'],
            totalUid: body['totalUid'],
            description: body['practiceDescription'],
            sourceSecondary: body['practicesourceSecondary'],
            sourcePrimary: body['practicesourcePrimary'],
            date: body['practiceDate']
        })
        .then(response => {
            res(response); 
        })
        .catch((err) => {
            rej(Error("Failed With" + err));
        })
    });
}

exports.practiceNotificationCronJob = functions.https.onRequest((req, res) => {
    cors(req,res, () => {
        admin.database().ref('/notificationPractices').once('value').then(function(notificationsRaw) {
            var notifications = notificationsRaw.val();
            var uniqueID = notificationsRaw;
            var today = getFormattedDate();
            console.log(today, 'this is today');
            const todaysTime = convertTimeToSeconds(today.hour, today.min, 0);

            for(var key in notifications) {
                var currNotif = notifications[key];
                var userUid = currNotif.userUid;

                console.log(currNotif.day, 'notif Day');
                console.log(currNotif.timeInSec, 'notification time');
                console.log(todaysTime, 'todays time');

                var timeTillAppointment = Math.max(currNotif.timeInSec - todaysTime, 0);

                if(currNotif.day & today.dayOfWeek && timeTillAppointment > 0 && timeTillAppointment <= 60 && currNotif.notify){
                    var notif = currNotif;
                    var id = userUid;

                    console.log('Sending Message to, ' + id);

                    const payload = {
                        notification: {
                            title: notif.practiceName,
                            body: 'Reminder to complete your practice!',
                            sound: "default"
                        },
                        data: {
                            title: notif.totalUid,
                            body: 'Reminder to complete your practice!' 
                        }
                    };

                    let options = { priority: "high" };

                    admin.messaging().sendToTopic(id, payload, options).then(function(success) {
                        admin.database().ref('/notificationPractices/' + id + ':' + notif.totalUid + '/notify').set(false).then(function(response){
                            console.log('notification sent and set to false');
                        })
                    });
                } 
                else if(timeTillAppointment == 0 && !currNotif.notify){
                    var notif = currNotif;
                    var id = userUid;

                    console.log(timeTillAppointment, 'appointment passed');

                    admin.database().ref('/notificationPractices/' + id + ':' + notif.totalUid + '/notify').set(true).then(function(response){
                        console.log('notification reset and set to true');
                    }) 
                }
            }
            res.status(200).send("success");
        });
    });
});
