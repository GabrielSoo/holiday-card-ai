import Image from "next/image";

// Simple logo component for the navbar
const Logo = () => {
  return <Image src="/shareforgood.svg" alt="Logo" width={60} height={60} />;
};

export const Navbar = () => {
  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 md:px-12 [&_*]:no-underline">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <div className="text-2xl">
              <Logo />
            </div>
            <span className="font-bold text-xl">AI 聖誕卡</span>
          </div>
        </div>
      </div>
    </header>
  );
};
