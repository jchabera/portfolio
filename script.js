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