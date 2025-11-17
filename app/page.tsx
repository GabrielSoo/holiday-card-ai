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
import { Textarea } from "@/components/ui/textarea";

import Dropzone from "@/features/dropzone";
import Image from "next/image";
import StyleSelector from "@/features/style-select";

import { useForm } from "react-hook-form";
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
  // const [result, setResult] = useState<string>("");
  // const [loading, setloading] = useState(false);

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
    // setloading(true);
    console.log("onSubmit");
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

      <section className="max-w-4xl mx-auto w-full">
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
              <Button type="submit" size="lg" className="w-full">
                創造聖誕卡
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </main>
  );
}
