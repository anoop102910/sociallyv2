# Socially

Socially is a social media platform that allows users to create posts, interact with posts through likes and comments, and manage their profiles. It uses NestJS for the backend and PostgreSQL for the database, with a frontend built using Next.js and Shadcn Formik for form handling.

## Tech Stack

- **Backend**: NestJS, PostgreSQL
- **Frontend**: Next.js, Shadcn Formik

## Features

- **User Authentication**: Sign up, login, and manage user roles (user/admin).
- **Post Management**: Create, view, update, and delete posts.
- **Post Interaction**: Like and unlike posts.
- **Comment Management**: Add, view, update, and delete comments on posts.
- **Comment Interaction**: Like and unlike comments.
- **User Connections**: Manage connections between users (e.g., following).

## Installation

### Backend

1. Clone the repository
2. Install dependencies using `npm install` or `yarn install`
3. Set up your PostgreSQL database
4. Update your `.env` file with your database credentials
5. Generate the database migration using `npm run generate` (using Drizzle ORM)
6. Run the database migration using `npm run migrate`
7. Start the server using `npm start:dev(Dev Mode)`
8. Build the Nest.js application using `npm run build`

### Frontend

1. Clone the repository
2. Install dependencies using `npm install` or `yarn install`
3. Build the Next.js application using `npm run build` or `yarn build`
4. Start the development server using `npm run dev` or `yarn dev`

## API Endpoints

### Authentication

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /auth/register | Sign up a new user |
| POST   | /auth/login    | Login a user       |

### Posts

| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| POST   | /posts     | Create a new post      |
| GET    | /my-feed   | Get your post feed     |
| GET    | /my-posts  | Get your all psots     |
| PUT    | /posts/:id | Update a specific post |
| DELETE | /posts/:id | Delete a specific post |

### Users

| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| GET    | /users     | Get all users          |
| GET    | /users/:id | Get a specific user    |
| PUT    | /users/:id | Update a specific user |
| DELETE | /users/:id | Delete a specific user |

### Like

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | /post/:postId/like   | Like a post   |
| POST   | /post/:postId/unlike | Unlike a post |

### Comments

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | /post/:postId/comments | Get all comments          |
| PUT    | /comments/:id          | Update a specific comment |
| DELETE | /comments/:id          | Delete a specific comment |
| POST   | /comments/:id/like     | Like a specific comment   |
| POST   | /comments/:id/unlike   | Unlike a specific comment |

### Connection

| Method | Endpoint               | Description   |
| ------ | ---------------------- | ------------- |
| POST   | /user/:userId:follow   | Follow user   |
| POST   | /user/:userId:unfollow | Unfollow user |

# Database Schema

## Users

| Column    | Type      |
| --------- | --------- |
| id        | serial    |
| name      | text      |
| email     | text      |
| password  | text      |
| role      | enum      |
| createdAt | timestamp |
| updatedAt | timestamp |

## Posts

| Column    | Type      |
| --------- | --------- |
| id        | serial    |
| authorId  | integer   |
| content   | text      |
| mediaUrl  | text      |
| createdAt | timestamp |
| updatedAt | timestamp |

## Likes

| Column    | Type      |
| --------- | --------- |
| userId    | integer   |
| postId    | integer   |
| createdAt | timestamp |
| updatedAt | timestamp |

## Comments

| Column    | Type      |
| --------- | --------- |
| id        | serial    |
| authorId  | integer   |
| postId    | integer   |
| content   | text      |
| createdAt | timestamp |
| updatedAt | timestamp |

## Connections

| Column       | Type      |
| ------------ | --------- |
| id           | serial    |
| userId       | integer   |
| connectionId | integer   |
| createdAt    | timestamp |
| updatedAt    | timestamp |
