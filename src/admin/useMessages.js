import { useEffect, useState } from 'react';
import { MESSAGES_EVENT, getMessages } from '../utils/messages';

/** Live list of contact-form messages for the dashboard. */
export function useMessages() {
  const [messages, setMessages] = useState(getMessages);

  useEffect(() => {
    const sync = () => setMessages(getMessages());

    window.addEventListener(MESSAGES_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(MESSAGES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return messages;
}

export function formatMessageDate(timestamp) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  } catch (error) {
    return new Date(timestamp).toLocaleString();
  }
}
