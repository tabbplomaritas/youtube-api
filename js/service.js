// https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
// &part=snippet,contentDetails,statistics,status

// https://www.googleapis.com/youtube/v3/videos?id=5owigsJJCsc,LCySGDkXFpI,paREY4LLwEY,zC9b1orltc8&key=AIzaSyB76Pizg-mT_itkTTAJXwJTs6_tL3KTMJk&part=statistics,snippet,player

"use strict";

function YouTubeService($http) {

  let trailerStats;
  let data;
  let trailers = "5owigsJJCsc,LCySGDkXFpI,paREY4LLwEY,zC9b1orltc8,0B5v45HutgQ";


  const getYouTube = ()=> {
    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=dogs&type=video&maxResults=4&key=AIzaSyB76Pizg-mT_itkTTAJXwJTs6_tL3KTMJk
      `,
    }).then((response) => {
      console.log(response);
      data = response.data.items;
      console.log(data);
      
        return data;
    }, (error) => {
      console.log(error);
    });
  }

  const getTrailers = () => {
    console.log(trailers);
  
    return $http({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/videos?id=${trailers}&key=AIzaSyB76Pizg-mT_itkTTAJXwJTs6_tL3KTMJk&part=statistics,snippet,player
    
      `,
    }).then((response) => {
      console.log(response);
      trailerStats = response;
      return response;
    }, (error) => {
      console.log(error);
    });
  }

  const getStats = () => {
      return stats;
    }


  return {
    getYouTube,
    getStats,
    getTrailers
  }
}

angular
  .module("App")
  .factory("YouTubeService", YouTubeService);
