import React, { useRef, useEffect } from 'react';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { WavRenderer } from '../utils/wav_renderer';

interface VisualizationProps {
  wavRecorder: WavRecorder;
  wavStreamPlayer: WavStreamPlayer;
}

export function Visualization({
  wavRecorder,
  wavStreamPlayer,
}: VisualizationProps) {
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isLoaded = true;

    const render = () => {
      if (isLoaded) {
        if (clientCanvasRef.current) {
          const clientCanvas = clientCanvasRef.current;
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          const clientCtx = clientCanvas.getContext('2d');
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              '#0099ff',
              10,
              0,
              8
            );
          }
        }
        if (serverCanvasRef.current) {
          const serverCanvas = serverCanvasRef.current;
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          const serverCtx = serverCanvas.getContext('2d');
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              '#009900',
              10,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, [wavRecorder, wavStreamPlayer]);

  return (
    <div className="visualization">
      <div className="visualization-entry client">
        <canvas ref={clientCanvasRef} />
      </div>
      <div className="visualization-entry server">
        <canvas ref={serverCanvasRef} />
      </div>
    </div>
  );
}
