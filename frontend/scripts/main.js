
angular.module('Authentication',[]);
angular.module('Home',['ngFileUpload']);
angular.module('User',['ngFileUpload']);
var app = angular.module('moviesApp',['ngRoute','ngFileUpload','Authentication','Home','User','ngCookies']);

app.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/',{
        
        templateUrl:'views/welcome.html',
        controller:'HomePageController'
    })
        .when('/details/:movieId',{
            templateUrl: 'views/movie_details.html',
            controller:'DetailsController'
        })
        .when('/user/:userId',{
            templateUrl:'views/user_profile.html',
            controller:'UserProfileController'
        })
        .when('/user/:userId/delete-review/:reviewId',{
            templateUrl:'views/delete_review.html',
            controller:'deleteReviewController'
        })
        .when('/details/:movieId/addReview',{
            templateUrl:'views/review_form.html',
            controller:'addReviewController'
        })
        .when('/details/:movieId/editReview/:reviewId',{
            templateUrl:'views/review_form.html',
            controller:'editReviewController'
        })
        .when('/add-movie',{
            templateUrl:'views/add_movie.html',
            controller: 'addMovieController'
        })
        .when('/:movieId/edit-movie',{
            templateUrl:'views/add_movie.html',
            controller: 'editMovieController'
        })
        .when('/:movieId/delete-movie',{
            templateUrl:'views/delete_movie.html',
            controller:'deleteMovieController'
        })
    .when('/login',{
        templateUrl:'views/login.html',
        controller:'LoginController'
    
    })
    .when('/signup',{
        templateUrl:'views/signup.html',
        controller: 'SignupController'
    })
    .otherwise({
        redirectTo: '/'
    });
}

])

app.run(['AuthService','$rootScope','$location','$cookies','$http',
    function(AuthService, $rootScope, $location,$cookies,$http){

        //defining all the base urls for api calls
        $rootScope.appUserUrl = 'http://localhost:3000/api/AppUsers';
        $rootScope.movieUrl = 'http://localhost:3000/api/Movies';
        $rootScope.reviewsUrl = 'http://localhost:3000/api/Reviews';

        $rootScope.errors = {};

        $rootScope.currentUser = $cookies.getObject('currentUser') || {};
        if(angular.equals($rootScope.currentUser,{})){
            $rootScope.isLoggedin = false;
        }else{
            $rootScope.isLoggedin = true;
        
        }

        $rootScope.openMoviePage = function(movieId){
            $location.path('details/'+movieId);
        }
        
        console.log("User is logged in : " , $rootScope.isLoggedin);
        console.log($rootScope.currentUser);
    }
])