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
    Avatar,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";

const ChatComponent = () => {
    const { id } = useParams();
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [resolved, setResolved] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [typingIndicator, setTypingIndicator] = useState(null);
    // const [otherUserTyping, setOtherUserTyping] = useState(false);
    var { user } = useContext(UserContext);

    // If user is null or undefined, user will be assigned the default object
    const defaultUser = { id: 0, firstName: 'Guest', roleName: 'Guest' };
    user = user ?? defaultUser;

    const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI, dangerouslyAllowBrowser: true });

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
                    connection.invoke('StopTyping', user.firstName);
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

    useEffect(() => { //get current ticket information
        axios.get(`https://localhost:7261/Tickets/${id}`)
            .then(response => {
                setTicket(response.data);
            })
            .catch(error => console.error('Error fetching ticket:', error));
    }, [id]);

    useEffect(() => { //create signalr connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7261/chat')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => { //check for signals
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

            connection.on('ResolveTicket', (user) => {
                console.log(user, "has resolved the ticket")
                setResolved(true)
            });

            // connection.on('SetTyping', (user) => {
            //     console.log(user, "is typing")
            //     setIsTyping(true)
            // });

            // connection.on('OtherUserTyping', (isTyping, userName) => {
            //     console.log(isTyping, userName, "hello there");
            //     // Update the typing indicator when other user is typing
            //     if (isTyping) {
            //         setTypingIndicator(<TypingIndicator content={`${userName} is typing`} />);
            //     } else {
            //         // Remove the typing indicator if other user is not typing
            //         setTypingIndicator(null);
            //     }
            // });
        }
    }, [connection, id, user && user.firstName]);

    useEffect(() => {
        // Run aiReply when a user sends a message only if ticket response type is ai
        if (messages.length > 0 && messages[messages.length - 1].user === user.firstName) {
            console.log("yee")
            // Check if the ticket's responseType is 'ai'
            if (ticket && ticket.responseType === 'ai') {
                setTypingIndicator(<TypingIndicator content="Uplay is typing" />);
                aiReply().finally(() => {
                    // Remove typing indicator once aiReply finishes
                    setTypingIndicator(null);
                });
                console.log("test", ticket, ticket.responseType);
            } else { console.log("haw", ticket, ticket.responseType) }
        }
    }, [messages, user.firstName, ticket]);

    return (
        <div>
            <h1>SignalR Chat</h1>
            <div>
                <label htmlFor="userObj">Your Name: {user && user.firstName} </label>
            </div>
            <MainContainer>
                <ChatContainer>
                    <MessageList typingIndicator={typingIndicator}>
                        <Message
                            model={{
                                message: `Customer support will be with you shortly`,
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
                    onChange={
                        (e) => {
                            setNewMessage(e.target.value)
                            // if (!otherUserTyping) {
                            //     connection.invoke('StartTyping', user.firstName)
                            // }
                        }
                    }
                    style={{ flexGrow: 1, padding: '5px', border: 'none', borderRadius: '3px' }}
                />
                <button
                    onClick={sendMessage}
                    disabled={resolved}
                    style={{
                        padding: '5px 10px',
                        marginLeft: '5px',
                        border: 'none',
                        borderRadius: '3px',
                        backgroundColor: resolved ? '#ccc' : '#007bff',
                        color: '#fff',
                        cursor: resolved ? 'not-allowed' : 'pointer',
                    }}
                >
                    Send
                </button>
                <button
                    onClick={resolveTicket}
                    disabled={resolved}
                    style={{
                        padding: '5px 10px',
                        marginLeft: '5px',
                        border: 'none',
                        borderRadius: '3px',
                        backgroundColor: resolved ? '#ccc' : '#007bff',
                        color: '#fff',
                        cursor: resolved ? 'not-allowed' : 'pointer',
                    }}
                >
                    Resolve
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;