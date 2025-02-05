"use client";

import {Copy} from "lucide-react";
import {useToast} from "@/hooks/use-toast";

export default function CopyButton({referralLink}: {referralLink: string}) {
	const {toast} = useToast();

	const copyReferralLink = async () => {
		try {
			await navigator.clipboard.writeText(referralLink);
			toast({
				title: "Copied to clipboard!",
				variant: "default",
			});
		} catch (err) {
			toast({
				title: "Failed to copy link",
				variant: "destructive",
			});
		}
	};

	return (
		<button
			onClick={copyReferralLink}
			className="p-2 hover:bg-emerald-400/10 rounded transition-colors duration-300"
			title="Copy link"
		>
			<Copy className="w-5 h-5 text-emerald-400" />
		</button>
	);
}
