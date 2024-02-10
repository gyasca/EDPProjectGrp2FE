import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";

// const ChatComponent = () => {
//     const [connection, setConnection] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');

//     useEffect(() => {
//         const newConnection = new signalR.HubConnectionBuilder()
//             .withUrl('https://localhost:7261/chat') // Replace with your SignalR backend URL
//             .withAutomaticReconnect()
//             .build();

//         setConnection(newConnection);
//     }, []);

//     useEffect(() => {
//         if (connection) {
//             connection
//                 .start()
//                 .then(() => {
//                     console.log('Connection established');
//                 })
//                 .catch((error) => {
//                     console.error('Error establishing connection:', error);
//                 });

//             connection.on('ReceiveMessage', (message) => {
//                 setMessages((prevMessages) => [...prevMessages, message]);
//             });
//         }
//     }, [connection]);

//     const sendMessage = () => {
//         if (connection && newMessage.trim() !== '') {
//             connection.invoke('SendMessage', newMessage);
//             setNewMessage('');
//         }
//     };

//     return (
//         <div>
//             <h1>SignalR Chat</h1>
//             <MainContainer>
//                 <ChatContainer>
//                     <MessageList>
//                         {messages.map((message) => (
//                             <Message
//                             model={{
//                                 message: message,
//                                 sentTime: "just now",
//                                 sender: "Joe",
//                                 direction: "outgoing"
//                             }}
//                         />
//                         ))}
//                     </MessageList>
//                 </ChatContainer>
//             </MainContainer>
//             <div>
//                 <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default ChatComponent;

const ChatComponent = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState(''); // Added user name state

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7261/chat') // Replace with your SignalR backend URL
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log('Connection established');
                })
                .catch((error) => {
                    console.error('Error establishing connection:', error);
                });

            connection.on('ReceiveMessage', (message, user) => {
                setMessages((prevMessages) => [...prevMessages, {message, user}]);
                console.log(message, user)
            });
        }
    }, [connection]);

    const sendMessage = () => {
        if (connection && newMessage.trim() !== '' && userName.trim() !== '') {
            connection.invoke('SendMessage', newMessage, userName);
            console.log("message sent", newMessage, userName)
            setNewMessage('');
        }
    };

    return (
        <div>
            <h1>SignalR Chat</h1>
            <div>
                <label htmlFor="userName">Your Name:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(f) => setUserName(f.target.value)}
                />
            </div>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                model={{
                                    message: `${message.message} ${index} ${message.user}`,
                                    sentTime: "just now",
                                    sender: message.user,
                                    direction: message.user === userName ? "outgoing" : "incoming"
                                }}
                            />
                        ))}
                    </MessageList>

                </ChatContainer>
            </MainContainer>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;