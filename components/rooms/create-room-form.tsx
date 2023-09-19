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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmojiCategories } from "@/convex/types";
import { useSetAtom } from "jotai";
import { defaultEmojiCategoriesAtom } from "@/atoms/defaultEmojiCategories";
import { useState } from "react";

const EMOJI_CATEGORIES: {
  id: EmojiCategories;
  label: string;
}[] = [
  { id: "animalsAndNature", label: "Animals & Nature 🦑" },
  { id: "flags", label: "Flags 🏳️‍🌈" },
  { id: "foodsAndDrinks", label: "Foods & Drinks 🍣" },
  { id: "objects", label: "Objects 🎷" },
  { id: "smiley", label: "Smiley 🧐" },
  { id: "travelsAndPlaces", label: "Travel & Places 🗽" },
];

const formSchema = z.object({
  roomName: z
    .string()
    .trim()
    .min(2, {
      message: "Room name must be at least 2 characters.",
    })
    .max(30, {
      message: "Room name must be at most 30 characters.",
    }),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters.",
    })
    .max(16, {
      message: "Password must be at most 16 characters.",
    })
    .optional(),
  emojisAmount: z.string(),
  multiplayerTurnLength: z.coerce
    .number()
    .max(59, {
      message: "Turn length must be at most 59 seconds.",
    })
    .min(5, {
      message: "Turn length must be at least 5 seconds.",
    }),
  emojiCategories: z
    .array(
      z.enum([
        "smiley",
        "animalsAndNature",
        "foodsAndDrinks",
        "travelsAndPlaces",
        "flags",
        "objects",
      ])
    )
    .min(1, {
      message: "You must select at least one emoji category.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

type CreateGameFormProps = {
  defaultEmojiCategories: EmojiCategories[];
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

const defaultRoomName = getRandomItemFromArray(randomRoomNames);

export default function CreateGameForm({
  defaultEmojiCategories,
  onFinish,
}: CreateGameFormProps) {
  const createGame = useMutation(api.games.gameplay.createGame);
  const setDefaultEmojiCategories = useSetAtom(defaultEmojiCategoriesAtom);
  const [showPassword, setShowPassword] = useState(true);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: defaultRoomName,
      password: "",
      emojisAmount: "8",
      multiplayerTurnLength: 15,
      emojiCategories: defaultEmojiCategories,
    },
  });

  async function onSubmit({
    roomName,
    emojisAmount,
    multiplayerTurnLength,
    emojiCategories,
    password,
  }: FormSchema) {
    await createGame({
      roomName,
      emojisAmount: parseInt(emojisAmount),
      multiplayerTimer: multiplayerTurnLength,
      emojiCategories,
      password,
    });
    setDefaultEmojiCategories(emojiCategories);
    onFinish?.();
  }

  return (
    <ScrollArea className="max-h-96 md:max-h-[500px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="createGameForm"
          className="space-y-4 md:space-y-8"
        >
          <FormField
            control={form.control}
            name="roomName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room name</FormLabel>
                <FormControl>
                  <Input placeholder={defaultRoomName} {...field} />
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
                <FormLabel>Game length</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Additional settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 md:space-y-8">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Room password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="multiplayerTurnLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          [Multiplayer] Turn length (in seconds)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="15" type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          How long each player has to make their move.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emojiCategories"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Emoji Categories
                          </FormLabel>
                        </div>
                        {EMOJI_CATEGORIES.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="emojiCategories"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </ScrollArea>
  );
}
