"use strict";



const youTube = {
  template: `
  <nav>


    <i class="fas fa-bars" id="menu" ></i>



    <a ng-repeat="trailer in $ctrl.trailers" id={{trailer.id}} ng-click="$ctrl.clickMovie($event, $index)">{{trailer.customTitle}}</a>



  </nav>

  <form ng-submit="$ctrl.sendRequest($ctrl.query);">
      <div class="searchWrapper">
        <input type="text" ng-model="$ctrl.query" placeholder="Search for a movie trailer">
        <button class="searchButton">
          <i class="material-icons">
          search
          </i>
          </button>
      </div>
  </form>

  <section class="movieInfo">
    <h2>{{$ctrl.clickedMovie.snippet.title}}</h2>
    <p class="description" >{{$ctrl.clickedMovie.snippet.description | limitTo:600 }} ...<button class="readMore">read more</button></p>

    <img ng-show="$ctrl.showThumb" src={{$ctrl.clickedMovie.snippet.thumbnails.medium.url}}

    <p>{{$ctrl.clickedMovie.statistics.viewCount}} Views</p>
    <p>{{$ctrl.clickedMovie.statistics.likeCount}} Likes</p>
    <p>{{$ctrl.clickedMovie.statistics.dislikeCount}}Dislikes</p>

    <a class="watchTrailer" ng-click="$ctrl.watchTrailer()">Watch the trailer</a>

    <iframe width="560" height="315" ng-show="$ctrl.showPlayer" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </section>

  <section class="searchResults">
    <div ng-repeat="item in $ctrl.queryResults">
      <p>{{item.snippet.title}}</p>
      <p>{{item.snippet.description | limitTo:600 }} ...<button class="readMore"> read more</button></p>
      <p>{{item.statistics.viewCount}} Views</p>

      <img src="{{item.snippet.thumbnails.medium.url}}">
    </div>
  </section>
  `,

  controller: ["YouTubeService", "$timeout", function(YouTubeService, $timeout) {

    const vm = this;
    vm.trailers;
    vm.clickedMovie;
    vm.queryResults;
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

    vm.sendRequest = (query) => {
      YouTubeService.sendQuery(query).then((response) => {

        vm.queryResults = response;
        console.log(vm.queryResults);

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
