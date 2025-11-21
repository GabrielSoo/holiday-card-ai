"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import Image from "next/image";

const artStyles = [
  {
    value: "watercolor",
    image: "/styles/ghibli.webp",
    overlay: 0.3,
  },
  {
    value: "realistic",
    image: "/styles/realistic.webp",
    overlay: 0.4,
  },
  {
    value: "papercraft",
    image: "/styles/paper-craft.webp",
    overlay: 0.5,
  },
];

const styleMapEnglishToChinese: Record<string, string> = {
  watercolor: "吉布利",
  realistic: "寫實",
  papercraft: "紙藝",
};

interface StyleSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function StyleSelector({
  value,
  onValueChange,
}: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <RadioGroup
        value={value || artStyles[0].value}
        onValueChange={onValueChange}
        className="grid grid-cols-3 gap-4"
      >
        {artStyles.map((style) => (
          <div key={style.value}>
            <RadioGroupItem
              value={style.value}
              id={style.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={style.value}
              className={cn(
                "relative flex flex-col border rounded-lg aspect-[3/4] cursor-pointer transition-all overflow-hidden",
                "peer-data-[state=checked]:ring-4 peer-data-[state=checked]:ring-blue-500 peer-data-[state=checked]:border-none"
              )}
            >
              <Image
                src={style.image}
                alt={style.value}
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: style.overlay }}
              />
              <span className="absolute bottom-3 left-3 text-lg md:text-xl lg:text-2xl font-bold text-white z-10">
                {styleMapEnglishToChinese[style.value]}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
