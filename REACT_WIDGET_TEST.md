# Testing Wavebox Widget in a Different Local React Project

This guide walks you through adding and testing the Wavebox widget in a separate local React project (not the Wavebox project itself).

---

## 1. Build and Copy the Widget Script

1. In your **Wavebox project**, ensure you have built the widget so that `dist/widget/widget.js` exists. If not, run your build command (e.g., `npm run build` or your custom build script).
2. Copy `widget.js` from your Wavebox project (`wavebox/dist/widget/widget.js`) into the `public` folder of your **other React project** (the one you want to test the widget in).

- Example destination after copying:  
  `<other-react-project>/public/widget.js`

---

## 2. Create a Widget Loader Component in the Other React Project

In your other React project, create a new file, e.g., `src/WaveboxWidget.js`:

```jsx
import { useEffect } from "react";

export default function WaveboxWidget() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById("wavebox-widget-script")) return;

    const script = document.createElement("script");
    script.id = "wavebox-widget-script";
    script.src = "/widget.js";
    script.setAttribute("data-slug", "schoolwave"); // Change if needed
    script.async = true;
    document.body.appendChild(script);

    // Optional cleanup if you want to remove the widget on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // The widget will render itself
}
```

---

## 3. Use the Component in Your App

Open your main app file in the other React project (e.g., `src/App.js` or `src/App.tsx`) and add the widget component:

```jsx
import WaveboxWidget from "./WaveboxWidget";

function App() {
  return (
    <div>
      <h1>Wavebox Widget React Test</h1>
      <p>This is a test page for the Wavebox widget in React.</p>
      <WaveboxWidget />
    </div>
  );
}

export default App;
```

---

## 4. Start Your React App

In your other React project directory, run:

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) (or the port your app runs on).  
You should see your app and the Wavebox widget loaded.

---

## 5. Troubleshooting

- **Widget not showing?**
  - Check the browser console for errors.
  - Make sure `/widget.js` is accessible (open http://localhost:3000/widget.js).
  - Ensure only one instance of the script is loaded.
  - Confirm you copied the latest `widget.js` from your Wavebox project.

---

**You can now interact with the Wavebox widget in your other local React app!** 