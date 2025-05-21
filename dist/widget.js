(function () {
    const script = document.currentScript;
    const slug = script?.getAttribute("data-slug");
  
    if (!slug) {
      console.error("Chatbot Widget: Missing `data-slug`.");
      return;
    }
  
    window.__CHATBOT_SLUG__ = slug;
  
    // Inject React widget bundle
    const chatbotScript = document.createElement("script");
    chatbotScript.src = "https://your-cdn.com/chatbot-widget.iife.js"; // Replace with your CDN path
    chatbotScript.async = true;
    document.body.appendChild(chatbotScript);
  })();
  