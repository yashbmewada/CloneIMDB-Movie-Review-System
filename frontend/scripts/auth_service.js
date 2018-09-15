'use strict';

angular.module('Authentication')

.factory("AuthService",
['$cookies','$http','$rootScope',
    function($cookies,$http,$rootScope){
        var service = {};
        
        service.Login = function(username, password, callback){
            var loginEndpoint = 'http://localhost:3000/api/AppUsers/login'
            var data = {
                username:username,
                password:password
            }
            $http.post(loginEndpoint, data)
            .then(function(response){
                console.log("success login");
                callback(response);
                $rootScope.isLoggedin = true;

            },function(response){
                console.log("fail login");
                callback(response);
            })
        }

        service.SetCredentials = function(username,authToken,userId,isAdmin){
           $rootScope.currentUser = {
               username:username,
               authToken:authToken,
               userId:userId,
               isAdmin:isAdmin
           };
            console.log($rootScope.currentUser);
           $cookies.putObject('currentUser',$rootScope.currentUser);
        }

        service.ClearCredentials = function(){
            $rootScope.currentUser = {};
            $cookies.remove('currentUser');
        }

        service.CheckLogin = function(userId,callback){
            var checkEndpoint = 'http://localhost:3000/api/AppUsers/'+userId;
            $http.get(checkEndpoint)
            .then(function(response){
                callback(response)
            },function(response){
                callback(response)
            })
        }
        return service;
    }
])