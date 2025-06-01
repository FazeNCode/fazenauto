"use client";
import React, { useState, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { navLinks } from "../../constants";
import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";
import flogo from "../../assets/flogo.png";

const Logo = () => (
  <div className="logo-container">
    <Image
      src={flogo}
      alt="logo"
      className="logo-image"
      width={120}
      height={96}
    />
    <p className="logo-text">
      <span className="logo-text-desktop">FazeNAuto</span>
    </p>
  </div>
);

const MobileNav = ({ toggle, setToggle }) => (
  <div className="mobile-nav-toggle">
    <Hamburger
      toggled={toggle}
      toggle={setToggle}
      size={30}
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
      const handleResize = () => {
        const isLarge = window.innerWidth >= 768;
        setIsLargeScreen(isLarge);
        if (isLarge) {
          setToggle(false); // Close mobile menu if resizing to desktop
        }
      };

      setIsLargeScreen(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleDropdownToggle = () => setDropdownOpen((prev) => !prev);

  const handleLinkClick = (title) => {
    setActive(title);
    setDropdownOpen(false); // Close dropdown on link click
    setToggle(false); // Close mobile menu
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-item')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${isLargeScreen ? "navbar-large" : "navbar-small"}`}>
      <div className="navbar-container">
        {!toggle && (
          <Link href="/" onClick={() => handleLinkClick("")}>
            <Logo />
          </Link>
        )}

        <MobileNav toggle={toggle} setToggle={setToggle} />

        {/* Mobile Menu */}
        <div className={`mobile-menu ${toggle ? "show" : "hide"}`}>
          <ul className="nav-list mobile-list">
            {navLinks.map((link) => (
              <li key={link.id} className="nav-item">
                {link.subLinks ? (
                  <>
                    <a
                      className={`nav-link ${active === link.title ? "active" : ""}`}
                      onClick={() => {
                        setActive(link.title);
                        handleDropdownToggle();
                      }}
                    >
                      {link.title} <span>{dropdownOpen ? "▲" : "▼"}</span>
                    </a>
                    <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                      {link.subLinks.map((sub) => (
                        <li key={sub.id} className="dropdown-item">
                          <Link href={`/${sub.id}`}>{sub.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    className={`nav-link ${active === link.title ? "active" : ""}`}
                    href={`/${link.id}`}
                    onClick={() => handleLinkClick(link.title)}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="nav-list desktop-list">
          {navLinks.map((link) => (
            <li key={link.id} className="nav-item">
              {link.subLinks ? (
                <>
                  <a
                    className={`nav-link ${active === link.title ? "active" : ""}`}
                    onClick={() => {
                      setActive(link.title);
                      handleDropdownToggle();
                    }}
                  >
                    {link.title} <span>{dropdownOpen ? "▲" : "▼"}</span>
                  </a>
                  <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                    {link.subLinks.map((sub) => (
                      <li key={sub.id} className="dropdown-item">
                        <Link href={`/${sub.id}`}>{sub.title}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  className={`nav-link ${active === link.title ? "active" : ""}`}
                  href={`/${link.id}`}
                  onClick={() => handleLinkClick(link.title)}
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
