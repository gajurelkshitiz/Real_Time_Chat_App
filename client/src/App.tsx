import React, { useState, useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
import io from 'socket.io-client';
// use ReturnType<typeof io> for the socket instance type instead of importing "Socket"
import './App.css';

interface Message {
  id?: string;
  text: string;
  type: 'chat' | 'welcome';
  from?: 'me' | 'other' | 'system';
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to socket server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Listen for chat messages
    newSocket.on('chat message', (msg: string) => {
      console.log('message from socket is: ', msg);
      setMessages(prev => [...prev, { text: msg, type: 'chat' }]);
    });

    // Listen for welcome messages
    newSocket.on('welcome', (msg: string) => {
      setMessages(prev => [...prev, { text: msg, type: 'welcome' }]);
    });

    // Cleanup on component unmount
    return () => {
      // remove listeners and disconnect socket
      newSocket.off('chat message');
      newSocket.off('welcome');
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || !socket) return;
    
    // emit to server
    socket.emit('chat message', text);

    // append locally as 'me'
    setMessages(prev => [...prev, { text, type: 'chat', from: 'me'}]);
    setInputValue('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">K</div>
        <div className="ml-3">
          <div className="font-semibold">Chat</div>
          <div className="text-sm text-gray-500">Online</div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {messages.map((message, idx) => {
              if (message.from === 'system') {
                return (
                  <div key={idx} className="flex justify-center">
                    <div className="text-xs text-gray-500 bg-transparent px-2 py-1 rounded">{message.text}</div>
                  </div>
                );
              }

              const isMe = message.from === 'me';
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-lg break-words ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none shadow'}`}>
                    <div className="text-sm">{message.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input */}
      <form onSubmit={handleSubmit} className="bg-white p-3 shadow">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
