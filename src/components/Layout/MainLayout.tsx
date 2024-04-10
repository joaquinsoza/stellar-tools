import {
  useDisclosure,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";
import Nav from "./Navbar";
import { SidebarContent } from "./SideBar/Sidebar";
import { SidebarContext } from "@/context/sidebar/SidebarContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}
    >
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <Nav onOpen={onOpen} zIndex={50} />
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
          zIndex={50}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 20 }} p="4" pt={24}>
          {children}
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
};

export default MainLayout;
