import {useEffect, useRef} from "react";

export default function VideoPlayer({stream, playing, muted, playerId,classNames}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video
            key={playerId}
            ref={videoRef}
            autoPlay={playing}
            muted={muted}
            className={classNames}
        />
    );
}
