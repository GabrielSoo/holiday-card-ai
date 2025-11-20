"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ImageOff, Download, RotateCw } from "lucide-react";

import Dropzone from "@/features/dropzone";
import Image from "next/image";
import Footer from "@/features/footer";
import { Navbar } from "@/features/navbar";
import StyleSelector from "@/features/style-select";

import { compositeTextOnImage } from "@/lib/image-utils";
import { generateHolidayCard } from "./actions";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  background: z.string().min(1, "請選擇背景"),
  style: z.string().min(1, "請選擇藝術風格"),
  text: z.string().min(1, "請輸入封面文字"),
  image: z.string().min(1, "請上載圖片"),
});

type FormValues = z.infer<typeof formSchema>;

interface Creation {
  id: string;
  image: string;
  text: string;
  background: string;
  style: string;
  timestamp: Date;
}

export default function Home() {
  const [loading, setloading] = useState(false);
  const [finalImage, setFinalImage] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [previousCreations, setPreviousCreations] = useState<Creation[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      formData.append("background", data.background);
      formData.append("style", data.style);
      formData.append("text", data.text);
      formData.append("image", data.image);

      const cardData = await generateHolidayCard(formData);
      const generatedImage =
        typeof cardData === "object" && cardData.image ? cardData.image : "";
      const fullPrompt =
        typeof cardData === "object" && cardData.prompt ? cardData.prompt : "";

      if (!generatedImage) {
        throw new Error("No image generated");
      }

      // Save the full prompt
      setCurrentPrompt(fullPrompt);

      // Step 2: Composite text onto the image
      const compositedImage = await compositeTextOnImage(
        generatedImage,
        data.text
      );
      setFinalImage(compositedImage);

      // Step 3: Add to previous creations
      const newCreation: Creation = {
        id: Date.now().toString(),
        image: compositedImage,
        text: data.text,
        background: data.background,
        style: data.style,
        timestamp: new Date(),
      };
      setPreviousCreations((prev) => [newCreation, ...prev]);

      setloading(false);
    } catch (e) {
      setloading(false);
      alert(`An error occurred: ${e}`);
    }
  };

  const handleGenerateAgain = handleSubmit(onSubmit);

  return (
    <>
      <Navbar />
      <main className="flex flex-col md:flex-row min-h-[calc(100vh-10rem)] container mx-auto py-8 px-6 md:px-12 max-w-screen-2xl gap-8">
        {/* Left Section */}
        <section className="md:w-[40%] lg:w-[35%] flex flex-col space-y-8">
          <h1 className=" text-2xl font-bold text-gray-900 md:text-3xl">
            製作你嘅完美聖誕卡
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
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
                      errors.text
                        ? [{ message: errors.text.message }]
                        : undefined
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
        </section>

        {/* Right Section */}
        <section className="flex-1 md:w-[60%] lg:w-[65%] space-y-6">
          {/* Empty State */}
          {!finalImage && !loading && (
            <Empty className="border border-dashed bg-muted/30 w-full mx-auto h-[60vh] flex items-center justify-center">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImageOff className="size-8" />
                </EmptyMedia>
                <EmptyTitle>No Creations Yet</EmptyTitle>
                <EmptyDescription>
                  You haven't created any holiday cards yet. Create your first
                  holiday card to get started.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {/* Loading State */}
          {loading && (
            <Empty className="border border-dashed bg-muted/30 w-full mx-auto h-[60vh] flex items-center justify-center">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner className="size-12" />
                </EmptyMedia>
                <EmptyTitle>生成中...</EmptyTitle>
                <EmptyDescription>
                  正在使用 AI 創造您的聖誕卡，請稍候
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {/* Result Display */}
          {finalImage && (
            <>
              <div className="w-full mx-auto h-[60vh]">
                <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 h-full flex">
                  {/* Display the composited image with text */}
                  <div className="relative w-full flex-1 min-h-0 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={finalImage}
                        alt="Generated holiday card with text"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt */}
              {currentPrompt && (
                <div className="border border-gray-200 bg-gray-50 rounded-xl p-6">
                  <p className="font-semibold mb-1">Prompt:</p>
                  <p className="whitespace-pre-wrap">{currentPrompt}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 w-full shrink-0">
                <Button asChild size="lg" className="flex-1">
                  <a href={finalImage} download="holiday-card.png">
                    <Download className="mr-2 h-4 w-4" />
                    下載
                  </a>
                </Button>
                <Button
                  onClick={handleGenerateAgain}
                  variant="outline"
                  size="lg"
                  className="min-w-[30%]"
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  重做
                </Button>
              </div>
            </>
          )}

          {/* Previous Creations */}
          {previousCreations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">以前嘅創作</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previousCreations.map((creation) => (
                  <div
                    key={creation.id}
                    className="group relative aspect-[672/1024] rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <Image
                      src={creation.image}
                      alt={creation.text}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <a
                        href={creation.image}
                        download={`christmas-card-${creation.id}.png`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-gray-900 hover:bg-gray-100 h-10 px-4 py-2"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        下載
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
