# Diff between openai-realtime-console-next.js and voice2app-openai-realtime-api

## Added Dependencies
```diff
{
  "dependencies": {
+   "@codesandbox/sandpack-react": "^2.19.9",
+   "@codesandbox/sandpack-themes": "^2.0.21",
+   "@vercel/analytics": "^1.3.1"
  }
}
```

## Modified Files

### App.tsx
```diff
- import { ConsolePage } from './pages/ConsolePage';
  import './App.scss';
+ import { Analytics } from "@vercel/analytics/react"

  function App() {
    return (
      <div data-component="App">
+       <Analytics />
        <ConsolePage />
      </div>
    );
  }
```

### New Components
```diff
+ /src/components/Sandpack.tsx - New component for code preview
+ /src/components/Sandpack.scss - Styles for Sandpack component
```

### relay-server/lib/relay.js
```diff
  const client = new RealtimeClient({ apiKey: this.apiKey });
- // Can set parameters ahead of connecting
- // client.updateSession({ instructions: 'You are a great, upbeat friend.' });
- client.updateSession({ voice: 'echo' });
- // client.updateSession({ turn_detection: 'server_vad' });
- // client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });
```

### README.md Changes
```diff
- # OpenAI Realtime Console - Next.js
+ # Generate Next.js pages using Voice (OpenAI Realtime API)

- ## Change list
- - Components are broken down for clarity
- - Switched to yarn.
- - Integrated with Next.js 14+
- - Code is still spaghetti, but at least now it comes with meatballs.
+ Fork of the OpenAI Realtime Console with modifications to edit a live codesandbox voice-interactive using API reference
+ for the OpenAI Realtime API.

- ## How to?
- ```
- yarn relay # To start the relay at localhost:8001
- yarn start # To start the client at localhost:3000
- ```
+ # Set your own API Key
+ 1. Set your API key (saved to local storage)
+ 2. Click "Connect" and start talking
+ 3. Watch LLM generated code appear and preview in a Nodebox
```

### public/index.html
```diff
- <title>realtime console</title>
+ <title>Voice2App realtime console</title>
```

## Key Architectural Changes

1. Added Sandpack Integration
- Introduced CodeSandbox's Sandpack for live code preview
- Added dark theme support for code editor

2. Analytics Integration
- Added Vercel Analytics for tracking usage

3. Purpose Change
- Original: General purpose realtime console
- New: Focused on voice-to-code generation with live preview

4. UI/UX Changes
- Added code preview panel
- Modified layout to accommodate live code preview
- Removed map component functionality

## Removed Features
- Removed map visualization components
- Removed certain voice configuration options
- Simplified relay server configuration

## Added Features
- Live code preview using Sandpack
- Code generation from voice input
- Analytics tracking
- Dark theme for code editor