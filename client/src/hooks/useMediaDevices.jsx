import { useState, useEffect } from "react";

export function useAvailableDevices() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        async function getDevices() {
            try {
                const deviceInfo = await navigator.mediaDevices.enumerateDevices()
                setDevices(deviceInfo.filter(device => device.kind === "videoinput"))
            } catch (e) {
                console.log("Error accessing devices: ", e);
            }
        }
        getDevices();
    }, []);
    // console.log("devices:", devices)
    return devices; // Returns an array of video input devices
}
