"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SendMessageProps {
    onSend: (message: string) => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <div className="flex mt-2">
            <Input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message..." 
                className="flex-grow" 
            />
            <Button onClick={handleSend} className="ml-2">Send</Button>
        </div>
    );
};

export default SendMessage;