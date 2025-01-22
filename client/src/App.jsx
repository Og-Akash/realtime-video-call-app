import "./App.css";
import {SocketProvider} from "./context/Socket.jsx";
import AppRouter from "./router/AppRoute";
import {FirebaseProvider} from "@/context/Firebase.jsx";

function App() {
    return (
        <SocketProvider>
            <FirebaseProvider>
                <AppRouter/>
            </FirebaseProvider>
        </SocketProvider>
    );
}

export default App;
