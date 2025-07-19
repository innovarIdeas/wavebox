# Wavebox Widget Integration Guide

This guide explains how to embed the Wavebox widget into your own website or application. You can use it in both plain HTML projects and React (or other modern JS frameworks) projects.

---

## 1. Requirements

- The widget script (`widget.js`) must be accessible from your host site. You can:
  - Use the provided `dist/widget/widget.js` directly if self-hosting
  - Or upload it to your own CDN/server
- You must provide a `data-slug` attribute to configure the widget for your use case (e.g., `schoolwave`).

---

## 2. Usage in a Plain HTML Project

1. **Copy the Widget Script**
   - Place `widget.js` somewhere accessible in your project (e.g., `/dist/widget/widget.js`).

2. **Add the Script Tag**
   - Insert the following into your HTML, just before the closing `</body>` tag:

```html
<!-- The widget script with required data-slug attribute -->
<script src="/path/to/widget.js" data-slug="schoolwave"></script>
```
- Replace `/path/to/widget.js` with the actual path where you host the script.
- Change `data-slug` to your own identifier if needed.

3. **Done!**
- The widget will automatically initialize and appear on your site.

---

## 3. Usage in a React Project

You can add the widget to any React app (Create React App, Vite, Next.js, etc.) by dynamically injecting the script.

### Option 1: Add to `public/index.html`

1. Copy `widget.js` to your `public` folder or host it elsewhere.
2. Add this to your `public/index.html`:

```html
<script src="/widget.js" data-slug="schoolwave"></script>
```

### Option 2: Dynamically Load in a Component

If you want to load the widget only on certain pages/components:

```jsx
import { useEffect } from "react";

export default function WaveboxWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/path/to/widget.js";
    script.setAttribute("data-slug", "schoolwave");
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return null; // or a placeholder if you wish
}
```
- Place `<WaveboxWidget />` in your component tree where you want the widget to load.

---

## 4. Configuration

- **data-slug**: Required. Identifies the widget instance/use case (e.g., `schoolwave`).
- You may add more data attributes in the future for further customization.

---

## 5. Troubleshooting

- Ensure the script path is correct and accessible from your site.
- Only one instance of the widget should be loaded per page.
- If you update the widget, clear your browser cache or use a versioned file name.

---

## 6. Example

### HTML Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wavebox Widget Demo</title>
</head>
<body>
  <!-- Your site content -->
  <script src="/dist/widget/widget.js" data-slug="schoolwave"></script>
</body>
</html>
```

### React Example
```jsx
import WaveboxWidget from "./WaveboxWidget";

function App() {
  return (
    <div>
      {/* Your app content */}
      <WaveboxWidget />
    </div>
  );
}
```

---

For advanced usage or issues, see the source code or contact the maintainer. 