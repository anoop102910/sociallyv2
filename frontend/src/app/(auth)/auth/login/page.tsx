import LoginForm from "@/components/forms/login-form";
import Image from "next/image";

function page() {
  return (
    <div className="mx-auto font-urbanist text-black relative min-h-screen w-full flex justify-center items-center">
      <Image
        priority
        width={1920}
        height={1080}
        src="/signin.webp"
        className="max-sm:hidden absolute inset w-full h-screen object-cover filter brightness-50 -z-[1000] opacity-80 bg-blend-darken object-center"
        alt="Background"
      />
      <div className="md:w-[1000px] md:max-h-[85vh] md:mt-10 rounded-xl md:flex md:bg-white md:overflow-hidden">
        <LoginForm />
        <div className="bg-dark-100/75 -z-10 w-full h-screen absolute top-0 left-0 md:hidden"></div>
        <Image
          priority
          width={1920}
          height={1080}
          src="/signin.webp"
          className="w-full md:z-10 h-screen object-cover object-center opacity-7 -z-20 absolute top-0 left-0 md:static md:w-1/2 md:h-full"
          alt="Background"
        />
      </div>
    </div>
  );
}

export default page;
