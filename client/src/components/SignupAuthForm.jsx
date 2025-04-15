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
          const { name, email, password } = data;

          const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: name },
            },
          });

          if (error) {
            if (
              error.message.includes("already registered") ||
              error.message.includes("already exists")
            ) {
              setError(
                "This email is already registered. Please log in instead."
              );
            } else {
              setError(error.message);
            }
          } else if (authData?.user?.identities?.length === 0) {
            setError(
              "This email is already registered. Please log in instead."
            );
          } else {
            navigate("/accountsuccess");
          }

          setIsLoading(false);
        }}
      >
        <Input
          required
          errorMessage="Please enter a valid name"
          label={
            <div className="font-figtree text-[14px] mb-1">
              What should we call you?
            </div>
          }
          labelPlacement="outside"
          name="name"
          placeholder="Enter Your Name (Max 12)"
          type="text"
          maxLength={12}
        />

        <Input
          required
          errorMessage="Please enter a valid email"
          label={
            <div className="font-figtree text-[14px] mb-1">Enter Email</div>
          }
          labelPlacement="outside"
          name="email"
          placeholder="Email"
          type="email"
        />

        <Input
          required
          errorMessage="Please enter a valid password"
          label={
            <div className="font-figtree text-[14px]">Create Password</div>
          }
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
            {loading ? "Signing Up..." : "Sign Up"}
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
