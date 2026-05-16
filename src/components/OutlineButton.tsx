// Bug fix: N/A — shared outline button style (30px radius, Indivisible, black border).
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
    "inline-flex items-center justify-center rounded-[30px] border border-black bg-transparent px-5 py-2 font-[family-name:var(--font-indivisible)] text-sm text-black transition hover:bg-black/5";

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
