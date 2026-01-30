(() => {
    // 1. Create the dog element
    const dog = document.createElement('img');
    dog.src = chrome.runtime.getURL('assets/dollar.gif');
    dog.id = 'dog-run-extension-img';

    // 2. Style it deeply to avoid page conflicts
    Object.assign(dog.style, {
        position: 'fixed',
        top: '0px',
        right: '0px',
        width: '100px', // Adjust size as needed
        height: 'auto',
        zIndex: '2147483647', // Max z-index
        cursor: 'pointer',
        userSelect: 'none',
        pointerEvents: 'auto'
    });

    // Append to documentElement (<html>) to avoid body overflow issues
    (document.documentElement || document.body).appendChild(dog);
    console.log('Dog Run Extension: Injected element');

    // 3. State
    // 0: Top-Right (Start)
    // 1: Bottom-Right
    // 2: Bottom-Left
    // 3: Top-Left
    let currentCorner = 0;
    let isRunning = false;
    let animation = null;

    // 4. Click Handler
    dog.addEventListener('click', () => {
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
    }

    function runNextLeg() {
        if (!isRunning) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const dogWidth = dog.offsetWidth || 100;
        const dogHeight = dog.offsetHeight || 100;

        // Calculate max coordinates
        // Origin is Top-Right (0,0)
        // X is negative (going left)
        // Y is positive (going down)
        const moveY = vh - dogHeight;
        const moveX = -(vw - dogWidth);

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
        let transformSuffix = '';
        switch (currentCorner) {
            case 0: // Top-Right -> Bottom-Right (Down)
                transformSuffix = 'rotate(90deg)';
                break;
            case 1: // Bottom-Right -> Bottom-Left (Left)
                transformSuffix = 'scaleX(-1)';
                break;
            case 2: // Bottom-Left -> Top-Left (Up)
                transformSuffix = 'rotate(-90deg)';
                break;
            case 3: // Top-Left -> Top-Right (Right)
                transformSuffix = 'scaleX(1)'; // Reset scale/rotate
                break;
        }

        // Construct transforms
        // We set the rotation immediately at the start of the leg and keep it constant
        const startTransform = `translate(${startPos.x}px, ${startPos.y}px) ${transformSuffix}`;
        const endTransform = `translate(${endPos.x}px, ${endPos.y}px) ${transformSuffix}`;

        // Animate
        animation = dog.animate(
            [
                { transform: startTransform },
                { transform: endTransform }
            ],
            {
                duration: 2500, // 2.5s per leg
                fill: 'forwards',
                easing: 'linear' // Linear movement for running
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
