// This file contains the Icon primitive component.
// It is not overwritten by the generate-icons script.

import type React from "react";

export function Icon({ className, children, ...props }: React.ComponentPropsWithRef<"svg">) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentcolor" fillRule="evenodd" clipRule="evenodd" {...props}>
      {children}
    </svg>
  );
}
