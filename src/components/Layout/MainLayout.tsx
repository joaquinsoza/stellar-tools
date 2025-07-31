"use client";

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { useState, Fragment } from "react";
import Nav from "./Navbar";
import { SidebarContent } from "./SideBar/Sidebar";
import { SidebarContext } from "@/context/sidebar/SidebarContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onDrawerOpen = () => setIsDrawerOpen(true);
  const onDrawerClose = () => setIsDrawerOpen(false);

  return (
    <SidebarContext.Provider
      value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}
    >
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Nav onOpen={onDrawerOpen} />
        <SidebarContent
          onClose={onDrawerClose}
          className="hidden md:block"
        />
        
        <Transition show={isDrawerOpen} as={Fragment}>
          <Dialog onClose={onDrawerClose} className="relative z-50 md:hidden">
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </TransitionChild>

            <div className="fixed inset-0 z-50 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col">
                  <SidebarContent onClose={onDrawerClose} />
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        <div className="ml-0 md:ml-20 p-4 pt-24">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default MainLayout;
