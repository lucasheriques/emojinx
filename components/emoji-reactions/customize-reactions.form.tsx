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
import { randomUserNames } from "@/lib/constants";
import { useAtom } from "jotai";
import { emojiReactionsAtom } from "@/atoms/emojiReactions";
import useZodForm from "@/hooks/use-zod-form";

const formSchema = z.object({
  emojis: z.array(
    z.object({
      emoji: z.string(),
    })
  ),
});

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
    setEmojiReactions(Object.values(values.emojis).map((emoji) => emoji.emoji));
    onFinish?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="emojiReactionsForm"
        className="space-y-8"
      >
        {fields.map((field, i) => (
          <FormItem key={field.id}>
            <FormLabel>Emoji</FormLabel>
            <FormControl>
              <Input {...form.register(`emojis.${i}.emoji`)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        ))}
      </form>
    </Form>
  );
}
