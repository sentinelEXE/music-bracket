// src/components/App.tsx
import React from 'react';

export const StartPage: React.FC = () => (
    <div>
        <h1>Welcome to the App</h1>
        <p>Your access token is: {localStorage.getItem('access_token')}</p>
    </div>
);