'use strict';



angular.module('Authentication')

.controller("LoginController",
[ 'AuthService','$scope','$rootScope','$location','$http',
    function(AuthService,$scope,$rootScope,$location,$http){
        var userData = {};
       $scope.login = function(){
           console.log("inside Login of controller");
            AuthService.Login($scope.username,$scope.password,function(response){
                if(response.status == 200){
                    $scope.errors.loginError=false;
                    console.log("USER DATA DURING LOGIN : ", response.data);
                    var authToken = response.data.id;
                    var config = {
                        headers:{
                            access_token:authToken
                        }
                    }
                    console.log("CONFIG: ",config);
                    $http.get($scope.appUserUrl + '/' + response.data.userId, config)
                    .then(function(response){
                        var userData = response.data;
                        console.log("USER DATA: ", userData);
                        AuthService.SetCredentials($scope.username,authToken ,userData.id,userData.isAdmin);
                        $location.path('/');
                    },function(response){
                        $scope.errors.loginError = true;
                    })
                }else{
                    $scope.errors.loginError = true;    
                }
            });

       }
    }

])

.controller("SignupController",
[
     '$scope', '$location','$http',
    function( $scope,$location,$http){

        $scope.signup= function(){
            var data = {username:$scope.username,
                  email:$scope.email,
                  password:$scope.password,
                  isAdmin: false
              }
      
          console.log(data);
              $http.post("http://localhost:3000/api/AppUsers",
              data).then(
                  function(response){
                    $scope.errors.signupError = false;
                    $location.path('/login');
                    console.log("signup success");
                  },
                  function(response){
                    $scope.errors.signupError = true;
                    $scope.errors.signupErrorMessage = response.data.error.details.messages;

                    if($scope.errors.signupErrorMessage.email){
                        $scope.errors.emailError = $scope.errors.signupErrorMessage.email[0];
                        }else{
                            $scope.errors.emailError = false;
                        }
                        if($scope.errors.signupErrorMessage.username){
                        $scope.errors.usernameError = $scope.errors.signupErrorMessage.username[0];  
                        }else{
                            $scope.errors.usernameError = false;
                        }
                    console.log("signup FAil username: ", $scope.errors.usernameError , "emailerror: ", $scope.errors.emailError);

                    if($scope.errors.signupErrorMessage.email){
                        $scope.errors.signupErrorMessage= $scope.errors.signupErrorMessage.email[0];
                    }
                    else if($scope.errors.signupErrorMessage.username){
                        $scope.errors.signupErrorMessage = $scope.errors.signupErrorMessage.username[0];
                    }
                                      
                    
                  }
              )
          
        }


    }

])

