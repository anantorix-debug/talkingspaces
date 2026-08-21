import type { ReactNode } from "react";
import Link from "next/link";

type Variant = "solid" | "outline" | "outline-dark";

const base =
  "inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

const variants: Record<Variant, string> = {
  solid: "bg-paper text-teal-dark hover:bg-teal-light",
  outline: "border border-paper text-paper hover:bg-paper hover:text-teal-dark",
  "outline-dark": "border border-teal text-teal hover:bg-teal hover:text-paper",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type NativeButtonProps = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "solid", className = "", children } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as NativeButtonProps;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
