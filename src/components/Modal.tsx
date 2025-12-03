"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useEffect, ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeModal = () => {
    router.back();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={closeModal}
      className="fixed inset-0 z-50  w-screen  bg-zinc-900/50 backdrop-blur-sm"
    >
      <div
        className="absolute inset-0"
        onClick={() => router.back()}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative mx-auto h-[85vh] w-[calc(85vw-60px)]"
      >
        <button
          onClick={closeModal}
          className="absolute -top-10 right-0 z-50 rounded-full bg-white/20 p-2 text-white"
        >
          X
        </button>
        {children}
      </motion.div>
    </dialog>
  );
}
