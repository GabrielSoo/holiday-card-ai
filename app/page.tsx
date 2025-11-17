"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import Dropzone from "@/features/dropzone";
import Image from "next/image";
import StyleSelector from "@/features/style-select";

import { compositeTextOnImage } from "@/lib/image-utils";
import { generateHolidayCard } from "./actions";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  prompt: z.string().min(1, "請輸入提示"),
  background: z.string().min(1, "請選擇背景"),
  style: z.string().min(1, "請選擇藝術風格"),
  text: z.string().min(1, "請輸入封面文字"),
  image: z.string().min(1, "請上載圖片"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [loading, setloading] = useState(false);
  const [finalImage, setFinalImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      background: "",
      style: "吉布利",
      text: "",
      image: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setloading(true);
    setFinalImage("");

    try {
      // Step 1: Generate the AI image
      const formData = new FormData();
      formData.append("prompt", data.prompt);
      formData.append("background", data.background);
      formData.append("style", data.style);
      formData.append("text", data.text);
      formData.append("image", data.image);

      const cardData = await generateHolidayCard(formData);
      const generatedImage = typeof cardData === "string" ? cardData : "";

      if (!generatedImage) {
        throw new Error("No image generated");
      }

      // Step 2: Composite text onto the image
      const compositedImage = await compositeTextOnImage(
        generatedImage,
        data.text
      );
      setFinalImage(compositedImage);
      setloading(false);
    } catch (e) {
      setloading(false);
      alert(`An error occurred: ${e}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="pb-10 mx-auto text-center flex flex-col space-y-6">
        <h1 className=" text-2xl font-bold text-gray-900 sm:text-4xl">
          人工智能聖誕卡
        </h1>

        <div className="flex justify-center mx-auto gap-8">
          <Image src="/shareforgood.svg" alt="Logo" width={60} height={60} />
          <Image src="/manulife.svg" alt="Logo" width={140} height={140} />
        </div>
      </div>

      <section className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              {/* Prompt */}
              <Field>
                <FieldLabel htmlFor="prompt">提示</FieldLabel>
                <Textarea
                  id="prompt"
                  placeholder="例如：一個家庭在聖誕樹周圍慶祝"
                  className="min-h-24"
                  rows={4}
                  {...register("prompt")}
                />
                <FieldError
                  errors={
                    errors.prompt
                      ? [{ message: errors.prompt.message }]
                      : undefined
                  }
                >
                  {errors.prompt?.message}
                </FieldError>
              </Field>

              {/* Background */}
              <Field>
                <FieldLabel htmlFor="background">背景</FieldLabel>
                <Select
                  value={watch("background")}
                  onValueChange={(value) => setValue("background", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選擇背景" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hong-kong">香港</SelectItem>
                    <SelectItem value="london">倫敦</SelectItem>
                    <SelectItem value="village">聖誕村莊</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  errors={
                    errors.background
                      ? [{ message: errors.background.message }]
                      : undefined
                  }
                >
                  {errors.background?.message}
                </FieldError>
              </Field>

              {/* Style */}
              <Field>
                <FieldLabel htmlFor="style">藝術風格</FieldLabel>
                <StyleSelector
                  value={watch("style")}
                  onValueChange={(value) => setValue("style", value)}
                />
                <FieldError
                  errors={
                    errors.style
                      ? [{ message: errors.style.message }]
                      : undefined
                  }
                >
                  {errors.style?.message}
                </FieldError>
              </Field>

              {/* Cover Text */}
              <Field>
                <FieldLabel htmlFor="text">封面文字</FieldLabel>
                <Input
                  id="text"
                  type="text"
                  placeholder="例如：聖誕快樂"
                  {...register("text")}
                />
                <FieldError
                  errors={
                    errors.text ? [{ message: errors.text.message }] : undefined
                  }
                >
                  {errors.text?.message}
                </FieldError>
              </Field>

              {/* Image */}
              <Field>
                <FieldLabel htmlFor="image">圖片</FieldLabel>
                <Dropzone
                  value={watch("image")}
                  onValueChange={(value) => setValue("image", value)}
                />
                <FieldError
                  errors={
                    errors.image
                      ? [{ message: errors.image.message }]
                      : undefined
                  }
                >
                  {errors.image?.message}
                </FieldError>
              </Field>
            </FieldSet>

            {/* Submit Button */}
            <Field orientation="horizontal" className="mt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    生成中...
                  </span>
                ) : (
                  "創造聖誕卡"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>

        {/* Result Display */}
        {finalImage && !loading && (
          <section className="mt-10 border border-gray-200 bg-gray-50 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold">您的聖誕卡:</h2>

              {/* Display the composited image with text */}
              <div className="relative w-full max-w-2xl aspect-[672/1024] rounded-lg overflow-hidden">
                <Image
                  src={finalImage}
                  alt="Generated holiday card with text"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Download button - downloads the composited image */}
              <a
                href={finalImage}
                download="holiday-card.png"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                下載聖誕卡
              </a>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
