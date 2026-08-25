"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TeamMember } from "@/lib/db/team";

interface TeamProfileCardProps {
  member: TeamMember;
}

export default function TeamProfileCard({ member }: TeamProfileCardProps) {
  const [activeResumeTab, setActiveResumeTab] = useState<"resume" | "skills" | "contact">("resume");

  return (
    <div className="bg-surface border border-black rounded-md p-5 flex flex-col gap-4 font-mono hover:border-black-secondary transition-all">
      {/* ── Top Profile Box Section ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-black-secondary pb-3">
        
        {/* White Photo Image Frame Box */}
        <div className="relative shrink-0 w-18 h-18 sm:w-24 sm:h-24 bg-white border border-black rounded-xl p-2 flex items-center justify-center shadow-sm group">
          <div className="relative w-full h-full overflow-hidden rounded-xs bg-surface flex items-center justify-center">
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-green-300 text-green-700 text-[8px] font-mono rounded-md border border-black uppercase font-bold shadow-xs">
            active
          </span>
        </div>

        {/* Position & Name Information */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 bg-black-secondary text-white text-[10px] font-mono rounded-md border border-black uppercase tracking-wide">
              {member.role}
            </span>
            <span className="text-xs font-mono text-black-secondary">
              SINCE {member.joinedYear} • {member.experienceYears}Y EXP
            </span>
          </div>

          <h2 className="text-xl sm:text-xl font-pixel text-black-primary tracking-wide">
            [ {member.name} ]
          </h2>

          <p className="text-xs font-mono text-text-secondary leading-relaxed max-w-2xl">
            {member.bio}
          </p>
        </div>
      </div>

      {/* ── Sort & Resume Component Section ── */}
      <div className="flex flex-col gap-2">
        {/* Tab Controls */}
        <div className="flex items-center justify-between border-black-secondary pb-2">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveResumeTab("resume")}
              className={`px-4 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                activeResumeTab === "resume"
                  ? "bg-border text-black-primary border-black"
                  : "bg-surface text-black-secondary border-border hover:bg-primary hover:text-black-primary"
              }`}
            >
              HIGHLIGHTS
            </button>
            <button
              type="button"
              onClick={() => setActiveResumeTab("skills")}
              className={`px-4 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                activeResumeTab === "skills"
                  ? "bg-border text-black-primary border-black"
                  : "bg-surface text-black-secondary border-border hover:bg-primary hover:text-black-primary"
              }`}
            >
              TECH STACK ({member.skills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveResumeTab("contact")}
              className={`px-4 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                activeResumeTab === "contact"
                  ? "bg-border text-black-primary border-black"
                  : "bg-surface text-black-secondary border-border hover:bg-primary hover:text-black-primary"
              }`}
            >
              CONTACT & INFO
            </button>
          </div>

          <span className="text-[10px] text-text-secondary uppercase hidden sm:inline-block">
            SORTED PROFILE DATA
          </span>
        </div>

        {/* Tab Content Display */}
        <div className="bg-border border border-black p-4 rounded-md text-xs">
          {activeResumeTab === "resume" && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between border-b border-black pb-2 gap-2">
                <div>
                  <span className="text-black-secondary uppercase font-bold">SPECIALTY: </span>
                  <span className="font-bold text-black-primary">{member.resume.specialty}</span>
                </div>
                <div className="text-text-secondary">
                  <span>DEGREE: </span>
                  <span className="text-black-primary">{member.resume.education}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-1">
                <span className="font-black text-xs text-black-secondary uppercase">
                  KEY ENGINEERING HIGHLIGHTS:
                </span>
                <ul className="flex flex-col gap-1.5 pl-2">
                  {member.resume.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-text-primary">
                      <span className="text-primary font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeResumeTab === "skills" && (
            <div className="flex flex-col gap-3">
              <span className="font-black text-xs text-black-secondary uppercase">
                CORE TECHNICAL COMPETENCIES:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white border border-black rounded-sm font-mono text-xs font-bold text-black-primary shadow-xs hover:bg-primary transition-colors"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeResumeTab === "contact" && (
            <div className="flex flex-col gap-3">
              <span className="font-pixel text-[11px] text-black-secondary uppercase">
                DIRECT CONTACT & NETWORKS:
              </span>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {member.socials.github && (
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-black-primary text-white rounded-sm border border-black hover:bg-primary hover:text-black-primary transition-colors flex items-center gap-1.5 text-xs font-mono"
                  >
                    <span>⌗</span> GitHub Profile
                  </a>
                )}
                {member.socials.twitter && (
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-black-primary text-white rounded-sm border border-black hover:bg-primary hover:text-black-primary transition-colors flex items-center gap-1.5 text-xs font-mono"
                  >
                    <span>𝕏</span> Twitter / X
                  </a>
                )}
                {member.socials.email && (
                  <a
                    href={`mailto:${member.socials.email}`}
                    className="px-3 py-1.5 bg-surface text-black-primary rounded-sm border border-black hover:bg-black-secondary hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                  >
                    <span>✉</span> {member.socials.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
