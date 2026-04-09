// === Řekneme prohlížeči, ať neobnovuje scroll ===
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    
    // === Aktivně posuneme stránku nahoru ===
    window.scrollTo(0, 0);
    
    
    // --- 2. KÓD PRO ANIMACI PŘI SCROLLOVÁNÍ ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // === NOVÝ KÓD: TLAČÍTKO ZPĚT NAHORU ===
    const scrollTopBtn = document.getElementById('back-to-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            // Zobrazíme tlačítko, pokud jsme odscrollovali více než 400px
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('is-visible');
            } else {
                scrollTopBtn.classList.remove('is-visible');
            }
        });
    }

    
    // --- KÓD PRO CUSTOM VIDEO PLAYER ---
    const customVideoPlayers = document.querySelectorAll('.custom-video-player');

    customVideoPlayers.forEach(player => {
        const video = player.querySelector('video');
        const playOverlay = player.querySelector('.play-overlay');
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        playOverlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playOverlay.classList.add('hidden');
                video.muted = false;
                video.controls = true;
            } else {
                video.pause();
                playOverlay.classList.remove('hidden');
                video.controls = false;
            }
        });

        video.addEventListener('ended', () => {
            playOverlay.classList.remove('hidden');
            video.controls = false;
        });

        // Když uživatel pauzne (např. přes ovládání), vrať overlay zpět.
        video.addEventListener('pause', () => {
            if (video.currentTime > 0 && !video.ended) {
                playOverlay.classList.remove('hidden');
            }
        });

        // Pokud uživatel preferuje méně pohybu, nepouštěj autoplay/loop chování agresivně.
        if (reduceMotion) {
            video.loop = false;
        }
    });

    // --- BEFORE / AFTER SLIDER ---
    const beforeAfterBlocks = document.querySelectorAll('.before-after');
    beforeAfterBlocks.forEach(block => {
        const range = block.querySelector('.before-after-range');
        const images = block.querySelector('.before-after-images');
        if (!range) return;

        const start = block.getAttribute('data-start');
        const initial = start ? Number(start) : Number(range.value);
        const clamped = Number.isFinite(initial) ? Math.max(0, Math.min(100, initial)) : 50;
        range.value = String(clamped);
        block.style.setProperty('--pos', `${clamped}%`);

        range.addEventListener('input', (e) => {
            const value = Number(e.target.value);
            block.style.setProperty('--pos', `${value}%`);
        });

        if (!images) return;

        const setFromClientX = (clientX) => {
            const rect = images.getBoundingClientRect();
            const x = Math.max(rect.left, Math.min(rect.right, clientX));
            const pct = ((x - rect.left) / rect.width) * 100;
            const value = Math.round(Math.max(0, Math.min(100, pct)));
            range.value = String(value);
            block.style.setProperty('--pos', `${value}%`);
        };

        // Tap/click anywhere on the photo should jump the slider there (mobile + desktop).
        const onPointerDown = (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            e.preventDefault();
            setFromClientX(e.clientX);
            images.setPointerCapture?.(e.pointerId);

            const onMove = (ev) => {
                setFromClientX(ev.clientX);
            };
            const onUp = (ev) => {
                images.releasePointerCapture?.(ev.pointerId);
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
            };

            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
        };

        // Prefer Pointer Events when available.
        if (window.PointerEvent) {
            images.addEventListener('pointerdown', onPointerDown);
        } else {
            // Fallback for older browsers.
            images.addEventListener('mousedown', (e) => {
                e.preventDefault();
                setFromClientX(e.clientX);
                const onMove = (ev) => setFromClientX(ev.clientX);
                const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
            });
            images.addEventListener('touchstart', (e) => {
                const t = e.touches && e.touches[0];
                if (!t) return;
                e.preventDefault();
                setFromClientX(t.clientX);
            }, { passive: false });
            images.addEventListener('touchmove', (e) => {
                const t = e.touches && e.touches[0];
                if (!t) return;
                e.preventDefault();
                setFromClientX(t.clientX);
            }, { passive: false });
        }
    });


    // --- KÓD PRO LOADING SCREEN (A FANCYBOX) ---
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;

    // 'load' event počká, až se načtou VŠECHNY skripty (včetně Fancyboxu)
    window.addEventListener('load', () => {

        // === AKTIVACE FANCYBOXU (PŘESUNUTO SEM) ===
        // Teď už máme jistotu, že Fancybox existuje
        if (typeof Fancybox !== 'undefined') {
            Fancybox.bind("[data-fancybox]", {
              loop: true,   // Nekonečné listování
              preload: 0  // Nenačítat fotky dopředu (proti sekání)
            });
        }
        // === KONEC PŘESUNUTÉHO KÓDU ===


        // Skryjeme loading screen
        body.classList.remove('loading'); 
        loadingScreen.classList.add('hidden');
        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.remove();
        });
    });

});