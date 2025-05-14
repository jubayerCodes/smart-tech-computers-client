import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Navigate = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, []);

  return <></>;
};

export default Navigate;
