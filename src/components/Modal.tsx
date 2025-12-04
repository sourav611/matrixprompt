"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useEffect, ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const closeModal = () => {
    router.back();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={closeModal}
      className="fixed inset-0 z-50 m-0 flex h-dvh w-screen max-w-none max-h-none items-center justify-center border-none bg-transparent p-0 outline-none backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {/* Custom Backdrop for animation control if needed, but native backdrop is used above. 
          We'll add a click layer here just in case native backdrop click is inconsistent. */}
      <div
        className="fixed inset-0 z-0 bg-black/80 backdrop-blur-md"
        onClick={closeModal}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
          mass: 0.8,
        }}
        className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-background shadow-2xl ring-1 ring-white/10 md:rounded-none lg:h-[90vh] lg:w-[90vw] lg:max-w-[1400px] lg:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 lg:right-6 lg:top-6"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </motion.div>
    </dialog>
  );
}
