"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { getRandomItemFromArray } from "@/lib/utils";
import { randomRoomNames } from "@/lib/constants";

const formSchema = z.object({
  roomName: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

type CreateGameFormProps = {
  onFinish?: () => void;
};

export default function CreateGameForm({ onFinish }: CreateGameFormProps) {
  const createGame = useMutation(api.games.createGame);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: getRandomItemFromArray(randomRoomNames),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ roomName }: FormSchema) {
    await createGame({ roomName });
    onFinish?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="createGameForm"
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={getRandomItemFromArray(randomRoomNames)}
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
