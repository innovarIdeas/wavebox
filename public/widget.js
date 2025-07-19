"use strict";
// Initialize the chatbot slug globally
window.__CHATBOT_SLUG__ = undefined;
(function () {
    console.log("Widget loader initializing...");
    // Look for the script with data-slug attribute
    const scripts = document.querySelectorAll('script');
    let slug = null;
    let baseUrl = "";
    // Check all scripts for data-slug and determine base URL
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const scriptSlug = script.getAttribute("data-slug");
        if (scriptSlug && script.src.includes('widget.js')) {
            slug = scriptSlug;
            // Extract base URL from the script src
            baseUrl = script.src.substring(0, script.src.lastIndexOf('/') + 1);
            break;
        }
    }
    if (!slug) {
        console.error("Chatbot Widget: Missing `data-slug`.");
        return;
    }
    console.log("Found slug:", slug);
    // Set the slug globally so the widget can access it
    window.__CHATBOT_SLUG__ = slug;
    // Create a container for the widget and attach shadow root
    const containerId = "chatbot-widget-shadow-root-container";
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        // Ensure the container covers the viewport for popups/modals
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100vw";
        container.style.height = "100vh";
        container.style.zIndex = "2147483647"; // max z-index for overlays
        container.style.pointerEvents = "none"; // let widget manage pointer events
        document.body.appendChild(container);
    }
    // Attach shadow root if not already present
    let shadowRoot = container.shadowRoot;
    if (!shadowRoot) {
        shadowRoot = container.attachShadow({ mode: "open" });
    }
    // Fetch and inject CSS into shadow root
    fetch(`${baseUrl}wavebox.css`)
        .then((resp) => resp.text())
        .then((cssText) => {
        let styleTag = shadowRoot.querySelector('style[data-wavebox]');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.setAttribute('data-wavebox', 'true');
            shadowRoot.appendChild(styleTag);
        }
        styleTag.textContent = cssText;
        // Inject React widget bundle into shadow root
        let widgetScript = shadowRoot.querySelector('script[data-wavebox]');
        if (!widgetScript) {
            widgetScript = document.createElement('script');
            widgetScript.setAttribute('data-wavebox', 'true');
            widgetScript.type = 'module';
            widgetScript.src = `${baseUrl}chatbot-bundle.js`;
            shadowRoot.appendChild(widgetScript);
        }
    });
})();
