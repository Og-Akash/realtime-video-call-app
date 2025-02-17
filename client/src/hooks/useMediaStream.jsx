import { useState, useEffect, useCallback } from "react";

export function useMediaStream(selectedDeviceId) {
    const [stream, setStream] = useState(null);

    const initStream = useCallback(async (deviceId) => {
        try {
            // console.log("Initializing stream with device ID:", deviceId);

            // Stop previous stream before updating
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Request new stream with the selected camera
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: deviceId ? { deviceId: { exact: deviceId } } : true,
                audio: false, // Do not request audio if only changing camera
            });

            if (!newStream || !newStream.getVideoTracks().length) {
                throw new Error("No video tracks available.");
            }

            setStream(newStream);
        } catch (error) {
            console.error("Error initializing media stream:", error);
        }
    }, []);

    useEffect(() => {
        if (selectedDeviceId) {
            initStream(selectedDeviceId);
        }
    }, [selectedDeviceId, initStream]);

    return { stream, updateStream: initStream };
}
