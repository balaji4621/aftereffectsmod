import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';

export interface NoiseOverlayProps {
  opacity?: number;
  intensity?: number;
  style?: React.CSSProperties;
}

export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  opacity = 0.1,
  intensity = 200,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const seed = random(
oise-);

  const noiseSvg = React.useMemo(() => {
    const rects: string[] = [];
    const rng = random(
oise-gen-);

    for (let i = 0; i < intensity; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const size = 0.5 + rng() * 1.5;
      const alpha = rng();
      rects.push(
        \<rect x="\%" y="\%" width="\%" height="\%" fill="white" opacity="\"/>\,
      );
    }

    return \<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">\</svg>\;
  }, [frame, intensity]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'overlay',
        backgroundImage: \url("data:image/svg+xml,\")\,
        backgroundSize: 'cover',
        ...style,
      }}
    />
  );
};
