"use strict";

const searchResults = {

  templateUrl: '../search-results.html',

  controller: ["YouTubeService", "$timeout", function(YouTubeService, $timeout) {




  }]



}

angular
  .module("App")
  .component("searchResults", searchResults);
