"use strict";

function YouTubeService($http) {

  let trailerStats;
  let queryResults;
  let trailers = "5owigsJJCsc,UU8-4ccWKzY,paREY4LLwEY,zC9b1orltc8,0B5v45HutgQ";
  let queryIds = "";
  let queryDetails;
  let clickedMovie;

  const sendQuery = (query)=> {
    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/search?&q=${query}&type=video&maxResults=5&key=AIzaSyB76Pizg-mT_itkTTAJXwJTs6_tL3KTMJk&part=snippet
      `,
    }).then((response) => {
      console.log(response);
      queryResults = response.data.items;
      console.log(queryResults);

      return getQueryDetails();;
    }, (error) => {
      console.log(error);
    });
  }

  const getQueryDetails = () => {
    //reset queryIds to clear previous search
    queryIds = "";
    //grab the id of the queryResults videos
    for(let video of queryResults) {
      queryIds += video.id.videoId + ",";
    }

    //request the stats and snippet for each
    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/videos?id=${queryIds}&key=${key()}&part=statistics,snippet`,
    }).then((response) => {
      queryDetails = response.data.items;
      return queryDetails;
    }, (error) => {
      console.log(error);
    });
  }

  const getTrailers = () => {
    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/videos?id=${trailers}&key=${key()}&part=statistics,snippet`,
    }).then((response) => {
      trailerStats = response;
      return response;
    }, (error) => {
      console.log(error);
    });
  }

  const setClickedMovie = (id) => {
    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key()}&part=statistics,snippet`,
    }).then((response) => {
      clickedMovie = response.data.items[0];
      return clickedMovie;

    }, (error) => {
      console.log(error);
    });
  }


  return {
    sendQuery,
    getTrailers,
    getQueryDetails,
    setClickedMovie
  }
}

angular
  .module("App")
  .factory("YouTubeService", YouTubeService);
