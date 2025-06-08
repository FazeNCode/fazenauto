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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in from another tab or component)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkAuthStatus();
      }
    };

    // Listen for custom login event
    const handleLoginEvent = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLoginEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLoginEvent);
    };
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
    // Close user dropdown when inventory dropdown opens
    if (!dropdownOpen) {
      setUserDropdownOpen(false);
    }
  };

  const handleLinkClick = (title) => {
    setActive(title);
    setDropdownOpen(false); // Close dropdown on link click
    setToggle(false); // Close mobile menu
  };

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen((prev) => !prev);
    // Close inventory dropdown when user dropdown opens
    if (!userDropdownOpen) {
      setDropdownOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setUserDropdownOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserDropdownOpen(false);
    setShowLogoutConfirm(false);
    router.push('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    // Extract name from email (part before @)
    const emailName = user.email.split('@')[0];
    // Handle common email patterns like dealer@ali.com -> ali, john.doe@company.com -> john
    const name = emailName.includes('.') ? emailName.split('.')[0] : emailName;
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside inventory dropdown
      if (!event.target.closest('.nav-item') && !event.target.closest('.dropdown-menu')) {
        setDropdownOpen(false);
      }

      // Check if click is outside user dropdown (more specific)
      if (!event.target.closest('.admin-portal-mobile') &&
          !event.target.closest('.user-dropdown-desktop') &&
          !event.target.closest('.user-dropdown-top')) {
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
          </div>
        )}

        {/* Admin Portal User Section - Mobile Top Bar (moved next to hamburger) */}
        {!isLargeScreen && user && (
          <div className="admin-portal-mobile">
            <div className="user-dropdown-mobile-top">
              <a
                className="user-link-mobile-top"
                onClick={handleUserDropdownToggle}
              >
                <span className="admin-portal-text">{getUserDisplayName()}</span>
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
                  <Link href="/admin/vehicle-info" onClick={() => handleLinkClick('Vehicle Info')}>
                    Vehicle Info
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link href="/vehicles/upload" onClick={() => handleLinkClick('Upload New')}>
                    Upload New
                  </Link>
                </li>
                <li className="dropdown-item">
                  <a onClick={handleLogoutClick} className="logout-link">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
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
                    <Link href="/admin/vehicle-info" onClick={() => handleLinkClick('Vehicle Info')}>
                      Vehicle Info
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/vehicles/upload" onClick={() => handleLinkClick('Upload New')}>
                      Upload New
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <a onClick={handleLogoutClick} className="logout-link">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="user-dropdown-desktop">
                <a
                  className="nav-link"
                  onClick={handleUserDropdownToggle}
                >
                  Dealer Login
                  <span className="dropdown-arrow">{userDropdownOpen ? "▲" : "▼"}</span>
                </a>
                <ul className={`dropdown-menu user-dropdown ${userDropdownOpen ? "show" : ""}`}>
                  <li className="dropdown-item">
                    <Link href="/login" onClick={() => handleLinkClick('Login')}>
                      Login
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/vehicles/upload" onClick={() => handleLinkClick('Upload New')}>
                      Upload New
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="logout-modal-buttons">
              <button onClick={confirmLogout} className="logout-confirm-btn">
                Yes
              </button>
              <button onClick={cancelLogout} className="logout-cancel-btn">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
