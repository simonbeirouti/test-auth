"use client";

import { Copy, Twitter, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";
import { ShareModalProps } from "@/types";

export function ShareModal({ onClose, referralLink }: ShareModalProps) {
  const [showPlatformOptions, setShowPlatformOptions] = useState<string | null>(
    null,
  );

  const handleInitialShare = async (platform: string) => {
    const url = `${window.location.origin}/?ref=${referralLink}`;
    const text = `Getting up that leaderboard for the CoinOS launch! Join me here:`;
    const fullText = `${text} ${url}`;

    if (platform === "copy") {
      await navigator.clipboard.writeText(fullText);
      // You can add a toast notification here
      return;
    }

    // Copy text first
    await navigator.clipboard.writeText(fullText);
    // Show platform-specific options
    setShowPlatformOptions(platform);
  };

  const handlePlatformOpen = (useApp: boolean, platform: string) => {
    const platformUrls = {
      twitter: {
        app: `twitter://post}`,
        web: `https://twitter.com/intent/tweet}`,
      },
      facebook: {
        app: `fb://share}`,
        web: `https://www.facebook.com/sharer/sharer.php}`,
      },
      linkedin: {
        app: `linkedin://sharing}`,
        web: `https://www.linkedin.com/sharing/share-offsite}`,
      },
    };

    const selectedUrl = useApp
      ? platformUrls[platform as keyof typeof platformUrls].app
      : platformUrls[platform as keyof typeof platformUrls].web;

    window.location.href = selectedUrl;
    setShowPlatformOptions(null);
  };

  const platforms = [
    { id: "twitter", name: "Twitter", icon: Twitter },
    { id: "facebook", name: "Facebook", icon: Facebook },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin },
    { id: "copy", name: "Copy Link", icon: Copy },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-black border border-emerald-400/20 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-emerald-400 mb-4">
          Share with Friends
        </h3>

        {!showPlatformOptions ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {platforms.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleInitialShare(id)}
                className="flex items-center justify-center gap-2 p-3 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-lg transition-colors duration-300"
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">{name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <p className="text-emerald-400 text-center mb-4">
              Text copied! Open in:
            </p>
            <button
              onClick={() => handlePlatformOpen(true, showPlatformOptions)}
              className="w-full p-3 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-lg transition-colors duration-300 text-emerald-400"
            >
              Open in App
            </button>
            <button
              onClick={() => handlePlatformOpen(false, showPlatformOptions)}
              className="w-full p-3 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-lg transition-colors duration-300 text-emerald-400"
            >
              Open in Browser
            </button>
            <button
              onClick={() => setShowPlatformOptions(null)}
              className="w-full p-3 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-lg transition-colors duration-300 text-emerald-400"
            >
              Back
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-emerald-400 border border-emerald-400/30 rounded hover:bg-emerald-400/10 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
