# Access Control & Permission Management System  

## Project Overview

The project demonstrates a **correct, maintainable, and backend-enforced authorization system** with role-based access control, permission scopes, time-based access, and admin-only audit logs.

## Tech Stack

### Frontend
- React
- CSS

### Backend
- Python
- Django
- JWT (Token-based Authentication)

### Database
- Sqlite

## Core Concepts

### Authentication
- Token-based authentication using JWT
- Login required to access the application
- Protected routes on frontend and backend
- Sessions persist using local storage

### Authorization (Backend-Enforced)
- Permissions define allowed actions
- Roles are collections of permissions
- Users can have multiple roles
- All access decisions are enforced by the backend
- Frontend only reflects access state

### Permission Scope
Each permission applies at one of the following levels:
- **Self** – User can act only on their own data
- **Team** – User can act on data within their team
- **Global** – User can act on all data

### Time-Based Access
- Roles or permissions may start in the future
- Permissions may expire automatically
- Permissions can be revoked at any time
- All changes take effect immediately

### Audit Logs
- All access-related admin actions are logged
- Logs are immutable
- Only admins can view audit logs

## System Roles

### Admin
- Create and manage users
- Create roles and assign permissions
- Assign roles to users
- Assign users to teams
- View audit logs
- Admins do not bypass access rules

### User
- Log in and access allowed features
- Blocked from unauthorized actions
- Receive clear feedback on access denial
- Cannot manage access rules


##  Getting Started After Cloning the Repository

Follow these steps to set up and run the project locally after cloning.

### 1️) Clone the Repository

git clone <your-github-repo-url>
cd <project-root>

### 2️) Backend Setup (Django)

Navigate to the backend folder:

cd djangonew

### 3)Create and Activate Virtual Environment

python -m venv venv
venv\Scripts\activate

### 4) Install Required Python Packages
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install djangorestframework-simplejwt

### 5)Apply Migrations and Create Superuser
python manage.py migrate
python manage.py createsuperuser
(if using current database,id:admin  password:admin)

### 6)Run Django Development Server
python manage.py runserver

### 7) Frontend Setup (React)

Open a new terminal, then navigate to the frontend folder:
cd reactnew

### 8) Run React Development Server
npm start

Frontend runs at:
http://localhost:3000

### 9)Running the Application

Both servers must be running at the same time
(in 2 terminals)

### 10)Admin Access

All functionalities are available for admin(not all integrated to frontend)
