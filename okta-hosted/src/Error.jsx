import React from 'react';

const Error = ({ error }) => {
  return <>{error.name} : {error.message}</>;
};

export default Error;
