import { cn } from "@/lib/utils";
import { checkBoxIcon, minusIcon } from "@/assets/icon/Icon";

export default function Checkbox({
  idHtmlFor,
  label,
  className,
  checked,
  onChange,
  containerClassName,
  labelClassName,
  type,
  disabled,
  ...props
}) {
  return (
    <>
      <div className={cn(
        "gap-x-2 flex",
        containerClassName
      )}>
        <div className={cn(
          "relative",
          label && "mt-0.5"
        )}>
          <input
            id={idHtmlFor}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            type="checkbox"
            className="peer absolute left-0 top-0 size-full opacity-0 cursor-pointer"
            {...props}
          />
          {type === "indeterminate"
            ? <div className={cn(
              "size-4 min-w-4 rounded border border-secondary/10 flex items-center *:size-full text-white bg-primary shadow-[inset_0_-1.5px_0_0_#0a041833] peer-disabled:opacity-50",
              className
            )}>
              {minusIcon}
            </div> : <div className={cn(
              "bg-input size-4 min-w-4 rounded border border-secondary/10 flex items-center *:size-full text-transparent peer-checked:text-white peer-checked:bg-primary shadow-[inset_0_-1.5px_0_0_#0a041833] peer-disabled:opacity-50",
              className
            )}>
              {checkBoxIcon}
            </div>}
        </div>
        {label &&
          <label
            htmlFor={idHtmlFor}
            className={cn(
              "text-sm font-medium text-secondary block cursor-pointer",
              labelClassName
            )}>
            {label}
          </label>}
      </div>
    </>
  )
}
