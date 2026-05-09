"use client";


import {
  ChevronDown,
  Menu,
  Settings,
  User,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function Navbar() {
  const router = useRouter();
  // const {
  //   isAdmin,
  //   isArtist,
  //   isLoading,
  //   isUser,
  //   isAuthenticated,
  //   user,
  // } = useCurrentUser();

  const isAuthenticated = false;
  const user = null;

  const isUser = false;
  const isAdmin = false;
  const isLoading = false;



  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },

  ];



  // const handleLogOut = async () => {
  //   try {
  //     await logout();
  //     toast.success("Logged out successfully!");
  //     router.replace("/signin");
  //   } catch (error) {
  //     toast.error("Something went wrong, please try again.");
  //   }
  // };

  return (
    <>
      <nav className="bg-white lg:border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                // src="/newLogo.svg"
                alt="logo"
                width={200}
                height={200}
                className="w-40 lg:w-44"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 relative">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-[17px] text-gray-900 hover:text-gradient transition-colors ${pathname === link.href ? "font-semibold text-purple-700" : ""
                    }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">



                  <div className="relative ">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={

                          "https://img.icons8.com/nolan/1200/user-default.jpg"
                        }
                        // src={
                        //   user.profilePic
                        //     ? user.profilePic
                        //     : "https://img.icons8.com/nolan/1200/user-default.jpg"
                        // }
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="z-50">
                        <div
                          className="fixed inset-0 "
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                          <a
                            href={`/`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">
                              My Profile
                            </span>
                          </a>
                          <a
                            href="/settings/profile-settings"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Settings
                            </span>
                          </a>

                          <Button
                            // onClick={handleLogOut}
                            className="w-full mt-2 cursor-pointer"
                          >
                            Log Out
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>

                  <Link href="/signin">
                    <button className="px-6 py-2.5  rounded-lg hover:bg-gray-100 transition-colors cursor-pointer btn-gradient">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}

            <div className="lg:hidden flex items-center gap-3">

              <button
                className="lg:hidden p-2 cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-sm text-nowrap text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 space-y-2 border-t border-gray-200">
                {user ? (
                  <>
                    <a
                      href={`/`}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        My Profile
                      </span>
                    </a>
                    <a
                      href="/settings/profile-settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Settings
                      </span>
                    </a>
                  </>
                ) : (
                  <>
                    <button

                      className="w-full px-4 py-2  rounded-lg transition-colors cursor-pointer btn-gradient"
                    >
                      Sign Up
                    </button>
                    <button className="w-full px-4 py-2 bg-transparent  text-gray-900 rounded-lg hover:bg-gray-100 transition-colors border">
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>


    </>
  );
}
