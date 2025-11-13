import { RefObject } from "react";
import { gsap } from "gsap";

interface UseAuthAnimationsProps {
  logoRef: RefObject<HTMLDivElement | null>;
  loginFormRef: RefObject<HTMLFormElement | null>;
  registerFormRef: RefObject<HTMLFormElement | null>;
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  onModeChange?: () => void;
}

export function useAuthAnimations({
  logoRef,
  loginFormRef,
  registerFormRef,
  isLogin,
  setIsLogin,
  onModeChange,
}: UseAuthAnimationsProps) {
  const animateToRegister = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.to(loginFormRef.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.3,
        onComplete: () => {
          loginFormRef.current?.reset();
          setIsLogin(false);
          onModeChange?.();
          gsap.set(loginFormRef.current, { scale: 1 });
        },
      });
    } else {
      const tl = gsap.timeline();
      tl.to(loginFormRef.current, {
        autoAlpha: 0,
        scale: 0.9,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      })
        .to(
          logoRef.current,
          {
            opacity: 0,
            scale: 0.8,
            rotateY: 90,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "-=0.2"
        )
        .call(() => {
          loginFormRef.current?.reset();
          setIsLogin(false);
          onModeChange?.();
        })
        .set(loginFormRef.current, { scale: 1, y: 0 })
        .to(logoRef.current, {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        })
        .fromTo(
          registerFormRef.current,
          { autoAlpha: 0, scale: 0.9, y: 20 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }
  };

  const animateToLogin = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.to(registerFormRef.current, {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.3,
        onComplete: () => {
          registerFormRef.current?.reset();
          setIsLogin(true);
          onModeChange?.();
          gsap.set(registerFormRef.current, { scale: 1 });
        },
      });
    } else {
      const tl = gsap.timeline();
      tl.to(registerFormRef.current, {
        autoAlpha: 0,
        scale: 0.9,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      })
        .to(
          logoRef.current,
          {
            opacity: 0,
            scale: 0.8,
            rotateY: -90,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "-=0.2"
        )
        .call(() => {
          registerFormRef.current?.reset();
          setIsLogin(true);
          onModeChange?.();
        })
        .set(registerFormRef.current, { scale: 1, y: 0 })
        .to(logoRef.current, {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        })
        .fromTo(
          loginFormRef.current,
          { autoAlpha: 0, scale: 0.9, y: 20 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }
  };

  const toggleMode = () => {
    if (isLogin) {
      animateToRegister();
    } else {
      animateToLogin();
    }
  };

  return { toggleMode };
}
