import React from 'react';
export interface AudioPlayProps {
    audioUrl: string,
}

function AudioPlay(props: AudioPlayProps) {

  const { audioUrl } = props;

  return (
    <div>
        <audio controls src={ audioUrl } />
    </div>
  )
}

export default AudioPlay