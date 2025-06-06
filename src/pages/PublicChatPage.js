import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatWindowContainer from '../components/ChatWindowContainer';
import axios from 'axios';

// This page renders CustomChatWindow, fetching the context from the backend based on the link
const PublicChatPage = () => {
  // Support both /chat/:customLinkName and /public/:linkName
  const params = useParams();
  const linkName = params.customLinkName || params.linkName;
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await axios.get(`/api/public/${linkName}/context`);
        if (res.data && res.data.context && res.data.context.length > 0) {
          const systemMessages = res.data.context.filter(m => m.role === 'system');
          setContext(systemMessages.map(m => m.content).join('\n'));
        } else {
          setContext('');
        }
      } catch (err) {
        setContext('Failed to load chat context.');
      }
      setLoading(false);
    };
    fetchContext();
  }, [linkName]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ChatWindowContainer mode="public" contextOverride={context} />
    </div>
  );
};

export default PublicChatPage;
