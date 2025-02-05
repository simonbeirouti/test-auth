import {Fragment} from "react";
import {Terminal} from "lucide-react";
import {socialLinks} from "@/data";
import Features from "@/components/home/features";
import Countdown from "@/components/home/countdown";
import {Milestone} from "@/components/dashboard/milestone";
import {FormMessage, Message} from "@/components/form-message";
import {SubmitButton} from "@/components/submit-button";
import {Input} from "@/ui/input";
import {signUpAction} from "@/app/actions";
import {createClient} from "@/supabase/server";
import Link from "next/link";

export default async function App(props: {searchParams: Promise<Message>}) {
	const supabase = await createClient();

	const {
		data: {user},
	} = await supabase.auth.getUser();

	const searchParams = await props.searchParams;

	if ("message" in searchParams) {
		return (
			<div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
				<FormMessage message={searchParams} />
			</div>
		);
	}

	return (
		<Fragment>
			<div className="min-h-screen flex flex-col items-center justify-center max-w-7xl mx-auto">
				<div className="flex flex-row items-center justify-between mb-6 w-full">
					<div className="flex items-center gap-3">
						<Terminal className="w-8 h-8 text-emerald-400" />
						<h1 className="text-emerald-400 text-3xl tracking-wider">
							COINFI
						</h1>
					</div>
					<div className="flex gap-4">
						{socialLinks.map((social, i) => (
							<a
								key={i}
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-emerald-400/70 hover:text-emerald-400 transition-colors duration-300"
								title={social.label}
							>
								<social.icon className="w-6 h-6" />
							</a>
						))}
					</div>
				</div>

				<div className="grid lg:grid-cols-2 gap-8 w-full">
					<div>
						<div className="space-y-6">
							<h2 className="text-4xl font-bold text-emerald-400 leading-tight">
								Own the Future of Finance: Share, Refer, and Earn
								with Coin Fi
							</h2>
							<p className="text-lg text-emerald-400/80">
								Join the revolution and invite your friends to
								unlock exclusive rewards. Be part of the next
								generation of decentralized finance.
							</p>

							<div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-4">
								<Countdown />

								<Milestone />
							</div>

							{!user ? (
								<form className="space-y-4">
									<Input
										name="email"
										pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
										className="w-full px-4 py-3 bg-transparent border border-emerald-400/30 rounded text-emerald-400 placeholder-emerald-400/30 focus:outline-none focus:border-emerald-400/60 transition-all duration-300"
										title="Please enter a valid email address without aliases"
										placeholder="you@example.com"
										required
									/>
									<SubmitButton
										formAction={signUpAction}
										pendingText="Signing up..."
										className="w-full px-6 py-3 text-emerald-400 bg-transparent border border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
									>
										GET EARLY ACCESS
									</SubmitButton>
									<FormMessage message={searchParams} />
								</form>
							) : (
								<Link
									href="/dashboard"
									className="block w-full px-6 py-3 text-center text-emerald-400 bg-transparent border border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
								>
									ACCESS DASHBOARD
								</Link>
							)}
						</div>
					</div>

					<Features />
				</div>
			</div>
		</Fragment>
	);
}
