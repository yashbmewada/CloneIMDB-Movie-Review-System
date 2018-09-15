'use strict';
var app = require('../../server/server');
module.exports = function(Movie) {
    var Review = app.models.Review;
    Movie.updateScore = function (movie, deletingReviewId) {
        //fetch reviews of movie
        movie.reviews({}, function(err, reviews) {
            //calcualate total score of all the reviews
            var totalScore = 0;
            var totalReviews = reviews.length;
            for (let i = 0; i < reviews.length; i++) {
                const review = reviews[i];
                if(review.id != deletingReviewId){
                    totalScore = totalScore + review.rating;
                }else{
                    totalReviews--;
                }
            }
            //calculate total rating average 
           
            var average = totalScore / totalReviews;
            //round it upto 1 decimal point
            average = Math.round(average * 10) / 10;

            // set this average as movie rating
            movie.rating = average;
            console.log("Updated rating is:"+average);
            
            // finally save it
            movie.save();
            
        });
    }
};

