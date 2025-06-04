"use client";
import React, { useState, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { navLinks } from "../../constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import "./Navbar.css";
// import flogo from "../../assets/flogo.png";

const Logo = () => (
  <div className="logo-container">
    {/* <Image
      src={flogo}
      alt="logo"
      className="logo-image"
      width={120}
      height={96}
    /> */}
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
  const router = useRouter();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

  // Check for authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData && userData.email && userData.role) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('user');
      }
    };

    checkAuthStatus();
  }, []);

  const handleDropdownToggle = () => setDropdownOpen((prev) => !prev);

  const handleLinkClick = (title) => {
    setActive(title);
    setDropdownOpen(false); // Close dropdown on link click
    setToggle(false); // Close mobile menu
  };

  const handleUserDropdownToggle = () => setUserDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserDropdownOpen(false);
    router.push('/');
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    // Extract first name from email or use email
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-item')) {
        setDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${isLargeScreen ? "navbar-large" : "navbar-small"}`}>
      <div className="navbar-container">
        {!toggle && (
          <div className="navbar-left">
            <Link href="/" onClick={() => handleLinkClick("")}>
              <Logo />
            </Link>

            {/* Admin Portal User Section - Mobile Top Bar */}
            {!isLargeScreen && user && (
              <div className="admin-portal-mobile">
                <span className="admin-portal-text">Admin Portal</span>
                <div className="user-dropdown-mobile-top">
                  <a
                    className="user-link-mobile-top"
                    onClick={handleUserDropdownToggle}
                  >
                    <span className="user-icon">👤</span>
                    <span>{userDropdownOpen ? "▲" : "▼"}</span>
                  </a>
                  <ul className={`dropdown-menu user-dropdown-top ${userDropdownOpen ? "show" : ""}`}>
                    <li className="dropdown-item">
                      <Link href="/admin" onClick={() => handleLinkClick('Dashboard')}>
                        Dashboard
                      </Link>
                    </li>
                    <li className="dropdown-item">
                      <Link href="/vehicles/upload" onClick={() => handleLinkClick('Upload New')}>
                        Upload New
                      </Link>
                    </li>
                    <li className="dropdown-item">
                      <a onClick={handleLogout} className="logout-link">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <MobileNav toggle={toggle} setToggle={setToggle} />

        {/* Mobile Menu */}
        <div className={`mobile-menu ${toggle ? "show" : "hide"}`}>
          <ul className="nav-list mobile-list">
            {navLinks.filter(link => link.id !== 'login').map((link) => (
              <li key={link.id} className={`nav-item ${link.subLinks && dropdownOpen ? 'dropdown-open' : ''}`}>
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
                          <Link
                            href={`/${sub.id}`}
                            onClick={() => handleLinkClick(sub.title)}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    className={`nav-link ${active === link.title ? "active" : ""}`}
                    href={link.id === "home" ? "/" : `/${link.id}`}
                    onClick={() => handleLinkClick(link.title)}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}

            {/* Show Dealer Login only if not authenticated */}
            {!user && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/login"
                  onClick={() => handleLinkClick('Dealer Login')}
                >
                  Dealer Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="nav-list desktop-list">
          {navLinks.filter(link => link.id !== 'login').map((link) => (
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
                    {link.title} <span className="dropdown-arrow">{dropdownOpen ? "▲" : "▼"}</span>
                  </a>
                  <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                    {link.subLinks.map((sub) => (
                      <li key={sub.id} className="dropdown-item">
                        <Link
                          href={`/${sub.id}`}
                          onClick={() => handleLinkClick(sub.title)}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  className={`nav-link ${active === link.title ? "active" : ""}`}
                  href={link.id === "home" ? "/" : `/${link.id}`}
                  onClick={() => handleLinkClick(link.title)}
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}

          {/* User Authentication Section - Desktop */}
          <li className="nav-item user-auth-desktop">
            {user ? (
              <div className="user-dropdown-desktop">
                <a
                  className="nav-link user-link"
                  onClick={handleUserDropdownToggle}
                >
                  <span className="user-icon">👤</span>
                  {getUserDisplayName()}
                  <span className="dropdown-arrow">{userDropdownOpen ? "▲" : "▼"}</span>
                </a>
                <ul className={`dropdown-menu user-dropdown ${userDropdownOpen ? "show" : ""}`}>
                  <li className="dropdown-item">
                    <Link href="/admin" onClick={() => handleLinkClick('Dashboard')}>
                      Dashboard
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <a onClick={handleLogout} className="logout-link">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                className="nav-link"
                href="/login"
                onClick={() => handleLinkClick('Dealer Login')}
              >
                Dealer Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
