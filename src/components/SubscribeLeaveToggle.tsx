"use client";
import { Button } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useToast } from "@/hooks/use-toast";
import { CreateSubreditSubscriptionPayload } from "@/lib/validators/subredit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subredditId: string;
  subreditName: string;
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subreditName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast();
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubreditSubscriptionPayload = {
        subredditId,
      };

      const { data }: { data: string } = await axios.post(
        "/api/subredit/subscribe",
        payload
      );

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a Problem.",
        description: "Something went Wrong, Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subreditName}`,
      });
    },
  });

  const { mutate: unSubscribe, isLoading: isUnSubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubreditSubscriptionPayload = {
        subredditId,
      };

      const { data }: { data: string } = await axios.post(
        "/api/subredit/unsubscribe",
        payload
      );

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a Problem.",
        description: "Something went Wrong, Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "UnSubscribed",
        description: `You are now unsubscribed from r/${subreditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isUnSubscribeLoading}
      onClick={() => unSubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
