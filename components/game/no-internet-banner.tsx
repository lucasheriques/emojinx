import { SmallBanner } from "@/components/ui/banner";

export default function NoInternetBanner({
  hasInternetConnection,
}: {
  hasInternetConnection: boolean;
}) {
  if (hasInternetConnection) {
    return null;
  }

  return <SmallBanner>Please check your internet connection.</SmallBanner>;
}
