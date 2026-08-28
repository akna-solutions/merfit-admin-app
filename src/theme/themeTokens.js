// Merfit Admin Panel — central design tokens.
// These feed Ant Design's ConfigProvider theme system (v5 token API).
// Keep this file as the single source of truth for brand colors & spacing
// so light/dark mode and any future re-skin only touch one place.

export const merfitColors = {
  primary: "#2F6FED", // modern blue — Merfit brand primary
  primaryHover: "#1D5FE0",
  primaryActive: "#154DBF",
  success: "#22C55E",
  warning: "#F5A623",
  error: "#EF4444",
  info: "#2F6FED",

  // Light mode surfaces
  lightBgLayout: "#F5F7FA",
  lightBgContainer: "#FFFFFF",
  lightBgElevated: "#FFFFFF",
  lightBorder: "#E7EAF0",
  lightTextBase: "#101828",
  lightTextSecondary: "#667085",

  // Dark mode surfaces
  darkBgLayout: "#0F1420",
  darkBgContainer: "#171D2B",
  darkBgElevated: "#1E2536",
  darkBorder: "#2A3245",
  darkTextBase: "#EEF1F6",
  darkTextSecondary: "#93A0B4",

  // Sidebar (kept slightly distinct from body background in both modes)
  siderBgLight: "#FFFFFF",
  siderBgDark: "#121826",
};

export const merfitRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const merfitSpacing = {
  cardGap: 20, // 16-24px band requested by design spec
  pagePadding: 24,
};

// Shared tokens that apply regardless of light/dark algorithm.
export const baseThemeTokens = {
  colorPrimary: merfitColors.primary,
  colorSuccess: merfitColors.success,
  colorWarning: merfitColors.warning,
  colorError: merfitColors.error,
  colorInfo: merfitColors.info,
  borderRadius: merfitRadius.sm,
  controlHeight: 38,
  fontSize: 14,
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  wireframe: false,
};

export const lightThemeTokens = {
  ...baseThemeTokens,
  colorBgBase: merfitColors.lightBgLayout,
  colorBgContainer: merfitColors.lightBgContainer,
  colorBgElevated: merfitColors.lightBgElevated,
  colorBgLayout: merfitColors.lightBgLayout,
  colorText: merfitColors.lightTextBase,
  colorTextSecondary: merfitColors.lightTextSecondary,
  colorBorder: merfitColors.lightBorder,
  colorBorderSecondary: merfitColors.lightBorder,
};

export const darkThemeTokens = {
  ...baseThemeTokens,
  colorBgBase: merfitColors.darkBgLayout,
  colorBgContainer: merfitColors.darkBgContainer,
  colorBgElevated: merfitColors.darkBgElevated,
  colorBgLayout: merfitColors.darkBgLayout,
  colorText: merfitColors.darkTextBase,
  colorTextSecondary: merfitColors.darkTextSecondary,
  colorBorder: merfitColors.darkBorder,
  colorBorderSecondary: merfitColors.darkBorder,
};

// Component-level token overrides so we move away from "default AntD" look.
export const componentTokens = (mode) => ({
  Layout: {
    headerBg:
      mode === "dark"
        ? merfitColors.darkBgContainer
        : merfitColors.lightBgContainer,
    siderBg:
      mode === "dark" ? merfitColors.siderBgDark : merfitColors.siderBgLight,
    bodyBg:
      mode === "dark" ? merfitColors.darkBgLayout : merfitColors.lightBgLayout,
    headerHeight: 68,
    headerPadding: "0 24px",
  },
  Menu: {
    itemBorderRadius: merfitRadius.sm,
    itemHeight: 42,
    itemMarginInline: 8,
    itemMarginBlock: 4,
    iconSize: 17,
    collapsedIconSize: 18,
    itemSelectedBg:
      mode === "dark" ? "rgba(47,111,237,0.18)" : "rgba(47,111,237,0.10)",
    itemSelectedColor: merfitColors.primary,
    itemHoverBg:
      mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(16,24,40,0.03)",
    itemColor:
      mode === "dark"
        ? merfitColors.darkTextSecondary
        : merfitColors.lightTextSecondary,
    groupTitleColor: mode === "dark" ? "#5B6579" : "#98A2B3",
    groupTitleFontSize: 11,
  },
  Card: {
    borderRadiusLG: merfitRadius.lg,
    paddingLG: 20,
    boxShadowTertiary:
      mode === "dark"
        ? "0 1px 2px rgba(0,0,0,0.35)"
        : "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
  },
  Statistic: {
    titleFontSize: 13,
    contentFontSize: 26,
  },
  Table: {
    headerBg: mode === "dark" ? merfitColors.darkBgElevated : "#FAFBFC",
    borderRadiusLG: merfitRadius.md,
    cellPaddingBlock: 14,
  },
  Button: {
    borderRadius: merfitRadius.sm,
    controlHeight: 38,
    fontWeight: 500,
  },
  Tag: {
    borderRadiusSM: 6,
  },
  Progress: {
    defaultColor: merfitColors.primary,
  },
});
