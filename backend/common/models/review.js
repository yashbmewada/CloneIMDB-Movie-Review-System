'use strict';
var app = require('../../server/server');
module.exports = function(Review) {
    
    

    Review.observe('after save', function(ctx, next) {
        var Movie = app.models.Movie;
        Movie.findById(ctx.instance.movieId).then( function(movie) {
            console.log("FOUND Movie ", movie.title);
            Movie.updateScore(movie);
        });
        next();
    });

    Review.observe('before delete', function(ctx, next) {
        Review.findById(ctx.where.id).then(function(review){
            var Movie = app.models.Movie;
            Movie.findById(review.movieId).then( function(movie) {
                console.log("FOUND Movie ", movie.title);
                Movie.updateScore(movie,ctx.where.id);
            });
        });

        next();
    });
};
