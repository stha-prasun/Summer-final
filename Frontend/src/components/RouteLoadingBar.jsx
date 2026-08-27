import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

export default function RouteLoadingBar() {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    ref.current?.continuousStart();
    const timer = setTimeout(() => {
      ref.current?.complete();
    }, 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <LoadingBar
      ref={ref}
      color="linear-gradient(90deg, #7c3aed, #2563eb)"
      height={3}
      shadow="0 0 10px #7c3aed, 0 0 5px #7c3aed"
    />
  );
}
