import { emojiReactionsAtom } from "@/atoms/emojiReactions";
import CustomizeReactionsDialog from "@/components/emoji-reactions/customize-reactions-dialog";
import useOnlinePresence from "@/components/game/hooks/use-online-presence";
import usePlayerId from "@/components/game/hooks/use-player-id";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAtomValue } from "jotai";

export default function EmojiReactions() {
  const [_, presences, updateMyPresence, clearReactions] = useOnlinePresence();
  const playerId = usePlayerId();
  const emojiReactions = useAtomValue(emojiReactionsAtom);

  const handleEmojiReaction = (emoji: string) => {
    updateMyPresence(emoji);
  };

  const reactions =
    presences?.find((presence) => presence.playerId === playerId)?.reactions ??
    [];

  return (
    <Card className="flex items-center p-4">
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Reactions</span>
        {emojiReactions.map((reaction, i) => (
          <Button
            key={i}
            onClick={() => handleEmojiReaction(reaction)}
            variant="ghost"
            size="icon"
            disabled={reactions.length >= 3}
          >
            {reaction}
          </Button>
        ))}
        <Button onClick={clearReactions} variant="ghost">
          Clear
        </Button>
      </div>
    </Card>
  );
}
