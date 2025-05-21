import ChatBubbleDialog from "./components/chat-bubble-dialog";
import { PopupProvider } from "./components/popup-provider";

type AppProps = {
  slug?: string;
};

function App({ slug }: AppProps) {
  const finalSlug = import.meta.env.DEV 
    ? import.meta.env.VITE_SCHOOLWAVE_SLUG 
    : slug;

  if (!finalSlug) {
    console.error("No slug provided. Please set VITE_SCHOOLWAVE_SLUG in development or pass slug prop in production.");
    return null;
  }

  return (
    <div id="chat-bubble-dialog" className="fixed bottom-7 right-7">
      <PopupProvider path={window.location.pathname}>
        <ChatBubbleDialog slug={finalSlug} />
      </PopupProvider>
    </div>
  );
}

export default App;
