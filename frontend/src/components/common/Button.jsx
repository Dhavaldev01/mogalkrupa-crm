import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Button({
  children,
  primaryBtn,
  className,
  link,
  url,
  onClick,
  loading,
  disabled,
  type = "button",
  target = "_self",
  ...props
}) {
  return (
    <>
      {link ?
        <Link
          to={url ? url : ''}
          disabled={loading || disabled}
          className={cn(
            "flex items-center justify-center gap-2 bg-white py-2.5 px-5 rounded-md border border-secondary/10 hover:bg-secondary/5 text-center text-base font-medium text-secondary cursor-pointer active:scale-[0.97] transition-all disabled:opacity-50 disabled:pointer-events-none leading-tight outline-none",
            primaryBtn && 'bg-primary hover:bg-primary border-primary text-white shadow-[inset_0_-2px_0_0_#0a041833] hover:brightness-110',
            (loading || disabled) && 'opacity-50 pointer-events-none',
            className
          )}
          target={target}
          {...props}>
          {children}
        </Link>
        : <button
          onClick={onClick}
          disabled={loading || disabled}
          type={type}
          className={cn(
            "flex items-center justify-center gap-2 bg-white py-2.5 px-5 rounded-md border border-secondary/10 hover:bg-secondary/5 text-center text-base font-medium text-secondary cursor-pointer active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-tight outline-none",
            primaryBtn && 'bg-primary hover:bg-primary border-primary text-white shadow-[inset_0_-2px_0_0_#0a041833] hover:brightness-110',
            className
          )}
          {...props}>
          {loading && <span className="size-4 min-w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          {children}
        </button>}
    </>
  )
}
