import ChatBubbleDialog from "@/components/chat-bubble-dialog";
import { PopupProvider } from "./components/popup-provider";

function App() {
  return (
    <div id="chat-bubble-dialog" className="fixed bottom-7 right-7">
      <PopupProvider path={window.location.pathname}>
        <ChatBubbleDialog />
      </PopupProvider>
    </div>
  );
}

export default App;
