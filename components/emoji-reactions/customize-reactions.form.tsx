"use client";

import * as z from "zod";
import { useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getRandomItemFromArray } from "@/lib/utils";
import { RANDOM_USER_NAMES } from "@/lib/constants";
import { useAtom } from "jotai";
import { emojiReactionsAtom } from "@/atoms/emojiReactions";
import useZodForm from "@/hooks/use-zod-form";

const formSchema = z.object({
  emojis: z.array(
    z.object({
      emoji: z.string().emoji({
        message: "Invalid emoji",
      }),
    })
  ),
});

const defaultEmojis = ["️️❤️", "🎉", "😤"];

type FormSchema = z.infer<typeof formSchema>;

type CustomizeReactionsFormProps = {
  onFinish?: () => void;
};

export default function CustomizeReactionsForm({
  onFinish,
}: CustomizeReactionsFormProps) {
  const [emojiReactions, setEmojiReactions] = useAtom(emojiReactionsAtom);

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      emojis: emojiReactions.map((emoji) => ({ emoji })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emojis",
  });

  async function onSubmit(values: FormSchema) {
    console.log({ values });
    setEmojiReactions(
      Object.values(values.emojis).map((emoji, i) => {
        if (!emoji.emoji) {
          return defaultEmojis[i];
        }
        return emoji.emoji;
      })
    );
    onFinish?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="emojiReactionsForm"
        className="grid grid-cols-3 items-start gap-8"
      >
        {fields.map((field, i) => (
          // <FormItem key={field.id}>
          //   <FormLabel>Emoji</FormLabel>
          //   <FormControl>
          //     <Input {...form.register(`emojis.${i}.emoji`)} />
          //   </FormControl>
          //   <FormMessage />
          // </FormItem>
          <FormField
            control={form.control}
            key={field.id}
            name={`emojis.${i}.emoji`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji {i + 1}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
