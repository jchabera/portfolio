gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const tl = gsap.timeline();

    tl.to('.loader-text', { yPercent: -100, opacity: 0, duration: 1, ease: 'power4.inOut', delay: 0.2 })
      .to('.loader', { 
          yPercent: -100, 
          duration: 1, 
          ease: 'power4.inOut',
          onComplete: () => {
              const loader = document.querySelector('.loader');
              if(loader) loader.style.display = 'none';
          }
      }, "-=0.5")
      .from('.hero-title .line', { y: 100, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'power4.out' }, "-=0.5")
      .from('.hero-bg img', { scale: 1.1, duration: 2, ease: 'power3.out' }, "-=1.5");

    gsap.to('.hero-bg img', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.utils.toArray('.project').forEach(item => {
        gsap.from(item, {
            y: 60, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%' }
        });
    });

    gsap.utils.toArray('.reel-card').forEach(item => {
        gsap.from(item, {
            y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 90%' }
        });
    });

    const projectData = {
        m3cs: {
            title: 'BMW M3 CS',
            desc: 'Editorial vizuální série zaměřená na surovou dynamiku, detaily karbonových komponentů a kontrastní stíny.',
            images: [
                'photos/M3cs/_DSC7708.jpg', 'photos/M3cs/_DSC7720.jpg', 'photos/M3cs/_DSC7731.jpg',
                'photos/M3cs/_DSC7744.jpg', 'photos/M3cs/_DSC7747.jpg', 'photos/M3cs/_DSC7755.jpg',
                'photos/M3cs/_DSC7771.jpg', 'photos/M3cs/_DSC7780.jpg', 'photos/M3cs/_DSC7781.jpg',
                'photos/M3cs/_DSC7792.jpg', 'photos/M3cs/_DSC7794.jpg', 'photos/M3cs/_DSC7796.jpg',
                'photos/M3cs/_DSC7799.jpg', 'photos/M3cs/_DSC7803.jpg', 'photos/M3cs/_DSC7804.jpg',
                'photos/M3cs/_DSC7805.jpg', 'photos/M3cs/_DSC7806.jpg', 'photos/M3cs/_DSC7809.jpg',
                'photos/M3cs/_DSC7810.jpg', 'photos/M3cs/_DSC7812.jpg', 'photos/M3cs/_DSC7814.jpg',
                'photos/M3cs/_DSC7818.jpg', 'photos/M3cs/_DSC7825.jpg', 'photos/M3cs/_DSC7827.jpg',
                'photos/M3cs/_DSC7837.jpg', 'photos/M3cs/_DSC7848.jpg', 'photos/M3cs/_DSC7853.jpg',
                'photos/M3cs/_DSC7858.jpg', 'photos/M3cs/_DSC7859.jpg', 'photos/M3cs/_DSC7863.jpg',
                'photos/M3cs/_DSC7865.jpg', 'photos/M3cs/_DSC7866.jpg', 'photos/M3cs/_DSC7868.jpg'
            ]
        },
        m2black: {
            title: 'BMW M2 Black',
            desc: 'Série snímků podtrhující temné tóny a ostré hrany modelu M2.',
            images: ['photos/M2black/_DSC7568.jpg', 'photos/M2black/_DSC7676.jpg']
        },
        corolla: {
            title: 'Corolla GR',
            desc: 'Exteriérová série pořízená během západu slunce zdůrazňující agresivní profil vozidla.',
            images: ['photos/corollaGR/_DSC6640.jpg', 'photos/corollaGR/_DSC6645.jpg', 'photos/corollaGR/_DSC6650.jpg']
        }
    };

    const modal = document.getElementById('project-modal');
    
    if (modal) {
        modal.setAttribute('data-lenis-prevent', 'true');
        
        const modalTitle = modal.querySelector('.modal-title');
        const modalDesc = modal.querySelector('.modal-desc');
        const modalGallery = modal.querySelector('.modal-gallery');
        const closeBtn = modal.querySelector('.modal-close');

        document.querySelectorAll('.project[data-gallery]').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-gallery');
                const data = projectData[id];
                
                if (data) {
                    modalTitle.textContent = data.title;
                    modalDesc.textContent = data.desc;
                    modalGallery.innerHTML = '';
                    
                    data.images.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src;
                        modalGallery.appendChild(img);
                    });

                    document.body.style.overflow = 'hidden';
                    lenis.stop();
                    
                    gsap.to(modal, { autoAlpha: 1, duration: 0.4, ease: 'power3.out' });

                    setTimeout(() => {
                        const newImages = modalGallery.querySelectorAll('img');
                        gsap.to(newImages, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' });
                    }, 100);
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                gsap.to(modal, {
                    autoAlpha: 0, duration: 0.4, ease: 'power3.inOut',
                    onComplete: () => {
                        document.body.style.overflow = '';
                        lenis.start();
                        modalGallery.innerHTML = '';
                    }
                });
            });
        }
    }

    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        const baBefore = document.querySelector('.ba-before');
        const baHandle = document.querySelector('.ba-handle');
        let isDown = false;

        baSlider.addEventListener('mousedown', () => isDown = true);
        window.addEventListener('mouseup', () => isDown = false);
        baSlider.addEventListener('touchstart', () => isDown = true);
        window.addEventListener('touchend', () => isDown = false);

        const moveSlider = (e) => {
            if (!isDown) return;
            const rect = baSlider.getBoundingClientRect();
            let x = (e.pageX || (e.touches && e.touches[0].pageX)) - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            
            baBefore.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
            baHandle.style.left = `${percent}%`;
        };

        window.addEventListener('mousemove', moveSlider);
        window.addEventListener('touchmove', moveSlider);
    }
});