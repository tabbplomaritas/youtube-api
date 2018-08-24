"use strict";

const home = {
  template: `
  <nav>
      <a id="trailers" ng-click="$ctrl.animateDropdown();">Movie Trailers</a>
      <a id="search" ng-click="$ctrl.animateSearchForm();">Search</a>
  </nav>

  <hr>

  <section class="dropdowns flex-col-center">
      <!-- trailer links dropdown -->
      <!-- using wrapper div to hide the overflow on aninmated links div -->
      <div class="dropdowns_linksWrapper">
        <div class="dropdowns_trailerLinks shadow animated">
          <a ng-repeat="trailer in $ctrl.trailers" id={{trailer.id}} ng-click="$ctrl.setClickedMovie($event)">{{trailer.customTitle}}</a>
          <i class="fas fa-times-circle trailerLinks_close" ng-click="$ctrl.slideUp();"></i>
        </div>
      </div>

    <!--Search drop down form-->
      <form class="animated" ng-submit="$ctrl.sendRequest($ctrl.query);">
        <div class="searchWrapper shadow">
          <input type="text" ng-model="$ctrl.query" placeholder="Search for a movie trailer" autofocus >
          <button class="searchButton">
              <i class="fas fa-search"></i>
          </button>
        </div>
      </form>
  </section>


  <section class="player">
      <i class="fas fa-times-circle movieInfo_close" ng-click="$ctrl.movieInfo_fadeOut();"></i>
      <h2>{{$ctrl.clickedMovie.snippet.title}}</h2>

    <div class="movieInfo_thumbnail" ng-show="$ctrl.showThumb">
      <img src={{$ctrl.clickedMovie.snippet.thumbnails.medium.url}} alt='thumbnail image of youtube movie titled {{$ctrl.clickedMovie.snippet.title}}'>
      <button class="watchTrailer animated pulse infinite" ng-click="$ctrl.watchTrailer()">Watch the trailer</button>
    </div>

    <section class="videoPlayer">
        <iframe ng-show="$ctrl.showPlayer" width="336" height="189" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </section>

      <section class="movieInfo_details">
        <p class="description" >{{$ctrl.clickedMovie.snippet.description | limitTo: $ctrl.limit }} ...
        <button class="readMore" ng-click="$ctrl.readMore();"> read more</button></p>

        <div class="movieInfo_stats">
          <p>Views: <i class="fas fa-eye"></i> {{$ctrl.clickedMovie.statistics.viewCount}}</p>
          <p>Likes: <i class="fas fa-heart"></i> {{$ctrl.clickedMovie.statistics.likeCount}} </p>
          <p>Dislikes: <i class="fas fa-thumbs-down"></i> {{$ctrl.clickedMovie.statistics.dislikeCount}}</p>
        </div>
      </section>
  </section>

<!-- search results list -->

  <section class="searchResults">
    <div class="searchResults_thumbnail animated fadeIn shadow" ng-repeat="item in $ctrl.queryResults">
      <p>{{item.snippet.title}}</p>

      <img src="{{item.snippet.thumbnails.medium.url}}" id={{item.id}} ng-click="$ctrl.setClickedMovie($event);" alt='thumbnail image of youtube movie titled {{item.snippet.title}}'>

  </section>`,

  controller: ["YouTubeService", "$timeout", function(YouTubeService, $timeout) {

    const vm = this;
    vm.trailers;
    vm.clickedMovie;
    vm.queryResults;

    let videoId;
    let trailerLinks = document.querySelector(".dropdowns_trailerLinks");
    let linksWrapper = document.querySelector(".dropdowns_linksWrapper");
    let form = document.querySelector("form");
    let formWrapper = document.querySelector(".form_wrapper");
    let searchResults = document.querySelector(".searchResults");
    let trailerLinksVisible = false;
    let formVisible = false;
    let movieInfoThumbnail = document.querySelector("movieInfo_thumbnail");
    let readButton = document.querySelector(".readMore");
    let iframe = document.querySelector("iframe");
    let player = document.querySelector(".player");

    vm.showPlayer = false;
    vm.showThumb = true;
    vm.limit = 100;



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
      //if movieInfo or search results section is showing, blur
      angular.element(player).addClass("blur");
      angular.element(searchResults).addClass("blur");
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
      angular.element(player).removeClass("blur");
      angular.element(searchResults).removeClass("blur");

      $timeout(function() {
        angular.element(linksWrapper).css("display", "none");
        angular.element(trailerLinks).removeClass("slideOutUp");
      }, 800);

      trailerLinksVisible = false;
    }

    vm.setClickedMovie = ($event) => {
      //slide the trailerLinks menu up
      vm.slideUp();

      //set the clickedMovie data
      YouTubeService.setClickedMovie($event.target.id).then((response) => {
        vm.clickedMovie = response;
        iframe.src = `https://www.youtube.com/embed/${vm.clickedMovie.id}`;
            //reset the read more button incase it was previously hidden and reset description limit

        if(vm.clickedMovie.snippet.description.length > 100){
          angular.element(readButton).css("display", "block");
          vm.limit = 100;
        }
      });

      //animate in the player
      $timeout( function(){
      //set iframe source
        angular.element(player).css("display", "flex");
        angular.element(player).addClass("animated fadeIn");
      }, 600 );
      window.scrollTo(0, 0);
    };


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
      angular.element(player).addClass("fadeOut");
      $timeout(function() {
        angular.element(player).css("display", "none");
        angular.element(player).removeClass("fadeOut");
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
        //reset search input
        vm.query = "";
      });
    }
  }]
};

angular
  .module("App")
  .component("home", home);
