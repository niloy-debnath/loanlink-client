import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(
          user.email
        )}`
      )
      .then((res) => {
        setRole(res.data.role);
        setRoleLoading(false);
      })
      .catch(() => {
        setRoleLoading(false);
      });
  }, [user]);

  return { role, roleLoading };
};

export default useRole;
