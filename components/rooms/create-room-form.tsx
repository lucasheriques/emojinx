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
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { cn, getRandomItemFromArray } from "@/lib/utils";
import { randomRoomNames } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { CheckIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  roomName: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  emojisAmount: z.number().min(8),
});

type FormSchema = z.infer<typeof formSchema>;

type CreateGameFormProps = {
  onFinish?: () => void;
};

const emojisAmountOptions = [
  {
    value: 8,
    label: "4x4 (8 unique emojis)",
  },
  {
    value: 18,
    label: "6x6 (18 unique emojis)",
  },
  {
    value: 32,
    label: "8x8 (32 unique emojis)",
  },
  {
    value: 50,
    label: "10x10 (50 unique emojis)",
  },
];

export default function CreateGameForm({ onFinish }: CreateGameFormProps) {
  const createGame = useMutation(api.games.createGame);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: getRandomItemFromArray(randomRoomNames),
      emojisAmount: 8,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({ roomName, emojisAmount }: FormSchema) {
    await createGame({ roomName, emojisAmount });
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
            <FormItem className="flex flex-col">
              <FormLabel>Grid size</FormLabel>
              <Popover>
                <PopoverTrigger asChild className="w-full">
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? emojisAmountOptions.find(
                            (option) => option.value === field.value
                          )?.label
                        : "Select grid size"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {emojisAmountOptions.map((option) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            form.setValue("emojisAmount", option.value);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
