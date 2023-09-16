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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  roomName: z.string().trim().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  emojisAmount: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

type CreateGameFormProps = {
  onFinish?: () => void;
};

const emojisAmountOptions = [
  {
    value: "4",
    label: "Quickest — only four pairs!",
  },
  {
    value: "8",
    label: "Quick",
  },
  {
    value: "18",
    label: "Standard",
  },
  {
    value: "32",
    label: "Epic",
  },
  {
    value: "50",
    label: "Marathon",
  },
];

export default function CreateGameForm({ onFinish }: CreateGameFormProps) {
  const createGame = useMutation(api.games.createGame);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: getRandomItemFromArray(randomRoomNames),
      emojisAmount: emojisAmountOptions[0].value,
    },
  });

  async function onSubmit({ roomName, emojisAmount }: FormSchema) {
    await createGame({ roomName, emojisAmount: parseInt(emojisAmount) });
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
              <FormLabel>Room name</FormLabel>
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
        <FormField
          control={form.control}
          name="emojisAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Length</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {emojisAmountOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {parseInt(form.getValues("emojisAmount")) >= 32 && (
                  <span className="block md:hidden dark:text-cyan-400 text-cyan-600 font-medium">
                    This length works best on tablet or bigger screen.
                  </span>
                )}
                Determines the number of emojis in the game. The more emojis,
                the longer the game.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
