"use client";
import { motion, useAnimation, Variants } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export type AnimationType =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "zoom"
  | "flip"
  | "rotate"
  | "bounce";

interface ScrollRevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  distance?: number;
  className?: string;
  custom?: Variants;
}

const getAnimationVariants = (
  duration: number,
  delay: number,
  distance: number,
): Record<AnimationType, Variants> => ({
  fadeUp: {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -distance },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
  },
  fadeRight: {
    hidden: { opacity: 0, x: distance },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 90 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: duration,
        delay: delay,
      },
    },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -15 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
      },
    },
  },
  bounce: {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  },
});

const ScrollReveal = ({
  children,
  type = "fadeUp",
  delay = 0,
  duration = 0.8,
  staggerChildren = 0.2,
  threshold = 0.2,
  once = true,
  stagger = false,
  distance = 50,
  className = "",
  custom,
}: ScrollRevealProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  const currentVariants =
    custom || getAnimationVariants(duration, delay, distance)[type];

  if (stagger && Array.isArray(children)) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerChildren,
            },
          },
        }}
      >
        {(children as ReactNode[]).map((child, index) => {
          const childVariants = getAnimationVariants(
            duration,
            delay + index * staggerChildren,
            distance,
          )[type];

          return (
            <motion.div key={index} variants={childVariants}>
              {child}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={currentVariants}
    >
      {children}
    </motion.div>
  );
};

export { ScrollReveal };
