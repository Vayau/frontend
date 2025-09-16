import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center gap-6 p-6 md:p-10">
      <div className="fixed inset-0 -z-10 ">
        <img
          src={
            "https://images.unsplash.com/uploads/1413387158190559d80f7/6108b580?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div>
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        ></a>
        <LoginForm />
      </div>
    </div>
  );
}
