import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:4000');

export const App = () => {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('message', message);
        setMessage('');

        const newMessage = {
            body: message,
            from: 'Me'
        }

        setMessages([...messages, newMessage]);
    }

    useEffect(() => {
        const receiveMessage = (message) => {
            setMessages([...messages, message])
        }

        socket.on('message', receiveMessage);
    }, [messages])

    return (
        <div className="App">
            <form onSubmit={ handleSubmit }>
                <p>{">"}</p>
                <input 
                    type="text" 
                    onChange={ e => setMessage(e.target.value) }
                    value={ message }
                    placeholder="Write your message here"
                />
            </form>

            <ul className="messages-container">
                {
                    messages.map((message, index) => (
                       <li key={ index } className={ `${ message.from === 'Me' ? 'my-message' : 'other-message' }` }>
                           {
                            (message.from === 'Me')
                            ? <p>{message.body}</p>
                            : <p><span>{message.from}:</span> {message.body}</p>
                           }
                       </li>
                    ))
                }
            </ul>
        </div>
    )
}
