import { usePrivy } from "@privy-io/react-auth";

export const LoginButton = () => {
  const { login, ready, authenticated } = usePrivy();

  if (!ready) {
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
    <button
      className="px-6 py-3 bg-[#3CFF97] text-black rounded-lg font-semibold transition-all hover:bg-opacity-90 focus:ring-2 focus:ring-[#3CFF97] focus:ring-opacity-50 focus:outline-none"
      onClick={login}
    >
      Get Started with Social Login
    </button>
  );
};
