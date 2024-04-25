import React from 'react';
import axios from 'axios';

const Line = ({ onClose, schedule, departureDate, departureTime, arrivalDate, arrivalTime, totalPrice }) => {
    // Function to handle reservation
    const handleReservation = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const userId = localStorage.getItem('userId'); // Retrieve the token from local storage

        if (!token) {

            // If token is not found, handle unauthorized access (e.g., redirect to login page)
            console.error('User is not authenticated.');
            // Handle unauthorized access here, such as showing a message to the user or redirecting to the login page
            return;
        }

        try {
            // Make a POST request to create a ticket, passing the token as a bearer token in the Authorization header
            const response = await axios.post(
                'https://localhost:7264/Ticket',
                {
                    busScheduleId: schedule.id,
                    userId: userId,
                    dateOfBooking: new Date()
                },
                {
                    headers: {
                        Authorization: Bearer ${ token }
                    }
                }
            );
console.log('Ticket created:', response.data);
onClose(); // Close the modal after successful reservation
        } catch (error) {
    console.error('Error creating ticket:', error.response.data);
}
    };

return (
    <div>
        <div>
            <div className="modal-content">
                <h1>Detajet e linjes</h1>

                <div>
                    <p>Nisja</p>
                    <p>{schedule.startCityName}</p>
                </div>
                <div>
                    <p>Destinacioni</p>
                    <p>{schedule.destinationCityName}</p>
                </div>
                <div>
                    <p>Operatori</p>
                    <p>{schedule.operatorName}</p>
                    <br />
                    <p>Data</p>
                    <p>{departureDate}</p>
                </div>
                <div>
                    <p>Ndalesat:</p>
                    <p>
                        <span>{departureTime}</span> -
                        <span> {schedule.startCityName}</span>
                    </p>
                    {schedule.stationNames.map((station, idx) => (
                        <p key={idx}>&#x25C8; {station} <br></br><span>&#x250B;</span></p>
                    ))}
                    <p>
                        <span>{departureTime}</span> -
                        <span> {schedule.destinationCityName}</span>
                    </p>
                </div>

                <div>
                    <p>
                        <span>Cmimi:</span> -
                        <span> {totalPrice} &#8364;</span>
                    </p>
                </div>

                {/* Reserve and Close buttons */}
                <button onClick={handleReservation}>Rezervo</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
);

};

export default Line;