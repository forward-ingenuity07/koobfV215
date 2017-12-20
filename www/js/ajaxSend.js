(function () {

    var App = angular.module("module", ['ionic']);

    App
        .controller("controller", function ($scope, $http, $interval) {
            $scope.facebook_link = "http://www.facebook.com/sweatbrand";
            $scope.twitter_link = "http://www.twitter.com/sweat_brand";
            $http({
                method: 'GET',
                url: 'http://forwardingenuity.com/json_competitions.php'
            })
        .then(function (response) {
            window.localStorage.setItem("prize_stored", (response.data)[0].winning);
            window.localStorage.setItem("instruction_stored", (response.data)[0].instructions);
            window.localStorage.setItem("date_stored", (response.data)[0].ending);
            window.localStorage.setItem("image_stored", (response.data)[0].image);
            $scope.prize = (response.data)[0].winning;
            $scope.image = (response.data)[0].image;

            $scope.instruction = (response.data)[0].instructions;
            window.localStorage.setItem("time", (response.data)[0].ending);

            // window.localStorage.setItem('response1',response.data)

            $("#counting")
              .countdown(window.localStorage.getItem("time"), function (event) {
                  $(".days").text(event.strftime('%D'));
                  $(".hours").text(event.strftime('%H'));

                  $(".minutes").text(event.strftime('%M'));
                  $(".seconds").text(event.strftime('%S'))
                  /* $(this).text(
                     event.strftime('%D days %H:%M:%S')
                   );*/
              });
            $interval.cancel();
        })
        .catch(function (error) {
            if (window.localStorage.getItem("prize_stored") != null) {
                $("#fb-foot").hide();
                $(".page-container").show();

                $scope.prize = window.localStorage.getItem("prize_stored");
                $scope.instruction = window.localStorage.getItem("instruction_stored");
                $scope.image = window.localStorage.getItem("image_stored");
                $("#counting")
                  .countdown(window.localStorage.getItem("date_stored"), function (event) {
                      $(".days").text(event.strftime('%D'));
                      $(".hours").text(event.strftime('%H'));

                      $(".minutes").text(event.strftime('%M'));
                      $(".seconds").text(event.strftime('%S'))
                      /* $(this).text(
                         event.strftime('%D days %H:%M:%S')
                       );*/
                  });
            }
            else {
                $(".page-container").hide();

                $("#text").text("Unable to load information, check connection")



            }
        })

        })

    .controller("ionic_controller", function ($scope, $ionicModal, $ionicLoading, $timeout, $ionicPopup, $http) {
        
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('login.html', {
            id: '1',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false,
            focusFirstInput: true
        }).then(function (modal) {
            $scope.modal1 = modal;
            $scope.modal1.show();
        });

        $ionicModal.fromTemplateUrl('signUp.html', {
            id: '2',
            scope: $scope
        }).then(function (modal) {
            $scope.modal2 = modal;
        });

        $scope.closeLogin = function () {
            location.href = "competitions.html";

        }
        $scope.facebook_link = "http://www.facebook.com/sweatbrand";
        $scope.twitter_link = "http://www.twitter.com/sweat_brand"
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            url1 = "http://www.forwardingenuity.com/sweat_users.php"
            $http({ method: 'GET', url: url1, timeout: 5000 })
                .then(function (response) {

                    var username = $("#username").val();
                    var password = $("#password").val();

                    for (i = 0; i < response.data.length; i++) {
                        if (username == response.data[i].email) {
                            if (password == response.data[i].password) {
                                window.localStorage.setItem("Logged", "1");
                                window.localStorage.setItem("Log_status", "1");
                                window.localStorage.setItem("Name", response.data[i].name);
                                window.localStorage.setItem("email", response.data[i].email);
                                window.localStorage.setItem("province", response.data[i].province);
                                window.localStorage.setItem("user_id", response.data[i].id);
                                break;
                            }
                            else {
                                window.localStorage.setItem("Logged", "0");
                                break;
                            }

                        }
                        else {
                            window.localStorage.setItem("Logged", "0");
                        }

                    }

                })
            .catch(function (error) {

                window.localStorage.setItem("Logged", "2");
            })
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system

            $scope.loading = $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Logging in',

                //Will a dark overlay or backdrop cover the entire view
                showBackdrop: false,

                // The delay in showing the indicator
                showDelay: 10
            });



            $timeout(function () {

                //        $scope.closeLogin();
                $ionicLoading.hide();
                if (window.localStorage.getItem("Logged") == "1") {
                    var myPopup = $ionicPopup.show({
                        template: 'Welcome ' + window.localStorage.getItem("Name"),
                        scope: $scope,

                        buttons: [
                           { text: 'OK' }, {

                               onTap: function (e) {

                                   if (!$scope.data.model) {
                                       //don't allow the user to close unless he enters model...
                                       e.preventDefault();
                                   } else {
                                       return $scope.data.model;
                                   }
                               }
                           }
                        ]
                    });
                }
                else if (window.localStorage.getItem("Logged") == "0") {
                    var myPopup = $ionicPopup.show({
                        template: 'Email password combination invalid',
                        scope: $scope,

                        buttons: [
                           { text: 'OK' }, {

                               onTap: function (e) {

                                   if (!$scope.data.model) {
                                       //don't allow the user to close unless he enters model...
                                       e.preventDefault();
                                   } else {
                                       return $scope.data.model;
                                   }
                               }
                           }
                        ]
                    });

                }

                else if (window.localStorage.getItem("Logged") == "3") {
                    var myPopup = $ionicPopup.show({
                        template: 'Network error, check connection',
                        scope: $scope,

                        buttons: [
                           { text: 'OK' }, {

                               onTap: function (e) {

                                   if (!$scope.data.model) {
                                       //don't allow the user to close unless he enters model...
                                       e.preventDefault();
                                   } else {
                                       return $scope.data.model;
                                   }
                               }
                           }
                        ]
                    });

                }

            }, 1000);


            $timeout(function () {
                if (window.localStorage.getItem("Logged")=="1"){
                $scope.closeLogin();
                }
                else {

                }

            }, 2000);


        };

        $scope.login = function () {
            $scope.modal1.show();
            $scope.modal2.hide();
        };
        $scope.signup = function () {
            $scope.modal2.show();
            $scope.modal1.hide();
        }


        // Perform the sign up action when the user submits the login form
        $scope.doSignup = function () {
            console.log('Doing sign up', $scope.SignupData);

            


            var url2 = "http://www.forwardingenuity.com/sweat_users_upl.php";
            var name = $("#name").val();
            window.localStorage.setItem("Name", name);
            var email = $("#email").val();
            var password = $("#pass").val();
            //  var el = document.getElementById("provinces");
            //  var province = el.options[el.selectedIndex].value;
            var province = $('#provinces option:selected').val()

            var dataSt = "name=" + name + "&email=" + email + "&password=" + password + "&province=" + province
            if (password != '' && name != '' && email != '') {
                $scope.loading = $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i> Signing up',

                    //Will a dark overlay or backdrop cover the entire view
                    showBackdrop: false,

                    // The delay in showing the indicator
                    showDelay: 10
                });

                window.localStorage.setItem("empty", "0");
                $.ajax({
                    type: "POST",                                           //method
                    url: url2,     //url   
                    data: dataSt,                                       //data sent as concatinated string
                    crossDomain: true,
                    cache: false,
                    timeout: 5000,
                    beforeSend: function () { $("#submit_button").text('Connecting...'); },
                    success: function (data) {
                        if (data == "success") {
                            window.localStorage.setItem("signed_up", "1");
                            window.localStorage.setItem("Logged", "1");
                            window.localStorage.setItem("Name", name);
                            window.localStorage.setItem("email", email);
                            window.localStorage.setItem("province", province);
                            url1 = "http://www.forwardingenuity.com/sweat_users.php"
                            $http({ method: 'GET', url: url1, timeout: 5000 })
                                .then(function (response) {
                                    for (var i = 0; i < response.data.length; i++) {
                                        if (response.data[i].email == window.localStorage.getItem("email")) {
                                            window.localStorage.setItem("user_id", response.data[i].id);
                                        }
                                    }
                                })
                        }
                        else if (data == "error") {
                            window.localStorage.setItem("signed_up", "2");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        window.localStorage.setItem("signed_up", "3");
                    }

                });
            }
            else {
                window.localStorage.setItem("empty", "1");
            }
            // return false;


            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system




            if (window.localStorage.getItem("empty") == "0") {

                $timeout(function () {
                    //  $scope.closeLogin();
                    $ionicLoading.hide();
                    $("#submit_button").text('Sign Up')
                    if (window.localStorage.getItem("signed_up") == "1") {

                        var myPopup = $ionicPopup.show({
                            template: 'Welcome ' + window.localStorage.getItem("Name"),
                            scope: $scope,

                            buttons: [
                               { text: 'OK' }, {

                                   onTap: function (e) {

                                       if (!$scope.data.model) {
                                           //don't allow the user to close unless he enters model...
                                           e.preventDefault();
                                       } else {
                                           return $scope.data.model;
                                       }
                                   }
                               }
                            ]
                        });
                    }
                    else if (window.localStorage.getItem("signed_up") == "0") {
                        var myPopup = $ionicPopup.show({
                            template: 'Error logging in, please try again',
                            scope: $scope,

                            buttons: [
                               { text: 'OK' }, {

                                   onTap: function (e) {

                                       if (!$scope.data.model) {
                                           //don't allow the user to close unless he enters model...
                                           e.preventDefault();
                                       } else {
                                           return $scope.data.model;
                                       }
                                   }
                               }
                            ]
                        });

                    }

                    else if (window.localStorage.getItem("signed_up") == "3") {
                        var myPopup = $ionicPopup.show({
                            template: 'Network error, please check connection',
                            scope: $scope,

                            buttons: [
                               { text: 'OK' }, {

                                   onTap: function (e) {

                                       if (!$scope.data.model) {
                                           //don't allow the user to close unless he enters model...
                                           e.preventDefault();
                                       } else {
                                           return $scope.data.model;
                                       }
                                   }
                               }
                            ]
                        });

                    }

                }, 3000);


                $timeout(function () {
                    if (window.localStorage.getItem("signed_up") == "1") {


                        $scope.closeLogin();
                    }
                    else {

                    }
                }, 4000);


            }
            else {
                var myPopup = $ionicPopup.show({
                    template: 'Email/Password/Name cannot be left empty',
                    scope: $scope,

                    buttons: [
                       { text: 'OK' }, {

                           onTap: function (e) {

                               if (!$scope.data.model) {
                                   //don't allow the user to close unless he enters model...
                                   e.preventDefault();
                               } else {
                                   return $scope.data.model;
                               }
                           }
                       }
                    ]
                });

            }
            

        };


    })




    .controller("button_controller", function ($scope, $ionicModal, $http) {
        $scope.login = function () {
            if (window.localStorage.getItem("Logged") == "1") {
                location.href = "apply_page.html";
            }
            else {
                location.href = "Notsigned.html";
            }
        }

    })

    .controller("apply_page_controller", function ($scope, $ionicModal, $ionicLoading, $timeout, $ionicPopup, $http) {
        
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('competitions/page1.html', {
            id: '3',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false,
            focusFirstInput: true
        }).then(function (modal) {
            $scope.modal3 = modal;
            $scope.modal3.show();
        });
        
        $ionicModal.fromTemplateUrl('competitions/page2.html', {
            id: '4',
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false,
            focusFirstInput: true
        }).then(function (modal) {
            $scope.modal4 = modal;
            
        });

        $scope.doPage1 = function () {
            var text=$("#texta").val();
            window.localStorage.setItem('text',text);

            $scope.modal3.hide();
            $scope.modal4.show();
            
        }

        $scope.previous = function () {
            
            $scope.modal4.hide();
            $scope.modal3.show();

        }
        

        $scope.doPage2 = function () {
            $("#page2_submit").text('connecting...');
            $scope.loading = $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Submitting',

                //Will a dark overlay or backdrop cover the entire view
                showBackdrop: false,

                // The delay in showing the indicator
                showDelay: 10
            });


            var file = document.querySelector("#afile").files[0];
            var fd = new FormData();
            fd.append("afile", file);
            fd.append("name", window.localStorage.getItem("Name"));
            fd.append("email", window.localStorage.getItem("email"));
            fd.append("province", window.localStorage.getItem("province"));
            fd.append("text", window.localStorage.getItem("text"));

            var filename = "http://www.sweatbrand.forwardingenuity.com/competition_images/";
            fd.append("image", filename);
            
            //var dataString = "name=" + window.localStorage.getItem("Name") + "&email=" + window.localStorage.getItem("email") + "&province=" + window.localStorage.getItem("province") + "&image=" + filename + "&insert=1";

            // These extra params aren't necessary but show that you can include other data.
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://www.sweatbrand.forwardingenuity.com/competition_entry.php', true);
            //var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')
            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var percentComplete = (e.loaded / e.total) * 100;
                    console.log(percentComplete + '% uploaded');
                   
                }
            };
            xhr.onload = function () {
                window.localStorage.setItem("entered", "1");
            };
            xhr.send(fd);


            $timeout(function () {
                $ionicLoading.hide();
                if (window.localStorage.getItem("entered") == "1") {
                var myPopup = $ionicPopup.show({
                    template: 'Thank you ' + window.localStorage.getItem("Name") + ' for your entry',
                    scope: $scope,

                    buttons: [
                       { text: 'OK' }, {

                           onTap: function (e) {

                               if (!$scope.data.model) {
                                   //don't allow the user to close unless he enters model...
                                   e.preventDefault();
                               } else {
                                   return $scope.data.model;
                               }
                           }
                       }
                    ]
                });
            }
                else {
                    
                    var myPopup = $ionicPopup.show({
                        template: 'Network error, check connection and try again',
                        scope: $scope,

                        buttons: [
                           { text: 'OK' }, {

                               onTap: function (e) {

                                   if (!$scope.data.model) {
                                       //don't allow the user to close unless he enters model...
                                       e.preventDefault();
                                   } else {
                                       return $scope.data.model;
                                   }
                               }
                           }
                        ]
                    });
                }

            }, 3000)


            $timeout(function () {
                if (window.localStorage.getItem("entered") == "1") {
                    $("#page2_submit").text('Submit');
                    location.replace('competitions.html');
                }
                else {

                }
            }, 4000)


        }

        
    })


}());

