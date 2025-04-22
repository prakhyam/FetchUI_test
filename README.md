# 🐶 Fetch Dog Adoption Platform

A web application that helps users search through a database of shelter dogs to find their perfect companion for adoption.

Deployed URL: [https://fetch-ui-test.vercel.app]

# Public Repository

Repository URL: https://github.com/prakhyam/FetchUI_test.git

---

# Table of Contents

- Overview
- Features
- Technologies Used
- API Integration
- Getting Started
  - Prerequisites
  - Installation
  - Running Locally
- Project Structure
- License

## Overview

The Fetch Dog Adoption Platform is a React-based application that allows users to search, filter, and find shelter dogs available for adoption. Users can browse through available dogs, filter them by breed, sort them alphabetically, and add their favorites to a list before generating a match from their selected favorites.

## Features

- User Authentication: Simple login with name and email
- Search Functionality: Browse available dogs with pagination
- Filtering: Filter dogs by breed
- Sorting: Sort results alphabetically by breed (ascending or descending)
- Favorites: Add dogs to a favorites list
- Matching: Generate a match based on favorited dogs
- Responsive Design: Works on both desktop and mobile devices

## Technologies Used

- React: Frontend library for building the user interface
- React Router: For navigation between pages
- Context API: For state management (authentication and app state)
- Material UI: Component library for consistent UI design
- Axios: For API requests
- CSS: Custom styling
- Environment Variables: For configuration

## API Integration

The application integrates with the Fetch API service (https://frontend-take-home-service.fetch.com) which provides endpoints for:

    - Authentication: Login/logout functionality with secure cookies
    - Dog Data: Searching, filtering, and fetching dog information
    - Breed Data: Retrieving available dog breeds
    - Location Data: Getting location information for zip codes
    - Matching: Generating a match from favorited dogs

The integration is handled through a dedicated fetchAPI.js file which:

    - Creates an Axios instance with proper configurations for cookies and error handling
    - Implements interceptors for request/response logging and error handling
    - Provides functions for all API operations required by the application
    - Handles session expiration by redirecting to the login page when necessary

## Getting Started

# Prerequisites

    - Node.js (v14 or later)
    - npm or yarn package manager

# Installation

1. Clone the repository:

git clone [git@github.com:prakhyam/FetchUI_test.git](https://github.com/prakhyam/FetchUI_test.git)
cd fetch-dog-adoption

2. Install dependencies:

npm install

# or

yarn install

3. Create a .env file in the root directory with the following content:

REACT_APP_API_URL=https://frontend-take-home-service.fetch.com

## Running Locally

1. Start the development server:

   npm start

   # or

   yarn start

2. Open your browser and navigate to http://localhost:3000

# Project Structure

fetch/
├── config/ # Configuration files
├── node_modules/ # Dependencies
├── public/ # Static files
├── src/ # Source code
│ ├── api/
│ │ └── fetchAPI.js # API service functions
│ ├── components/ # Reusable components
│ │ ├── DogCard.js # Individual dog display
│ │ ├── DogList.js # List of dogs
│ │ ├── FilterPanel.js # Filtering options
│ │ ├── LocationFilter.js # Location filtering
│ │ ├── LoginForm.js # Authentication form
│ │ ├── MatchResult.js # Display match results
│ │ ├── Pagination.js # Navigation between pages
│ │ └── SortSelector.js # Sorting options
│ ├── context/
│ │ └── AuthContext.js # Authentication state
│ ├── pages/
│ │ ├── LoginPage.js # Login screen
│ │ ├── MatchPage.js # Match results page
│ │ └── SearchPage.js # Main search interface
│ ├── App.js # Main application component
│ ├── index.js # Entry point
│ └── styles.css # Global styles
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── package-lock.json # Dependency lock file
├── package.json # Project metadata and dependencies
├── Procfile # Deployment configuration
├── README.md # Project documentation
├── REQUIREMENTS.md # Project requirements
└── static.json # Static file configuration

# Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

# License

This project is licensed under the MIT License - see the LICENSE file for details.
