﻿/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        // Enable to debug issues.
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

        window.plugins.OneSignal.init("f726f088-5d47-42e1-bf68-6c293302ecb3",
                                        { googleProjectNumber: "867553565277" },
                                        app.didReceiveRemoteNotificationCallBack);
    },
    didReceiveRemoteNotificationCallBack: function (jsonData) {
        alert("Notification received:\n" + JSON.stringify(jsonData));
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    }
};

function sendTag() {
    window.plugins.OneSignal.sendTag("PhoneGapKey", "PhoneGapValue");
}
function getIds() {
    window.plugins.OneSignal.getIds(function (ids) {
        document.getElementById("OneSignalUserId").innerHTML = "UserId: " + ids.userId;
        document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + ids.pushToken;
        console.log('getIds: ' + JSON.stringify(ids));
    });
}
*/

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    var fields = {
        // note: you can use a single tracking id for both the app and the website,
        // don't worry it won't mix the data. More about this in the 3rd section
        trackingId: 'UA-113062402-1'
    };

    // if we are in the app (the protocol will be file://)
    if (document.URL.indexOf('http://') !== 0) {

        // we store and provide the clientId ourselves in localstorage since there are no
        // cookies in Cordova
        fields.clientId = localStorage.getItem('ga:clientId');
        // disable GA's cookie storage functions
        fields.storage = 'none';

        ga('create', fields);

        // prevent tasks that would abort tracking
        ga('set', {
            // don't abort if the protocol is not http(s)
            checkProtocolTask: null,
            // don't expect cookies to be enabled
            checkStorageTask: null
        });

        // a callback function to get the clientId and store it ourselves
        ga(function (tracker) {
            localStorage.setItem('ga:clientId', tracker.get('clientId'));
        });

        // send a screenview event
        ga('send', {
            // these are the three required properties, check GA's doc for the optional ones
            hitType: 'screenview',
            // you can edit these two values as you wish
            screenName: '/index.html',
            appName: 'Forbooks'
        });
    }
        // if we are in a browser
    else {

        ga('create', fields);

        // send a pageview event
        ga('send', {
            // this is required, there are optional properties too if you want them
            hitType: 'pageview'
        });
    }



    /* (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

var GA_LOCAL_STORAGE_KEY = 'ga:clientId';
ga('create', 'UA-113062402-1', {
    'storage': 'none',
    'clientId': localStorage.getItem(GA_LOCAL_STORAGE_KEY)
});
ga(function (tracker) {
    localStorage.setItem(GA_LOCAL_STORAGE_KEY, tracker.get('clientId'));
});
ga('send', 'pageview');
 */
    // console.log(ga.q)
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
   

    var notificationOpenedCallback = function (jsonData) {
       // console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        //var message = JSON.stringify(jsonData);
        
        if (jsonData.notification.payload.additionalData.type=="book_match") {
            window.localStorage.setItem("book_request_received", "1");
            window.localStorage.setItem("book_request_name", jsonData.notification.payload.additionalData.book_name)
            location.href = "#/app/news"

        }

        else if (jsonData.notification.payload.additionalData.type == "incoming_message") {
          /*  function message_received() {
                var contact_list = JSON.parse(window.localStorage.getItem("contacteds"));
                if (contact_list != null) {
                    for (var i = 0; i < contact_list.length; i++) {
                        if (contact_list[i].title == jsonData.notification.payload.additionalData.title && contact_list[i].id == jsonData.notification.payload.additionalData.from) {
                            (contact_list[i].messageThread).push({
                                userId: window.localStorage.getItem("id"),
                                text: jsonData.notification.payload.additionalData.message,
                                float: 'right',
                                classify: 'mes2'
                            })
                        }

                        else if (i == contact_list.length - 1 && (contact_list[i].id != jsonData.notification.payload.additionalData.from || contact_list[i].title != jsonData.notification.payload.additionalData.title)) {
                            contact_list.push({
                                userId: window.localStorage.getItem("id"),
                                title: window.localStorage.getItem("target_book"),
                                lastMessage: message,

                                messageThread: [{
                                    userId: window.localStorage.getItem("id"),
                                    text: jsonData.notification.payload.additionalData.message,
                                    float: 'right',
                                    classify: 'mes2',
                                    time: d

                                }]
                            })
                            //  contacteds[contacteds.length - 1].messageThread.push(message);
                        }
                    }
                }

                else {
                    var contact_list = [{
                        userId: window.localStorage.getItem("id"),
                        text: jsonData.notification.payload.additionalData.message,
                        float: 'right',
                        classify: 'mes2'

                    }]

                }
                window.localStorage.setItem("contacteds", JSON.stringify(contact_list));
                return "#/app/messages";
            }
            
            location.href = message_received();*/

            /*
                if (typeof window.localStorage.getItem("contacteds") != 'undefined') {
                    var contact_list = window.localStorage.getItem("contacteds");
                    contact_list.push({
                        id: JSON.parse(jsonData.notification.payload.additionalData.from),
                        title: JSON.parse(jsonData.notification.payload.additionalData.title),
                        lastMessage: JSON.parse(jsonData.notification.payload.additionalData.message),
                        messageThread:{
                            userId: window.localStorage.getItem("id"),
                            text: JSON.parse(jsonData.notification.payload.additionalData.message),
                            float: 'right',
                            classify: 'mes2'
                    }
                    })

             /*       if (typeof contact_list[0].messageThread != 'undefined') {
                        contact_list[0].messageThread.push({
                            userId: window.localStorage.getItem("id"),
                            text: JSON.parse(jsonData.notification.payload.additionalData.message),
                            float: 'right',
                            classify: 'mes2'
                        });

                    }
                    else {
                        contact_list[0].messageThread.push({
                            userId: window.localStorage.getItem("id"),
                            text: JSON.parse(jsonData.notification.payload.additionalData.message),
                            float: 'right',
                            classify: 'mes2'
                        });

                    }
                    window.localStorage.setItem("contacteds", JSON.stringify(contact_list));
                    location.href = '#/app/messages';
                }
                else {
                    var contact_list = [{}];
                    contact_list[0] = {
                        id: JSON.parse(jsonData.notification.payload.additionalData.from),
                        title: JSON.parse(jsonData.notification.payload.additionalData.title),
                        lastMessage: JSON.parse(jsonData.notification.payload.additionalData.message),
                        messageThread: {
                            userId: window.localStorage.getItem("id"),
                            text: JSON.parse(jsonData.notification.payload.additionalData.message),
                            float: 'right',
                            classify: 'mes2'
                        }
                    }
                    contact_list[0].messageThread = {
                        userId: window.localStorage.getItem("id"),
                        text: JSON.parse(jsonData.notification.payload.additionalData.message),
                        float: 'right',
                        classify: 'mes2'
                    }
                    window.localStorage.setItem("contacteds", JSON.stringify(contact_list));
                    location.href = '#/app/messages';
                }
            
            */
     /*       var contact_list = {
                id: jsonData.notification.payload.additionalData.from,
                title: jsonData.notification.payload.additionalData.title,
                lastMessage: jsonData.notification.payload.additionalData.message,
                messageThread: {
                    userId: window.localStorage.getItem("id"),
                    text: jsonData.notification.payload.additionalData.message,
                    float: 'right',
                    classify: 'mes2'
                }
            }
            window.localStorage.setItem("contacteds", JSON.stringify(contact_list));
            location.href = '#/app/messages';
       */
            if (window.localStorage.getItem("contacteds") != null) {
                var contacteds = [{}];
                contacteds = JSON.parse(window.localStorage.getItem("contacteds"));
                for (var i = 0; i < contacteds.length; i++) {
                    if (contacteds[i].id == jsonData.notification.payload.additionalData.from && contacteds[i].title == jsonData.notification.payload.additionalData.title) {
                        contacteds[i].lastMessage = jsonData.notification.payload.additionalData.message;
                        if (typeof contacteds[i].messageThread == 'undefined') {
                            contacteds[i].messageThread = [{
                                userId: jsonData.notification.payload.additionalData.from,
                                text: jsonData.notification.payload.additionalData.message,
                                time: '12:15 PM',
                                float: 'right',
                                classify: 'mes2',
                                
                            }];
                        }
                        else {

                            (contacteds[i].messageThread).push({
                                userId: jsonData.notification.payload.additionalData.from,
                                text: jsonData.notification.payload.additionalData.message,
                                time: '12:15 PM',
                                float: 'right',
                                classify: 'mes2',
                               
                            });


                        }

                        break;
                    }
                    else if (i == contacteds.length - 1 && (contacteds[i].id != jsonData.notification.payload.additionalData.from || contacteds[i].title != jsonData.notification.payload.additionalData.title)) {
                        contacteds.push({
                            id: jsonData.notification.payload.additionalData.from,
                            title: jsonData.notification.payload.additionalData.title,
                            lastMessage: jsonData.notification.payload.additionalData.message,

                            messageThread: [{
                                userId: jsonData.notification.payload.additionalData.from,
                                text: jsonData.notification.payload.additionalData.message,
                                float: 'right',
                                classify: 'mes2',
                                time: '12:15 PM'

                            }]
                        })
                        //  contacteds[contacteds.length - 1].messageThread.push(message);
                    }
                }


                window.localStorage.setItem("contacteds", JSON.stringify(contacteds));
               
            }
            else {
                var contacteds = [{}];
                contacteds.push({
                    id: jsonData.notification.payload.additionalData.from,
                    title: jsonData.notification.payload.additionalData.title,
                    lastMessage: jsonData.notification.payload.additionalData.message
                });
                /*    if ($scope.contacted!=null){
                    $scope.contacted.push({
                        id: window.localStorage.getItem("target_user"),
                        title: window.localStorage.getItem("target_book"),
                        lastMessage: message
                    });
                        $scope.$apply();
                    }*/
                window.localStorage.setItem("contacteds", JSON.stringify(contacteds));
               

            }

            location.href = '#/app/news'



        }

    };

    window.plugins.OneSignal
      .startInit("f726f088-5d47-42e1-bf68-6c293302ecb3")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
 /*   
    var analytics = window.ga;
    if (typeof analytics !== "undefined") {
   */

    /*
    }
    else {
        console.log("Google analytics not started");
    }*/
    // Call syncHashedEmail anywhere in your app if you have the user's email.
    // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
    // window.plugins.OneSignal.syncHashedEmail(userEmail);
}, false);