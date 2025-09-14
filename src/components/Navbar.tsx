"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdLanguage } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiMenu } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="w-full shadow-sm bg-gradient-to-b from-transparent to-[#F7F7F7]">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 min-h-[52px]">
        {/* Left - Logo */}
        <div className="text-xxl font-bold py-2 md:py-0">Logo</div>

        {/* Center - Tabs */}
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  {/* Tabs at the top center */}
  <div className="flex justify-center w-full mt-5 ">
    <TabsList className="flex gap-3 bg-secondary w-auto">
      <TabsTrigger value="home">Home</TabsTrigger>
      <TabsTrigger value="experience">Experiences</TabsTrigger>
      <TabsTrigger value="services">Services</TabsTrigger>
    </TabsList>
  </div>

  {/* Content below tabs */}
  <div className="flex justify-center mt-02 mb-5 w-full">
    <div className="w-full md:w-[900px]">
      {activeTab === "home" && (
        <TabsContent value="home">
          <SearchBar />
        </TabsContent>
      )}
      {activeTab === "experience" && (
        <TabsContent value="experience">
          <div className="h-14 md:h-0">Process to Development Exprience </div>
        </TabsContent>
      )}
      {activeTab === "services" && (
        <TabsContent value="services">
          <div className="h-14 md:h-0">Process to Development services</div>
        </TabsContent>
      )}
    </div>
  </div>
</Tabs>

        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          {/* Host Dialog */}
          <Dialog>
           <DialogTrigger className="inline-block md:hidden lg:hidden xl:inline-block px-3 py-1 text-sm rounded-lg border">
              Become a host
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Become a host</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Please confirm your choice.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Language Dialog */}
          <Dialog>
            <DialogTrigger className="p-2 rounded-full hover:bg-gray-100">
              <MdLanguage size={20} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Language</DialogTitle>
                <DialogDescription>Choose your preferred language.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100">
              <FiMenu size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
