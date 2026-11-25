import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "../../../app/hooks";
import { useRegisterMutation } from "../api/authApi";
import { registerSchema, type RegisterForm } from "../schemas/schemas";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { Alert, Card, Container, Form, Button } from "react-bootstrap";
import { getErrorMessage } from "../../../lib/errors";

//field, label, type, autoComplete
const formFields = [
  ["name", "Name", "text", "name"],
  ["email", "Email", "email", "email"],
  ["password", "Password", "password", "new-password"],
  ["confirmPassword", "Confirm password", "password", "new-password"],
] as const;

export function RegisterPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async ({ name, email, password }: RegisterForm) => {
    try {
      await registerUser({ name, email, password }).unwrap();
    } catch {
      // shown through `error` below
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 420 }}>
      <Card body>
        <h1 className="h4 mb-3"> Create account</h1>
        {error && <Alert variant="danger"> {getErrorMessage(error)}</Alert>}
      </Card>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        {formFields.map(([field, label, type, autoComplete]) => (
          <Form.Group className="mb-3" controlId={field} key={field}>
            <Form.Label> {label}</Form.Label>
            <Form.Control
              type={type}
              autoComplete={autoComplete}
              isInvalid={!!errors[field]}
              {...register(field)}
            />
            <Form.Control.Feedback type="invalid">{errors[field]?.message}</Form.Control.Feedback>
          </Form.Group>
        ))}
      </Form>

      <Button type="submit" className="w-100" disabled={isLoading}>
        {isLoading ? "Creating..." : "Register"}
      </Button>

      <p className="mat-3 mb-0 text-center">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </Container>
  );
}
