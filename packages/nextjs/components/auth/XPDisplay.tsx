import { usePrivy } from "@privy-io/react-auth";
import { useXP } from "~~/context/XPContext";

export const XPDisplay = () => {
  const { ready, authenticated } = usePrivy();
  const { xp, level } = useXP();

  if (!ready || !authenticated) return null;

  // Calculate progress percentage for the current level
  const progressPercentage = xp % 100;

  return (
    <div className="flex items-center gap-2 bg-base-300 px-3 py-1 rounded-full">
      <div className="flex flex-col items-center">
        <span className="text-xs font-semibold">Level</span>
        <span className="text-sm font-bold">{level}</span>
      </div>
      <div className="h-8 w-px bg-base-content opacity-20"></div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold">XP</span>
        <span className="text-sm font-bold">{xp}</span>
      </div>
      <div className="w-full max-w-24 h-1 bg-base-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
