import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../app/auth";

export const Protected = ({ children }: PropsWithChildren) => {
  if (!auth.isAuthed()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
