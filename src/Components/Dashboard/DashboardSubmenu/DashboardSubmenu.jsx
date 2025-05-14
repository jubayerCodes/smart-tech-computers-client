"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import DashboardSubmenuActiveLink from "../DashboardSubmenuActiveLink/DashboardSubmenuActiveLink";
import { usePathname } from "next/navigation";

const DashboardSubmenu = ({
  submenuItems,
  icon,
  submenuTitle,
  handleSubmenuToggle,
}) => {
  const [submenuActive, setSubmenuActive] = useState(false);
  const submenuRef = useRef();

  const paths = submenuItems?.map((item) => item?.href);

  const currentPath = usePathname();

  useEffect(() => {
    const active = paths?.find((path) => currentPath.startsWith(path));

    setSubmenuActive(!!active);
  }, [currentPath]);

  return (
    <li
      ref={submenuRef}
      className={`submenu-active ${submenuActive ? "active" : ""}`}
    >
      <a
        className="submenu-toggle"
        onClick={() => handleSubmenuToggle(submenuRef?.current)}
      >
        {icon}
        <span className="text">{submenuTitle}</span>
        <FaAngleDown className="arrow-icon" />
      </a>
      <ul className={`sub-menu`}>
        {submenuItems?.map((item, idx) => (
          <DashboardSubmenuActiveLink
            key={idx}
            href={item?.href}
            setSubmenuActive={setSubmenuActive}
          >
            {item?.title}
          </DashboardSubmenuActiveLink>
        ))}
      </ul>
    </li>
  );
};

export default DashboardSubmenu;
