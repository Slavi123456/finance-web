import { Link, Navigate, useLocation } from "react-router-dom";
import { Container, Card, Alert, Form, Button } from "react-bootstrap";
import { useAppSelector } from "../../../app/hooks";
import { useLoginMutation } from "../api/authApi";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginForm } from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "../../../lib/errors";

export function LoginPage() {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  //Redirect once the session exist. Its Declarative for no race
  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values).unwrap();
    } catch {
      //shown bellow
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 420 }}>
      <Card body>
        <h1 className="h4 mb-3"> Log in</h1>
        {error && <Alert variant="danger">{getErrorMessage(error)}</Alert>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label> Email </Form.Label>
            <Form.Control
              type="email"
              autoComplete="email"
              isInvalid={!!errors.email}
              {...register("email")}
            />
            <Form.Control.Feedback type="invalid"> {errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label> Password </Form.Label>
            <Form.Control
              type="password"
              autoComplete="current-password"
              isInvalid={!!errors.password}
              {...register("password")}
            />
            <Form.Control.Feedback type="invalid">
              {" "}
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>

        <Button type="submit" className="w-100" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>

        <p className="mt-3 mb-0 text-center">
          No account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </Container>
  );
}
