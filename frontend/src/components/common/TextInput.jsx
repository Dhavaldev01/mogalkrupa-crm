import { useEffect, useState } from "react";
import { checkBoxIcon, copyIcon, eyeHideIcon, eyeIcon } from "@/assets/icon/Icon";
import { cn } from "@/lib/utils";

export default function TextInput({
  placeholder = 'Placeholder',
  type = 'text',
  idHtmlFor,
  label,
  labelChildren,
  isRequired,
  error,
  labelClassName,
  className,
  pswBtnClassName,
  errorClassName,
  isGroupLeft,
  isGroupRight,
  isTextarea,
  value,
  onChange,
  maxLength,
  showCount = false,
  containerClassName,
  onLeftGroupClick,
  onRightGroupClick,
  isGroupLeftClass,
  isGroupRightClass,
  isDisabled = false,
  isCopy = false,
  copyBtnClick,
  copyBtnClassName,
  copyActiveIcon,
  onKeyDown,
  min,
  ...props
}) {

  const [showPassword, setShowPassword] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (value !== undefined) {
      setCharCount(String(value).length);
    }
  }, [value]);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e);
    }
  };

  const isNearLimit = maxLength && charCount > maxLength * 0.9;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <>
      <div className={cn("space-y-2", containerClassName)}>
        {label &&
          <label htmlFor={idHtmlFor} className={cn(
            "text-sm font-medium text-secondary block leading-[1.358]",
            labelClassName
          )}>
            {label} {isRequired && <span className="text-danger">*</span>}
            {labelChildren}
          </label>}
        <div className="flex w-full">
          {isGroupLeft &&
            <div
              onClick={onLeftGroupClick}
              className={cn(
                "bg-white rounded-lg rounded-r-none py-3 px-4 border border-secondary/10 shadow-xs border-r-black/10 text-sm font-medium text-secondary block",
                isGroupLeftClass
              )}>
              {isGroupLeft}
            </div>}
          <div className="relative flex-1">
            {isTextarea
              ? <textarea
                id={idHtmlFor}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                maxLength={maxLength}
                disabled={isDisabled}
                {...props}
                className={cn(
                  "bg-white block w-full rounded-lg py-3 px-4 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all focus-within:ring-3 focus-within:ring-primary/20 focus-within:border-primary min-h-20 max-h-20 resize-none leading-[1.25] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10",
                  type == 'password' && "pr-11",
                  isGroupLeft && "rounded-l-none",
                  isGroupRight && "rounded-r-none",
                  className
                )}>
              </textarea>
              : <input
                id={idHtmlFor}
                value={value}
                type={type == 'password' ? (showPassword ? 'text' : 'password') : type}
                placeholder={placeholder}
                disabled={isDisabled}
                onKeyDown={onKeyDown}
                min={min}
                step={type === "number" ? "any" : undefined}
                {...props}
                className={cn(
                  "bg-white block w-full rounded-lg py-3 px-4 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all focus-within:ring-3 focus-within:ring-primary/20 focus-within:border-primary leading-[1.25] disabled:opacity-50 disabled:bg-secondary/10 disabled:cursor-not-allowed",
                  (type == 'password' || isCopy) && "pr-11",
                  isGroupLeft && "rounded-l-none",
                  isGroupRight && "rounded-r-none",
                  className
                )}
                onChange={handleChange}
                onWheel={(e) => {
                  e.currentTarget.blur();
                }}
              />}
            {type == 'password' &&
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "size-5 min-w-5 absolute right-4 top-1/2 -translate-y-1/2 *:size-full flex items-center justify-center p-0 cursor-pointer",
                  pswBtnClassName
                )}>
                {showPassword ? eyeHideIcon : eyeIcon}
              </button>}
            {isCopy &&
              <button
                type="button"
                onClick={copyBtnClick}
                className={cn(
                  "size-5 min-w-5 absolute right-4 top-1/2 -translate-y-1/2 *:size-full flex items-center justify-center p-0 cursor-pointer",
                  copyBtnClassName
                )}>
                {copyActiveIcon ? checkBoxIcon : copyIcon}
              </button>}
          </div>
          {isGroupRight &&
            <div
              onClick={onRightGroupClick}
              className={cn(
                "bg-white rounded-lg rounded-l-none py-3 px-4 border border-secondary/10 shadow-xs border-l-black/10 text-sm font-medium text-secondary block",
                isGroupRightClass
              )}>
              {isGroupRight}
            </div>}
        </div>
        {(error || showCount && maxLength) && (
          <div className="flex items-center gap-2">
            {error &&
              <span className={cn(
                "text-xs font-medium text-danger block",
                errorClassName
              )}>{error}</span>}
            {showCount && maxLength && (
              <span className={cn(
                "text-xs font-medium ml-auto",
                isOverLimit ? "text-danger" : isNearLimit ? "text-warning" : "text-black/80"
              )}>
                {charCount} / {maxLength}
              </span>
            )}
          </div>)}
      </div >
    </>
  )
}
