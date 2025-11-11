// src/components/ui/navbar.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  Users,
  Calendar,
  MapPin,
  BarChart3,
  // NEW ICON IMPORT
  Smartphone, // Added for Device View
} from "lucide-react";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface NavbarProps {
  className?: string;
}

// Marketing dashboard navigation items
const navigationItems: NavigationItem[] = [
  { id: "overview", name: "Overview", icon: Home, href: "/" },
  {
    id: "campaign-view",
    name: "Campaign View",
    icon: Target,
    href: "/campaign-view",
  },
  {
    id: "demographic-view",
    name: "Demographic View",
    icon: Users,
    href: "/demographic-view",
  },
  {
    id: "weekly-view",
    name: "Weekly View",
    icon: Calendar,
    href: "/weekly-view",
  },
  {
    id: "region-view",
    name: "Region View",
    icon: MapPin,
    href: "/region-view",
  },
  // 🚀 NEW: Device View link added here
  {
    id: "device-view",
    name: "Device View",
    icon: Smartphone,
    href: "/device-view",
  },
];

export function Navbar({ className = "" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Determine active item based on current pathname
  const getActiveItem = (currentPath: string) => {
    const currentItem = navigationItems.find(
      (item) => item.href === currentPath
    );
    return currentItem ? currentItem.id : "overview";
  };

  const [activeItem, setActiveItem] = useState(() => getActiveItem(pathname));

  // Update active item when pathname changes
  useEffect(() => {
    setActiveItem(getActiveItem(pathname));
  }, [pathname]);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string, href: string) => {
    setActiveItem(itemId);
    router.push(href);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-30 p-3 rounded-lg bg-gray-800 shadow-md border border-gray-700 lg:hidden hover:bg-gray-700 transition-all duration-200 cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-300" />
        ) : (
          <Menu className="h-5 w-5 text-gray-300" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 z-40 transition-all duration-300 ease-in-out flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    ${isCollapsed ? "w-20" : "w-72"}
    lg:translate-x-0 lg:static lg:z-auto lg:h-auto
    ${className}
  `}
      >
        {/*
         
        - old Aside. // reason for collapsing. 
            className={`
                    fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 z-40 transition-all duration-300 ease-in-out flex flex-col
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    ${isCollapsed ? "w-20" : "w-72"}
                    lg:translate-x-0 lg:static lg:z-auto
                    ${className}
                  `}
        
        */}
        {/* Header with logo and collapse button */}
        <div
          className={`flex items-center border-b border-gray-700 bg-gray-900/60 ${
            isCollapsed ? "flex-col p-3" : "justify-between p-5"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base">
                  Amana Marketing
                </span>
                <span className="text-xs text-gray-400">
                  Marketing Dashboard
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm mb-2">
              <span className="text-white font-bold text-base">A</span>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-gray-700 transition-all duration-200 cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id, item.href)}
                    className={`
                      w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group cursor-pointer
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon
                        className={`
                          h-4.5 w-4.5 flex-shrink-0
                          ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-200"
                          }
                        `}
                      />
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-sm ${
                            isActive ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <span
                            className={`
                            px-1.5 py-0.5 text-xs font-medium rounded-full
                            ${
                              isActive
                                ? "bg-blue-500 text-white"
                                : "bg-gray-600 text-gray-200"
                            }
                          `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Badge for collapsed state */}
                    {isCollapsed && item.badge && (
                      <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-blue-600 border border-gray-800">
                        <span className="text-[10px] font-medium text-white">
                          {parseInt(item.badge) > 9 ? "9+" : item.badge}
                        </span>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                        {item.badge && (
                          <span className="ml-1.5 px-1 py-0.5 bg-gray-700 rounded-full text-[10px]">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section with profile */}
        <div className="mt-auto border-t border-gray-700">
          {/* Profile Section */}
          <div
            className={`bg-gray-900/30 ${
              isCollapsed ? "py-4 px-2" : "px-3 py-2"
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-200 font-medium text-sm">AM</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-white truncate">
                    Marketing Team
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Campaign Manager
                  </p>
                </div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full ml-2"
                  title="Online"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-200 font-medium text-sm">
                      AM
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
