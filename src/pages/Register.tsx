import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Register = () => {
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
                  <FieldDescription> Enter a username below. </FieldDescription>
                  <Input id="username" type="text" placeholder="username" />
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
                  <Input id="password" type="password" placeholder="••••••••" />
                </Field>

                <Field>
                  <FieldDescription> Confirm Password </FieldDescription>
                  <Input id="password" type="password" placeholder="••••••••" />
                </Field>

              </FieldGroup>
            </FieldSet>

            <Button className = "block w-full">
              Create Account
            </Button>
        </div>

        <Label>
           <Checkbox/> Checking this box allows Formation Map to send you promotional emails and messages.
        </Label>
      </div>
    </div>
  )
}

export default Register;