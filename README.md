# User Account and Transaction Management System

Welcome to the User Account and Transaction Management System project! This project aims to provide backend services for managing user accounts and transactions efficiently.

## Introduction

This project consists of two main backend services:

1. **Account Manager Service**: Responsible for managing user accounts, including registration, login, and management of payment accounts and transaction histories.
   
2. **Payment Manager Service**: Handles transaction-related operations, including sending and withdrawing funds.

## Features

- User registration and login functionality.
- Management of various payment accounts per user (e.g., credit, debit, loan).
- Recording of transaction history for each user account.
- APIs for sending and withdrawing funds.
- APIs to retrieve user account details and transaction histories.
- Dockerized deployment for easy setup and scalability.

## Technology Stack

- **Framework**: Fastify for the API server.
- **Database**: PostgreSQL with Prisma for ORM.
- **Containerization**: Docker for containerization.
- **Authentication**: Supabase.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**: Clone this GitHub repository to your local machine.
   
   ```bash
   git clone https://github.com/RioBagusRinanto/be-assignment
   ```

2. **Install Dependencies**: Navigate to the project directory and install the dependencies using npm.

   ```bash
   cd be-assignment
   npm install
   ```

3. **Set Up Environment Variables**: Create a `.env` file in the root directory of the project and configure environment variables as needed (e.g., database connection details, authentication secrets).

4. **Run the Application**: Start the Fastify server to run the application.

   ```bash
   npm start
   ```

5. **Access the APIs**: Once the server is running, you can access the APIs via the specified endpoints (e.g., `http://localhost:8001/register`).

6. **Sample Collection**: the file `thunder-collection_be-assessment.json` is my collection file for test process.

---

Thank you for considering this project. If you have any questions or need assistance, feel free to reach out!