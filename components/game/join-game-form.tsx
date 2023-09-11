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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { gameIdAtom } from "@/atoms/gameId";
import { playerIdAtom } from "@/atoms/player/playerId";
import { playerNameAtom } from "@/atoms/player/playerName";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

type JoinGameFormProps = {
  onFinish?: () => void;
};

export default function JoinGameForm({ onFinish }: JoinGameFormProps) {
  const joinGame = useMutation(api.games.joinGame);
  const gameId = useAtomValue(gameIdAtom);
  const setPlayerId = useSetAtom(playerIdAtom);
  const [playerName, setPlayerName] = useAtom(playerNameAtom);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: playerName,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ name }: FormSchema) {
    const player = await joinGame({ gameId, name });
    setPlayerId(player.id);
    setPlayerName(player.name);
    onFinish?.();
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
                <Input placeholder="fun" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
