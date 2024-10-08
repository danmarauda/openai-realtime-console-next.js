import { Toggle } from '../components/toggle/Toggle';
import { Button } from '../components/button/Button';
import { X, Zap } from 'react-feather';

interface ActionsProps {
  isConnected: boolean;
  canPushToTalk: boolean;
  isRecording: boolean;
  changeTurnEndType: (value: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
  disconnectConversation: () => void;
  connectConversation: () => void;
}

export function Actions({
  isConnected,
  canPushToTalk,
  isRecording,
  changeTurnEndType,
  startRecording,
  stopRecording,
  disconnectConversation,
  connectConversation,
}: ActionsProps) {
  return (
    <div className="content-actions">
      <Toggle
        defaultValue={false}
        labels={['manual', 'vad']}
        values={['none', 'server_vad']}
        onChange={(_: any, value: string) => changeTurnEndType(value)}
      />
      <div className="spacer" />
      {isConnected && canPushToTalk && (
        <Button
          label={isRecording ? 'release to send' : 'push to talk'}
          buttonStyle={isRecording ? 'alert' : 'regular'}
          disabled={!isConnected || !canPushToTalk}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
        />
      )}
      <div className="spacer" />
      <Button
        label={isConnected ? 'disconnect' : 'connect'}
        iconPosition={isConnected ? 'end' : 'start'}
        icon={isConnected ? X : Zap}
        buttonStyle={isConnected ? 'regular' : 'action'}
        onClick={isConnected ? disconnectConversation : connectConversation}
      />
    </div>
  );
}
