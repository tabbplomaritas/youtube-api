"use strict";

/* <i class="fas fa-bars" id="menu"></i> */

const youTube = {
  templateUrl: "../template.html",

  controller: ["YouTubeService", "$timeout", function(YouTubeService, $timeout) {

    const vm = this;
    vm.trailers;
    vm.clickedMovie;
    vm.queryResults;
    vm.showPlayer = false;
    vm.showThumb = true;
    vm.limit = 100;
    let movieInfo = document.querySelector(".movieInfo");
    let iframe = document.querySelector("iframe");
    let dropdowns = document.querySelector(".dropdowns");
    let trailerLinks = document.querySelector(".dropdowns_trailerLinks");


      YouTubeService.getTrailers().then((response) => {
        console.log(response);

        vm.trailers = response.data.items;
        vm.trailers[0].customTitle = "Smallfoot";
        vm.trailers[1].customTitle = "The Grinch";
        vm.trailers[2].customTitle = "Hotel Transylvania";
        vm.trailers[3].customTitle = "Sherlock Gnomes";
        vm.trailers[4].customTitle = "Incredibles 2";
      })

    vm.clickMovie = ($event, $index) => {
      vm.hideDropdowns();

      //set or update the clicked movie data and fade in
      $timeout( function(){
        let videoId = $event.target.id;
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        vm.clickedMovie = vm.trailers[$index];
        angular.element(movieInfo).addClass("animated fadeIn");
      }, 500 );

      //reset the thumbnail to show and the video to not show
      vm.resetThumb();
    }

    vm.hideDropdowns = () => {
      //animate the divs up and out
        angular.element(trailerLinks).addClass("animated slideOutUp");
      //set them to display none to clear the layout
        $timeout( function(){
          angular.element(dropdowns).css("display", "none");
      }, 500 );
    }

    vm.resetThumb = () => {
      vm.showPlayer = false;
      vm.showThumb = true;
    }

    vm.fadeOut = () => {
      //fade out current window
      angular.element(movieInfo).addClass("animated fadeOut");
      //remove fadeOut so we can add fadeIn
      $timeout( function(){
        angular.element(movieInfo).css("display", "none");
        angular.element(movieInfo).removeClass("animated fadeOut");
    }, 500 );
    }

    vm.readMore = () => {
      vm.limit = 100000;
    }

    vm.watchTrailer = () => {
      vm.fadeOut();
        $timeout( function(){
          vm.showPlayer = true;
          vm.showThumb = false;
      }, 500 );
    }

    vm.sendRequest = (query) => {
      YouTubeService.sendQuery(query).then((response) => {
        vm.queryResults = response;
      });
  }

    vm.setStats = (id) => {
      YouTubeService.setStats(id);
    }


  }]
};

angular
  .module("App")
  .component("youTube", youTube);
