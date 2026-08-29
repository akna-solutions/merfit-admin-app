import React from "react";

// Thin structural wrapper so every feature page shares the same vertical
// rhythm between header / filter bar / content sections (spec §3, §38).
export default function PageContainer({ children }) {
  return <div className="merfit-page">{children}</div>;
}
