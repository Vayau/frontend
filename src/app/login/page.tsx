import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center gap-6 p-6 md:p-10">
      <div className="fixed inset-0 -z-10 ">
        <Image
          src="/login.jpg"
          width={1000}
          height={1000}
          alt="image"
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
