"use client";

import { motion, useInView } from "motion/react";
import React from "react";

const animateInVariants = {
  fadeInAndUp: {
    hidden: {
      opacity: 0,
      translateY: 48,
    },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  },
};

type AnimateInVariants = keyof typeof animateInVariants;

interface AnimateInProps extends Omit<React.ComponentPropsWithRef<typeof motion.div>, "variants"> {
  variants?: AnimateInVariants;
  asChild?: string;
}

export function AnimateIn({ children, className, variants = "fadeInAndUp", ...props }: AnimateInProps) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.p ref={ref} variants={animateInVariants[variants]} initial={inView ? "visible" : "hidden"} whileInView="visible" className={className} {...props}>
      {children}
    </motion.p>
  );
}
