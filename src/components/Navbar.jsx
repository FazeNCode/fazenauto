"use client";
import React, { useState, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { navLinks } from "../constants";
import Link from "next/link";
import Image from "next/image";
import flogo from "../assets/flogo.png";

// Logo Component
const Logo = () => (
  <div className="flex items-center">
    <Image
      src={flogo}
      alt="logo"
      className="w-30 h-24 object-contain"
      width={120}
      height={96}
    />
    <p className="text-white text-[34px] font-bold cursor-pointer">
      <span className="sm:block hidden mx-[-24px]">FazeNAuto</span>
    </p>
  </div>
);

// MobileNav Component
const MobileNav = ({ toggle, setToggle }) => (
  <div className="md:hidden absolute top-10 right-10">
    <Hamburger
      toggled={toggle}
      toggle={setToggle}
      size={50}
      easing="ease-in"
      duration={0.7}
      rounded
    />
  </div>
);

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLargeScreen(window.innerWidth >= 768);

      const handleResize = () => {
        setIsLargeScreen(window.innerWidth >= 768);
        if (window.innerWidth >= 768) {
          setToggle(false);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav
      className={`w-full flex items-center ${
        isLargeScreen ? "py-5" : "py-2"
      } top-0 z-20 bg-primary bg-opacity-80 fixed`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <div className="flex items-center gap-2">
            <Logo />
          </div>
        </Link>

        <MobileNav toggle={toggle} setToggle={setToggle} />

        {/* Mobile Dropdown Menu */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[100%] z-10 rounded-xl`}
        >
          <ul className="list-none flex justify-center items-center flex-col gap-6 w-full">
            {navLinks.map((link) =>
              link.subLinks ? (
                <li key={link.id} className="relative">
                  <a
                    onClick={() => {
                      setActive(link.title);
                      handleDropdownToggle();
                    }}
                    className={`${
                      active === link.title ? "text-white" : "text-secondary"
                    } hover:text-white text-[20px] font-medium cursor-pointer flex justify-between w-full`}
                  >
                    {link.title}
                    <span>{dropdownOpen ? "▲" : "▼"}</span>
                  </a>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      dropdownOpen ? "max-h-60" : "max-h-0"
                    } w-full`}
                  >
                    {dropdownOpen && (
                      <ul className="bg-primary text-white py-2 mt-1 rounded-lg w-full">
                        {link.subLinks.map((subLink) => (
                          <li
                            key={subLink.id}
                            className="px-4 py-2 hover:bg-opacity-80 cursor-pointer"
                          >
                            <Link href={`/${subLink.id}`}>{subLink.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ) : (
                <li
                  key={link.id}
                  className={`${
                    active === link.title ? "text-white" : "text-secondary"
                  } hover:text-white text-[20px] font-medium cursor-pointer`}
                >
                  <Link href={`/${link.id}`}>{link.title}</Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Desktop Navigation */}
        <ul className="list-none hidden md:flex flex-row gap-10">
          {navLinks.map((link) =>
            link.subLinks ? (
              <li key={link.id} className="relative">
                <a
                  onClick={() => {
                    setActive(link.title);
                    handleDropdownToggle();
                  }}
                  className={`${
                    active === link.title ? "text-white" : "text-secondary"
                  } hover:text-white text-[20px] font-medium cursor-pointer flex justify-between`}
                >
                  {link.title}
                  <span>{dropdownOpen ? "▲" : "▼"}</span>
                </a>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    dropdownOpen ? "max-h-60" : "max-h-0"
                  } w-full`}
                >
                  {dropdownOpen && (
                    <ul className="absolute left-0 bg-primary text-white py-2 mt-1 rounded-lg">
                      {link.subLinks.map((subLink) => (
                        <li
                          key={subLink.id}
                          className="px-4 py-2 hover:bg-opacity-80 cursor-pointer"
                        >
                          <Link href={`/${subLink.id}`}>{subLink.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ) : (
              <li
                key={link.id}
                className={`${
                  active === link.title ? "text-white" : "text-secondary"
                } hover:text-white text-[20px] font-medium cursor-pointer`}
              >
                <Link href={`/${link.id}`}>{link.title}</Link>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
