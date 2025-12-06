import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Login = () => {
  return (
    <div className = "grid place-items-center min-h-screen">
      <div className="flex flex-col items-center space-y-4 max-w-md w-full">


      <h1 className = "text-5xl text-center mb-7 text-bold w-full"> 
        Formation Map 
      </h1>

        <div className = "w-full max-w-md border-2 rounded-md space-y-6 w-full p-6">
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input id="username" type="text" placeholder="username" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" placeholder="••••••••" />
                </Field>

              </FieldGroup>
            </FieldSet>

            <Button className = "block w-full">
              Log In
            </Button>

            <a href="/create-account" 
            className="text-sm text-blue-500 hover:underline ">
              Don't have an account? Create one
            </a>
        </div>
      </div>
    </div>
  )
}

export default Login;