import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

const MESSAGES_CHANGED = 'folio:messages-changed';

function announceChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MESSAGES_CHANGED));
}

/** Server-backed inbox for the dashboard. */
export function useMessages({ active = true } = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(active);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!active) return;

      if (!quiet) setLoading(true);

      try {
        const data = await api.getMessages();
        setMessages(data?.messages ?? []);
        setError(null);
      } catch (requestError) {
        setError(requestError);
      } finally {
        setLoading(false);
      }
    },
    [active]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const sync = () => load({ quiet: true });
    window.addEventListener(MESSAGES_CHANGED, sync);
    return () => window.removeEventListener(MESSAGES_CHANGED, sync);
  }, [load]);

  const markRead = useCallback(
    async (id, read) => {
      setMessages((current) =>
        current.map((message) => (message.id === id ? { ...message, read } : message))
      );

      try {
        await api.setMessageRead(id, read);
        announceChange();
      } catch (requestError) {
        setError(requestError);
        load({ quiet: true });
      }
    },
    [load]
  );

  const remove = useCallback(
    async (id) => {
      setMessages((current) => current.filter((message) => message.id !== id));

      try {
        await api.deleteMessage(id);
        announceChange();
      } catch (requestError) {
        setError(requestError);
        load({ quiet: true });
      }
    },
    [load]
  );

  const clearAll = useCallback(async () => {
    try {
      await api.clearMessages();
      setMessages([]);
      announceChange();
    } catch (requestError) {
      setError(requestError);
    }
  }, []);

  const unread = messages.filter((message) => !message.read).length;

  return { messages, unread, loading, error, reload: load, markRead, remove, clearAll };
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
