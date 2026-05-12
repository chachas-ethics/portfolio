const cards = document.querySelectorAll('#testimonials .group');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    
    // 1. Calculate Mouse position inside the card (0 to 1 range)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // 2. Calculate Tilt (Rotation between -10deg and 10deg)
    const rotateX = (y - 0.5) * -20; 
    const rotateY = (x - 0.5) * 20;

    // 3. Apply 3D Transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // 4. Update Spotlight Position via CSS Variables
    card.style.setProperty('--mouse-x', `${x * 100}%`);
    card.style.setProperty('--mouse-y', `${y * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    // Reset position smoothly
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

// Mobile Gyroscope Tilt (For Seniors only - requires HTTPS)
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (e) => {
    // Beta = tilting front to back (-180 to 180)
    // Gamma = tilting left to right (-90 to 90)
    const tiltX = e.beta; 
    const tiltY = e.gamma;

    cards.forEach(card => {
      // Scale down the intensity for mobile
      const moveX = tiltX * 0.5; 
      const moveY = tiltY * 0.5;
      
      card.style.transform = `perspective(1000px) rotateX(${moveX}deg) rotateY(${moveY}deg)`;
    });
  });
}

// At the top of your script.js
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 300 : 1000; // 70% fewer particles for mobile performance


// 1. Kinetic Grid Scroll Effect
const grid = document.querySelector('#skills div.absolute');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    // Move the grid slightly slower than scroll to create depth
    if(grid) grid.style.transform = `translateY(${scrolled * 0.15}px) perspective(1000px) rotateX(10deg)`;
});

// 2. Intersection Observer for "Skill Boot-up"
const skillCards = document.querySelectorAll('#skills .group');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Delay each card slightly for a "staggered" loading look
            setTimeout(() => {
                entry.target.classList.add('active');
                entry.target.classList.add('glitch-load');
                
                // Animate the progress bars inside the cards
                const bars = entry.target.querySelectorAll('.h-full');
                bars.forEach(bar => {
                    const width = bar.style.width; // Capture target width
                    bar.style.width = '0%'; // Start at zero
                    setTimeout(() => bar.style.width = width, 100); // Animate to target
                });
            }, index * 150); 
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

skillCards.forEach(card => {
    card.classList.add('skill-reveal'); // Add hidden class initially
    skillObserver.observe(card);
});


const projectItems = document.querySelectorAll('.project-item');

const observerOptions = {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const frame = entry.target.querySelector('.browser-frame');
        const text = entry.target.querySelector('.project-text');
        
        // Calculate the ratio of visibility
        const ratio = entry.intersectionRatio;
        
        if (entry.isIntersecting) {
            // Z-Axis Zoom effect
            frame.style.transform = `perspective(1200px) scale(${0.8 + (ratio * 0.2)}) rotateX(${(1 - ratio) * 10}deg)`;
            frame.style.opacity = ratio;
            
            // Text slide-in effect
            text.style.transform = `translateX(${(1 - ratio) * 30}px)`;
            text.style.opacity = ratio;
        }
    });
}, observerOptions);

projectItems.forEach(item => projectObserver.observe(item));

const servicesSection = document.querySelector('#services');
const bentoCards = document.querySelectorAll('.bento-card');
const gridFloor = document.querySelector('.grid-floor');

// 1. Spotlight Tracking
servicesSection.addEventListener('mousemove', (e) => {
    bentoCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 2. 3D Grid Perspective Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sectionTop = servicesSection.offsetTop;
    const sectionHeight = servicesSection.offsetHeight;
    
    // Only animate when section is in view
    if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
        const relativeScroll = scrolled - sectionTop;
        const rotation = 60 + (relativeScroll * 0.02); // Dynamic tilt
        const depth = -100 + (relativeScroll * 0.1); // Dynamic depth
        
        if (gridFloor) {
            gridFloor.style.transform = `perspective(500px) rotateX(${rotation}deg) translateY(${depth}px)`;
        }
    }
});

// 1. Terminal Decryption Logic
const decodeElements = document.querySelectorAll('.decode-text');
const glyphs = "ABCDEF0123456789<>_/";

const decodeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const originalText = el.innerText;
            let iteration = 0;
            
            const interval = setInterval(() => {
                el.innerText = originalText.split("")
                    .map((char, index) => {
                        if(index < iteration) return originalText[index];
                        return glyphs[Math.floor(Math.random() * glyphs.length)];
                    }).join("");
                
                if(iteration >= originalText.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
            
            el.classList.add('active');
            decodeObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

decodeElements.forEach(el => decodeObserver.observe(el));

// 2. Magnetic Module Stack
const stack = document.querySelector('.module-stack-container');
if (stack) {
    stack.addEventListener('mousemove', (e) => {
        const rect = stack.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        stack.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        stack.style.setProperty('--tx', `${x}px`);
        stack.style.setProperty('--ty', `${y}px`);
    });

    stack.removeEventListener('mouseleave', () => {});
    stack.addEventListener('mouseleave', () => {
        stack.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}

const Mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // MOBILE: Auto-run animations on scroll
    // We replace 'mousemove' with a subtle auto-tilt or just leave it clean
    console.log("Mobile Optimization Active: UI smoothed for touch.");
} else {
    // DESKTOP: Full Magnetic & Spotlight Tracking
    console.log("Desktop Environment: Full Interactive Surfaces Active.");
}

// 1. CTA Background Warp Logic
const cta_grid = document.querySelector('.cta_warp_grid');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const cta_sect = document.querySelector('#cta');
  
  if (cta_sect) {
    const sectTop = cta_sect.offsetTop;
    // Calculate distance from section to viewport
    const offset = (scrolled - sectTop) * 0.1; 
    
    // Distort the grid based on scroll position
    if (cta_grid) {
      cta_grid.style.transform = `perspective(1000px) rotateX(60deg) translateY(${offset}px) scale(${1 + (offset * 0.001)})`;
    }
  }
});

// 2. CTA Terminal 3D Tilt Logic
const cta_terminal = document.querySelector('.cta_terminal_surface');

if (cta_terminal) {
  window.addEventListener('mousemove', (e) => {
    const rect = cta_terminal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    cta_terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  cta_terminal.addEventListener('mouseleave', () => {
    cta_terminal.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  });
}



