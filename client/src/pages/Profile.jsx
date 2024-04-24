import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);

    localStorage.setItem('userId', '1');
    console.log(localStorage);

    const cancelTicket = async (ticketId) => {
        try {
            
            await axios.delete(`https://localhost:7264/Ticket/${ticketId}`);
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        } catch (error) {
            console.error('Error canceling the ticket:', error);
        }
    };
    
    useEffect(() => {
    
    const userId = localStorage.getItem('userId');

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`https://localhost:7264/User/${userId}`);
        setUser(userResponse.data);

        const ticketResponse = await axios.get(`https://localhost:7264/Ticket?userId=${userId}`);
        setTickets(ticketResponse.data);

      } catch (error) {
        console.error('Error fetching user or ticket data:', error);

      }
    };

    if (userId) {
      fetchUserData();
    }
  }, []);

  const clearStorage = () => {
    localStorage.clear();
  }

  return (
    <div>
        <NavBar isLoggedIn={true} />
        <div>
            

            {user ? (
                <div>
                    <div>
                    <h1>Welcome, {user.firstName} {user.lastName}</h1>
                    <p>{user.email}</p>
                    <button onClick={()=>clearStorage()}>Logout</button>
                    </div>

                    {tickets ? (
                        <div>
                            {tickets.map((ticket) => (

                                <div>
                                    <h1>Your Tickets:</h1>
                                    <div>
                                        <div>
                                            <h3>
                                                Prishtina 
                                            </h3>
                                            <div>
                                                <h3>{ticket.departure.slice(0, 9)} at {ticket.departure.slice(11, 16)}</h3>
                                            </div>
                                        </div>
                                        <div>
                                            <h3>
                                                Shkup 
                                            </h3>
                                            <div>
                                                <h3>{ticket.arrival.slice(0, 9)} at {ticket.arrival.slice(11, 16)}</h3>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <p> Ulesja Numer: {ticket.seat}</p>
                                                <p>{ticket.operatorName}</p>
                                            </div>
                                            <button onClick={() => cancelTicket(ticket.id)} >
                                                Anulo
                                            </button>
                                        </div>
                                    </div>
                                </div>                                                          
                            ))}
                        </div>
                        ): (
                        <h3>You dont have any booked tickets</h3>
                    )}

                </div>
            ) : (
                <div>
                    <p>Loading...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Profile;
