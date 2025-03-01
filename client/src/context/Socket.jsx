import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a context to provide socket instance
const socketContext = createContext(null);

// Socket initialization function with options
const initSocket = async () => {

  return io(import.meta.env.VITE_BACKEND_URL); // Use your backend URL
};

// Socket Provider to manage socket connection
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
    const socketInstance = await initSocket();
      setSocket(socketInstance);
    };

    connectSocket();


  }, []);

  // If socket is not initialized yet, render null or loading state
  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

// Hook to access socket instance in other components
export function useSocket() {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
