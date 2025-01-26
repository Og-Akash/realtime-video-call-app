import { useState, useEffect } from "react";

export function useAvailableDevices() {
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);

    useEffect(() => {
        async function getDevices() {
            try {
                const deviceInfo = await navigator.mediaDevices.enumerateDevices()
                setVideoDevices(deviceInfo.filter(device => device.kind === "videoinput"))
                setAudioDevices(deviceInfo.filter(device => device.kind === "audioinput"))
            } catch (e) {
                console.log("Error accessing devices: ", e);
            }
        }
        getDevices();
    }, []);
    // console.log("devices:", devices)
    return {
        videoDevices,
        audioDevices
    };
}
