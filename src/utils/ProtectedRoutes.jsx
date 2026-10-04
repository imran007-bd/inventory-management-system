import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children, requireRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allowedRoles = useMemo(
    () => (Array.isArray(requireRole) ? requireRole : [requireRole]),
    [requireRole]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      navigate("/unauthorized");
      return;
    }
  }, [user, navigate, allowedRoles]);

  if (!user) return null;
  if (!allowedRoles.includes(user.role)) return null;

  return children;
};

export default ProtectedRoutes;
