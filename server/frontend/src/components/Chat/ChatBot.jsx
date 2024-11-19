import React, { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]); // To store chat messages
    const [userInput, setUserInput] = useState(''); // To track user input
    const [isLoading, setIsLoading] = useState(false); // To indicate loading state


    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        // Add user message to chat
        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            console.log("sending", userInput)
            const response = await fetch('/djangoapp/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userMessage: userInput }),
            });

            const data = await response.json();
            console.log("recieved", data, response)

            if (response.ok) {
                // Add bot response to chat
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: data.response },
                ]);
            } else {
                console.error('Server error:', data.error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: 'Sorry, something went wrong.' },
                ]);
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Sorry, I could not connect to the server.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };



    return (
        <>
            {/* Floating Chat Icon */}
            <div className="chat-icon" onClick={toggleChat}>
                <div className="chat-icon-container">💬</div>
            </div>

            {/* Chat Area */}
            {isChatOpen && (
                <div className="chat-area">
                    <div className="chat-header">Chat with us!</div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">Bot is typing...</div>
                        )}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                        />
                        <button onClick={sendMessage} disabled={isLoading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
