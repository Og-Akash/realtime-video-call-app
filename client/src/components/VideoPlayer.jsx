import { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  playing,
  muted,
  playerId,
  classNames,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "5px",
      }}
      key={playerId}
      ref={videoRef}
      autoPlay={playing}
      muted={muted}
      className={classNames}
    />
  );
}
