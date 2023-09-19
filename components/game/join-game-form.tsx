"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import useJoinGame from "@/components/game/hooks/use-join-game";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(18, {
      message: "Name must be at most 16 characters.",
    })
    .trim(),
});

type FormSchema = z.infer<typeof formSchema>;

type JoinGameFormProps = {
  defaultPlayerName: string;
  onFinish?: () => void;
};

export default function JoinGameForm({
  onFinish,
  defaultPlayerName,
}: JoinGameFormProps) {
  const joinGame = useJoinGame({ onFinish });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:
        defaultPlayerName === ""
          ? getRandomItemFromArray(randomUserNames)
          : defaultPlayerName,
    },
  });

  async function onSubmit(values: FormSchema) {
    await joinGame(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="joinGameForm"
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={getRandomItemFromArray(randomUserNames)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
