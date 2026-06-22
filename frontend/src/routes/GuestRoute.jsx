import { Navigate } from "react-router-dom";

export default function GuestRoute({
  user,
  children,
}) {
  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}