# Dog Run Chrome Extension

## Setup

1. **Add the GIF**:
   - Make sure you have your `dollar.gif` file.
   - Place it inside the `assets` folder: `dog-run-extension/assets/dollar.gif`.

2. **Install in Chrome/Arc**:
   - Open your browser and navigate to `chrome://extensions`.
   - Toggle **Developer mode** on (usually top right).
   - Click **Load unpacked**.
   - Select the `dog-run-extension` folder (the root folder, not just assets).

3. **Usage**:
   - Open any website (refresh if it was already open).
   - You should see the gif in the top-right corner.
   - **Click the gif** to make it run around the screen edges!
   - **Click again** to make it stop.

## Troubleshooting
- If the image doesn't load, double-check the filename is exactly `dollar.gif` inside `assets`.
- If the animation is weird, try refreshing the page (the script calculates screen size on click).
