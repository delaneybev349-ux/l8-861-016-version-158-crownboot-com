
(function () {
  window.initMoviePlayer = function (url) {
    var video = document.getElementById('movie-player');
    var cover = document.getElementById('player-cover');
    var play = document.getElementById('player-play');
    var status = document.getElementById('player-status');
    var hls = null;
    var loaded = false;

    if (!video || !url) {
      return;
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text || '';
      }
    }

    function load() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', function () {
          setStatus('');
        }, { once: true });
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('');
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('视频暂时无法加载');
          }
        });
        return;
      }
      setStatus('视频暂时无法加载');
    }

    function start() {
      load();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    function toggle() {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    }

    load();
    if (play) {
      play.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }
    if (cover) {
      cover.addEventListener('click', start);
      cover.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          start();
        }
      });
    }
    video.addEventListener('click', toggle);
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 && cover) {
        cover.classList.remove('is-hidden');
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
