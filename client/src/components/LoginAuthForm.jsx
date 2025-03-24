import React from "react";
import { Form, Input, Button } from "@heroui/react";

export default function LoginAuthForm() {
  const [action, setAction] = React.useState(null);

  return (
    <>
      <Form
        className="w-full max-w-xs flex flex-col gap-5 px-7 mt-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          let data = Object.fromEntries(new FormData(e.currentTarget));

          setAction(`submit ${JSON.stringify(data)}`);
        }}
      >
        <Input
          required
          errorMessage="Please enter a valid username"
          label={
            <div className="font-figtree text-[14px] mb-1">Enter Username</div>
          }
          labelPlacement="outside"
          name="username"
          placeholder="Username"
          type="text"
        />

        <Input
          required
          errorMessage="Please enter a valid password"
          label={<div className="font-figtree text-[14px]">Enter Password</div>}
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
          >
            Login
          </Button>
        </div>
      </Form>
    </>
  );
}
