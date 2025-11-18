# Community Clean Server 🌱

A backend server built for the *Community Cleanliness Portal* — enabling users to report, track, and manage local environmental issues through a REST API.

---

## 🚀 Project Overview

- **Purpose:** Provide a scalable, secure, and easy-to-use API for the Community Cleanliness Portal.  
- **Why this project exists:** To help community members report cleanliness issues (trash, illegal dumping, etc.), track them, and allow authorized users to manage the status of these reports.  
- **Who it's for:** Local governments, community organizations, or citizen‑volunteers who want to maintain cleaner neighborhoods.

---

## 🧱 Tech Stack

- **Platform:** Node.js  
- **Framework:** Express  
- **Database:** MongoDB  
- **Authentication:** JSON Web Tokens (JWT)  
- **Environment Configuration:** `dotenv`  
- **Logging:** (optional) [e.g. `winston`]  
- **API Documentation:** (optional) Swagger / OpenAPI  

---

## 📦 Features

- Create, read, update, and delete (CRUD) report entries  
- User registration and authentication  
- Role-based access (e.g., regular user vs admin)  
- Status tracking for reports (pending, in‑progress, resolved)  
- Timestamped reporting  
- Validation for user inputs  

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14+ recommended)  
- npm or yarn  
- MongoDB (local or remote)  
- A `.env` file with environment variables (see below)

### Installation

1. **Clone the repository**  

   git clone https://github.com/rafiabubbles/Community-Clean-Server.git  
   cd Community-Clean-Server  
2.Install dependencies

npm install  
# or  
yarn install 

3 onfigure environment variables
Create a .env file in the project root and add variables such as:

PORT=5000  
MONGODB_URI=your_mongo_connection_string  
JWT_SECRET=your_jwt_secret 

4.Run the server

npm start  
# or, for development  
npm run dev  
