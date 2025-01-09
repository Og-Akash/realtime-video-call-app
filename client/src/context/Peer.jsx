import { createContext, useContext, useMemo } from "react";

const peerContext = createContext(null);

export function PeerContextProvider({ children }) {
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }, []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  return (
    <peerContext.Provider value={{ peer, createOffer }}>
      {children}
    </peerContext.Provider>
  );
}

export function usePeer() {
  const peer = useContext(peerContext);
  if (!peerContext) {
    throw new Error("usePeer must be used within a peerContextProvider");
  }
  return peer;
}
