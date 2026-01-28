import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className = "grid place-items-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 max-w-md w-full">


      <h1 className = "text-5xl text-center mb-7 text-bold w-full"> 
        Formation Map 
      </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md border-2 rounded-md space-y-6 w-full p-6">
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                  />
                </Field>

              </FieldGroup>
            </FieldSet>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="block w-full" disabled={loading}>
              Log In
            </Button>

            <Link to="/register"
            className="text-sm text-blue-500 hover:underline ">
              Don't have an account? Create one
            </Link>
        </form>
      </div>
    </div>
  )
}

export default Login;