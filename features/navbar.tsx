import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 md:px-12 [&_*]:no-underline">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-8">
              <Image
                src="/shareforgood.svg"
                alt="Logo"
                width={60}
                height={60}
              />
              <Image src="/manulife.svg" alt="Logo" width={140} height={140} />
            </div>
            <span className="font-bold text-xl">AI 聖誕卡</span>
          </div>
        </div>
      </div>
    </header>
  );
};
