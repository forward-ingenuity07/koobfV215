angular.module('mobionicApp.controllers', [])

// Home Controller
.controller('HomeCtrl', function($scope, $http, Data) {
    
    $scope.items = Data.items;
    $http({ method: 'GET', url: 'http://www.forwardingenuity.com/user_online.php' }).then(function (response) {

        return;
    });


})

// News Controller
.controller('NewsCtrl', function($scope, $ionicLoading, NewsData, NewsStorage) {
    
    $scope.news = [];
    $scope.storage = '';
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      //Will a dark overlay or backdrop cover the entire view
      showBackdrop: false,

      // The delay in showing the indicator
      showDelay: 10
    });
    
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
.controller('NewCtrl', function($scope, $ionicModal,$stateParams, $ionicLoading, $timeout, $ionicScrollDelegate, NewsData) {



    $ionicModal.fromTemplateUrl('templates/tabs2.html', {
        id: 'messages',
        scope: $scope
    }).then(function (modal) {
        $scope.modal_message = modal;
    });

    $scope.new = NewsData.get($stateParams.newId);
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
           
            if (window.localStorage.getItem("messages") != null) {
                var messages = [];
                messages = JSON.parse(window.localStorage.getItem("messages"));
                messages[messages.length] = message;
                window.localStorage.setItem("messages", JSON.stringify(messages));
            }
            var dataStr = "party1=" + window.localStorage.getItem("id") + "&party2=" + window.localStorage.getItem("target_user") + "&message=" + message;
            var url3 = "http://www.forwardingenuity.com/ins_message.php"
            $.ajax({
                type: "POST",                                           //method
                url: url3,     //url   
                data: dataStr,                                       //data sent as concatinated string
                crossDomain: true,
                cache: false,
                timeout: 5000,
                success: function (data) {
                    if (data == "success") {
                        window.localStorage.setItem("message_sent", "1");
                    }
                    else if (data == "error") {
                        window.localStorage.setItem("message_sent", "0");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    window.localStorage.setItem("message_sent", "3");
                }

            });
            
            
            $scope.messages.push({
                userId: alternate ? '12345' : '54321',
                text: $scope.data.message,
                time: d
            });

            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);
            
            }
       


        $scope.inputUp = function () {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function () {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function () {
            // cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];

   



})

// Products Controller
.controller('ProductsCtrl', function($scope, $ionicLoading, $http, $interval, ProductsData, ProductsStorage) {
    
    $scope.products = [];
    $scope.storage = '';
    $scope.place=[];
   
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
    $interval(function () {
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

    },2000)
    


})

    // Products Controller
.controller('sellCtrl', function ($scope, $ionicModal, $ionicLoading, $http, $interval, ProductsData, ProductsStorage) {

    
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

.controller('AppCtrl', function ($scope, $ionicLoading, $ionicModal, $timeout, $ionicPopup, MenuData, $http, $ionicActionSheet, $ionicPlatform) {
   


  $scope.items = MenuData.items;
    $scope.profileMenu=MenuData.profileMenu;
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

                  $scope.update_ui();

                  $timeout(function () {


                      $scope.loading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Sell Book',
                          template: 'Upload successful! :)'
                      });
                      $("#insert_book").text('Submit');
                      
                      $scope.closeSell();
                      $scope.update_ui();

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
                      $scope.update_ui();
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
                      window.plugins.OneSignal.sendTag("email", window.localStorage.getItem("email"));
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
              for (var i = 0; i < response.data.length; i++) {
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
                      if (i == response.data.length - 1) {
                          var username = $scope.signupData.username;
                          var email = $scope.signupData.email;
                          var password = $scope.signupData.password;
                          window.localStorage.setItem("email", email);
                          window.localStorage.setItem("username", username);
                          var dataString = "username=" + username + "&email=" + email + "&password=" + password + "&insert=";
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
                                     }

                                   }
                                })
                        .catch(function(){
      
                        })
                                          window.plugins.OneSignal.sendTag("email", window.localStorage.getItem("email"));


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
    $scope.filled = 3;
    $scope.getNumber = function (num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr[i] = i;
        }
        return arr;
}
 
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
        var year = $("input[name='year']:checked").val();
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
