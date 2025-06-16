import React from 'react';

const ErrorReporter = ({ error }) => {
  return <>{error.name} : {error.message}</>;
};

export default ErrorReporter;
