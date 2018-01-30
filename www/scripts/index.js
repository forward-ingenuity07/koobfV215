/*
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

            var contact_list = JSON.parse(window.localStorage.getItem("contacteds"));
            if (contact_list != null) {
                for (var i = 0; i < contact_list.length; i++) {
                    if (contact_list[i].title == jsonData.notification.payload.additionalData.type && contact_list[i].id == jsonData.notification.payload.additionalData.from) {
                        (contact_list[i].messageThread).push({
                            userId: window.localStorage.getItem("id"),
                            text: $scope.data.message,
                            float: 'right',
                            classify: 'mes2'        


                        })
                    }
                }
            }

            window.localStorage.setItem("book_request_received", "1");
            window.localStorage.setItem("book_request_name", jsonData.notification.payload.additionalData.book_name)
            location.href = "#/app/messages"

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