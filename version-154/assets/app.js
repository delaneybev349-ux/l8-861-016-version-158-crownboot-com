(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function bindMobileMenu() {
        var button = document.querySelector('[data-mobile-menu]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function bindHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener('click', function () {
                show(itemIndex);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function bindFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-filter]'));
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
        if (!inputs.length || !cards.length) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        inputs.forEach(function (input) {
            if (initial && !input.value) {
                input.value = initial;
            }
        });
        function apply(value) {
            var query = normalize(value);
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
                card.style.display = !query || haystack.indexOf(query) !== -1 ? '' : 'none';
            });
        }
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                inputs.forEach(function (other) {
                    if (other !== input) {
                        other.value = input.value;
                    }
                });
                apply(input.value);
            });
        });
        Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]')).forEach(function (button) {
            button.addEventListener('click', function () {
                var value = button.getAttribute('data-filter-value') || '';
                inputs.forEach(function (input) {
                    input.value = value;
                });
                apply(value);
            });
        });
        if (initial) {
            apply(initial);
        }
    }

    function bindPlayers() {
        Array.prototype.slice.call(document.querySelectorAll('video[data-video]')).forEach(function (video) {
            var source = video.getAttribute('data-video');
            var wrapper = video.closest('.video-wrap');
            var button = wrapper ? wrapper.querySelector('.video-start') : null;
            var initialized = false;
            var hls = null;
            function init() {
                if (initialized || !source) {
                    return;
                }
                initialized = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
            }
            function start() {
                init();
                if (button) {
                    button.classList.add('is-hidden');
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            }
            if (button) {
                button.addEventListener('click', start);
            }
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (button && video.currentTime === 0) {
                    button.classList.remove('is-hidden');
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hls && typeof hls.destroy === 'function') {
                    hls.destroy();
                }
            });
        });
    }

    ready(function () {
        bindMobileMenu();
        bindHero();
        bindFilters();
        bindPlayers();
    });
})();
