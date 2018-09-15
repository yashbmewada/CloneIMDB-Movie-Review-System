angular.module('Home')

    .controller('HomePageController', ['AuthService', '$location', '$scope', '$rootScope', '$http',
        function (AuthService, $location, $scope, $rootScope, $http) {
            $scope.movies = [];
            $scope.order = "category";
            //console.log($scope.currentUser);
            $scope.totalPages = 0;
            $scope.totalResults = 0
            rows = 2;
            $scope.perPage = 4 * rows;
            $scope.currentPagePosition = 0;

            $rootScope.refreshResult = function () {
                var config = getSearchConfig();
                $http.get('http://localhost:3000/api/Movies', config)
                    .then(
                        function (response) {
                            $scope.movies = response.data;
                            console.log($scope.movies)
                        },
                        function (err) {
                            console.log(err);
                        }
                    )
            }

            // this is to convert totalPages in array for pagination view ng-repeat 
            $scope.getNumbers = function (num) {
                return new Array(num);
            }

            $scope.updateCurrentPage = function (pageNumber) {
                if (pageNumber <= $scope.totalPages || pageNumber == 1) {
                    $scope.currentPagePosition = pageNumber;
                    if ($scope.currentPagePosition == 1) {
                        $scope.isPrevEnable = false;
                    } else {
                        $scope.isPrevEnable = true;
                    }

                    if ($scope.currentPagePosition == $scope.totalPages) {
                        $scope.isNextEnable = false;
                    } else {
                        $scope.isNextEnable = true;
                    }

                    $scope.refreshResult();
                } else {
                    console.log("Condition failed");

                }
            }

            $rootScope.onQueryUpdated = function () {
                var config = getSearchCountConfig();
                $http.get('http://localhost:3000/api/Movies/count', config)
                    .then(
                        function (response) {
                            console.log(response);
                            console.log("Search term is '" + getQuery() + "'");

                            $scope.totalResults = response.data.count;
                            $scope.totalPages = Math.ceil($scope.totalResults / $scope.perPage);
                            console.log("Total res:" + $scope.totalResults + " Total pages:" + $scope.totalPages);

                            $scope.updateCurrentPage(1);
                        },
                        function (err) {
                            console.log(err);
                        }
                    )
            }

            $scope.onQueryUpdated();

            $rootScope.showHomePage = function () {
                console.log("Should show search page");
                $location.path('/');
            }

            function getQuery() {
                if ($scope.searchTerm != null) {
                    return $scope.searchTerm;
                } else {
                    return "";
                }
            }

            function getSearchConfig() {
                var query = getQuery();
                console.log("SearchTerm is:" + $scope.searchTerm);



                var caseInsensitive = 'i';
                var config = {
                    // for limit filter[limit]=_n_
                    // for skip  ?filter[skip]=50  
                    // for like  ?filter[where][property][like]=value //{"where":{"title":{"like":"Kegular.*","options":"i"}}}
                    // for or    ?filter[where][or][0][title]=My%20Post&filter[where][or][1][content]=Hello
                    params: {
                        "filter[limit]": $scope.perPage,
                        "filter[skip]": ($scope.currentPagePosition - 1) * $scope.perPage,
                        "filter[where][or][0][title][like]": query,
                        "filter[where][or][0][title][options]": caseInsensitive,
                        "filter[where][or][1][actor3][like]": query,
                        "filter[where][or][1][actor3][options]": caseInsensitive,
                        "filter[where][or][2][actor1][like]": query,
                        "filter[where][or][2][actor1][options]": caseInsensitive,
                        "filter[where][or][3][actor2][like]": query,
                        "filter[where][or][3][actor2][options]": caseInsensitive,
                        "filter[where][or][4][description][like]": query,
                        "filter[where][or][4][description][options]": caseInsensitive,
                        "filter[where][or][5][year]": query,
                        "filter[where][or][6][category][like]": query,
                        "filter[where][or][6][category][options]": caseInsensitive,
                        "filter[where][or][7][director][like]": query,
                        "filter[where][or][7][director][options]": caseInsensitive,
                    }
                }
                return config;
            }

            function getSearchCountConfig() {
                var query = getQuery();
                console.log("SearchTerm is:" + $scope.searchTerm);
                var caseInsensitive = 'i';
                var config = {
                    // for limit filter[limit]=_n_
                    // for skip  ?filter[skip]=50  
                    // for like  ?filter[where][property][like]=value //{"where":{"title":{"like":"Kegular.*","options":"i"}}}
                    // for or    ?filter[where][or][0][title]=My%20Post&filter[where][or][1][content]=Hello
                    params: {
                        "where[or][0][title][like]": query,
                        "where[or][0][title][options]": caseInsensitive,
                        "where[or][1][actor3][like]": query,
                        "where[or][1][actor3][options]": caseInsensitive,
                        "where[or][2][actor1][like]": query,
                        "where[or][2][actor1][options]": caseInsensitive,
                        "where[or][3][actor2][like]": query,
                        "where[or][3][actor2][options]": caseInsensitive,
                        "where[or][4][description][like]": query,
                        "where[or][4][description][options]": caseInsensitive,
                        "where[or][5][year]": query,
                        "where[or][6][category][like]": query,
                        "where[or][6][category][options]": caseInsensitive,
                        "where[or][7][director][like]": query,
                        "where[or][7][director][options]": caseInsensitive,
                    }
                }
                return config;
            }

            $scope.openMoviePage = function (movieId) {
                $location.path('details/' + movieId);
            }


            $rootScope.signout = function () {
                console.log(" Current USER before Sign out : ", $scope.currentUser);
                // TODO : Uncomment This line to make a request using the 
                var logoutEndpoint = 'http://localhost:3000/api/AppUsers/logout';
                var access_token = $scope.currentUser.authToken
                console.log(access_token, "  =  ", typeof (access_token));
                $http({
                    method: 'POST',
                    url: logoutEndpoint,
                    headers: {
                        access_token: access_token
                    }
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("inside response")
                    AuthService.ClearCredentials();
                    $rootScope.currentUser = {};
                    $rootScope.isLoggedin = false;
                    $scope.errors.logoutError = false;
                    $location.path('/');
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.errors.logoutError = true;
                });



                console.log("Logout Successful");
                console.log("Current USER after Signout : ", $scope.currentUser)

            }

        }
    ])

    //GEt details of movie page.
    .controller('DetailsController', ['$scope', '$rootScope', '$http', '$routeParams',
        function ($scope, $rootScope, $http, $routeParams) {
            $scope.whichMovie = $routeParams.movieId;
            $scope.movieDetail = {};
            var baseMoviesUrl = 'http://localhost:3000/api/Movies/';
            //GEt the details of movie
            $http.get(baseMoviesUrl + $scope.whichMovie)
                .then(function (response) {
                    $scope.movieDetail = response.data;
                    $scope.errors.movieLoadError = false;
                }, function (response) {
                    $scope.errors.movieLoadError = true;
                    console.log("Movie fetch failed");
                })

            //GEt the reviews for that movie

            var config = {
                params: {
                    "filter[include]": "appUser"
                }
            }

        
            $http.get(baseMoviesUrl + $scope.whichMovie + '/reviews', config)
                .then(function (response) {
                    $scope.movieDetail.reviews = response.data;
                    $scope.movieDetail.reviewCount = $scope.movieDetail.reviews.length;
                    $scope.errors.movieReviewFetchError = false;
                    console.log("Got the reviews")
                    console.log($scope.movieDetail.reviews)
                    //checking if user already has given a review or not
                    for(review of $scope.movieDetail.reviews){
                        console.log("Review being checked : " , review);
                        if(review.appUserId === $scope.currentUser.userId ){
                            console.log(true);
                            $scope.whichReview = review.id;
                            $scope.isReviewed = true;
                            break;
                        }else{
                            console.log(false);
                            $scope.isReviewed = false;
                            $scope.whichReview = null;
                        }
                    }
                }, function (repsonse) {
                    $scope.errors.movieReviewFetchError = true;
                    console.log("Could not get reviews")
                })

            
            
                
            //Add a movie to favorites
            var config = {
                headers: {
                    access_token: $scope.currentUser.authToken
                }
            }
            var data = {
                appUserId: $scope.currentUser.userId,
                movieId: $scope.whichMovie
            }

            
            $scope.addFavorite = function () {
                var favUrl = 'http://localhost:3000/api/AppUsers/' + $scope.currentUser.userId + '/favorites/rel/' + $scope.whichMovie;
                $http.put(favUrl, data, config)
                    .then(
                        function (response) {
                            console.log("Added favorite")
                            $scope.errors.addFavError = false;
                            $scope.isFavorite = true;
                        },
                        function (response) {
                            console.log("Could not add favorite")
                            $scope.errors.addFavError = true;
                            $scope.isFavorite = false;
                        }
                    )

            }

            if($scope.isLoggedin){

            //get User Favorites;
            $http.get('http://localhost:3000/api/AppUsers/'+$scope.currentUser.userId + '/favorites', config)
                .then(function(response){
                    $scope.errors.favFetchError = false;
                    $scope.favorites = response.data;
                    for(favorite of $scope.favorites){
                if(favorite.id === $scope.whichMovie){
                    $scope.isFavorite = true;
                }
            }
                },function(response){
                    $scope.errors.favFetchError = true;
                })

            }

            $scope.removeFavorite = function () {

                var favUrl = 'http://localhost:3000/api/AppUsers/' + $scope.currentUser.userId + '/favorites/rel/' + $scope.whichMovie;
                $http.delete(favUrl, config)
                    .then(
                        function (response) {
                            console.log("Added favorite")
                            //$scope.errors.addFavError = false;
                            $scope.isFavorite = false;
                        },
                        function (response) {
                            console.log("Could not add favorite")
                            //$scope.errors.addFavError = true;
                            $scope.isFavorite = true;
                        }
                    )

            }






        }
    ])

    .controller('addReviewController', [
        '$scope', '$http', '$location','$routeParams',
        function ($scope, $http, $location,$routeParams) {
            console.log("Inside the review controller")
            console.log($routeParams)
            console.log("movie id = ", $routeParams.movieId)
            $scope.whichMovie = $routeParams.movieId;

            $scope.review = {
                rating: "1",
                body: "",
                movieId: $scope.whichMovie,
                appUserId: $scope.currentUser.userId
            };
            //add a review if not provided.
            $scope.addReview = function () {
                console.log($scope.review.rating);
                if ($scope.review.body === "") {
                    $scope.errors.reviewContentError = true;
                    console.log("Content cannot be empty")
                } else {
                    //send the reviews
                    var config = {
                        params: {
                            access_token: $scope.currentUser.authToken
                        }
                    };
                    $scope.errors.reviewContentError = false;
                    reviewUrl = 'http://localhost:3000/api/Reviews'
                    $http.post(reviewUrl, $scope.review, config)
                        .then(function (response) {
                            console.log(response.status, "review posted for movie");
                            $scope.errors.reviewPostError = false;
                            $location.path('/details/' + $scope.whichMovie);
                            
                        }, function (response) {
                            $scope.errors.reviewPostError = true;
                            console.log("failed to post the review")
                        })
                }
            }
        }
    ])

    .controller('editReviewController',
    ['$scope', '$http', '$location','$routeParams',
    function ($scope, $http, $location,$routeParams) {
        var config = {
            headers:{
                access_token: $scope.currentUser.authToken
            }
        }
        $scope.whichReview = $routeParams.reviewId;
        $http.get($scope.reviewsUrl + "/" + $scope.whichReview,config)
        .then(function(response){
            console.log("Inside the Reviews get for edit review controller");
            console.log(response.data);
            $scope.review = response.data;
        },function(response){
            console.log("Failed getting the review with that id.");
        })

         //edit a review.
         $scope.addReview = function () {
            console.log($scope.review.rating);
            if ($scope.review.body === "") {
                $scope.errors.reviewContentError = true;
                console.log("Content cannot be empty")
            } else {
                //send the reviews
                var config = {
                    params: {
                        access_token: $scope.currentUser.authToken
                    }
                };
                $scope.errors.reviewContentError = false;
                reviewUrl = 'http://localhost:3000/api/Reviews'
                $http.put(reviewUrl, $scope.review, config)
                    .then(function (response) {
                        console.log(response.status, "review posted for movie");
                        $scope.errors.reviewPostError = false;
                        $location.path('/details/' + $routeParams.movieId);
                        
                    }, function (response) {
                        $scope.errors.reviewPostError = true;
                        console.log("failed to post the review")
                    })
            }
        }
    }])


    .controller('editMovieController', [
        '$scope', 'Upload', '$http', '$routeParams', '$location', '$timeout',
        function ($scope, Upload, $http, $routeParams, $location, $timeout) {
            $scope.whichMovie = $routeParams.movieId;
            var config = {
                headers: {
                    access_token: $scope.currentUser.authToken
                }
            }

            $http.get($scope.movieUrl + '/' + $scope.whichMovie, config)
                .then(function (response) {
                    $scope.newMovie = response.data;
                });


            $scope.addMovie = function (file) {
                file.upload = Upload.upload({
                    url: 'http://localhost:3000/upload',
                    data: {
                        photo: file
                    },
                    headers: {
                        access_token: $scope.currentUser.authToken
                    }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        $scope.newMovie.coverImageUrl = response.data.url;
                        $http.put($scope.movieUrl + '/' + $scope.whichMovie, $scope.newMovie, config)
                            .then(function (response) {
                                $scope.errors.editMovieError = false;
                                $location.path('/details/' + $scope.whichMovie);
                                console.log("Movie Edit Success");
                            }, function (response) {
                                $scope.errors.editMovieError = true;
                                console.log("Movie Edit Fail");
                            })
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }



        }
    ])

    .controller('deleteMovieController', ['$scope', '$http', '$location', '$routeParams',
        function ($scope, $http, $location, $routeParams) {
            $scope.whichMovie = $routeParams.movieId;
            var config = {
                headers: {
                    access_token: $scope.currentUser.authToken
                }
            }

            $http.get($scope.movieUrl + '/' + $scope.whichMovie, config)
                .then(function (response) {
                    $scope.movie = response.data;
                });



            $scope.deleteMovie = function () {
                $http.delete($scope.movieUrl + '/' + $scope.whichMovie, config)
                    .then(function (response) {
                        $scope.errors.deleteMovieError = false;
                        $location.path('/');
                        console.log("Movie Delete Success");
                    }, function (response) {
                        $scope.errors.deleteMovieError = true;
                        console.log("Movie Delete Fail");
                    })
            

        }
        }])