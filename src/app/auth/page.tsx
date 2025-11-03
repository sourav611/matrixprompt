"use client"

import { loginAction } from "@/actions/users"
import { Provider } from "@supabase/supabase-js"
import { motion, Variants } from "framer-motion"
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClickLoginButton = (provider: Provider) => {
    startTransition(async () => {
      const { errorMessage, url } = await loginAction(provider);
      if (!errorMessage && url) {
        router.push(url);
      } else {
        toast.error(errorMessage);
      }
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Section - 40% */}
      <motion.div
        className="w-full lg:w-[40%] flex flex-col p-6 lg:p-8 xl:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Fixed */}
        <div className="shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Main Content - Scrollable if needed */}
        <div className="flex-1 flex flex-col justify-center py-6 lg:py-8 max-w-md mx-auto w-full">
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">ArtesiaFlow</h2>
            <p className="text-xs text-gray-500 mt-1">
              Create stunning AI-generated imagery
            </p>
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="mb-5">
            <button
              onClick={() => handleClickLoginButton("google")}
              disabled={isPending}
              className="w-full cursor-pointer flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-300 font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isPending ? "Logging in.." : "Continue with Google"}
            </button>
          </motion.div>
        </div>

        {/* Footer - Fixed */}
        <motion.div
          variants={itemVariants}
          className="shrink-0 flex items-center justify-center gap-4 text-xs text-gray-500"
        >
          <a href="#" className="hover:text-gray-700">
            Terms
          </a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700">
            Privacy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-gray-700">
            Help
          </a>
        </motion.div>
      </motion.div>

      {/* Right Section  */}
      <motion.div
        className="hidden lg:block lg:w-[60%] relative bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                4,000+ Images to Play with
              </span>
            </div>
          </div>

          <div className="flex justify-end  bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl max-w-sm ">
            <p className="text-gray-900 font-medium text-sm mb-2">
              Stop faking it in Photoshop and Green Screen, Put yourself in the
              picture. Literally with one click
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-600"></div>
            </div>
          </div>
        </div>

        {/* Image Grid - 3 Column Masonry Layout */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
          {/* Column 1 - Full height tall image */}
          <motion.div
            className="relative overflow-hidden rounded-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Image
              src="/stockimages/standgir.png"
              alt="Ai generated girl standing near car"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
          </motion.div>

          {/* Column 2 - Two stacked images */}
          <div className="flex flex-col gap-1">
            <motion.div
              className="relative overflow-hidden rounded-sm flex-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src="/stockimages/miniontrek.png"
                alt="Ai generated girl standing near car"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-sm flex-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Image
                src="/stockimages/minioshine.jpeg"
                alt="Ai generated girl standing near car"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>

          {/* Column 3 - Two stacked images */}
          <div className="flex flex-col gap-1">
            <motion.div
              className="relative overflow-hidden rounded-sm flex-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Image
                src="/stockimages/divingwa.jpeg"
                alt="Ai generated girl standing near car"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-sm flex-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                alt="Forest landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}