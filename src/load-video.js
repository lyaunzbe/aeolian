export default function(mediaURL) {
  return new Promise((resolve, reject) => {

    let url = window.URL || window.webkitURL;

    let video = document.createElement("video");
    console.log(mediaURL)
    video.src = mediaURL;
    // video.width = 512;
    // video.height = 512;
    video.setAttribute('crossorigin', 'anonymous');
    video.loop = true;
    video.load();
    video.oncanplay = function() {
      video.play();
      resolve(video);
    };
  })
}
