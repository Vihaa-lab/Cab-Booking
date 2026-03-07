# Cab Booking System – Technical Architecture

## Architecture Diagram

![Architecture Diagram](../images/architecture-diagram.png)

## System Overview

The Cab Booking System is built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
The system follows a layered architecture where the frontend communicates with backend APIs, and the backend interacts with the database.

---

## Client Layer (React.js)

The client layer represents the **frontend interface** where users interact with the system.

Responsibilities:
- User registration and login
- Cab booking interface
- Ride tracking
- Viewing ride history

The frontend sends HTTP requests to the backend APIs.

---

## API Layer (Express.js)

The API layer handles all incoming requests from the frontend.

Example APIs:

POST /api/rides/book  
GET /api/users/:id  
PUT /api/rides/:id  
DELETE /api/rides/:id  

This layer validates requests and passes them to the service layer.

---

## Service Layer

The service layer contains the **business logic** of the application.

Main functions:
- Fare calculation
- Matching drivers with passengers
- Managing ride status
- Handling ride tracking

---

## Data Access Layer (MongoDB)

MongoDB is used as the database to store application data.

Collections include:
- Users
- Drivers
- Rides
- Bookings
- Payments

The backend uses **Mongoose ODM** to interact with MongoDB.

---

## Data Flow

1. User enters pickup and destination in the frontend.
2. React sends a request to the backend API.
3. Backend processes the booking request.
4. Ride information is stored in MongoDB.
5. Driver receives ride request and updates ride status.