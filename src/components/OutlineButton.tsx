// Style: shared outline button — 30px radius, 24px type, 2px black border.
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function OutlineButton(props: ButtonProps | LinkProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-[30px] border-2 border-black bg-transparent px-4 py-2.5 text-center font-[family-name:var(--font-indivisible)] text-base leading-tight text-black transition hover:bg-black/5 sm:min-h-12 sm:px-5 sm:text-lg md:text-xl";

  if ("href" in props && props.href) {
    const { href, children, className = "", ...rest } = props;
    return (
      <a href={href} className={`${base} ${className}`} {...rest}>
        {children}
      </a>
    );
  }

  const { children, className = "", ...rest } = props as ButtonProps;
  return (
    <button type="button" className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}
