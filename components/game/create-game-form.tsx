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
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useAtom, useSetAtom } from "jotai";
import { playerIdAtom } from "@/atoms/playerId";

const formSchema = z.object({
  roomName: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateGameForm() {
  const createGame = useMutation(api.games.createGame);
  const createOrGetPlayer = useMutation(api.players.createOrGetPlayer);
  const [playerId, setPlayerId] = useAtom(playerIdAtom);
  const player = useQuery(api.players.getPlayer, { playerId: playerId });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ roomName, username }: FormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (!player) {
      const player = await createOrGetPlayer({ username });
      setPlayerId(player._id ?? player);
    }
    await createGame({ roomName });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="lucasfaria" {...field} />
              </FormControl>
              <FormDescription>
                {"It'll"} be used to identify you in the game.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="fun" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create room</Button>
      </form>
    </Form>
  );
}
