import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div suppressHydrationWarning>{children}</div>;
};

export default AuthLayout;
