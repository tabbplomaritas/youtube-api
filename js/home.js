"use strict";

const home = {
  templateUrl: "../home.html",

  controller: ["YouTubeService", "$timeout", function(YouTubeService, $timeout) {

    const vm = this;
    vm.trailers;
    vm.clickedMovie;
    vm.queryResults;
    vm.showPlayer = false;
    vm.showThumb = true;
    vm.limit = 100;
    let videoId;
    let movieInfoThumbnail = document.querySelector("movieInfo_thumbnail");
    let readButton = document.querySelector(".readMore");
    let movieInfo = document.querySelector(".movieInfo");
    let iframe = document.querySelector("iframe");
    let dropdowns = document.querySelector(".dropdowns");
    let trailerLinks = document.querySelector(".dropdowns_trailerLinks");
    let linksWrapper = document.querySelector(".dropdowns_linksWrapper");
    let form = document.querySelector("form");
    let formWrapper = document.querySelector(".form_wrapper");
    let searchResults = document.querySelector(".searchResults");
    let trailerLinksVisible = false;
    let formVisible = false;

    YouTubeService.getTrailers().then((response) => {
      vm.trailers = response.data.items;
      //set custom titles for nav menu titles for shorter, simpler titles. Full title shown in movie info
      vm.trailers[0].customTitle = "Smallfoot";
      vm.trailers[1].customTitle = "The Grinch";
      vm.trailers[2].customTitle = "Hotel Transylvania";
      vm.trailers[3].customTitle = "Sherlock Gnomes";
      vm.trailers[4].customTitle = "Incredibles 2";
    })

    vm.animateSearchForm = () => {
      if(!formVisible){
        vm.showSearchForm();
      } else {
        vm.hideForm();
      }
    }

    vm.showSearchForm = () => {
      
      vm.slideUp();
      angular.element(form).removeClass("fadeOut");

      $timeout(function() {
        angular.element(form).css("display", "flex");
        angular.element(form).addClass("fadeIn");
      }, 400);

      formVisible = true;
    }

    vm.hideForm = () => {
      angular.element(form).removeClass("fadeIn");
      angular.element(form).css("display", "none");

      $timeout(function() {
        angular.element(form).addClass("fadeOut");
      }, 500);

      formVisible = false;
    }

    vm.animateDropdown = () => {
      if(!trailerLinksVisible){
        vm.slideDown();
      } else {
        vm.slideUp();
      }
    }

    vm.slideDown = () => {
      //if movieInfo section is showing, blur
      angular.element(movieInfo).addClass("blur");
      //hide search form
      if(formVisible){
        vm.hideForm();
      }
      //animate in drop down trailer links
      $timeout(function() {
        angular.element(linksWrapper).css("display", "block");
        angular.element(trailerLinks).addClass("slideInDown");
      }, 400);
      //remove the animation class
      $timeout(function() {
        angular.element(trailerLinks).removeClass("slideInDown");
      }, 1400);
      
      trailerLinksVisible = true;
    }

    vm.slideUp = () => {
      angular.element(trailerLinks).addClass("slideOutUp");
      angular.element(movieInfo).removeClass("blur");

      $timeout(function() {
        angular.element(linksWrapper).css("display", "none");
        angular.element(trailerLinks).removeClass("slideOutUp");
      }, 800);
     
      trailerLinksVisible = false;
    }

    vm.clickMovie = ($event, $index) => {
      //slide the trailerLinks menu up
      vm.slideUp();
      //clear the search results if they're showing
      angular.element(searchResults).addClass("animated fadeOut");
      //reset the read more button incase it was previously hidden and reset description limit
      angular.element(readButton).css("display", "block");
      vm.limit = 100;
      //set or update the clicked movie data and fade in
      $timeout( function(){
        angular.element(movieInfo).css("display", "flex");
        videoId = $event.target.id;
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        vm.clickedMovie = vm.trailers[$index];
        angular.element(movieInfo).addClass("animated fadeIn");
      }, 600 );

      //reset the thumbnail to show and the video to not show
      vm.showPlayer = false;
      vm.showThumb = true;
    }

    vm.fadeOut = () => {
      //fade out movie info thumbnail
      angular.element(movieInfoThumbnail).addClass("animated fadeOut");
      //remove fadeOut
      $timeout( function(){
        angular.element(movieInfoThumbnail).css("display", "none");
        angular.element(movieInfoThumbnail).removeClass("animated fadeOut");
    }, 500 );
    }

    vm.movieInfo_fadeOut = () => {
      angular.element(movieInfo).addClass("fadeOut");
      $timeout(function() {
        angular.element(movieInfo).css("display", "none");
        angular.element(movieInfo).removeClass("fadeOut");
      }, 1000)
  }

    vm.readMore = () => {
      //increase the character limit on description
        vm.limit = 100000;
      //remove 'read more' button
        angular.element(readButton).css("display", "none"); 
    }

    vm.watchTrailer = () => {
      //fade out the thumbnail
      vm.fadeOut();
      //swap ng-show of player and thumbnail
        $timeout( function(){
          vm.showPlayer = true;
          vm.showThumb = false;
      }, 500 );
    }

    
    vm.sendRequest = (query) => {
      //if visible, fadeout the movie info section to make room for the search results
     vm.movieInfo_fadeOut();

      //send api call for user input search term then set response to variable.
      YouTubeService.sendQuery(query).then((response) => {
        vm.queryResults = response;
      });
    }

  }]
};

angular
  .module("App")
  .component("home", home);
