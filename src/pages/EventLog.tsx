import React, { useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'react-feather';

interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

interface EventLogProps {
  realtimeEvents: RealtimeEvent[];
  expandedEvents: { [key: string]: boolean };
  setExpandedEvents: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  formatTime: (timestamp: string) => string;
}

export function EventLog({
  realtimeEvents,
  expandedEvents,
  setExpandedEvents,
  formatTime,
}: EventLogProps) {
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const eventsScrollHeightRef = useRef(0);

  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  return (
    <div className="content-block-body" ref={eventsScrollRef}>
      {!realtimeEvents.length && `awaiting connection...`}
      {realtimeEvents.map((realtimeEvent, i) => {
        const count = realtimeEvent.count;
        const event = { ...realtimeEvent.event };
        if (event.type === 'input_audio_buffer.append') {
          event.audio = `[trimmed: ${event.audio.length} bytes]`;
        } else if (event.type === 'response.audio.delta') {
          event.delta = `[trimmed: ${event.delta.length} bytes]`;
        }
        return (
          <div className="event" key={`${event.event_id}-${i}`}>
            <div className="event-timestamp">
              {formatTime(realtimeEvent.time)}
            </div>
            <div className="event-details">
              <div
                className="event-summary"
                onClick={() => {
                  const id = event.event_id;
                  const expanded = { ...expandedEvents };
                  if (expanded[id]) {
                    delete expanded[id];
                  } else {
                    expanded[id] = true;
                  }
                  setExpandedEvents(expanded);
                }}
              >
                <div
                  className={`event-source ${
                    event.type === 'error' ? 'error' : realtimeEvent.source
                  }`}
                >
                  {realtimeEvent.source === 'client' ? (
                    <ArrowUp />
                  ) : (
                    <ArrowDown />
                  )}
                  <span>
                    {event.type === 'error' ? 'error!' : realtimeEvent.source}
                  </span>
                </div>
                <div className="event-type">
                  {event.type}
                  {count && ` (${count})`}
                </div>
              </div>
              {!!expandedEvents[event.event_id] && (
                <div className="event-payload">
                  {JSON.stringify(event, null, 2)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
