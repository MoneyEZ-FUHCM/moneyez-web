import { CarouselDemo } from "@/components";
import { LoginForm } from "./components";

const AuthPage = () => {
  return (
    <main className="flex flex-grow bg-[hsl(0,0%,97%)]">
      <section className="container mx-auto grid h-screen flex-grow flex-row place-items-center bg-[hsl(0,0%,97%)]">
        <div className="mx-5 my-2 grid min-h-[400px] w-full max-w-[450px] grid-cols-1 overflow-hidden rounded-[30px] border-none bg-[#fff] transition-all duration-500 sm:min-w-[450px] sm:max-w-[500px] sm:border lg:grid lg:min-h-[650px] lg:max-w-[1024px] lg:grid-cols-2 lg:shadow-2xl">
          <div className="order-2 my-auto items-center overflow-hidden px-7 lg:px-16">
            <LoginForm />
          </div>
          <div className="order-1 hidden rounded-xl transition-all duration-500 lg:block">
            <CarouselDemo />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
