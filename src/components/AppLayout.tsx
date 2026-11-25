import { Button, Container, Nav, Navbar, NavLink } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { useLogout } from "../features/auth/hooks/useLogout";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const logout = useLogout();

  return (
    <>
      <Navbar bg="light" expand="sm" className="mb-4 border-bottom">
        <Container>
          <Navbar.Brand> Finance </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/dashboard">
                {" "}
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/purchases">
                {" "}
                Purchases
              </Nav.Link>
            </Nav>
            <span className="me-3 text-muted">{user?.name}</span>
            <Button variant="outline-secondary" size="sm" onClick={() => void logout()}>
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Outlet />
      </Container>
    </>
  );
}
