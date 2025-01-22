import {useEffect, useRef} from "react";

export default function VideoPlayer({stream, playing, muted, playerId}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div style={{
            border: "1px solid red",
        }}>
        <video
            key={playerId}
            ref={videoRef}
            autoPlay={playing}
            muted={muted}
            style={{width: "50%", height: "auto"}}
        />
        </div>
    );
}
