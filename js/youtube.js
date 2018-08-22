"use strict";

   // <div ng-repeat="item in $ctrl.results">
    //   <p>{{item.snippet.title}}</p>
    //   <p>{{item.snippet.description}}</p>
    //   <img src="{{item.snippet.thumbnails.default.url}}">
    // </div>

const youTube = {
  template: `
  <nav>


    <i class="fas fa-bars menu" ></i>



    <a ng-repeat="trailer in $ctrl.trailers" id={{trailer.id}} ng-click="$ctrl.clickMovie($event, $index)">{{trailer.customTitle}}</a>

  </nav>


  <section class="movieInfo">
    <h2>{{$ctrl.clickedMovie.snippet.title}}</h2>
    <p class="description" >{{$ctrl.clickedMovie.snippet.description}}</p>

    <img ng-show="$ctrl.showThumb" src={{$ctrl.clickedMovie.snippet.thumbnails.medium.url}}

    <p>{{$ctrl.clickedMovie.statistics.viewCount}} Views</p>
    <p>{{$ctrl.clickedMovie.statistics.likeCount}} Likes</p>
    <p>{{$ctrl.clickedMovie.statistics.dislikeCount}}Dislikes</p>

    <button ng-click="$ctrl.watchTrailer()">Watch the trailer</button>

    <iframe width="560" height="315" ng-show="$ctrl.showPlayer" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </section>
  `,

  controller: ["YouTubeService", "$timeout", function(YouTubeService, $timeout) {

    const vm = this;
    vm.trailers;
    vm.clickedMovie;
    vm.showPlayer = false;
    vm.showThumb = true;
    let movieInfo = document.querySelector(".movieInfo");
    let iframe = document.querySelector("iframe");



      YouTubeService.getTrailers().then((response) => {
        vm.trailers = response.data.items;
        vm.trailers[0].customTitle = "Smallfoot";
        vm.trailers[1].customTitle = "The Grinch";
        vm.trailers[2].customTitle = "Hotel Transylvania";
        vm.trailers[3].customTitle = "Sherlock Gnomes";
        vm.trailers[4].customTitle = "Incredibles 2";

        console.log(vm.trailers);
      })




    vm.clickMovie = ($event, $index) => {
      //fade out current data
      vm.fadeOut();

      //set or update the clicked movie data and fade in
      $timeout( function(){
        let videoId = $event.target.id;
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        vm.clickedMovie = vm.trailers[$index];
        angular.element(movieInfo).addClass("animated fadeIn");
      }, 1000 );

      //reset the thumbnail to show and the video to not show
      vm.resetThumb();
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
        angular.element(movieInfo).removeClass("animated fadeOut");
    }, 500 );
    }

    vm.watchTrailer = () => {
      vm.showPlayer = true;
      vm.showThumb = false;


    }

    // YouTubeService.getYouTube().then((response) => {
    //   console.log("this is doing something");

    //   vm.results = response;
    //   console.log(vm.results);

    // });

    // vm.setStats = (id) => {
    //   YouTubeService.setStats(id);
    // }



  }]
};

angular
  .module("App")
  .component("youTube", youTube);
