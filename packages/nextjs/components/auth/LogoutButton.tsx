import { usePrivy } from "@privy-io/react-auth";

export const LogoutButton = () => {
  const { ready, authenticated, logout } = usePrivy();
  const disableLogout = !ready || (ready && !authenticated);

  if (disableLogout) return null;

  return (
    <button className="btn btn-sm btn-secondary" onClick={logout}>
      Logout
    </button>
  );
};
