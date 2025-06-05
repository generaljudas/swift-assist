import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomChatWindow from '../components/CustomChatWindow';
import axios from 'axios';

// This page renders CustomChatWindow, fetching the context from the backend based on the link
const CasaPage = () => {
  const { linkName } = useParams();
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await axios.get(`/api/casa/${linkName}/context`);
        if (res.data && res.data.context && res.data.context.length > 0) {
          // Use the first system message or join all system messages
          const systemMessages = res.data.context.filter((m) => m.role === 'system');
          setContext(systemMessages.map((m) => m.content).join('\n'));
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

  if (loading)
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <CustomChatWindow initialContext={context} />
    </div>
  );
};

export default CasaPage;
