import { useState, useEffect, useCallback, useRef } from "react";

export function useMediaStream(selectedDeviceId) {
    const [stream, setStream] = useState(null);
    const currentDeviceId = useRef(null); // Track the current device ID

    const initStream = useCallback(
        async (deviceId) => {
            try {
                console.log("Initializing stream with device ID:", deviceId);

                if (deviceId !== currentDeviceId.current) {
                    currentDeviceId.current = deviceId;

                    // Stop tracks from the old stream
                    if (stream) {
                        stream.getTracks().forEach((track) => track.stop());
                    }

                    // Request new stream
                    const newStream = await navigator.mediaDevices.getUserMedia({
                        video: deviceId ? { deviceId: { exact: deviceId } } : true,
                        audio: true,
                    });

                    // Validate the new stream
                    if (!newStream || !newStream.getVideoTracks().length) {
                        throw new Error("New stream is invalid or contains no video tracks");
                    }

                    setStream(newStream); // Update state with the new stream
                }
            } catch (error) {
                console.error("Error initializing media stream:", error);
            }
        },
        [stream]
    );


    // Effect to initialize stream when device ID changes
    useEffect(() => {
        initStream(selectedDeviceId);

        // Cleanup function to stop tracks on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [selectedDeviceId, initStream]);

    return { stream, updateStream: initStream };
}
