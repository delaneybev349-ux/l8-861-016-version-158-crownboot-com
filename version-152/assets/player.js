import { H as Hls } from './hls.js';

var activePlayers = new WeakMap();

export function setupPlayer(config) {
  var video = document.getElementById(config.videoId);
  var button = document.getElementById(config.buttonId);
  var cover = document.getElementById(config.coverId);

  if (!video || !config.source) {
    return;
  }

  function hideCover() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  function beginPlayback() {
    hideCover();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== config.source) {
        video.src = config.source;
      }
      video.play();
      return;
    }

    if (Hls && Hls.isSupported()) {
      var hls = activePlayers.get(video);
      if (!hls) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.attachMedia(video);
        activePlayers.set(video, hls);
      }
      hls.loadSource(config.source);
      hls.once(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      return;
    }

    video.src = config.source;
    video.play();
  }

  if (button) {
    button.addEventListener('click', beginPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      beginPlayback();
    }
  });
}
