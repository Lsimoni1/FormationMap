import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if(password !== confirmPassword) {
      // setError("passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
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
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email" 
                    type="text" 
                    placeholder="email" 
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FieldDescription>                         
                      Passwords must include: 
                      <ul className = "list-disc list-inside pl-4">
                        <li> 8 or more characters </li>
                        <li> a special character </li>    
                        <li> 1 or more uppercase letter </li>
                      </ul>
                    </FieldDescription> 
                  <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password" 
                    type="password" 
                    placeholder="••••••••" />
                </Field>

                <Field>
                  <FieldDescription> Confirm Password </FieldDescription>
                  <Input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" />
                </Field>

              </FieldGroup>
            </FieldSet>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {confirmPassword && password !== confirmPassword && <p className="text-orange-500 text-sm">Passwords do not match</p>}

            <Button type="submit" className = "block w-full" disabled={loading}>
              Create Account
            </Button>

            <Link to="/login"
              className="text-sm text-blue-500 hover:underline ">
              Already have an account? Log in 
            </Link>
        </form>

        <Label>
           <Checkbox/> Checking this box allows Formation Map to send you promotional emails and messages.
        </Label>
      </div>
    </div>
  )
}

export default Register;