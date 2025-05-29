/**
 * Portfolio Website JavaScript
 * Handles animations, interactions, and theme management
 */

// ============================================================================
// Animation & Effects
// ============================================================================

/**
 * Creates particle effects in the background
 */
const initParticleEffect = () => {
    const createParticle = () => {
        const particles = document.querySelector('.particles');
        if (!particles) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        particles.appendChild(particle);
        
        setTimeout(() => particle.remove(), 5000);
    };

    setInterval(createParticle, 200);
};

/**
 * Handles smooth scrolling for anchor links
 */
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
};

/**
 * Creates parallax effect on elements
 */
const initParallax = () => {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.parallax').forEach(element => {
                const speed = element.getAttribute('data-speed') || 2;
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    });
};

/**
 * Handles scroll-based animations
 */
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animation || 'fade-in';
                element.classList.add('animate', animation);
                
                // Add stagger effect for child elements
                if (element.classList.contains('stagger-animate')) {
                    Array.from(element.children).forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                    });
                }
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    document.querySelectorAll('.animate-on-scroll, .reveal, .stagger-animate').forEach(element => {
        observer.observe(element);
    });
};

/**
 * Creates interactive cursor effect
 */
const initCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    let cursorTimeout;
    const updateCursor = (e) => {
        clearTimeout(cursorTimeout);
        cursor.style.opacity = '1';
        
        // Add magnetic effect for interactive elements
        const magnetic = document.elementFromPoint(e.clientX, e.clientY)?.closest('.magnetic');
        if (magnetic) {
            const rect = magnetic.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const strength = 0.5;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            cursor.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px) scale(1.5)`;
        } else {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursor.style.transform = '';
        }

        cursorTimeout = setTimeout(() => {
            cursor.style.opacity = '0';
        }, 2000);
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-clicked'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-clicked'));
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
};

// ============================================================================
// Theme Management
// ============================================================================

/**
 * Handles theme switching with animations
 */
const initThemeManager = () => {
    const toggleTheme = () => {
        const body = document.body;
        const isDark = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Animate theme change
        document.querySelectorAll('.theme-transition').forEach(element => {
            element.style.transition = 'all 0.3s ease';
            element.classList.add('theme-changing');
            setTimeout(() => element.classList.remove('theme-changing'), 300);
        });
    };

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    document.body.style.transition = 'background-color 0.3s ease';

    return { toggleTheme };
};

// ============================================================================
// Text Effects
// ============================================================================

/**
 * Creates text scramble effect
 */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        
        this.el.innerText = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

const initTextEffects = () => {
    // Initialize text scramble effect
    document.querySelectorAll('.text-scramble').forEach(el => {
        const scramble = new TextScramble(el);
        const phrases = JSON.parse(el.getAttribute('data-phrases') || '[]');
        
        if (phrases.length) {
            let counter = 0;
            const next = () => {
                scramble.setText(phrases[counter]).then(() => {
                    setTimeout(next, 2000);
                });
                counter = (counter + 1) % phrases.length;
            };
            next();
        }
    });
};

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize all features when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const { toggleTheme } = initThemeManager();
    
    // Initialize all effects
    initParticleEffect();
    initSmoothScroll();
    initParallax();
    initScrollAnimations();
    initCursorEffect();
    initTextEffects();
    
    // Initialize scroll handler
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
        });
    });
});

// ============================================================================
// Flutter Integration
// ============================================================================

// Handle Flutter application initialization
window.addEventListener('flutter-first-frame', () => {
    console.log('Flutter application rendered first frame');
    document.body.classList.add('app-ready');
});

// Expose functions to Flutter
window.portfolioJS = {
    toggleTheme: () => initThemeManager().toggleTheme(),
    
    scrollTo: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    addParallax: (elementId, speed) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('parallax');
            element.setAttribute('data-speed', speed);
        }
    },
    
    triggerAnimation: (elementId, animationType) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(animationType);
        }
    },
    
    scrambleText: (elementId, phrases) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('text-scramble');
            element.setAttribute('data-phrases', JSON.stringify(phrases));
            const scramble = new TextScramble(element);
            let counter = 0;
            const next = () => {
                scramble.setText(phrases[counter]).then(() => {
                    setTimeout(next, 2000);
                });
                counter = (counter + 1) % phrases.length;
            };
            next();
        }
    }
}; 