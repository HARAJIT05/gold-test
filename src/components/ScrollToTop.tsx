import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top on route changes.
 *
 * Rules:
 * - Always scroll when the pathname changes (navigating between pages).
 * - Scroll when the `sub` search param changes (entering/leaving a subcategory).
 * - Do NOT scroll when only the `product` param changes (opening/closing the modal
 *   should not disturb the user's scroll position on the product list).
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  // Track the previous value of the `sub` param
  const prevSubRef = useRef<string | null>(null);
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const currentSub = params.get("sub");
    const pathnameChanged = pathname !== prevPathnameRef.current;
    const subChanged = currentSub !== prevSubRef.current;

    if (pathnameChanged || subChanged) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    prevPathnameRef.current = pathname;
    prevSubRef.current = currentSub;
  }, [pathname, search]);

  return null;
}
