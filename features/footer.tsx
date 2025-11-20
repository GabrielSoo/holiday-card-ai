import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bottom-0 border-t py-8">
      <div className="container mx-auto grid place-items-center px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-12">
          <span className="font-medium">Powered by</span>
          <Image src="/shareforgood.svg" alt="Logo" width={60} height={60} />
          <Image src="/manulife.svg" alt="Logo" width={140} height={140} />
        </div>
      </div>
    </footer>
  );
}
