(() => {
    // 1. Create the container to hold both character and bubble
    const container = document.createElement('div');
    container.id = 'dog-run-extension-container';
    Object.assign(container.style, {
        position: 'fixed',
        top: '0px',
        right: '0px',
        zIndex: '2147483647',
        pointerEvents: 'none'
    });

    // 2. Create the dog element
    const dog = document.createElement('img');
    dog.id = 'dog-run-extension-img';
    Object.assign(dog.style, {
        display: 'block',
        height: 'auto',
        cursor: 'pointer',
        userSelect: 'none',
        pointerEvents: 'auto'
    });

    // 3. Create speech bubble
    const bubble = document.createElement('div');
    bubble.id = 'dog-run-extension-bubble';
    Object.assign(bubble.style, {
        position: 'absolute',
        bottom: '100%',
        right: '0px',
        marginBottom: '10px',
        padding: '10px 15px',
        backgroundColor: 'white',
        color: '#333',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'opacity 0.3s, transform 0.3s',
        pointerEvents: 'none'
    });

    // Assemble
    container.appendChild(bubble);
    container.appendChild(dog);
    (document.documentElement || document.body).appendChild(container);
    console.log('Dog Run Extension: Injected element');

    // Helper to update src and size
    function updateImage(filename) {
        if (filename === 'none') {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block'; // Ensure it's visible if not 'none'
        dog.src = chrome.runtime.getURL(`assets/${filename}`);

        // Dynamic sizing based on character
        if (filename === 'JingYuan.gif') {
            dog.style.width = '150px';
        } else if (filename === 'Bluebinh.gif') {
            dog.style.width = '120px';
        } else {
            dog.style.width = '100px';
        }
    }

    // Load initial character
    chrome.storage.local.get({ character: 'dollar.gif' }, (result) => {
        updateImage(result.character);
    });

    // Listen for changes
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.character) {
            updateImage(changes.character.newValue);
        }
    });

    // State
    let currentCorner = 0;
    let animation = null;

    // Phrases
    const phrases = [
        "Hello?",
        "Work hard?",
        "Wanna have a break?",
        "Need water?",
        "Z.. z..z"
    ];

    // Click Handler
    dog.addEventListener('click', () => {
        showSpeechBubbleAndMove();
    });

    function showSpeechBubbleAndMove() {
        // Pick random phrase
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        bubble.textContent = text;

        // Show bubble immediately
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';

        // Start moving immediately
        moveToNextCorner();

        // Hide bubble after 1.5 seconds (while moving)
        setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(-10px)';
        }, 1500);
    }

    function moveToNextCorner() {
        // Determine next target
        const nextCorner = (currentCorner + 1) % 4;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const dogWidth = dog.offsetWidth || 100;
        const dogHeight = dog.offsetHeight || 100;

        // Calculate max coordinates
        const moveY = vh - dogHeight;
        const moveX = -(vw - dogWidth);

        let targetTransform = '';

        switch (nextCorner) {
            case 0: // Top-Right
                targetTransform = 'translate(0px, 0px)';
                break;
            case 1: // Bottom-Right
                targetTransform = `translate(0px, ${moveY}px)`;
                break;
            case 2: // Bottom-Left
                targetTransform = `translate(${moveX}px, ${moveY}px)`;
                break;
            case 3: // Top-Left
                targetTransform = `translate(${moveX}px, 0px)`;
                break;
        }

        // Animate container (so bubble moves with it)
        animation = container.animate(
            [
                { transform: targetTransform }
            ],
            {
                duration: 2500,
                fill: 'forwards',
                easing: 'ease-in-out'
            }
        );

        // Update state
        currentCorner = nextCorner;
    }
})();
