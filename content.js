(() => {
    // Configuration
    const CONFIG = {
        image: 'assets/Bluebinh.gif',
        width: '150px',
        height: '150px',
        position: { top: '100px', right: '-150px' }, // Start hidden off-screen
        peekPosition: { right: '0px' }, // End position (visible)
        transition: 'right 0.5s ease-in-out',
        peekDuration: 4000, // How long to stay visible
        minInterval: 5000,  // Minimum time between peeks
        maxInterval: 15000  // Maximum time between peeks
    };

    // 1. Create the container
    const container = document.createElement('div');
    container.id = 'dog-run-extension-container';

    Object.assign(container.style, {
        position: 'fixed',
        top: CONFIG.position.top,
        right: CONFIG.position.right,
        width: CONFIG.width,
        height: CONFIG.height,
        zIndex: '2147483647',
        cursor: 'pointer',
        transition: CONFIG.transition,
        pointerEvents: 'auto'
    });

    // 2. Create the character image
    const charImg = document.createElement('img');
    charImg.src = chrome.runtime.getURL(CONFIG.image);
    charImg.id = 'dog-run-extension-img';

    Object.assign(charImg.style, {
        width: '100%',
        height: 'auto',
        display: 'block',
        pointerEvents: 'none'
    });

    // 3. Create the speech bubble
    const bubble = document.createElement('div');
    bubble.id = 'dog-run-extension-bubble';
    Object.assign(bubble.style, {
        position: 'absolute',
        bottom: '80%', // Position above the character
        right: '100%', // To the left of the character
        marginRight: '-20px', // Overlap slightly
        padding: '8px 12px',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.3s',
        zIndex: '2147483648'
    });

    // Bubble tail
    const tail = document.createElement('div');
    Object.assign(tail.style, {
        position: 'absolute',
        bottom: '10px',
        right: '-6px',
        width: '0',
        height: '0',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: '6px solid white'
    });
    bubble.appendChild(tail);

    container.appendChild(charImg);
    container.appendChild(bubble);
    (document.documentElement || document.body).appendChild(container);
    console.log('Dog Run Extension: Peeking Character Injected');

    // Phrases
    const phrases = [
        "Hello there!", "Peek-a-boo!",
        "Working hard?", "Take a break!",
        "What's this?", "I'm watching!",
        "Coding?", "Zoom zoom!"
    ];

    let isPeeking = false;
    let peekTimeout = null;

    function showSpeechBubble() {
        // Pick random phrase
        const text = phrases[Math.floor(Math.random() * phrases.length)];

        // Reset content to just tail
        bubble.innerHTML = '';
        bubble.appendChild(tail);
        // Add text node
        bubble.appendChild(document.createTextNode(text));

        // Show
        bubble.style.opacity = '1';

        // Hide after 2.5s
        setTimeout(() => {
            bubble.style.opacity = '0';
        }, 2500);
    }

    function peek() {
        if (isPeeking) return;
        isPeeking = true;

        // Slide In
        container.style.right = CONFIG.peekPosition.right;

        // Maybe show bubble after a delay
        setTimeout(() => {
            if (Math.random() > 0.3) {
                showSpeechBubble();
            }
        }, 500);

        // Slide Out after duration
        setTimeout(() => {
            container.style.right = CONFIG.position.right;
            isPeeking = false;
            scheduleNextPeek();
        }, CONFIG.peekDuration);
    }

    function scheduleNextPeek() {
        const interval = Math.random() * (CONFIG.maxInterval - CONFIG.minInterval) + CONFIG.minInterval;
        peekTimeout = setTimeout(peek, interval);
    }

    // Initial schedule
    scheduleNextPeek();

    // Click handler to manually peek or hide
    container.addEventListener('click', () => {
        if (isPeeking) {
            // If clicked while peeking, maybe say something else or hide immediately?
            // Let's just say something else
            showSpeechBubble();
        } else {
            // Force peek
            if (peekTimeout) clearTimeout(peekTimeout);
            peek();
        }
    });

})();
