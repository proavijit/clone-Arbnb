"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#F7F7F7] to-transparent text-gray-900 py-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo/Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold">Logo</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your platform for amazing properties.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-gray-700 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-gray-700 transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-700 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-700 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
                aria-label="GitHub"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Twitter"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Instagram"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
