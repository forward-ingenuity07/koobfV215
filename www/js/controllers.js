angular.module('mobionicApp.controllers', [])

// Home Controller
.controller('HomeCtrl', function($scope, $http, Data) {
    
    $scope.items = Data.items;
    $http({ method: 'GET', url: 'http://www.forwardingenuity.com/user_online.php' }).then(function (response) {

        return;
    });


})

// News Controller
.controller('NewsCtrl', function($scope,$filter,$window, $ionicLoading, NewsData,$ionicPopup, $ionicScrollDelegate, NewsStorage) {
    
    $scope.news = [];
    $scope.storage = '';
    $scope.filtered = [];
    var filtered = $scope.filtered;
    $scope.check = function (parent,index) {
        window.localStorage.setItem("book_choose", JSON.stringify(parent.filtered[index]));
        window.localStorage.setItem("book_choose", JSON.stringify(parent.filtered[index]))
        $scope.$emit('book_select', [1, 2, 3]);
        $scope.$broadcast('book_select', [1, 2, 3]);
    }
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });

    if (window.localStorage.getItem("book_request_received") == "1") {
        $scope.$emit('book_request_received', [1, 2, 3]);
        $scope.$broadcast('book_request_received', [1, 2, 3]);
        $scope.$on('book_request_received', function (event, data) {
            NewsData.async().then(
       // successCallback
       function () {
           $scope.news = NewsData.getAll();
           $ionicLoading.hide();
           $scope.$apply();
       },
       // errorCallback 
       function () {
           $scope.news = NewsStorage.all();
           $scope.storage = 'Data from local storage';
           $ionicLoading.hide();
       },
       // notifyCallback
       function () { }
   );
        });

      
        var title_request = window.localStorage.getItem("book_request_name");
        title_request = title_request.toUpperCase();
        var alertPopup = $ionicPopup.alert({
            title: 'Book request',
            template: 'A book titled <b>' + title_request + '</b> has been uploaded and can be found by pressing the search button above and typing in the title'
        });
        window.localStorage.setItem("book_request_received", "0");
    }
    
    NewsData.async().then(
        // successCallback
        function() {
            $scope.news = NewsData.getAll();
            $ionicLoading.hide();
        },
        // errorCallback 
        function() {
            $scope.news = NewsStorage.all();
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );
    $scope.receiving = function (event) {
        $scope.bookie = event.target.id;
        $scope.$apply();
    }
    var available_search = false;
    $scope.search_on = available_search;
    $scope.searching = function () {
        
        
        $scope.search_on = !($scope.search_on);
       
            $ionicScrollDelegate.scrollTop();
       
    }

})

    .directive('input', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function (scope, element, attr) {
                element.bind('focus', function (e) {
                    if (scope.onFocus) {
                        $timeout(function () {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function (e) {
                    if (scope.onBlur) {
                        $timeout(function () {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function (e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function () {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })


// New Controller
.controller('NewCtrl', function($scope, $http, $interval, $ionicModal,$stateParams, $ionicLoading, $timeout, $ionicScrollDelegate, NewsData) {
    $interval(function () {
        $scope.contacted = JSON.parse(window.localStorage.getItem("contacteds"));
    },1000)
    $scope.contacted = JSON.parse(window.localStorage.getItem("contacteds"));
    

    $ionicModal.fromTemplateUrl('templates/tabs2.html', {
        id: 'messages',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_message = modal;
    });
    $scope.new = JSON.parse(window.localStorage.getItem("book_choose")
       )
  //  $scope.new = NewsData.get($stateParams.newId);
  //  $scope.new = $scope.filtered[$stateParams.newId];
  /*  $scope.$on('book_select', function (event, mass) {
        
    });
    */
    $scope.book_contact = function (event) {
        window.localStorage.setItem("target_user", event.target.id);
        window.localStorage.setItem("target_book", event.target.name);
        
        $scope.Message_title = window.localStorage.getItem("target_book");

        $scope.loading = $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Loading...',

          //Will a dark overlay or backdrop cover the entire view
          showBackdrop: false,

          // The delay in showing the indicator
          showDelay: 10
      });
      //  $scope.modal_message.show();
        $timeout(function () {
            $scope.loading.hide();
            $scope.modal_message.show();

        },100)
       
       
    }
    window.localStorage.removeItem("contacteds");
    $scope.thread_chosen = function () {
        window.localStorage.setItem("target_user", event.target.id);
        window.localStorage.setItem("target_book", event.target.name);
        $scope.Message_title = event.target.name;
        $scope.modal_message.show();
    }

    $scope.close_messages = function () {

        $scope.modal_message.hide();
    }
    
   

        $scope.hideTime = true;

        var alternate,
          isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        $scope.sendMessage = function () {

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
         //   var user_id = window.localStorage.getItem("user_id");
            var message = $scope.data.message;


            if (window.localStorage.getItem("contacteds") != null) {
                var contacteds = [{}];
                contacteds = JSON.parse(window.localStorage.getItem("contacteds"));
                for (var i = 0; i < contacteds.length; i++) {
                    if (contacteds[i].id == window.localStorage.getItem("target_user") && contacteds[i].title == window.localStorage.getItem("target_book")) {
                        contacteds[i].lastMessage = message;
                        break;
                    }
                    else if (i == contacteds.length - 1 && (contacteds[i].id != window.localStorage.getItem("target_user") || contacteds[i].title != window.localStorage.getItem("target_book"))) {
                        contacteds.push({
                            id: window.localStorage.getItem("target_user"),
                            title: window.localStorage.getItem("target_book"),
                            lastMessage: message
                        })
                    }
                }
                
               
                window.localStorage.setItem("contacteds", JSON.stringify(contacteds));
                $scope.$apply();
            }
            else {
                var contacteds = [{}];
                contacteds.push({
                    id: window.localStorage.getItem("target_user"),
                    title: window.localStorage.getItem("target_book"),
                    lastMessage: message
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
                $scope.$apply();
                
            }

            /*
            if (window.localStorage.getItem("messages") != null) {
                var messages = [];
                messages = JSON.parse(window.localStorage.getItem("messages"));
                messages[messages.length] = message;
                window.localStorage.setItem("messages", JSON.stringify(messages));
            }*/

            /*
           
            if (window.localStorage.getItem("contacted") != null) {

                var contacteds = [{}];
                contacteds = JSON.parse(window.localStorage.getItem("contacted"));
                for (var i = 0; i < contacteds.length; i++) {
                    if (window.localStorage.getItem("target_user") == contacteds[i].id) {
                        break;

                    }
                    if ((i == contacteds.length - 1) && (window.localStorage.getItem("target_user") != contacteds[i].id)) {
                        var contacteds = [];

                        contacteds.push({
                            id: window.localStorage.getItem("target_user"),
                            title: window.localStorage.getItem("target_book")
                        });
                        $scope.contacted.push({
                            id: window.localStorage.getItem("target_user"),
                            title: window.localStorage.getItem("target_book")
                        });
                        window.localStorage.setItem("contacted", JSON.stringify(contacted));
                    }

                }


            }

            else {
                var contacteds = [];
                contacteds[0] = {
                    id: window.localStorage.getItem("target_user"),
                    title: window.localStorage.getItem("target_book")
                }
                $scope.contacted.push({
                    id: window.localStorage.getItem("target_user"),
                    title: window.localStorage.getItem("target_book")
                })
                window.localStorage.setItem("contacted", JSON.stringify(contacted));
            }
            */

            


            var dataStr = "party1=" + window.localStorage.getItem("id") + "&party2=" + window.localStorage.getItem("target_user") + "&message=" + message + "&time=" + d;
            var url3 = "http://www.forwardingenuity.com/ins_message.php";
            $.ajax({
                type: "POST",                                           //method
                url: url3,     //url   
                data: dataStr,                                       //data sent as concatinated string
                crossDomain: true,
                cache: false,
                timeout: 5000,
                success: function (data) {
                    if (data == "success") {
               //         alert("sent");
                    }
                    else if (data == "error") {
                 //       alert("not sent");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
               //     alert("network error");
                }

            });



  /*          var dataStr = "id=" + window.localStorage.getItem("id") + "&message=" + message;
        //    var dataStr = "party1=" + window.localStorage.getItem("id") + "&party2=" + window.localStorage.getItem("target_user") + "&message=" + message;
            var url3 = "http://www.forwardingenuity.com/ins_message2.php";
            $.ajax({
                type: "POST",                                           //method
                url: url3,     //url   
                data: dataStr,                                       //data sent as concatinated string
                crossDomain: true,
                cache: false,
                timeout: 5000,
                success: function (data) {
                    if (data == "success") {
                        alert("sent");
                    }
                    else if (data == "error") {
                        alert("not sent");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("network error");
                }

            });
*/            
            
            $scope.messages.push({
                userId: alternate ? '12345' : '54321',
                text: $scope.data.message,
                time: d
            });

            delete $scope.data.message;
          /*  $ionicScrollDelegate.scrollBottom(true);
            */
            }
       

    /*
        $scope.inputUp = function () {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };*/
    /*
        $scope.inputDown = function () {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };
        */
        $scope.closeKeyboard = function () {
            // cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];

   



})

// Products Controller
.controller('ProductsCtrl', function($scope, $ionicLoading, $http, $interval,MenuData, ProductsData, SettingsData, ProductsStorage) {
    $scope.products = [];
    $scope.storage = '';
    $scope.place=[];
    $scope.$emit('change_event', [1, 2, 3]);
    $scope.$broadcast('change_event', [1, 2, 3]);

  /*  $http({
        method: 'GET',
        url: 'http://forwardingenuity.com/accom.php'
    })
      .then(function (response) {
          
          $scope.place = response.data[0];

          window.localStorage.setItem('response1', response.data)
      })
      */
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',
        
      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
   
        ProductsData.async().then(
        // successCallback
        function () {
            $scope.products = ProductsData.getAll();


            $scope.letterLimit = ProductsData.getLetterLimit();
            $ionicLoading.hide();
        },
        // errorCallback 
        function () {
            $scope.products = ProductsStorage.all();
            $scope.letterLimit = ProductsData.getLetterLimit();


            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
        },
        // notifyCallback
        function () { }
    );
   
        $scope.filtering = SettingsData.items.type;
        

        $scope.type_filter = function (tags,area,price) {
            var filt = $scope.filtering;
            var place = SettingsData.items.area;
            var cost = SettingsData.items.range;
            var status = true;
            for (var i = 0; i < tags.length; i++) {
                for (var j=0; j < $scope.filtering.length; j++) {
                    if (tags[i].toLowerCase() == (filt[j].name).toLowerCase()) {
                        if (filt[j].value == true) {
                            //return true;
                            status = true;
                        }
                        else {
                            return false;
                        }
                        if (i == tags.length && j == filt.length) {
                        /*    if (filt[j].value == true) {
                                return true;
                            }
                            else {
                                return false;
                            }*/
                            
                        }
                    }
                    
                        
                }

            }
            
            
                for (var k = 0; k < place.length; k++) {
                    if (area.toLowerCase() == (place[k].name).toLowerCase()) {
                        if (place[k].value == true) {
                            //return true;
                            status = true;
                        }
                        else {
                            return false;
                        }
                       
                    }


                }
                if (price > cost) {
                    return false;
                }
            



            return status;
        }

})

    // Products Controller
.controller('sellCtrl', function ($scope, $ionicModal, $ionicLoading, $http, $interval, ProductsData, ProductsStorage) {
    $scope.book_uploads = [];
    $scope.$emit('change_event_to_profile', [1, 2, 3]);
    $scope.$broadcast('change_event_to_profile', [1, 2, 3]);

    $scope.$on('book_inserted', function (event, data) {
        $scope.book_uploads.push(data);
    });


    if (window.localStorage.getItem("Logged_in") != "1") {
        // Create the login modal that we will use later
        $scope.modal.show();
        $("#main").hide();

        var promise = $interval(function () { 
            if (window.localStorage.getItem("Logged_in") == "1") {
                $scope.username = window.localStorage.getItem("username");
                $("#main").show();
                $http({ method: 'GET', url: 'http://www.forwardingenuity.com/phps/json_book.php' })
     .then(function (response) {
         var j = 0;
         var book_uploads = [];
         for (var i = 0; i < response.data.length; i++) {
             if (window.localStorage.getItem("id") == response.data[i].uploader) {
                 book_uploads[j] = response.data[i];
                 j++;
                 $scope.book_uploads = book_uploads;
             }
             else {

             }
         }
     })
 .catch(function () {

 })
                stop();
            }


        }, 500)
    }
    else {
        $scope.username = window.localStorage.getItem("username");
        $("#main").show();
        $http({ method: 'GET', url: 'http://www.forwardingenuity.com/phps/json_book.php' })
      .then(function (response) {
          var j=0;
          var book_uploads=[];
          for (var i = 0; i < response.data.length; i++) {
              if (window.localStorage.getItem("id") == response.data[i].uploader) {
                 book_uploads[j]=response.data[i];
                 j++;
                 $scope.book_uploads = book_uploads;
              }
              else {

              }
          }
      })
        
  .catch(function () {

  })
        
    }
    function stop() {
        $interval.cancel(promise);
    }
    
})

// Product Controller
.controller('ProductCtrl', function($scope, $stateParams, ProductsData) {
    
    $scope.product = ProductsData.get($stateParams.productId);
    
})

    .controller('messagesCtrl', function ($scope, $http) {
        $scope.contacted = JSON.parse(window.localStorage.getItem("contacted"));
        
        var url_messages = "http://www.forwardingenuity.com/messages.php";
        $http({ method: 'GET', url: url_messages, timeout: 5000 }).
         // this callback will be called asynchronously
         // when the response is available.
         success(function (data) {
            
         }).
         // called asynchronously if an error occurs
         // or server returns response with an error status.
         error(function () {

         });
    })


// Gallery Controller
.controller('GalleryCtrl', function($scope, GalleryData) {

    $scope.items = GalleryData.items;

})

// Map Controller
.controller('MapCtrl', function($scope, MapData) {

    $scope.windowOptions = false;

    $scope.onClick = function () {
    this.windowOptions = !this.windowOptions;
    };

    $scope.closeClick = function () {
    this.windowOptions = false;
    };

    $scope.map = MapData.map;

    $scope.events = {

        click: function (mapModel, eventName, originalEventArgs) {

            var e = originalEventArgs[0];
            var latitude = e.latLng.lat(), longitude = e.latLng.lng();

            console.log(longitude, latitude);

        }
    }

})

// About Controller
.controller('AboutCtrl', function($scope, $ionicLoading, AboutData, AboutStorage) {
    
    $scope.about = [];
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,
        
      // The delay in showing the indicator
      showDelay: 10
    });
    
    AboutData.async().then(
        // successCallback
        function() {
            $scope.about = AboutData.getAll();
            $ionicLoading.hide();
        },
        // errorCallback 
        function() {
            $scope.about = AboutStorage.all();
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );
    
})

// Member Controller
.controller('MemberCtrl', function($scope, $stateParams, AboutData) {
    
    $scope.member = AboutData.get($stateParams.memberId);
    
})

// Contact Controller
.controller('ContactCtrl', function($scope) {
    
    $scope.contact = {
      subject:  '',
      body: ''
    }
    
    $scope.submitForm = function() {

        window.plugin.email.open({
            to:      ['username@company.com'],
            cc:      ['username1@company.com'],
            bcc:     ['username2@company.com'],
            subject: $scope.contact.subject,
            body:    $scope.contact.body
        });

    };

})

// Posts Controller
.controller('PostsCtrl', function($scope, $ionicLoading, PostsData, PostsStorage) {
    
    $scope.posts = [];
    $scope.storage = '';
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    PostsData.async().then(
        // successCallback
        function() {
            $scope.posts = PostsData.getAll().posts;
            $ionicLoading.hide();
        },
        // errorCallback 
        function() {
            $scope.posts = PostsStorage.all().posts;
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );
    
    var page = 1;
    // Define the number of the posts in the page
    var pageSize = 3;

    $scope.paginationLimit = function(data) {
    return pageSize * page;
    };

    $scope.hasMoreItems = function() {
    return page < ($scope.posts.length / pageSize);
    };

    $scope.showMoreItems = function() {
    page = page + 1;       
    }; 
    
})

// Post Controller
.controller('PostCtrl', function($scope, $stateParams, PostsData, $sce) {

    $scope.post = PostsData.get($stateParams.postId);
    
    $scope.content = $sce.trustAsHtml($scope.post.content);
    
    $scope.loadURL = function (url) {
        //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
        //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
        //_blank: Opens in the InAppBrowser.
        //_system: Opens in the system's web browser.
        window.open(url,'_blank');
    }
    
    $scope.sharePost = function () {

        var subject = $scope.post.title;
        var message = $scope.post.content;
        message = message.replace(/(<([^>]+)>)/ig,"");

        var link = $scope.post.url;

        //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
        window.plugins.socialsharing.share(message, subject, null, link);
    }
    
})

// ServerPosts Controller
.controller('ServerPostsCtrl', function($scope, $http, $ionicLoading, ServerPostsData, ServerPostsStorage) {
    var data = []
    $scope.posts = [];
    $scope.storage = '';
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    $scope.loadData = function () {
        
        $http({method: 'GET', url: ServerPostsData.getURL() + 'page=' + $scope.page, timeout: 5000}).
        // this callback will be called asynchronously
        // when the response is available.
        success(function(data) {
            $scope.more = data.pages !== $scope.page;
            $scope.posts = $scope.posts.concat(data.posts);
            ServerPostsData.setData($scope.posts);
            ServerPostsStorage.save(data);
            $ionicLoading.hide();
        }).
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        error(function() {
            $scope.posts = ServerPostsStorage.all().posts;
            ServerPostsData.setData(ServerPostsStorage.all().posts);
            $scope.storage = 'Data from local storage';
            $ionicLoading.hide();
        });

    };
        
    $scope.showMoreItems = function () {
        $scope.page += 1;
        $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Loading Data',

        //Will a dark overlay or backdrop cover the entire view
        showBackdrop: false,

        // The delay in showing the indicator
        showDelay: 10
        });
        $scope.loadData();
    }

    $scope.hasMoreItems = function () {
        return $scope.more;
    }

    $scope.page = 1;
    $scope.more = true;
    $scope.loadData();
    
})

// ServerPost Controller
.controller('ServerPostCtrl', function($scope, $stateParams, ServerPostsData, $sce) {

    $scope.post = ServerPostsData.get($stateParams.serverpostId);
    
    $scope.content = $sce.trustAsHtml($scope.post.content);
    
    $scope.loadURL = function (url) {
        //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
        //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
        //_blank: Opens in the InAppBrowser.
        //_system: Opens in the system's web browser.
        window.open(url,'_blank');
    }
    
    $scope.sharePost = function () {

        var subject = $scope.post.title;
        var message = $scope.post.content;
        message = message.replace(/(<([^>]+)>)/ig,"");

        var link = $scope.post.url;

        //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
        window.plugins.socialsharing.share(message, subject, null, link);
    }
    
})

// RSS Feeds Controller
.controller('FeedsCtrl', function($scope, $ionicLoading, FeedsData, FeedsStorage) {
    
    $scope.feeds = [];
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    var data;
    
    FeedsData.async().then(
        // successCallback
        function() {
            data = FeedsData.getAll();

            $scope.title = data.title;
            $scope.description = data.description;
            $scope.link = data.link;
            $scope.feeds = data.entries;
            
            $ionicLoading.hide();
            
        },
        // errorCallback 
        function() {
            data = FeedsStorage.all();
            console.log(data);
            $scope.storage = 'Data from local storage';
            
            $scope.title = data.title;
            $scope.description = data.description;
            $scope.link = data.link;
            $scope.feeds = data.entries;
            
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );
    
    var page = 1;
    // Define the number of the feed results in the page
    var pageSize = 5;

    $scope.paginationLimit = function(data) {
    return pageSize * page;
    };

    $scope.hasMoreItems = function() {
    return page < ($scope.feeds.length / pageSize);
    };

    $scope.showMoreItems = function() {
    page = page + 1;
    $scope.$apply();
    }; 
    
    $scope.getImage = function(index) {
    var selectedItem = $scope.feeds[index];
    var content = selectedItem.content;
    var element = $('<div>').html(content);
    var source = element.find('img').attr("src");
    return source;
    }
    
})

// RSS Feeds Controller
.controller('FeedsRefresherCtrl', function($scope, $ionicLoading, FeedsData, FeedsStorage) {
    
    $scope.feeds = [];
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    var data;
        
    var getData = function() {
    
        FeedsData.async().then(
            // successCallback
            function() {
                data = FeedsData.getAll();
                console.log(data);

                $scope.title = data.title;
                $scope.description = data.description;
                $scope.link = data.link;
                $scope.feeds = data.entries;

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

            },
            // errorCallback 
            function() {
                data = FeedsStorage.all();
                console.log(data);
                $scope.storage = 'Data from local storage';

                $scope.title = data.title;
                $scope.description = data.description;
                $scope.link = data.link;
                $scope.feeds = data.entries;

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // notifyCallback
            function() {}
        );
        
    }
    
    getData();
    
    $scope.doRefresh = function() {
        getData();  
    }
    
    $scope.getImage = function(index) {
    var selectedItem = $scope.feeds[index];
    var content = selectedItem.content;
    var element = $('<div>').html(content);
    var source = element.find('img').attr("src");
    return source;
    }
    
})

// RSS Feed Controller
.controller('FeedCtrl', function($scope, $stateParams, FeedsData, $sce) {
    
    $scope.entry = FeedsData.get($stateParams.entryId);
    
    $scope.content = $sce.trustAsHtml($scope.entry.content);
    
    $scope.loadURL = function (url) {
        //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
        //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
        //_blank: Opens in the InAppBrowser.
        //_system: Opens in the system's web browser.
        window.open(url,'_blank');
    }
    
    $scope.shareEntry = function () {

        var subject = $scope.entry.title;
        var message = $scope.entry.content;
        message = message.replace(/(<([^>]+)>)/ig,"");

        var link = $scope.entry.link;

        //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
        window.plugins.socialsharing.share(message, subject, null, link);
    }
    
})



// Plugins Controller
.controller('PluginsCtrl', function($scope, PluginsData) {
  $scope.items = PluginsData.items;
})

// Device Controller
.controller('DeviceCtrl', function($scope) {
  $scope.device = device;
})

// Notifications Controller
.controller('NotificationsCtrl', function($scope) {
    
    $scope.alertNotify = function() {
    navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
    };

    $scope.beepNotify = function() {
    navigator.notification.beep(1);
    };

    $scope.vibrateNotify = function() {
    navigator.notification.vibrate(3000);
    };

    $scope.confirmNotify = function() {
    navigator.notification.confirm("My Confirmation",function(){console.log("Confirm Success")},"Are you sure?",["Ok","Cancel"]);
    };
    
})

// Barcodescanner Controller
.controller('BarcodescannerCtrl', function($scope) {
    
    $scope.scan = function() {
        cordova.plugins.barcodeScanner.scan(function(result) {
            $scope.result = result;
            $scope.$apply();
        }, function(error) {
            $scope.error = error;
            $scope.$apply();
        });
    };
    
})

// Geolocation Controller
.controller('GeolocationCtrl', function($scope, $ionicLoading) {
    
    $scope.map = {
    center: {
        latitude: 45, 
        longitude: -73
    },
    marker: {},
    zoom: 5
    };

    $scope.loading = $ionicLoading.show({

      //The text to display in the loading indicator
      template: '<i class="icon ion-loading-c"></i> Getting current location',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });

    var options = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(function(position) {

        $scope.map = {
            center: {
                latitude: position.coords.latitude, 
                longitude: position.coords.longitude
            },
            marker: {
                latitude: position.coords.latitude, 
                longitude: position.coords.longitude
            },
            zoom: 12
        };

        $ionicLoading.hide();
        
        }, function(error) {
        alert('Unable to get location: ' + error.message);
        $ionicLoading.hide();
    }, options);


})

// Seetings Controller
.controller('SettingsCtrl', function($scope, SettingsStorage, NewsStorage, ProductsStorage, AboutStorage, FeedsStorage, PostsStorage, ServerPostsStorage) {
 
    $scope.settings = SettingsStorage.all();

    $scope.saveSettings = function() {
        SettingsStorage.save($scope.settings);
    };
    
    $scope.$watch('settings', function() { SettingsStorage.save($scope.settings) }, true);
    
    $scope.resetSettings = function() {
        SettingsStorage.clear();
        $scope.settings = SettingsStorage.all();
    };
    
    $scope.resetNewsStorage = function() {
        NewsStorage.clear();
        window.localStorage.clear();
    };
    
    $scope.resetProductsStorage = function() {
        ProductsStorage.clear();
    };
    
    $scope.resetAboutStorage = function() {
        AboutStorage.clear();
    };
    
    $scope.resetFeedsStorage = function() {
        FeedsStorage.clear();
    };
    
    $scope.resetPostsStorage = function() {
        PostsStorage.clear();
    };
    
    $scope.resetServerPostsStorage = function() {
        ServerPostsStorage.clear();
    };
    
})

.controller('AppCtrl', function ($scope, $ionicLoading, SettingsData, $ionicModal, $timeout, $ionicPopup, MenuData, $http, $ionicActionSheet, $ionicPlatform) {
    $scope.settings = SettingsData.items;
    window.FirebasePlugin.logEvent("select_content", { content_type: "page_view", item_id: "home" });
    /*var analytics = window.ga;
    if (typeof analytics !== "undefined") {
        
        window.ga.trackView("Tracking the view");
    /*
    }
    else {
        console.log("Google analytics not started");
    }*/
  $scope.items = MenuData.items;
  $scope.profileMenu = MenuData.profileMenu;
  $scope.$on('change_event', function (event, mass) {
      $scope.profileMenu = MenuData.accommod;
      $scope.apply();
  });
  $scope.$on('change_event_to_profile', function (event, mass) {
      $scope.profileMenu = MenuData.profileMenu;
      $scope.apply();
  });
  
  // Form data for the login modal
  $scope.loginData = {};
  $scope.SellData = {};
  $scope.BookRequestData = {};
    $scope.signupData={};
  // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        id:'1',
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

    $scope.update_ui = function () {
        $http({ method: 'GET', url: 'http://www.forwardingenuity.com/phps/json_book.php' })
      .then(function (response) {
          var j = 0;
          var book_uploads = [];
          for (var i = 0; i < response.data.length; i++) {
              if (window.localStorage.getItem("id") == response.data[i].uploader) {
                  book_uploads[j] = response.data[i];
                  j++;
                  $scope.book_uploads = book_uploads;
              }
              else {

              }
          }
      })

  .catch(function () {

  })

    }
    

    $ionicModal.fromTemplateUrl('templates/sell_modal.html', {
        id: '4',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_sell = modal;
    });

    $ionicModal.fromTemplateUrl('templates/update_modal.html', {
        id: 'update',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_update = modal;
    });

    $ionicModal.fromTemplateUrl('templates/sell_modal2.html', {
        id: '7',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_sell2 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/signUp.html', {
        id: 'Modal_signup',
        scope: $scope
    }).then(function (modal) {
        $scope.modal1 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/BookRequest.html', {
        id: '5',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_BookRequest = modal;
    });

    $ionicModal.fromTemplateUrl('templates/advanced_search.html', {
        id: 'search',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_search = modal;
    });

    $scope.BookRequest = function () {
        $scope.modal_BookRequest.show();
    }
    $scope.closeBookRequest = function () {

        $scope.modal_BookRequest.hide();
    }


    $scope.sell_modal = function () {
        $scope.modal_sell.show();

    }
    $scope.sell_modal2 = function () {
        $scope.modal_sell2.show();

    }
    $scope.closeSell = function () {
        $scope.modal_sell.hide();
        $scope.modal_sell2.hide();
    }
  // Triggered in the login modal to close it
    $scope.closeLogin = function () {
       
      $scope.modal.hide();
      $scope.modal1.hide();
        
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  $scope.newUser = function () {
      $scope.modal.hide();
      $scope.modal1.show();
  }
  $scope.backToLogin = function () {
      $scope.modal.show();
      $scope.modal1.hide();

  }
  $scope.Sell = function () {
      $("#insert_book").text('Connecting...');
      $scope.loading = $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Uploading...',

          //Will a dark overlay or backdrop cover the entire view
          showBackdrop: false,

          // The delay in showing the indicator
          showDelay: 10
      });
      
      var title = $scope.SellData.title;
      var price = $scope.SellData.price;
      var el = document.getElementById("faculty_chosen2");
      var faculty = el.options[el.selectedIndex].value;
      var uploader = window.localStorage.getItem("id");
      var book_info={
          "title":title,
          "price":price,
          "faculty":faculty,
          "uploader":uploader
      }
      window.localStorage.setItem("book_info",JSON.stringify(book_info));

      var file = document.querySelector("#afile").files[0];
      var fd = new FormData();
      fd.append("afile", file);
      fd.append("title", title);
      fd.append("price", price);
      fd.append("faculty", faculty);
      fd.append("uploader", uploader)

      var filename = "http://www.forwardingenuity.com/forB/images/";
      fd.append("image", filename);

      //var dataString = "name=" + window.localStorage.getItem("Name") + "&email=" + window.localStorage.getItem("email") + "&province=" + window.localStorage.getItem("province") + "&image=" + filename + "&insert=1";

      // These extra params aren't necessary but show that you can include other data.
      var done2 = '0';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://forwardingenuity.com/phps/insert_book_new.php', true);
      //var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')

      xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
              var percentComplete = (e.loaded / e.total) * 100;
              console.log(percentComplete + '% uploaded');
              if (percentComplete == 100) {
                  $scope.$emit('book_inserted', JSON.parse(window.localStorage.getItem("book_info")));
                  $scope.$broadcast('book_inserted', JSON.parse(window.localStorage.getItem("book_info")));

                  $scope.loading.hide();
                  var alertPopup = $ionicPopup.alert({
                      title: 'Sell Book',
                      template: 'Book inserted successfully! :)'
                  });
                  $("#insert_book").text('Submit');

                  $scope.closeSell();
                  done2 = '1';
                 
              }
          }
      };

      xhr.onload = function () {

      };
      xhr.send(fd);

      $timeout(function () {
          if (done2 == '0') {
              $scope.loading.hide();
              var alertPopup = $ionicPopup.alert({
                  title: 'Insert Book',
                  template: 'Book not inserted, please try again'
              });
              $("#insert_book").text('Submit');
          }
      }, 5000)


      /*
      var dataString2 = "title=" + title + "&price=" + price + "&faculty=" + faculty  + "&uploader=" + uploader + "&insert=";
      $.ajax({
          type: "POST",
          url: "http://www.forwardingenuity.com/insert_book.php",
          data: dataString2,
          crossDomain: true,
          cache: false,
          timeout: 2000,
          beforeSend: function () { $("#insert_book").text('Connecting...'); },
          success: function (data) {
              if (data == "success") {
                  //           alert("inserted");

               //   $scope.update_ui();
                  $scope.book_uploads.push({
                      title: title,
                      price: price,
                      faculty:faculty
                  })
                  $scope.$apply();
                  $timeout(function () {


                      $scope.loading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Sell Book',
                          template: 'Upload successful! :)'
                      });
                      $("#insert_book").text('Submit');
                      
                      $scope.closeSell();
                 //     $scope.update_ui();

                  }, 1500);
              }
              else if (data == "error") {
                  $timeout(function () {


                      $scope.loading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Sell Book',
                          template: 'Upload unsuccessful, Please try again.'
                      });
                      $("#insert_book").text('Submit');
                   //   $scope.update_ui();
                  }, 1500);
              }
          },
          error: function (jqXHR, exception) {
              $timeout(function () {


                  $scope.loading.hide();
                  var alertPopup = $ionicPopup.alert({
                      title: 'Sell Book',
                      template: 'Network error, please check connection and try again'
                  });
                  $("#insert_book").text('Submit');
                  $scope.update_ui();
              }, 1500);
          }
      });
      */

  }


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $scope.loading = $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Signing in',

          //Will a dark overlay or backdrop cover the entire view
          showBackdrop: false,

          // The delay in showing the indicator
          showDelay: 10
      });

    // Simulate a login delay. Remove this and replace with your login
      // code if using a login system

      $http({ method: 'GET', url: 'http://www.forwardingenuity.com/json_users.php' })
          .then(function (response) {
          for (var i = 0; i < response.data.length;i++){
              if ($scope.loginData.username == response.data[i].email) {
                  if ($scope.loginData.password == response.data[i].password) {
                     
                      window.localStorage.setItem("Logged_in", "1");
                      window.localStorage.setItem("email", response.data[i].email);
                      window.localStorage.setItem("username", response.data[i].username);
                      window.localStorage.setItem("id", response.data[i].id);
                      window.localStorage.setItem("stars", response.data[i].stars);
                      window.plugins.OneSignal.sendTag("email", response.data[i].email);
                      window.plugins.OneSignal.sendTags({"email":response.data[i].email,"number":response.data[i].number});
                      break;
                  }
                  else {
                      window.localStorage.setItem("Logged_in", "0");
                  }
                  
          }
              else {
                  window.localStorage.setItem("Logged_in", "3");
              }
          }
          })
      .catch(function(){
      
})

      $timeout(function () {

          $scope.loading.hide();
          if (window.localStorage.getItem("Logged_in") == "1") {
              $("#main").show();
          var alertPopup = $ionicPopup.alert({
              title: 'Login',
              template: 'Login successful'
          });
          }
          else if (window.localStorage.getItem("Logged_in") == "3") {
              var alertPopup = $ionicPopup.alert({
                  title: 'Login',
                  template: 'Email/Password combination is not valid'
              });
          }
          else {
              var alertPopup = $ionicPopup.alert({
                  title: 'Login',
                  template: 'Login error, please check network and try again'
              });
          }
      }, 1000);

      $timeout(function () {
          if (window.localStorage.getItem("Logged_in") == "1") {
              $scope.closeLogin();
          }
      
    }, 2000);
  };
  
    

  $scope.doSignup = function () {
      console.log('Doing login', $scope.loginData);
      $scope.loading = $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Signing up',

          //Will a dark overlay or backdrop cover the entire view
          showBackdrop: false,

          // The delay in showing the indicator
          showDelay: 10
      });

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system

      $http({ method: 'GET', url: 'http://www.forwardingenuity.com/json_users.php' })
          .then(function (response) {
              for (var i = 0; i < response.data.length || i==0; i++) {
                  if ($scope.signupData.email == response.data[i].email) {
                     
                      

                      $timeout(function () {
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                              title: 'Sign up',
                              template: 'Email is already registered'
                          });
                          
                      },2000)

                      
                      break;

                  }
                  else {
                      if (i == response.data.length - 1 || response.data.length==0) {
                          var username = $scope.signupData.username;
                          var email = $scope.signupData.email;
                          var password = $scope.signupData.password;
                          window.localStorage.setItem("email", email);
                          window.localStorage.setItem("username", username);
                          var dataString = "username=" + username + "&email=" + email + "&password=" + password + "&stars=1"+ "&insert=";
                          $.ajax({
                              type: "POST",
                              url: "http://forwardingenuity.com/insert_user.php",
                              data: dataString,
                              crossDomain: true,
                              cache: false,
                              timeout: 2000,
                              beforeSend: function () { $("#insert").text('connecting...'); },
                              success: function (data) {
                                  if (data == "success") {
                                      $("#main").show();
                                      //           alert("inserted");

                                          $http({ method: 'GET', url: 'http://www.forwardingenuity.com/json_users.php' })
                         .then(function (response) {
                                 for (var i = 0; i < response.data.length; i++) {
                                     if (window.localStorage.getItem("email") == response.data[i].email) {
                                         window.localStorage.setItem("id", response.data[i].id);
                                         window.localStorage.setItem("stars", response.data[i].stars);
                                         window.plugins.OneSignal.sendTag("email", response.data[i].email);
                                         window.plugins.OneSignal.sendTag("number", response.data[i].id);

                                     }

                                   }
                                })
                        .catch(function(){
      
                        })
                                      

                                      window.localStorage.setItem("Logged_in", "1");
                                      $timeout(function () {
                                          $ionicLoading.hide();
                                          var alertPopup = $ionicPopup.alert({
                                              title: 'Sign up',
                                              template: 'Sign up successful!'
                                          });
                                          $("#insert").text('Sign up');
                                          $scope.closeLogin();

                                      }, 2000)
                                    }
                                  else if (data == "error") {
                                      $timeout(function () {
                                          $ionicLoading.hide();
                                          var alertPopup = $ionicPopup.alert({
                                              title: 'Sign up',
                                              template: 'Sign up unsuccessful :(. Please try again'
                                          });
                                          $("#insert").text('Sign up');
                                          

                                      }, 2000)
                                  }
                              },
                              error: function (jqXHR, exception) {
                                  $timeout(function () {
                                      $ionicLoading.hide();
                                      var alertPopup = $ionicPopup.alert({
                                          title: 'Sign up',
                                          template: 'Sign up unsuccessful. Please check internet connection.'
                                      });
                                      $("#insert").text('Sign up');


                                  }, 2000)

                              }
                          });

                      }
                  }
              }
          })
      .catch(function () {

      })

      
  };


    // Triggered on a button click, or some other target
    $scope.show = function() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: '<b>Share</b> This' },
           { text: 'Move' }
         ],
         destructiveText: 'Delete',
         titleText: 'Modify your album',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
           return true;
         }
        });

    };
   
    $scope.empty = 5;
    $scope.filled = window.localStorage.getItem("stars");
    $scope.getNumber = function (num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr[i] = i;
        }
        return arr;
}
 

    $scope.year_chosen = '1';

    $scope.doBookRequest = function () {
        $scope.loading = $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i>Sending request',

            //Will a dark overlay or backdrop cover the entire view
            showBackdrop: false,

            // The delay in showing the indicator
            showDelay: 10
        });
        var title = $scope.BookRequestData.title;
        var code = $scope.BookRequestData.ModuleCode;
        var e = document.getElementById("faculty_chosen");
        var faculty = e.options[e.selectedIndex].value;
        var year = $scope.year_chosen;
        var user_id=window.localStorage.getItem("id");
        var dataString = "title=" + title + "&code=" + code + "&faculty=" + faculty + "&year=" + year + "&user_id=" + user_id + "&insert=";
        $.ajax({
            type: "POST",
            url: "http://forwardingenuity.com/phps/book_requests.php",
            data: dataString,
            crossDomain: true,
            cache: false,
            timeout: 2000,
            beforeSend: function () { $("#request").text('Requesting...'); },
            success: function (data) {
                if (data == "success") {
                    //           alert("inserted");
                    $timeout(function () {
                        

                        $scope.loading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Book request',
                            template: 'Request submitted, we hope to give you feedback soon!'
                        });
                        $("#request").text('Request Book!');
                        $scope.closeBookRequest()
                        
                    }, 1500);
                }
                else if (data == "error") {
                    $timeout(function () {


                        $scope.loading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Book request',
                            template: 'Request not submitted, Please try again.'
                        });
                        $("#request").text('Request Book!');
                    }, 1500);
                }
            },
            error: function (jqXHR, exception) {
                $timeout(function () {


                    $scope.loading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Book request',
                        template: 'Network error, please check connection and try again'
                    });
                    $("#request").text('Request Book!');

                }, 1500);
            }
        });
        

    }
    
    $scope.advancedSearch = function () {
        //  $scope.modal_search.show();
        location.href="#/app/advanced_search"
    }

    $scope.toggle_button = function (setting) {
        if (setting.value == true) {
            window.localStorage.setItem(setting.name, "1");
            $scope.$emit(setting.name, [1, 2, 3]);
            $scope.$broadcast(setting.name, [1, 2, 3]);

        }
        else {
            window.localStorage.setItem(setting.name, "0");
        }
        
    }

    $scope.update = {};

    $scope.chosen_from_list = function (book) {
        $scope.modal_update.show();
        
        $scope.update.title = book.title;
        $scope.update.price = book.price;
        $scope.facul = book.faculty;
        window.localStorage.setItem("update_book_id", book.id);
    }
    $scope.closeUpdate = function () {
        $scope.modal_update.hide();

    }
    $scope.update = {};
    $scope.update_done = function () {
        $scope.loading = $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i>Making changes...',

            //Will a dark overlay or backdrop cover the entire view
            showBackdrop: false,

            // The delay in showing the indicator
            showDelay: 10
        });
        var title = $scope.update.title;
        var price = $scope.update.price;
       
        var e = document.getElementById("faculty_chosen2");
        var faculty = e.options[e.selectedIndex].value;
        var year = $("input[name='year']:checked").val();
        var user_id = window.localStorage.getItem("id");
        

        var file = document.querySelector("#afile").files[0];
        var fd = new FormData();
        fd.append("afile", file);
        fd.append("title", title);
        fd.append("price", price);
        fd.append("faculty", faculty);
        fd.append("year", year);
        fd.append("id",window.localStorage.getItem("update_book_id"))

        var filename = "http://www.forwardingenuity.com/forB/images/";
        fd.append("image", filename);

        //var dataString = "name=" + window.localStorage.getItem("Name") + "&email=" + window.localStorage.getItem("email") + "&province=" + window.localStorage.getItem("province") + "&image=" + filename + "&insert=1";

        // These extra params aren't necessary but show that you can include other data.
        var done1 = '0';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://forwardingenuity.com/phps/update_new.php', true);
        //var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
                if(percentComplete==100){
                $scope.loading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Edit Book',
                    template: 'Changes made successfully :)'
                });
                done1 = '1';
                $scope.closeUpdate();
                }
            }
        };

        xhr.onload = function () {

        };
        xhr.send(fd);
        
            $timeout(function () {
                if (done1 == '0') {
                    $scope.loading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Edit Book',
                        template: 'Changes not made, please try again'
                    });
                }
            },5000)
        



    }
})

// Feed Plugin Categories Controller
.controller('FeedPluginCategoriesCtrl', function($scope, $ionicLoading, FeedPluginData) {
    
    $scope.categories = [];
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,
        
      // The delay in showing the indicator
      showDelay: 10
    });
    
    FeedPluginData.asyncCategories().then(
        // successCallback
        function() {
            $scope.categories = FeedPluginData.getCategories();
            $ionicLoading.hide();
        },
        // errorCallback 
        function() {
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );
    
})

// Feed Plugin Category Controller
.controller('FeedPluginCategoryCtrl', function($scope, $ionicLoading, $stateParams, FeedPluginData) {
    
    $scope.id = $stateParams.id;
    $scope.title = FeedPluginData.getCategoryTitle($stateParams.id);
    $scope.items = FeedPluginData.getCategory($stateParams.id);
    
})

// Feed Plugin Feeds Controller
.controller('FeedPluginMasterCtrl', function($scope, $ionicLoading, $stateParams, FeedPluginData) {
    
    $scope.feeds = [];
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    var data;
    
    FeedPluginData.async($stateParams.categoryId, $stateParams.id).then(
        // successCallback
        function() {
            data = FeedPluginData.getResult();

            $scope.title = data.title;
            $scope.description = data.description;
            $scope.link = data.link;
            $scope.feeds = data.entries;
            FeedPluginData.setFeeds($scope.feeds);
            
            $ionicLoading.hide();
            
        },
        // errorCallback 
        function() {
            $ionicLoading.hide();
        },
        // notifyCallback
        function() {}
    );
    
    var page = 1;
    // Define the number of the feed results in the page
    var pageSize = 5;

    $scope.paginationLimit = function(data) {
    return pageSize * page;
    };

    $scope.hasMoreItems = function() {
    return page < ($scope.feeds.length / pageSize);
    };

    $scope.showMoreItems = function() {
    page = page + 1;
    $scope.$apply();
    }; 
    
    $scope.mediaObject = function(item) {
        return (item && item.mediaGroups) ? item.mediaGroups[0].contents[0] : {url:''};
    }

    $scope.hasVideo = function(item) {
        var media = $scope.mediaObject(item);

        //JAVASCRIPT: condition ? val1 : val2
        //return media.type ? (media.type == "video/mp4") : (media.url ? (media.url.indexOf(".mp4") != -1) : false);
        return media.type ? (media.type == "video/mp4") : false;
    }

    $scope.hasAudio = function(item) {
        var media = $scope.mediaObject(item);

        //JAVASCRIPT: condition ? val1 : val2
        return media.type ? (media.type == "audio/mp3") : false;
    }
    
    $scope.getImage = function(index) {
    var selectedItem = $scope.feeds[index];
    var content = selectedItem.content;
    var element = $('<div>').html(content);
    var source = element.find('img').attr("src");
    return source;
    }
    
})

// Feed Plugin Feed Controller
.controller('FeedPluginDetailCtrl', function($scope, $stateParams, FeedPluginData, $sce) {
    
    $scope.entry = FeedPluginData.getFeed($stateParams.id);
    
    $scope.content = $sce.trustAsHtml($scope.entry.content);
    
    $scope.loadURL = function (url) {
        //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
        //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
        //_blank: Opens in the InAppBrowser.
        //_system: Opens in the system's web browser.
        window.open(url,'_blank');
    }
    
    $scope.shareEntry = function () {

        var subject = $scope.entry.title;
        var message = $scope.entry.content;
        message = message.replace(/(<([^>]+)>)/ig,"");

        var link = $scope.entry.link;

        //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
        window.plugins.socialsharing.share(message, subject, null, link);
    }
    
    $scope.mediaObject = function(item) {
        return (item && item.mediaGroups) ? item.mediaGroups[0].contents[0] : {url:''};
    }

    $scope.hasVideo = function(item) {
        var media = $scope.mediaObject(item);

        //JAVASCRIPT: condition ? val1 : val2
        //return media.type ? (media.type == "video/mp4") : (media.url ? (media.url.indexOf(".mp4") != -1) : false);
        return media.type ? (media.type == "video/mp4") : false;
    }

    $scope.hasAudio = function(item) {
        var media = $scope.mediaObject(item);

        //JAVASCRIPT: condition ? val1 : val2
        return media.type ? (media.type == "audio/mp3") : false;
    }

    $scope.getTrustedResourceUrl = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    
})

// YouTube Videos Controller
.controller('YouTubeVideosCtrl', function($scope, $ionicLoading, YouTubeData) {
    
    $scope.videos = [];
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
    var getData = function() {
        
        YouTubeData.async().then(
            // successCallback
            function() {
                $scope.videos = YouTubeData.getVideos();
                console.log($scope.videos);
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // errorCallback 
            function() {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            // notifyCallback
            function() {}
        );
    }
    
    getData();
    
    var page = 1;
    // Define the number of the posts in the page
    var pageSize = 6;
    
    $scope.doRefresh = function() {
        getData();  
    }
    
    $scope.paginationLimit = function(data) {
    return pageSize * page;
    };

    $scope.hasMoreItems = function() {
    return page < ($scope.videos.length / pageSize);
    };

    $scope.showMoreItems = function() {
    page = page + 1;       
    }; 
    
})

// YouTube Video Controller
.controller('YouTubeVideoCtrl', function($scope, $stateParams, YouTubeData, $sce) {
    $scope.video = {};
    $scope.video = YouTubeData.getVideo($stateParams.videoId);
    
    $scope.content = $sce.trustAsHtml($scope.video.snippet.description);
    
    $scope.getVideoUrl = function () {
        var videoUrl= 'http://www.youtube.com/embed/' + $scope.video.snippet.resourceId.videoId;
        return $sce.trustAsResourceUrl(videoUrl);
    }
    
    $scope.shareVideo = function () {

        var subject = $scope.video.snippet.title;
        var message = $scope.video.snippet.description;
        message = message.replace(/(<([^>]+)>)/ig,"");

        var link = 'http://www.youtube.com/embed/' + $scope.video.snippet.resourceId.videoId;

        //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
        window.plugins.socialsharing.share(message, subject, null, link);
    }
    
})
