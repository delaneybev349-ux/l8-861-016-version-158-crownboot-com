(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function reset() {
            if (timer) {
                window.clearInterval(timer);
            }
            play();
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                reset();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                reset();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                reset();
            });
        }

        show(0);
        play();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var section = panel.parentElement;
        var list = section ? section.querySelector('[data-filter-list]') : null;
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-card]')) : [];
        var search = panel.querySelector('[data-search-input]');
        var year = panel.querySelector('[data-year-filter]');
        var type = panel.querySelector('[data-type-filter]');

        function value(input) {
            return input ? input.value.trim().toLowerCase() : '';
        }

        function cardText(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.textContent
            ].join(' ').toLowerCase();
        }

        function apply() {
            var q = value(search);
            var y = value(year);
            var t = value(type);

            cards.forEach(function (card) {
                var text = cardText(card);
                var ok = true;

                if (q && text.indexOf(q) === -1) {
                    ok = false;
                }

                if (y && (card.getAttribute('data-year') || '').toLowerCase() !== y) {
                    ok = false;
                }

                if (t && (card.getAttribute('data-type') || '').toLowerCase() !== t) {
                    ok = false;
                }

                card.classList.toggle('is-hidden', !ok);
            });
        }

        [search, year, type].forEach(function (input) {
            if (input) {
                input.addEventListener('input', apply);
                input.addEventListener('change', apply);
            }
        });
    });
})();

function initMoviePlayer(videoId, layerId, sourceUrl) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    var ready = false;
    var hlsInstance = null;

    if (!video || !layer || !sourceUrl) {
        return;
    }

    function loadSource() {
        if (ready) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
        } else {
            video.src = sourceUrl;
        }

        ready = true;
    }

    function startPlayback() {
        loadSource();
        layer.classList.add('is-hidden');
        var action = video.play();
        if (action && typeof action.catch === 'function') {
            action.catch(function () {
                layer.classList.remove('is-hidden');
            });
        }
    }

    layer.addEventListener('click', startPlayback);

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        layer.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            layer.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
