"use client";
import React, { useState, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { navLinks } from "../../constants";
import Link from "next/link";
import Image from "next/image";
// import flogo from "../assets/flogo.png";
import "./Navbar.css";
import flogo from '../../assets/flogo.png'; // 

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
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className={`navbar ${isLargeScreen ? "navbar-large" : "navbar-small"}`}>
      <div className="navbar-container">
        <Link href="/" onClick={() => {
          setActive("");
          window.scrollTo(0, 0);
        }}>
          <Logo />
        </Link>

        <MobileNav toggle={toggle} setToggle={setToggle} />

        {/* Mobile Menu */}
        <div className={`mobile-menu ${toggle ? "show" : "hide"}`}>
          <ul className="nav-list mobile-list">
            {navLinks.map((link) => (
              <li key={link.id} className="nav-item">
                {link.subLinks ? (
                  <>
                    <a className={`nav-link ${active === link.title ? "active" : ""}`} onClick={() => {
                      setActive(link.title);
                      handleDropdownToggle();
                    }}>
                      {link.title}
                      <span>{dropdownOpen ? "▲" : "▼"}</span>
                    </a>
                    {dropdownOpen && (
                      <ul className="dropdown-menu">
                        {link.subLinks.map(sub => (
                          <li key={sub.id} className="dropdown-item">
                            <Link href={`/${sub.id}`}>{sub.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link className={`nav-link ${active === link.title ? "active" : ""}`} href={`/${link.id}`}>{link.title}</Link>
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
                  <a className={`nav-link ${active === link.title ? "active" : ""}`} onClick={() => {
                    setActive(link.title);
                    handleDropdownToggle();
                  }}>
                    {link.title}
                    <span>{dropdownOpen ? "▲" : "▼"}</span>
                  </a>
                  {dropdownOpen && (
                    <ul className="dropdown-menu desktop-dropdown">
                      {link.subLinks.map(sub => (
                        <li key={sub.id} className="dropdown-item">
                          <Link href={`/${sub.id}`}>{sub.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link className={`nav-link ${active === link.title ? "active" : ""}`} href={`/${link.id}`}>{link.title}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
