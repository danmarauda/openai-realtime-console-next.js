import React from 'react';
import { Button } from '../components/button/Button';
import { Edit } from 'react-feather';

interface HeaderProps {
  apiKey: string;
  resetAPIKey: () => void;
  showApiKey: boolean;
}

export function Header({ apiKey, resetAPIKey, showApiKey }: HeaderProps) {
  return (
    <div className="content-top">
      <div className="content-title">
        <img src="/openai-logomark.svg" alt="OpenAI Logo" />
        <span>realtime console</span>
      </div>
      <div className="content-api-key">
        {showApiKey && (
          <Button
            icon={Edit}
            iconPosition="end"
            buttonStyle="flush"
            label={`api key: ${apiKey.slice(0, 3)}...`}
            onClick={() => resetAPIKey()}
          />
        )}
      </div>
    </div>
  );
}
