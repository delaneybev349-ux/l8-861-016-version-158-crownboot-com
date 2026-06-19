(function () {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    onReady(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var overlay = shell.querySelector('.player-overlay');
            var button = shell.querySelector('.player-button');
            var stream = shell.getAttribute('data-video');
            var hlsInstance = null;

            function attachStream() {
                if (!video || !stream || video.getAttribute('data-ready') === 'true') {
                    return;
                }

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }

                video.setAttribute('data-ready', 'true');
            }

            function startPlayback(event) {
                if (event) {
                    event.preventDefault();
                }
                attachStream();
                if (overlay) {
                    overlay.hidden = true;
                }
                shell.classList.add('is-playing');
                video.controls = true;
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        if (overlay) {
                            overlay.hidden = false;
                        }
                        shell.classList.remove('is-playing');
                    });
                }
            }

            if (button) {
                button.addEventListener('click', startPlayback);
            }
            if (overlay) {
                overlay.addEventListener('click', startPlayback);
            }
            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        startPlayback();
                    }
                });
                window.addEventListener('beforeunload', function () {
                    if (hlsInstance) {
                        hlsInstance.destroy();
                    }
                });
            }
        });
    });
})();
