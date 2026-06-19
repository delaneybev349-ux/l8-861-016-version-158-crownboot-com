(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var videos = Array.prototype.slice.call(document.querySelectorAll('.js-video-player'));
    var controllers = [];

    videos.forEach(function (video) {
      var frame = video.closest('.video-frame');
      var cover = frame ? frame.querySelector('.js-play-cover') : null;
      var stream = video.getAttribute('data-stream');
      var loaded = false;

      var loadVideo = function () {
        if (loaded || !stream) {
          return Promise.resolve();
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
          return new Promise(function (resolve) {
            var hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            controllers.push(hls);
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              resolve();
            });
            window.setTimeout(resolve, 1400);
          });
        }
        video.src = stream;
        return Promise.resolve();
      };

      var start = function () {
        loadVideo().then(function () {
          if (cover) {
            cover.classList.add('is-hidden');
          }
          return video.play();
        }).catch(function () {
          if (cover) {
            cover.classList.add('is-hidden');
          }
          video.setAttribute('controls', 'controls');
          video.focus();
        });
      };

      if (cover) {
        cover.addEventListener('click', start);
      }
      video.addEventListener('click', function () {
        if (!loaded) {
          start();
        }
      });
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
    });

    window.__videoControllers = controllers;
  });
})();
