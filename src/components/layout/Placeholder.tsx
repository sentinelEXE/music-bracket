// src/components/Placeholder.tsx
import React from 'react';

interface PlaceholderProps {
  loading: boolean;
  error: any;
  children: React.ReactNode;
}

const Placeholder: React.FC<PlaceholderProps> = ({ loading, error, children }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children}</>;
};

export default Placeholder;