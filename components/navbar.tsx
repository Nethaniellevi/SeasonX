import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { NavbarTeamButton } from "./navbar-team-button";

export async function Navbar() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DDDDDD] bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 font-semibold text-xl text-[#222222] tracking-tight">
          Season<span style={{ color: "var(--team-primary)" }}>X</span>
        </Link>

        {/* Center pill search bar — Airbnb style */}
        <div className="hidden md:flex flex-1 justify-center">
          <Link
            href="/marketplace"
            className="flex items-center gap-0 rounded-full border border-[#DDDDDD] bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
          >
            <div className="flex items-center px-5 py-3 text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] transition-colors">
              🏟️ <span className="ml-2">Sport</span>
            </div>
            <div className="w-px h-6 bg-[#DDDDDD]" />
            <div className="flex items-center px-5 py-3 text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] transition-colors">
              📅 <span className="ml-2">Date</span>
            </div>
            <div className="w-px h-6 bg-[#DDDDDD]" />
            <div className="flex items-center gap-2 pl-5 pr-2 py-2">
              <span className="text-sm text-[#717171]">Search tickets</span>
              <div
                className="transition-colors rounded-full p-2"
                style={{ backgroundColor: "var(--team-primary)" }}
              >
                <Search className="h-4 w-4 text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile search icon */}
        <div className="flex md:hidden flex-1 justify-end">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 rounded-full border border-[#DDDDDD] px-4 py-2 shadow-sm text-sm font-semibold text-[#222222]"
          >
            <Search className="h-4 w-4" />
          </Link>
        </div>

        {/* Nav links + Auth */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            href="/seller/verify"
            className="hidden md:block text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2 rounded-full transition-colors"
          >
            Sell tickets
          </Link>

          <NavbarTeamButton />

          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:block text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2 rounded-full transition-colors"
              >
                Dashboard
              </Link>
              <div className="ml-2 border border-[#DDDDDD] rounded-full p-2 flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2 rounded-full transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="font-semibold text-sm rounded-full px-5 py-2.5 transition-colors"
                style={{
                  backgroundColor: "var(--team-primary)",
                  color: "var(--team-on-primary)",
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
