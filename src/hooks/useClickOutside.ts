import { useEffect, useState, useRef } from "react";

export default function useClickOutside() {
  const [isShowComponent, setIsShowComponent] = useState<boolean>(false);
  const ref = useRef<any>(null);

  useEffect((): any => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsShowComponent(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return { ref, isShowComponent, setIsShowComponent };
}
