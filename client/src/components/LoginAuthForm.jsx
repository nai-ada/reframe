import React from "react";
import { Form, Input, Button } from "@heroui/react";

export default function LoginAuthForm() {
  const [action, setAction] = React.useState(null);

  return (
    <>
      <Form
        className="w-full max-w-xs flex flex-col gap-8 px-7 mt-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          let data = Object.fromEntries(new FormData(e.currentTarget));

          setAction(`submit ${JSON.stringify(data)}`);
        }}
      >
        <Input
          // className="border-2 border-[#A7CFB8] rounded-lg"
          required
          errorMessage="Please enter a valid username"
          label={
            <div className="font-figtree text-[1.125rem] mb-1">
              Enter Your Username
            </div>
          }
          labelPlacement="outside"
          name="username"
          placeholder="Username"
          type="text"
        />

        <Input
          // className="border-2 border-[#A7CFB8] rounded-lg"
          required
          errorMessage="Please enter a valid password"
          label={
            <div className="font-figtree text-[1.125rem]">
              Enter Your Password
            </div>
          }
          labelPlacement="outside"
          name="password"
          placeholder="Password"
          type="password"
        />

        <div className="flex gap-2">
          <Button
            className="bg-[#A7CFB8] font-figtree p-6 text-[16px]"
            type="submit"
          >
            Login
          </Button>
        </div>
        {/* {action && (
        <div className="text-small text-default-500">
          Action: <code>{action}</code>
        </div>
      )} */}
      </Form>
    </>
  );
}
