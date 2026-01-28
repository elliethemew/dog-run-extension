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
    let animation = null;

    // 4. Click Handler
    dog.addEventListener('click', () => {
        moveToNextCorner();
    });

    function moveToNextCorner() {
        // Determine next target
        const nextCorner = (currentCorner + 1) % 4;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const dogWidth = dog.offsetWidth || 100;
        const dogHeight = dog.offsetHeight || 100;

        // Calculate max coordinates
        // Origin is Top-Right (0,0)
        const moveY = vh - dogHeight;
        const moveX = -(vw - dogWidth);

        // Define all coordinates
        // 0: 0, 0
        // 1: 0, moveY
        // 2: moveX, moveY
        // 3: moveX, 0

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

        // Animate to target
        // We don't specify start state; it starts from current computed style
        animation = dog.animate(
            [
                { transform: targetTransform }
            ],
            {
                duration: 2500, // Slower: 2.5s per leg
                fill: 'forwards', // Stay at destination
                easing: 'ease-in-out' // Smoother start/stop
            }
        );

        // Update state
        currentCorner = nextCorner;
    }
})();
