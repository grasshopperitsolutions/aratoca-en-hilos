import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  /** Opens an `href` in a new tab, with the usual opener protection. */
  external?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-terracotta text-cream hover:bg-cream hover:text-terracotta border border-terracotta',
  secondary:
    'bg-charcoal text-cream hover:bg-earth border border-charcoal',
  outline:
    'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-cream',
  ghost:
    'bg-transparent text-charcoal hover:text-terracotta',
};

export default function Button({
  children,
  variant = 'primary',
  href,
  to,
  onClick,
  className = '',
  type = 'button',
  external = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300';

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}