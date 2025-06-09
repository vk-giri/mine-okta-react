import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();

  const loginHandler = async () => {
    navigate('/login');
  };

  return (
    <>
      <h1>Embedded Widget</h1>
      <Button variant='primary' onClick={loginHandler}>
        Primary
      </Button>
    </>
  );
};

export default Home;
