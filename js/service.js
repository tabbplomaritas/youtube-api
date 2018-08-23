"use strict";

function YouTubeService($http) {

  let trailerStats;
  let queryResults;
  let trailers = "5owigsJJCsc,LCySGDkXFpI,paREY4LLwEY,zC9b1orltc8,0B5v45HutgQ";
  let queryIds = "";
  let queryDetails;

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
      url: `https://www.googleapis.com/youtube/v3/videos?id=${queryIds}&key=${key()}&part=statistics,snippet,player`,
    }).then((response) => {
      console.log(response);
      queryDetails = response.data.items;
      console.log(queryDetails);
      return queryDetails;
    }, (error) => {
      console.log(error);
    });
  }

  const getTrailers = () => {
    console.log(trailers);

    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/videos?id=${trailers}&key=${key()}&part=statistics,snippet,player`,
    }).then((response) => {
      trailerStats = response;
      console.log(trailerStats);

      return response;
    }, (error) => {
      console.log(error);
    });
  }



  return {
    sendQuery,
    getTrailers,
    getQueryDetails
  }
}

angular
  .module("App")
  .factory("YouTubeService", YouTubeService);
