// Bug fix: bolder type + thicker border so CTAs stand out more (border-4, font-bold).
// Bug fix: hover blue — removed bg-transparent (it blocked hover bg); rotate-2 = tilt right.
// Bug fix: forwardRef for donate CTA jiggle (Web Animations API on mount).
// Style: shared outline button — 30px radius, 4px black border.
"use client";

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type Ref,
} from "react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const BASE_CLASS = [
  "outline-btn inline-flex min-h-12 origin-center touch-manipulation items-center justify-center rounded-[30px] border-4 border-black px-4 py-2.5 text-center font-[family-name:var(--font-indivisible)] text-base font-bold leading-tight text-black sm:min-h-[3.25rem] sm:px-5 sm:text-lg md:text-xl",
  "transition-[transform,background-color] duration-200 ease-out",
  "hover:rotate-2 hover:bg-[var(--blue)]",
  "active:rotate-2 active:bg-[var(--blue)]",
  "focus-visible:rotate-2 focus-visible:bg-[var(--blue)]",
].join(" ");

function usePressFeedback(disabled?: boolean) {
  const [pressed, setPressed] = useState(false);
  const releaseTimerRef = useRef<number | undefined>(undefined);

  const clearReleaseTimer = useCallback(() => {
    if (releaseTimerRef.current !== undefined) {
      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = undefined;
    }
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (disabled || event.button !== 0) return;
      clearReleaseTimer();
      setPressed(true);
    },
    [clearReleaseTimer, disabled],
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (disabled) return;
      clearReleaseTimer();
      const delayMs = event.pointerType === "touch" ? 280 : 0;
      if (delayMs > 0) {
        releaseTimerRef.current = window.setTimeout(
          () => setPressed(false),
          delayMs,
        );
      } else {
        setPressed(false);
      }
    },
    [clearReleaseTimer, disabled],
  );

  const onPointerLeave = useCallback(() => {
    clearReleaseTimer();
    setPressed(false);
  }, [clearReleaseTimer]);

  const onPointerCancel = onPointerLeave;

  return {
    pressed,
    handlers: { onPointerDown, onPointerUp, onPointerLeave, onPointerCancel },
  };
}

function mergePointerHandlers<T extends HTMLAnchorElement | HTMLButtonElement>(
  ours: ReturnType<typeof usePressFeedback>["handlers"],
  theirs: {
    onPointerDown?: (e: PointerEvent<T>) => void;
    onPointerUp?: (e: PointerEvent<T>) => void;
    onPointerLeave?: (e: PointerEvent<T>) => void;
    onPointerCancel?: (e: PointerEvent<T>) => void;
  },
) {
  return {
    onPointerDown: (e: PointerEvent<T>) => {
      ours.onPointerDown(e as PointerEvent<HTMLAnchorElement | HTMLButtonElement>);
      theirs.onPointerDown?.(e);
    },
    onPointerUp: (e: PointerEvent<T>) => {
      ours.onPointerUp(e as PointerEvent<HTMLAnchorElement | HTMLButtonElement>);
      theirs.onPointerUp?.(e);
    },
    onPointerLeave: (e: PointerEvent<T>) => {
      ours.onPointerLeave();
      theirs.onPointerLeave?.(e);
    },
    onPointerCancel: (e: PointerEvent<T>) => {
      ours.onPointerCancel();
      theirs.onPointerCancel?.(e);
    },
  };
}

function buildClassName(pressed: boolean, className: string) {
  const feedback = pressed ? " rotate-2 bg-[var(--blue)]" : "";
  return `${BASE_CLASS}${feedback} ${className}`.trim();
}

export const OutlineButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps | LinkProps
>(function OutlineButton(props, ref) {
  const isLink = "href" in props && Boolean(props.href);
  const disabled = isLink ? undefined : (props as ButtonProps).disabled;

  const { pressed, handlers } = usePressFeedback(disabled);

  if (isLink) {
    const {
      href,
      children,
      className = "",
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      ...rest
    } = props as LinkProps;

    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        aria-disabled={disabled || undefined}
        className={buildClassName(pressed, className)}
        {...mergePointerHandlers(handlers, {
          onPointerDown,
          onPointerUp,
          onPointerLeave,
          onPointerCancel,
        })}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const {
    children,
    className = "",
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ...rest
  } = props as ButtonProps;

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      className={buildClassName(pressed, className)}
      {...mergePointerHandlers(handlers, {
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        onPointerCancel,
      })}
      {...rest}
    >
      {children}
    </button>
  );
});
