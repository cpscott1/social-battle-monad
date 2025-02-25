import { useLoginWithOAuth, usePrivy } from "@privy-io/react-auth";

export const LoginButton = () => {
  const { ready, authenticated } = usePrivy();
  const { state, loading, initOAuth } = useLoginWithOAuth();

  console.log("OAuth State:", state); // Debug log

  const handleSocialLogin = async (provider: "twitter" | "discord") => {
    console.log(`Attempting to login with ${provider}`); // Debug log
    try {
      await initOAuth({ provider });
      console.log(`${provider} OAuth initiated`); // Debug log
    } catch (err) {
      console.error(`Error logging in with ${provider}:`, err);
    }
  };

  if (!ready || loading) {
    return (
      <button
        className="px-6 py-3 bg-[#3CFF97] text-black rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#3CFF97] focus:ring-opacity-50 focus:outline-none opacity-50 cursor-not-allowed"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (authenticated) {
    return (
      <button
        className="px-6 py-3 bg-[#3CFF97] text-black rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#3CFF97] focus:ring-opacity-50 focus:outline-none"
        onClick={() => console.log("Get Started clicked")}
      >
        Get Started
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        className="px-6 py-3 bg-[#1DA1F2] text-white rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#1DA1F2] focus:ring-opacity-50 focus:outline-none"
        onClick={() => handleSocialLogin("twitter")}
      >
        Login with Twitter
      </button>
      <button
        className="px-6 py-3 bg-[#5865F2] text-white rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#5865F2] focus:ring-opacity-50 focus:outline-none"
        onClick={() => handleSocialLogin("discord")}
      >
        Login with Discord
      </button>
    </div>
  );
};
