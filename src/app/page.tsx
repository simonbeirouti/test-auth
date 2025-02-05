import { Fragment } from "react";
import { Terminal } from "lucide-react";
import { socialLinks } from "@/data";
import HomeCounter from "@/components/home/home-counter";
import Features from "@/components/home/features";
import InputDash from "@/components/home/input-dash";

export default function App() {
  return (
    <Fragment>
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-emerald-400" />
          <h1 className="text-emerald-400 text-3xl tracking-wider">COINFI</h1>
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

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-emerald-400 leading-tight">
              Own the Future of Finance: Share, Refer, and Earn with Coin Fi
            </h2>
            <p className="text-lg text-emerald-400/80">
              Join the revolution and invite your friends to unlock exclusive
              rewards. Be part of the next generation of decentralized finance.
            </p>

            <HomeCounter />
            <InputDash />
          </div>
        </div>

        <Features />
      </div>
    </Fragment>
  );
}