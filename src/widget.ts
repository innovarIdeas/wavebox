(function () {
  const script = document.currentScript as HTMLScriptElement | null;
  const slug = script?.getAttribute("data-slug");

  if (!slug) {
    console.error("Chatbot Widget: Missing `data-slug` attribute.");
    return;
  }

  const container = document.createElement("div");
  container.id = "chatbot-widget-container";
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.zIndex = "9999";
  container.style.pointerEvents = "none"; 


  const iframe = document.createElement("iframe");
  const baseUrl = import.meta.env.VITE_WAVEBOX_URL;
  iframe.src = `${baseUrl}/embed?slug=${slug}`;
  
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.border = "none";
  iframe.style.backgroundColor = "transparent";
  iframe.style.pointerEvents = "auto";
  iframe.setAttribute("allowtransparency", "true");

  container.appendChild(iframe);
  document.body.appendChild(container);
})();
