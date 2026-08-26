"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamProfileCard from "@/components/TeamProfileCard";
import { TEAM_MEMBERS } from "@/lib/db/team";

export default function PixlTeam() {
  const [selectedRoleFilter] = useState<string>("ALL");

  const filteredMembers =
    selectedRoleFilter === "ALL"
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((m) =>
          m.role.toUpperCase().includes(selectedRoleFilter.toUpperCase())
        );

  return (
    <div className="bg-surface min-h-screen flex flex-col font-mono">
      <Header />

      {/* Main Content */}
      <main className="grow w-full max-w-full mx-auto px-24 mt-12 py-8 flex flex-col gap-4">
        {/* Back Link */}
        <Link
          href="/"
          className="self-start text-xs font-mono text-black-primary hover:text-black-secondary transition-colors flex items-center gap-3"
        >
          &lt; BACK
        </Link>

        <h1 className="text-lg sm:text-md font-pixel text-black-secondary tracking-wide uppercase">
          +++ PIXLAPE_TEAM + CREATORS & ARCHITECTS ++++
        </h1>

        {/* Console Container */}
        <div className="bg-border border border-black rounded-lg p-6 sm:p-8 shadow-md text-black flex flex-col">

          {/* Team Profile Cards List */}
          <div className="flex flex-col gap-4">
            {filteredMembers.map((member) => (
              <TeamProfileCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}