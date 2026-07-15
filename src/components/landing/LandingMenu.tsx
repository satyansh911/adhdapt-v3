"use client";

import { StaggeredMenu, type StaggeredMenuItem } from "@/components/StaggeredMenu";

const ITEMS: StaggeredMenuItem[] = [
  { label: "Home", link: "/", ariaLabel: "Go home" },
  { label: "Features", link: "/#modules", ariaLabel: "See features" },
  { label: "Login", link: "/login", ariaLabel: "Log in" },
];

/**
 * Full-screen staggered overlay menu that replaces the old top navbar. It
 * renders its own fixed header with the ADHDapt logo + a menu toggle button.
 */
export default function LandingMenu() {
  return (
    <StaggeredMenu
      isFixed
      position="right"
      items={ITEMS}
      displaySocials={false}
      displayItemNumbering
      logoUrl="/home/logo.png"
      menuButtonColor="#ececf0"
      openMenuButtonColor="#111"
      changeMenuColorOnOpen
      accentColor="#ED1C24"
      colors={["#141414", "#ED1C24"]}
    />
  );
}
