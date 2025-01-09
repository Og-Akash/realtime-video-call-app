import "./App.css";
import { SocketProvider } from "./context/Socket.jsx";
import { PeerContextProvider } from "./context/Peer.jsx";
import AppRouter from "./router/AppRoute";

function App() {
  return (
    <>
      <SocketProvider>
        <PeerContextProvider>
          <AppRouter />
        </PeerContextProvider>
      </SocketProvider>
    </>
  );
}

export default App;
