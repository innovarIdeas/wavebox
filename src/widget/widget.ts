interface CustomWindow extends Window {
  __CHATBOT_SLUG__?: string;
}

// Initialize the chatbot slug globally
((window as unknown) as CustomWindow).__CHATBOT_SLUG__ = undefined;

(function () {
  console.log("Widget loader initializing...");
  
  // Look for the script with data-slug attribute
  const scripts = document.querySelectorAll('script');
  let slug = null;
  
  // Check all scripts for data-slug
  for (let i = 0; i < scripts.length; i++) {
    const scriptSlug = scripts[i].getAttribute('data-slug');
    if (scriptSlug) {
      slug = scriptSlug;
      break;
    }
  }

  if (!slug) {
    console.error("Chatbot Widget: Missing `data-slug`.");
    return;
  }

  console.log("Found slug:", slug);
  
  // Set the slug globally so the widget can access it
  ((window as unknown) as CustomWindow).__CHATBOT_SLUG__ = slug;

  const cssLink = document.createElement("link")
  cssLink.rel = "stylesheet"
  cssLink.href = "./dist/widget/wavebox.css"
  document.head.appendChild(cssLink)

  // Inject React widget bundle
  const chatbotScript = document.createElement("script");
  chatbotScript.src = "./dist/widget/chatbot-bundle.js";
  document.body.appendChild(chatbotScript);
})();
