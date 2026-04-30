import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import logo from '../assets/CheckPointLogo.png'
const SiteNavbar: React.FC = () => {
    return (
        <Navbar className="sticky-top mb-3" bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to="/">
                    <img
                        src={logo}
                        height={65}
                        className="d-inline-block align-top"
                    />

                </Navbar.Brand>
                <Navbar.Toggle aria-controls="site-navbar" />
                <Navbar.Collapse id="site-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to='/games' end>Games</Nav.Link>
                        <Nav.Link as={NavLink} to="/library">Library</Nav.Link>
                        <Nav.Link as={NavLink} to='/stats'>Statistics</Nav.Link>
                        <Nav.Link as={NavLink} to="/play-next">Play Next</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default SiteNavbar