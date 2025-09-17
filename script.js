// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const notificationContainer = document.getElementById('notification-container');

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Only prevent default for internal links (starting with #)
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        // For external links (resume, transcript), let the browser handle them normally
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.timeline-item, .project-card, .skill-category, .expertise-item').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(2);
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseFloat(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// Skill bar animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.getAttribute('data-width');
            progressBar.style.width = width + '%';
            progressBar.classList.add('animate');
            skillObserver.unobserve(progressBar);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress').forEach(bar => {
    skillObserver.observe(bar);
});

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Enhanced hover effects for buttons
document.querySelectorAll('.btn, .submit-btn').forEach(button => {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    
    button.addEventListener('click', createRipple);
    button.addEventListener('mouseenter', createHoverEffect);
    button.addEventListener('mouseleave', removeHoverEffect);
});

// Ripple effect on button click
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced hover effect for buttons
function createHoverEffect(event) {
    const button = event.currentTarget;
    const glow = document.createElement('div');
    glow.className = 'button-glow';
    glow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    button.appendChild(glow);
    setTimeout(() => glow.style.opacity = '1', 10);
}

function removeHoverEffect(event) {
    const button = event.currentTarget;
    const glow = button.querySelector('.button-glow');
    if (glow) {
        glow.style.opacity = '0';
        setTimeout(() => glow.remove(), 300);
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroText && heroImage) {
        const rate = scrolled * -0.5;
        heroText.style.transform = `translateY(${rate * 0.5}px)`;
        heroImage.style.transform = `translateY(${rate * 0.3}px)`;
    }
});

// Floating particles effect
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${i % 3 === 0 ? 'var(--primary-color)' : i % 3 === 1 ? 'var(--secondary-color)' : 'var(--accent-color)'};
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        hero.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Enhanced expertise item animations
document.querySelectorAll('.expertise-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Timeline item staggered animation
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

// Project card enhanced hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const image = card.querySelector('.project-image i');
        if (image) {
            image.style.transform = 'scale(1.2) rotate(360deg)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const image = card.querySelector('.project-image i');
        if (image) {
            image.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Skill item enhanced interactions
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            progressBar.style.animation = 'progressGlow 1s ease-in-out infinite alternate';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            progressBar.style.animation = '';
        }
    });
});

// Contact method enhanced hover effects
document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('mouseenter', () => {
        const icon = method.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(360deg)';
            icon.style.color = 'var(--primary-color)';
        }
    });
    
    method.addEventListener('mouseleave', () => {
        const icon = method.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = 'var(--primary-color)';
        }
    });
});

// Social links enhanced effects
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px) scale(1.2)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

// Profile card enhanced interactions
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    profileCard.addEventListener('mouseenter', () => {
        const image = profileCard.querySelector('.profile-image i');
        if (image) {
            image.style.animation = 'pulse 1s ease-in-out infinite';
        }
    });
    
    profileCard.addEventListener('mouseleave', () => {
        const image = profileCard.querySelector('.profile-image i');
        if (image) {
            image.style.animation = 'pulse 2s ease-in-out infinite';
        }
    });
}

// Debounced scroll handler for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Enhanced loading screen with progress
let loadingProgress = 0;
const loadingSpinner = document.querySelector('.loading-spinner');

if (loadingSpinner) {
    const progressInterval = setInterval(() => {
        loadingProgress += Math.random() * 15;
        if (loadingProgress >= 100) {
            loadingProgress = 100;
            clearInterval(progressInterval);
        }
        
        // Create a subtle pulse effect
        loadingSpinner.style.transform = `scale(${1 + Math.sin(loadingProgress * 0.1) * 0.1})`;
    }, 100);
}

// Console welcome message
console.log(`
%c🚀 Welcome to Aaryan's Portfolio! 🚀
%c
%cThis portfolio is built with modern web technologies and features:
%c• Responsive design with CSS Grid and Flexbox
%c• Smooth animations and transitions
%c• Interactive elements and hover effects
%c• Performance optimized with debouncing
%c• Modern JavaScript ES6+ features
%c
%cFeel free to explore the code! 👨‍💻
`,
'color: #00d4ff; font-size: 20px; font-weight: bold;',
'',
'color: #ffffff; font-size: 14px;',
'color: #00ff88; font-size: 12px;',
'color: #00ff88; font-size: 12px;',
'color: #00ff88; font-size: 12px;',
'color: #00ff88; font-size: 12px;',
'color: #00ff88; font-size: 12px;',
'color: #ffffff; font-size: 14px;'
);



// Terminal functionality
function initTerminal() {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;

    // Add click functionality to terminal buttons
    const closeBtn = terminal.querySelector('.terminal-btn-close');
    const minimizeBtn = terminal.querySelector('.terminal-btn-minimize');
    const maximizeBtn = terminal.querySelector('.terminal-btn-maximize');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            terminal.style.transform = 'scale(0.8)';
            terminal.style.opacity = '0';
            setTimeout(() => {
                terminal.style.display = 'none';
            }, 300);
        });
    }

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            terminal.style.transform = 'scale(0.9)';
            terminal.style.opacity = '0.7';
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            terminal.style.transform = 'scale(1)';
            terminal.style.opacity = '1';
        });
    }

    // Add typing animation for the last command
    const typingCommand = terminal.querySelector('.typing-command');
    const typingOutput = terminal.querySelector('.typing-output');
    
    if (typingCommand && typingOutput) {
        // Hide the output initially
        typingOutput.style.opacity = '0';
        
        // Show output after typing animation completes
        setTimeout(() => {
            typingOutput.style.opacity = '1';
        }, 3000);
    }

    // Add cursor blink animation
    const cursor = terminal.querySelector('.terminal-cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    // Add hover effect for terminal
    terminal.addEventListener('mouseenter', () => {
        terminal.style.transform = 'translateY(-5px) scale(1.02)';
    });

    terminal.addEventListener('mouseleave', () => {
        terminal.style.transform = 'translateY(0) scale(1)';
    });
}

// Initialize terminal
initTerminal();

// Initialize advanced animations
initAdvancedAnimations();

// Typing animation for hero subtitle
function initTypingAnimation() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;

    const texts = [
        'Software Engineer',
        'Data Scientist',
        'Full-Stack Developer',
        'ML Engineer',
        'Systems Programmer'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing animation after a delay
    setTimeout(type, 1000);
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    initTypingAnimation();
    initTerminalAnimation();
});

// Terminal animation with single loop
function initTerminalAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line[data-delay]');
    const typingCommands = document.querySelectorAll('.typing-command');
    const typingOutputs = document.querySelectorAll('.typing-output');
    
    if (terminalLines.length === 0) return;

    let currentIndex = 0;
    const totalSteps = terminalLines.length;

    function animateStep() {
        if (currentIndex >= totalSteps) {
            // Animation complete - show constantly blinking cursor
            const cursor = document.querySelector('.terminal-cursor');
            if (cursor) {
                cursor.style.animation = 'blink 1s infinite';
                // Add text input effect
                addTextInputEffect();
            }
            return;
        }

        const currentLine = terminalLines[currentIndex];
        const currentCommand = currentLine.querySelector('.typing-command');
        const currentOutput = document.querySelector(`.typing-output[data-delay="${parseInt(currentLine.dataset.delay) + 1}"]`);

        // Animate the terminal line
        currentLine.classList.add('animate');

        // Animate the command typing
        if (currentCommand) {
            setTimeout(() => {
                currentCommand.classList.add('animate');
            }, 600);
        }

        // Animate the output
        if (currentOutput) {
            setTimeout(() => {
                currentOutput.classList.add('animate');
            }, 2100); // After command typing completes
        }

        // Move to next step
        currentIndex++;
        setTimeout(animateStep, 2800); // Wait for current step to complete
    }

    // Add text input effect after animation completes
    function addTextInputEffect() {
        const cursor = document.querySelector('.terminal-cursor');
        if (!cursor) return;

        // Create a text input effect that simulates typing
        const possibleCommands = [
            'ls -la',
            'pwd',
            'whoami',
            'date',
            'echo "Hello World"',
            'cat README.md',
            'git status',
            'npm start'
        ];

        let commandIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentCommand = '';

        function typeCommand() {
            const targetCommand = possibleCommands[commandIndex];
            
            if (isDeleting) {
                currentCommand = targetCommand.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentCommand = targetCommand.substring(0, charIndex + 1);
                charIndex++;
            }

            // Update cursor text content
            cursor.textContent = currentCommand;

            if (!isDeleting && charIndex === targetCommand.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeCommand();
                }, 2000); // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                commandIndex = (commandIndex + 1) % possibleCommands.length;
                setTimeout(typeCommand, 1000); // Pause before next command
            } else {
                setTimeout(typeCommand, isDeleting ? 50 : 100);
            }
        }

        // Start the text input effect
        setTimeout(typeCommand, 1000);
    }

    // Start animation after a delay
    setTimeout(animateStep, 1000);
}

// Performance optimization: Use requestAnimationFrame for smooth animations
function smoothScrollTo(target) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - 70;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Enhanced navigation with smooth scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const target = link.getAttribute('href');
        
        // Only prevent default for internal links (starting with #)
        if (target && target.startsWith('#')) {
            e.preventDefault();
            smoothScrollTo(target);
        }
        // For external links (resume, transcript), let the browser handle them normally
    });
});

// Add CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    .floating-particle {
        pointer-events: none;
        z-index: 1;
    }
    
    .button-glow {
        border-radius: inherit;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes progressGlow {
        0% { box-shadow: 0 0 5px var(--primary-color); }
        100% { box-shadow: 0 0 15px var(--primary-color), 0 0 25px var(--primary-color); }
    }
`;
document.head.appendChild(style);

// Matrix Rain Effect
function createMatrixRain() {
    const matrixContainer = document.getElementById('matrixRain');
    if (!matrixContainer) return;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = i * 20 + 'px';
        column.style.animationDelay = Math.random() * 3 + 's';
        column.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        let text = '';
        for (let j = 0; j < 20; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrixContainer.appendChild(column);
    }
}

// Floating Particles
function createFloatingParticles() {
    const particlesContainer = document.getElementById('floatingParticles');
    if (!particlesContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// DNA Helix Animation
function createDNAHelix() {
    const dnaContainer = document.createElement('div');
    dnaContainer.className = 'dna-helix';
    dnaContainer.style.position = 'fixed';
    dnaContainer.style.right = '50px';
    dnaContainer.style.bottom = '50px';
    dnaContainer.style.zIndex = '-1';
    dnaContainer.style.pointerEvents = 'none';
    
    document.body.appendChild(dnaContainer);
    
    const strandCount = 20;
    for (let i = 0; i < strandCount; i++) {
        const strand = document.createElement('div');
        strand.className = 'dna-strand';
        strand.style.left = Math.sin(i * 0.3) * 30 + 50 + '%';
        strand.style.top = (i * 10) + '%';
        strand.style.animationDelay = (i * 0.2) + 's';
        
        dnaContainer.appendChild(strand);
    }
}

// Neural Network Animation
function createNeuralNetwork() {
    const neuralContainer = document.createElement('div');
    neuralContainer.style.position = 'fixed';
    neuralContainer.style.top = '0';
    neuralContainer.style.left = '0';
    neuralContainer.style.width = '100%';
    neuralContainer.style.height = '100%';
    neuralContainer.style.pointerEvents = 'none';
    neuralContainer.style.zIndex = '-1';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    // Create nodes
    const nodes = [];
    for (let i = 0; i < 15; i++) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', Math.random() * 1000);
        node.setAttribute('cy', Math.random() * 1000);
        node.setAttribute('r', '3');
        node.className = 'neural-node';
        node.style.animationDelay = Math.random() * 2 + 's';
        
        svg.appendChild(node);
        nodes.push({ x: parseFloat(node.getAttribute('cx')), y: parseFloat(node.getAttribute('cy')) });
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.sqrt(
                Math.pow(nodes[i].x - nodes[j].x, 2) + 
                Math.pow(nodes[i].y - nodes[j].y, 2)
            );
            
            if (distance < 200) {
                const connection = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                connection.setAttribute('x1', nodes[i].x);
                connection.setAttribute('y1', nodes[i].y);
                connection.setAttribute('x2', nodes[j].x);
                connection.setAttribute('y2', nodes[j].y);
                connection.className = 'neural-connection';
                connection.style.animationDelay = Math.random() * 2 + 's';
                
                svg.appendChild(connection);
            }
        }
    }
    
    neuralContainer.appendChild(svg);
    document.body.appendChild(neuralContainer);
}

// Glitch Text Effect
function initGlitchText() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    glitchElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
}

// Holographic Text Effect
function initHolographicText() {
    const holographicElements = document.querySelectorAll('.holographic');
    holographicElements.forEach(element => {
        element.style.backgroundSize = '400% 400%';
    });
}

// Liquid Button Effect
function initLiquidButtons() {
    const liquidButtons = document.querySelectorAll('.liquid-btn');
    liquidButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Enhanced Loading Screen
function initInteractiveWelcome() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const welcomeLogo = document.getElementById('welcomeLogo');
    const enterPortfolioBtn = document.getElementById('enterPortfolio');
    const viewResumeBtn = document.getElementById('viewResume');
    const particles = document.querySelectorAll('.welcome-particle');
    
    if (!welcomeScreen) return;
    
    // Logo click effect
    welcomeLogo.addEventListener('click', () => {
        welcomeLogo.style.transform = 'scale(1.2) rotate(5deg)';
        setTimeout(() => {
            welcomeLogo.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    });
    
    // Enter Portfolio button
    enterPortfolioBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 800);
    });
    
    // View Resume and Transcript buttons now use actual links
    // No additional JavaScript needed since they're anchor tags
    
    // Particles are now just visual elements - no click functionality
    
    // Auto-progress animation over 10 seconds
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        enterPortfolioBtn.style.setProperty('--progress', progress + '%');
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            if (!welcomeScreen.classList.contains('hidden')) {
                welcomeScreen.classList.add('hidden');
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                }, 800);
            }
        }
    }, 100); // 100ms intervals = 10 seconds total
}

// Particle System
function createParticleSystem() {
    const particleSystem = document.createElement('div');
    particleSystem.style.position = 'fixed';
    particleSystem.style.top = '0';
    particleSystem.style.left = '0';
    particleSystem.style.width = '100%';
    particleSystem.style.height = '100%';
    particleSystem.style.pointerEvents = 'none';
    particleSystem.style.zIndex = '-1';
    
    document.body.appendChild(particleSystem);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.opacity = '0.7';
        
        particleSystem.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0px)', opacity: 0.7 },
            { transform: 'translateY(-100vh)', opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            particle.remove();
        };
    }
    
    setInterval(createParticle, 100);
}

// Energy Wave Effect
function createEnergyWaves() {
    const waveContainer = document.createElement('div');
    waveContainer.style.position = 'fixed';
    waveContainer.style.top = '0';
    waveContainer.style.left = '0';
    waveContainer.style.width = '100%';
    waveContainer.style.height = '100%';
    waveContainer.style.pointerEvents = 'none';
    waveContainer.style.zIndex = '-1';
    
    document.body.appendChild(waveContainer);
    
    function createWave() {
        const wave = document.createElement('div');
        wave.style.position = 'absolute';
        wave.style.width = '100px';
        wave.style.height = '100px';
        wave.style.border = '2px solid #00d4ff';
        wave.style.borderRadius = '50%';
        wave.style.left = Math.random() * 100 + '%';
        wave.style.top = Math.random() * 100 + '%';
        wave.style.opacity = '0.5';
        
        waveContainer.appendChild(wave);
        
        const animation = wave.animate([
            { transform: 'scale(0)', opacity: 0.5 },
            { transform: 'scale(3)', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            wave.remove();
        };
    }
    
    setInterval(createWave, 3000);
}

// Data Stream Effect
function createDataStreams() {
    const streamContainer = document.createElement('div');
    streamContainer.style.position = 'fixed';
    streamContainer.style.top = '0';
    streamContainer.style.left = '0';
    streamContainer.style.width = '100%';
    streamContainer.style.height = '100%';
    streamContainer.style.pointerEvents = 'none';
    streamContainer.style.zIndex = '-1';
    
    document.body.appendChild(streamContainer);
    
    function createDataStream() {
        const stream = document.createElement('div');
        stream.style.position = 'absolute';
        stream.style.height = '1px';
        stream.style.width = Math.random() * 200 + 100 + 'px';
        stream.style.background = 'linear-gradient(90deg, transparent, #00d4ff, transparent)';
        stream.style.top = Math.random() * 100 + '%';
        stream.style.left = '-200px';
        stream.style.opacity = '0.7';
        
        streamContainer.appendChild(stream);
        
        const animation = stream.animate([
            { transform: 'translateX(0px)' },
            { transform: 'translateX(calc(100vw + 200px))' }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            stream.remove();
        };
    }
    
    setInterval(createDataStream, 2000);
}

// Quantum Jump Effect
function createQuantumJumps() {
    const quantumContainer = document.createElement('div');
    quantumContainer.style.position = 'fixed';
    quantumContainer.style.top = '0';
    quantumContainer.style.left = '0';
    quantumContainer.style.width = '100%';
    quantumContainer.style.height = '100%';
    quantumContainer.style.pointerEvents = 'none';
    quantumContainer.style.zIndex = '-1';
    
    document.body.appendChild(quantumContainer);
    
    function createQuantumParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = '0.8';
        
        quantumContainer.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
            { transform: 'translate(20px, -20px) scale(1.5)', opacity: 0.6 },
            { transform: 'translate(-20px, 20px) scale(0.5)', opacity: 0.3 },
            { transform: 'translate(20px, 20px) scale(1.2)', opacity: 0.7 },
            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 }
        ], {
            duration: 4000,
            easing: 'ease-in-out',
            iterations: Infinity
        });
    }
    
    for (let i = 0; i < 10; i++) {
        setTimeout(createQuantumParticle, i * 400);
    }
}

// Initialize all animations
function initAdvancedAnimations() {
    createMatrixRain();
    createFloatingParticles();
    createDNAHelix();
    createNeuralNetwork();
    createParticleSystem();
    createEnergyWaves();
    createDataStreams();
    createQuantumJumps();
    initGlitchText();
    initHolographicText();
    initLiquidButtons();
    initInteractiveWelcome();
}
