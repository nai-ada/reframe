import React from "react";
import { Form, Input, Button } from "@heroui/react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SignUpAuthForm() {
  const [loading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const navigate = useNavigate();

  return (
    <>
      <Form
        className="w-full max-w-xs flex flex-col gap-5 px-7 mt-4 justify-center"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          setError(null);
          setSuccess(null);

          let data = Object.fromEntries(new FormData(e.currentTarget));
          const { email, password } = data;

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setError(error.message);
          } else {
            navigate("/dashboard");
          }
          setIsLoading(false);
        }}
      >
        <Input
          required
          errorMessage="Please enter a valid email"
          label={<div className="font-figtree text-[14px] mb-1">Email</div>}
          labelPlacement="outside"
          name="email"
          placeholder="Email"
          type="email"
        />

        <Input
          required
          errorMessage="Please enter a valid password"
          label={<div className="font-figtree text-[14px]">Password</div>}
          labelPlacement="outside"
          name="password"
          placeholder="Password"
          type="password"
        />

        <div className="flex gap-2">
          <Button
            className="bg-[#bae0b6] text-[#3a3a3a] font-medium shadow-lg mb-8"
            radius="xl"
            variant="solid"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </div>
      </Form>
      {error && (
        <div className="text-red-500 justify-center text-center">{error}</div>
      )}
      {success && { success }}
    </>
  );
}
