import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import UserContext from "../../contexts/UserContext";
import axios from 'axios';
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
    const [resolved, setResolved] = useState(false); // Changed to boolean
    const [ticket, setTicket] = useState(null);
    const { user } = useContext(UserContext);
    const userHasEmployeeRole = (user.roleName == "employee-master");

    // const resolveTicket = () => {
    //     if (connection && user.firstName.trim() !== '') {
    //         connection.invoke('ResolveTicket', user.firstName);
    //         console.log("TICKET RESOLVED")
    //         setResolved(true)
    //         // The resolution state should be broadcasted to other clients via SignalR
    //     }
    // };

    // // const sendMessage = () => {
    // //     if (connection && newMessage.trim() !== '' && user !== '') {
    // //         connection.invoke('SendMessage', newMessage, user.firstName);
    // //         console.log("message sent", newMessage, user.firstName);
    // //         setNewMessage('');
    // //     }
    // // };

    // const sendMessage = () => {
    //     if (connection && newMessage.trim() !== '' && user !== '') {
    //         // Convert ticket.createdBy to a string
    //         const recipientId = ticket.createdBy !== null ? ticket.createdBy.toString() : '1';

    //         connection.invoke('SendMessageTest', newMessage, user.firstName, recipientId)
    //             .then(() => {
    //                 console.log("Message sent", newMessage, user.firstName, recipientId);
    //                 setNewMessage('');
    //             })
    //             .catch(error => console.error("Error sending message:", error));
    //     }
    // };


    // useEffect(() => {
    //     // Fetch TICKET from your ASP.NET MVC API
    //     if (userHasEmployeeRole) {
    //         axios.get('https://localhost:7261/Tickets/' + id)
    //             .then(response => {
    //                 setTicket(response.data);
    //                 console.log("Created By: " + response.data.createdBy, response.data.acceptedBy);
    //             })
    //             .catch(error => console.error('Error fetching ticket:', error));
    //     }
    // }, [id, userHasEmployeeRole]); // Include dependencies in the dependency array

    // useEffect(() => {
    //     if (connection) {
    //         connection.on('TicketResolved', () => {
    //             console.log('Ticket resolved');
    //             // Update the local state to reflect the resolution on the client side
    //             setResolved(true);
    //         });
    //     }
    // }, [connection]);

    // useEffect(() => {
    //     const newConnection = new signalR.HubConnectionBuilder()
    //         .withUrl('https://localhost:7261/chat') // Replace with your SignalR backend URL
    //         .withAutomaticReconnect()
    //         .build();

    //     setConnection(newConnection);
    // }, []);

    // useEffect(() => {
    //     if (connection) {
    //         connection
    //             .start()
    //             .then(() => {
    //                 console.log('Connection established');
    //             })
    //             .catch((error) => {
    //                 console.error('Error establishing connection:', error);
    //             });

    //         connection.on('ReceiveMessageTest', (message, user, recipient) => {
    //             setMessages((prevMessages) => [...prevMessages, { message, user, recipient }]);
    //             console.log(message, user, recipient);
    //         });
    //     }
    // }, [connection]);

    const resolveTicket = () => {
        if (connection && user.firstName.trim() !== '') {
            connection.invoke('ResolveTicket', user.firstName);
            setResolved(true);
        }
    };

    const sendMessage = () => {
        if (connection && newMessage.trim() !== '' && user !== '') {
            const recipientId = ticket.createdBy !== null ? ticket.createdBy.toString() : '1';

            connection.invoke('SendMessage', newMessage)
                .then(() => {
                    setNewMessage('');
                })
                .catch(error => console.error("Error sending message:", error));
        }
    };

    useEffect(() => {
        axios.get('https://localhost:7261/Tickets/' + id)
            .then(response => {
                setTicket(response.data);
            })
            .catch(error => console.error('Error fetching ticket:', error));
    }, id);

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
                    // Join the room when the connection is established
                    connection.invoke('JoinRoom', { User: user.firstName, Room: id });
                })
                .catch((error) => {
                    console.error('Error establishing connection:', error);
                });

            connection.on('ReceiveMessage', (message, user) => {
                setMessages((prevMessages) => [...prevMessages, { message, user}]);
            });

            connection.on('UsersInRoom', (users) => {
                console.log('Users in the room:', users);
                // Handle the list of users in the room as needed
            });
        }
    }, [connection, id, user.firstName]);

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
                                message: message.user
                                    ? `${message.user} says ${message.message}`
                                    : message.message,
                                sentTime: "just now",
                                sender: user.firstName,
                                direction: user.firstName === message.user ? "outgoing" : "incoming"
                            }}
                            >
                                <Avatar name={user.firstName} />
                            </Message>
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
                <button onClick={sendMessage} disabled={resolved}>Send</button>
            </div>
            <div>
                {userHasEmployeeRole && (
                    <button onClick={resolveTicket} disabled={resolved}>
                        Resolve
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatComponent;