import "./globals.css";
import type {Metadata} from "next";
import {Geist} from "next/font/google";
import {ThemeProvider} from "next-themes";
import Footer from "@/components/layout/footer";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: {
		default: "Coin Fi",
		template: "Coin Fi | %s",
	},
	description:
		"Join an ecosystem of people who are building the future of finance.",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "Coin Fi",
		description:
			"Join an ecosystem of people who are building the future of finance.",
		url: "https://coinfi.io",
		siteName: "Coin Fi",
		images: [{url: "/favicon.ico"}],
	},
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={geistSans.className}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="min-h-screen bg-black font-mono">
						<div className="max-w-6xl mx-auto p-6">
							{children}
							<Footer />
						</div>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
