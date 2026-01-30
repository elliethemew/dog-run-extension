document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('button');

    // 1. Load saved character (default to dollar.gif)
    const { character = 'dollar.gif' } = await chrome.storage.local.get('character');
    updateActiveButton(character);

    // 2. Add click listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const char = btn.getAttribute('data-char');

            // Save to storage
            await chrome.storage.local.set({ character: char });

            // Update UI
            updateActiveButton(char);

            // Optional: Close popup after selection
            // window.close();
        });
    });

    function updateActiveButton(activeChar) {
        buttons.forEach(btn => {
            if (btn.getAttribute('data-char') === activeChar) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
});
