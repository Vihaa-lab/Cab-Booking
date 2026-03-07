# MVC Pattern – Cab Booking System

The Cab Booking System follows the **MVC (Model–View–Controller)** architecture pattern.  
This pattern separates the application into three main components to make development organized and scalable.

---

## Model

The **Model** represents the data layer of the application.

It defines the database structure and handles interactions with the database.

Example Models:
- User Model
- Driver Model
- Ride Model
- Booking Model
- Payment Model

These models are stored in MongoDB using **Mongoose schemas**.

---

## View

The **View** represents the frontend interface that users interact with.

In this project, the view layer is developed using **React.js**.

Example Pages:
- Login Page
- Registration Page
- Cab Booking Page
- Ride Tracking Page
- Payment Page
- Booking History Page

The view sends requests to the backend APIs to fetch or update data.

---

## Controller

The **Controller** acts as the middle layer between the Model and the View.

It processes user requests, applies business logic, and returns responses.

Example Controllers:
- User Controller
- Driver Controller
- Ride Controller
- Booking Controller
- Payment Controller

Controllers communicate with models to store or retrieve data from the database.

---

## MVC Workflow

1. User interacts with the **View (React Frontend)**.
2. The request is sent to the **Controller (Node.js / Express API)**.
3. The controller interacts with the **Model (MongoDB Database)**.
4. The database returns the requested data.
5. The controller sends the response back to the frontend.