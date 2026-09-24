import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outline-light" | "ghost" | "gold" | "whatsapp";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  isExternal,
  children,
  icon,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans tracking-[0.18em] uppercase transition-all duration-300 select-none group relative overflow-hidden text-xs md:text-xs font-medium";

  const sizeStyles = {
    sm: "px-5 py-2.5 gap-2",
    md: "px-7 py-3.5 gap-3",
    lg: "px-9 py-4 gap-3 text-sm",
  }[size];

  const variantStyles = {
    primary:
      "bg-zen-black text-zen-ivory hover:bg-zen-accent hover:text-white border border-zen-black hover:border-zen-accent",
    secondary:
      "bg-zen-ivory text-zen-black hover:bg-zen-stone border border-zen-stone hover:border-zen-sand",
    outline:
      "border border-zen-black/40 text-zen-black hover:border-zen-black hover:bg-zen-black hover:text-zen-ivory bg-transparent",
    "outline-light":
      "border border-zen-ivory/40 text-zen-ivory hover:border-zen-ivory hover:bg-zen-ivory hover:text-zen-black bg-transparent",
    ghost:
      "text-zen-black hover:text-zen-accent bg-transparent p-0 tracking-widest underline-offset-8 hover:underline",
    gold:
      "bg-zen-accent text-white hover:bg-zen-taupe border border-zen-accent shadow-sm",
    whatsapp:
      "bg-[#25D366] text-white hover:bg-[#1EBE5D] border border-[#25D366] font-medium tracking-wider",
  }[variant];

  const combinedClass = `${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClass}
        >
          <span>{children}</span>
          {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass}>
        <span>{children}</span>
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      <span>{children}</span>
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </button>
  );
}
