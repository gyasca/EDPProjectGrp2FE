import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import UserContext from "../../contexts/UserContext";
import axios from 'axios';
import OpenAI from "openai";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Avatar
} from "@chatscope/chat-ui-kit-react";

const ChatComponent = () => {
    const { id } = useParams();
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [resolved, setResolved] = useState(false);
    const [ticket, setTicket] = useState(null);
    var { user } = useContext(UserContext);

    const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI, dangerouslyAllowBrowser: true});

    // If user is null or undefined, user will be assigned the default object
    const defaultUser = { id: 0, firstName: 'Guest', roleName: 'Guest' };
    user = user ?? defaultUser;

    // Now you can use updatedUser throughout your code
    // console.log(user);

    const userHasEmployeeRole = user && user.roleName === "employee-master";

    const resolveTicket = () => {
        if (connection && user && user.firstName.trim() !== '') {
            connection.invoke('ResolveTicket', user.firstName);
            setResolved(true);
        }
    };

    const sendMessage = () => {
        if (connection && newMessage.trim() !== '' && user && user.firstName !== '') {
            const recipientId = ticket && ticket.createdBy !== null ? ticket.createdBy.toString() : '1';

            connection.invoke('SendMessage', newMessage)
                .then(() => {
                    setNewMessage('');
                })
                .catch(error => console.error("Error sending message:", error));
        }
    };

    const aiReply = async () => {
        if (connection && user && user.firstName.trim() !== '') {
            // Construct the conversation array
            const conversation = [
                { role: "system", content: "You are a customer service representative for UPlay, a Singaporean activity planning website" },
                ...messages.map((message) => ({ role: "user", content: message.message })),
            ];
    
            // Make API call to OpenAI
            try {
                const openaiResponse = await openai.chat.completions.create({
                    messages: conversation,
                    model: "gpt-3.5-turbo",
                });
    
                const aiMessage = openaiResponse.choices[0].message.content;
    
                // Add the AI's reply to the conversation
                setMessages((prevMessages) => [...prevMessages, { message: aiMessage, user: "assistant" }]);
    
                // connection.invoke('SendMessage', aiMessage)
                //     .then(() => {
                //         setNewMessage('');
                //     })
                //     .catch(error => console.error("Error sending message:", error));
            } catch (error) {
                console.error("Error calling OpenAI API:", error);
            }
        } else {
            console.log("It's else");
        }
    };
    
    useEffect(() => {
        axios.get(`https://localhost:7261/Tickets/${id}`)
            .then(response => {
                setTicket(response.data);
            })
            .catch(error => console.error('Error fetching ticket:', error));
    }, [id]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7261/chat')
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
                    connection.invoke('JoinRoom', { User: user && user.firstName, Room: id });
                })
                .catch((error) => {
                    console.error('Error establishing connection:', error);
                });

            connection.on('ReceiveMessage', (message, user) => {
                setMessages((prevMessages) => [...prevMessages, { message, user }]);
            });

            connection.on('UsersInRoom', (users) => {
                console.log('Users in the room:', users);
            });
        }
    }, [connection, id, user && user.firstName]);

    useEffect(() => {
        // Run aiReply when a user sends a message
        if (messages.length > 0 && messages[messages.length - 1].user === user.firstName) {
            aiReply();
            console.log("test")
        }
    }, [messages]);

    return (
        <div>
            <h1>SignalR Chat</h1>
            <div>
                <label htmlFor="userObj">Your Name: {user && user.firstName} </label>
            </div>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        <Message
                            model={{
                                message: `A customer support staff will be with you shortly`,
                                sentTime: "just now",
                                sender: "System",
                                direction: user.roleName === "employee-master" ? "outgoing" : "incoming"
                            }}>

                        </Message>
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                model={{
                                    message: message.message,
                                    sentTime: "just now",
                                    sender: user.firstName,
                                    direction: user.firstName === message.user ? "outgoing" : "incoming"
                                }}
                            >
                                <Avatar name={message.user} />
                            </Message>
                        ))}
                    </MessageList>
                </ChatContainer>
            </MainContainer>
            <div style={{ display: 'flex', padding: '5px', border: '1px solid #ccc', borderRadius: '3px', backgroundColor: '#f5f5f5' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flexGrow: 1, padding: '5px', border: 'none', borderRadius: '3px' }}
                />
                <button onClick={sendMessage} disabled={resolved} style={{ padding: '5px 10px', marginLeft: '5px', border: 'none', borderRadius: '3px', backgroundColor: '#007bff', color: '#fff' }}>
                    Send
                </button>
                <button onClick={aiReply} disabled={resolved} style={{ padding: '5px 10px', marginLeft: '5px', border: 'none', borderRadius: '3px', backgroundColor: '#007bff', color: '#fff' }}>
                    Reply
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;