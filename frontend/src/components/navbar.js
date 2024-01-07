import React from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

function Navigationbar() {
  return (
    <Nav fill variant="tabs">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/" activeClassName="active">
          Chart
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/Cameras" activeClassName="active">
          Cameras
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navigationbar;
