(() => {
    // 1. Create the container
    const container = document.createElement('div');
    container.id = 'dog-run-extension-container';

    // Style the container (it handles position and movement)
    Object.assign(container.style, {
        position: 'fixed',
        top: '0px',
        right: '0px',
        width: '100px', // Match dog size
        height: '100px', // Match dog size (approx)
        zIndex: '2147483647',
        cursor: 'pointer',
        userSelect: 'none',
        pointerEvents: 'auto' // Container captures clicks
    });

    // 2. Create the dog element
    const dog = document.createElement('img');
    dog.src = chrome.runtime.getURL('assets/dollar.gif');
    dog.id = 'dog-run-extension-img';

    // Style the dog (it handles rotation/scale inside the container)
    Object.assign(dog.style, {
        width: '100%',
        height: 'auto',
        display: 'block',
        pointerEvents: 'none' // Click passes through to container
    });

    // 3. Create the speech bubble
    const bubble = document.createElement('div');
    bubble.id = 'dog-run-extension-bubble';
    Object.assign(bubble.style, {
        position: 'absolute',
        bottom: '100%', // Above the dog
        right: '50%',   // Centered horizontally relative to dog
        transform: 'translateX(50%)',
        marginBottom: '10px',
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
        transition: 'opacity 0.3s'
    });

    // Bubble tail
    const tail = document.createElement('div');
    Object.assign(tail.style, {
        position: 'absolute',
        bottom: '-6px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0',
        height: '0',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid white'
    });
    bubble.appendChild(tail);

    container.appendChild(dog);
    container.appendChild(bubble);
    (document.documentElement || document.body).appendChild(container);
    console.log('Dog Run Extension: Injected container and element');

    // 3. State
    // 0: Top-Right (Start)
    // 1: Bottom-Right
    // 2: Bottom-Left
    // 3: Top-Left
    let currentCorner = 0;
    let isRunning = false;
    let animation = null;

    // Phrases
    const phrases = [
        "Woof!", "Zoom!", "Catch me!",
        "Such speed!", "Wow!", "Bark!",
        "Too fast!", "Running!"
    ];

    function showSpeechBubble() {
        if (!isRunning) return;

        // Pick random phrase
        const text = phrases[Math.floor(Math.random() * phrases.length)];

        // Update text (avoid overwriting tail)
        // Reset content to just tail
        bubble.innerHTML = '';
        bubble.appendChild(tail);
        // Add text node
        bubble.appendChild(document.createTextNode(text));

        // Show
        bubble.style.opacity = '1';

        // Hide after 1.5s
        setTimeout(() => {
            bubble.style.opacity = '0';
        }, 1500);
    }

    // 4. Click Handler (on container)
    container.addEventListener('click', () => {
        if (isRunning) {
            stopRunning();
        } else {
            startRunning();
        }
    });

    function startRunning() {
        isRunning = true;
        // If paused in the middle, resume
        if (animation && animation.playState === 'paused') {
            animation.play();
        } else {
            // Otherwise start the next leg
            runNextLeg();
        }
    }

    function stopRunning() {
        isRunning = false;
        if (animation) {
            animation.pause();
        }
        // Hide bubble if showing
        bubble.style.opacity = '0';
    }

    function runNextLeg() {
        if (!isRunning) return;

        // Maybe show bubble? 30% chance per leg start
        if (Math.random() > 0.7) {
            showSpeechBubble();
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const width = container.offsetWidth || 100;
        const height = container.offsetHeight || 100;

        // Calculate max coordinates
        // Origin is Top-Right (0,0)
        // X is negative (going left)
        // Y is positive (going down)
        const moveY = vh - height;
        const moveX = -(vw - width);

        // Define all coordinates for corners
        const coords = [
            { x: 0, y: 0 },         // 0: Top-Right
            { x: 0, y: moveY },     // 1: Bottom-Right
            { x: moveX, y: moveY }, // 2: Bottom-Left
            { x: moveX, y: 0 }      // 3: Top-Left
        ];

        const nextCorner = (currentCorner + 1) % 4;
        const startPos = coords[currentCorner];
        const endPos = coords[nextCorner];

        // Determine Rotation/Scale based on direction
        let dogTransform = '';
        switch (currentCorner) {
            case 0: // Top-Right -> Bottom-Right (Down)
                dogTransform = 'rotate(90deg)';
                break;
            case 1: // Bottom-Right -> Bottom-Left (Left)
                dogTransform = 'scaleX(-1)';
                break;
            case 2: // Bottom-Left -> Top-Left (Up)
                dogTransform = 'rotate(-90deg)';
                break;
            case 3: // Top-Left -> Top-Right (Right)
                dogTransform = 'scaleX(1)'; // Reset scale/rotate
                break;
        }

        // Apply rotation to the dog image immediately
        dog.style.transform = dogTransform;

        // Construct transforms for the container (movement only)
        const startTransform = `translate(${startPos.x}px, ${startPos.y}px)`;
        const endTransform = `translate(${endPos.x}px, ${endPos.y}px)`;

        // Animate container
        animation = container.animate(
            [
                { transform: startTransform },
                { transform: endTransform }
            ],
            {
                duration: 2500, // 2.5s per leg
                fill: 'forwards',
                easing: 'linear'
            }
        );

        animation.onfinish = () => {
            // Only update corner state when we actually arrive
            currentCorner = nextCorner;

            // Loop if still running
            if (isRunning) {
                runNextLeg();
            }
        };
    }
})();
