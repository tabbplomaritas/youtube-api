"use strict";

   // <div ng-repeat="item in $ctrl.results">
    //   <p>{{item.snippet.title}}</p>
    //   <p>{{item.snippet.description}}</p>
    //   <img src="{{item.snippet.thumbnails.default.url}}">
    // </div>

const youTube = {
  template: `<h1>Tabb's Movie Trailer API App</h1>


  <nav>
    <a ng-repeat="trailer in $ctrl.trailers" id={{trailer.id}} ng-click="$ctrl.clickMovie($event)">{{trailer.snippet.title}}</a>
  
  </nav>
    
 
  <div>
    <h2>{{$ctrl.stats.data.items["0"].snippet.title}}</h2>

    <p>Number of Views: {{$ctrl.stats.data.items["0"].statistics.viewCount}}</p>
    <p>Number of Likes: {{$ctrl.stats.data.items["0"].statistics.likeCount}}</p>
    <p>Number of Dislikes: {{$ctrl.stats.data.items["0"].statistics.dislikeCount}}</p>

    <iframe width="560" height="315" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
  `,

  controller: ["YouTubeService", function(YouTubeService) {

    const vm = this;
    vm.trailers;
   
      YouTubeService.getTrailers().then((response) => {
        vm.trailers = response.data.items;
        console.log(vm.trailers);
      })

    vm.clickMovie = ($event) => {
      let iframe = document.querySelector("iframe");
      let videoId = $event.target.id;
     
      iframe.src = `https://www.youtube.com/embed/${videoId}`
     
    
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
