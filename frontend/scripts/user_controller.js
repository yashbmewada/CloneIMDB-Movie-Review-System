angular.module('User')

.controller('UserProfileController',
    [
        '$scope','$http','$routeParams',
        function($scope,$http,$routeParams){
            console.log('Inside the UserPofile Contoller');
            $scope.whichUser = $routeParams.userId;

            //get user details
            $scope.userDetails = {};

            config = {
                headers:{
                    access_token:$scope.currentUser.authToken
                }
            }
            //Get the user details for profile
            $http.get('http://localhost:3000/api/AppUsers/'+$scope.whichUser,config)
                .then(function(response){
                    $scope.userDetails = response.data;
                    $scope.errors.userProfileError = false;
                },function(response){

                    $scope.errors.userProfileError = true;
                })

            //Get the user favorite movies
            $http.get('http://localhost:3000/api/AppUsers/'+$scope.whichUser + '/favorites', config)
                .then(function(response){
                    $scope.errors.favFetchError = false;
                    $scope.userDetails.favorites = response.data;
                },function(response){
                    $scope.errors.favFetchError = true;
                })


            
            $http.get($scope.appUserUrl + '/'+ $scope.whichUser + '/reviews/'  , config)
            .then(function(response){
                    $scope.errors.fetchReviewError = false;
                    $scope.userDetails.reviews = response.data;
            }, function(response){
                $scope.errors.fetchReviewError = true;
            })
        
        }
    ])

.controller('addMovieController',
[
    '$scope','Upload','$location','$http','$timeout',
    function($scope,Upload,$location,$http,$timeout){
        
        $scope.addMovie = function(file){
            //upload image
            file.upload = Upload.upload({
      url: 'http://localhost:3000/upload',
      data: {photo: file},
      headers:{access_token:$scope.currentUser.authToken}
    });

    file.upload.then(function (response) {
      $timeout(function () {
         $scope.newMovie.coverImageUrl = response.data.url;
         $scope.newMovie.rating = 0.0;
         //adding the movie.
            $http.post($scope.movieUrl,$scope.newMovie,{header:{access_token:$scope.currentUser.authToken}})
            .then(function(response){
                $scope.errors.postMovieError = false;
                console.log("Mobvie Post data : ",response.data);
            }
            ,function(response){
                $scope.errors.postMovieError = true;
                console.log("FAiled")
            })
      })
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    })

            
        }
    }
])

.controller('deleteReviewController',
['$scope','$http','$routeParams','$location',
function($scope,$http,$routeParams,$location){
    $scope.whichReview = $routeParams.reviewId;
    $scope.whichUser = $routeParams.userId;

    var config = { 
        headers:{
            access_token:$scope.currentUser.authToken
        }
    }

    $http.get($scope.reviewsUrl + "/" + $scope.whichReview, config)
    .then(function(response){
        console.log("Got Review with values: ", response.data);
        $scope.review = response.data;
    },function(response){
        console.log("Could not get the review");
    })


    $scope.deleteReview = function(){
        $http.delete($scope.reviewsUrl + "/" + $scope.whichReview, config)
        .then(function(response){
            console.log("Deleted the review");
            $location.path("/user/"+$scope.whichUser);
        },function(response){
            console.log("Could not delete the review");
        })
    }
}])

