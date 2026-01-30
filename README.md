# Peeking Character Extension

A fun Chrome extension that adds a character who occasionally peeks out from the side of your screen to say hello!

## Features
- **Peeking Animation**: The character hides off-screen and randomly slides in from the right.
- **Speech Bubbles**: Displays random phrases like "Hello there!", "Take a break!", etc.
- **Interactive**: Click the character to make them speak or peek immediately.

## Setup

1. **Install in Chrome/Arc**:
   - Open your browser and navigate to `chrome://extensions`.
   - Toggle **Developer mode** on (usually top right).
   - Click **Load unpacked**.
   - Select the `dog-run-extension` folder (the root folder).

2. **Usage**:
   - Open any website (refresh if it was already open).
   - Wait a few seconds... you'll see the character peek out from the right side!
   - **Click the character** to make them say a random phrase.

## Customization
- The character image is located at `assets/Bluebinh.gif`. You can replace this file to change the character (keep the filename or update `manifest.json` and `content.js`).

## Troubleshooting
- If the character doesn't appear, try refreshing the page.
- Make sure `assets/Bluebinh.gif` exists.
- Check `chrome://extensions` for any errors.
