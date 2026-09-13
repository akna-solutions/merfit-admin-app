// MB Fit Admin Panel — central design tokens.
// These feed Ant Design's ConfigProvider theme system (v5 token API).
// Keep this file as the single source of truth for brand colors & spacing
// so light/dark mode and any future re-skin only touch one place.

export const mbfitColors = {
  primary: "#2F6FED", // modern blue — MB Fit brand primary
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

export const mbfitRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const mbfitSpacing = {
  cardGap: 20, // 16-24px band requested by design spec
  pagePadding: 24,
};

// Shared tokens that apply regardless of light/dark algorithm.
export const baseThemeTokens = {
  colorPrimary: mbfitColors.primary,
  colorSuccess: mbfitColors.success,
  colorWarning: mbfitColors.warning,
  colorError: mbfitColors.error,
  colorInfo: mbfitColors.info,
  borderRadius: mbfitRadius.sm,
  controlHeight: 38,
  fontSize: 14,
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  wireframe: false,
};

export const lightThemeTokens = {
  ...baseThemeTokens,
  colorBgBase: mbfitColors.lightBgLayout,
  colorBgContainer: mbfitColors.lightBgContainer,
  colorBgElevated: mbfitColors.lightBgElevated,
  colorBgLayout: mbfitColors.lightBgLayout,
  colorText: mbfitColors.lightTextBase,
  colorTextSecondary: mbfitColors.lightTextSecondary,
  colorBorder: mbfitColors.lightBorder,
  colorBorderSecondary: mbfitColors.lightBorder,
};

export const darkThemeTokens = {
  ...baseThemeTokens,
  colorBgBase: mbfitColors.darkBgLayout,
  colorBgContainer: mbfitColors.darkBgContainer,
  colorBgElevated: mbfitColors.darkBgElevated,
  colorBgLayout: mbfitColors.darkBgLayout,
  colorText: mbfitColors.darkTextBase,
  colorTextSecondary: mbfitColors.darkTextSecondary,
  colorBorder: mbfitColors.darkBorder,
  colorBorderSecondary: mbfitColors.darkBorder,
};
// mode'dan bağımsız, sidebar için sabit dark ayarlar
export const sidebarForcedDarkComponents = {
  Layout: {
    siderBg: mbfitColors.siderBgDark,
  },
  Menu: {
    itemBorderRadius: mbfitRadius.sm,
    itemHeight: 42,
    itemMarginInline: 8,
    itemMarginBlock: 4,
    iconSize: 17,
    collapsedIconSize: 18,
    itemSelectedBg: "rgba(47,111,237,0.18)",
    itemSelectedColor: mbfitColors.primary,
    itemHoverBg: "rgba(255,255,255,0.04)",
    itemColor: mbfitColors.darkTextSecondary,
    groupTitleColor: "#5B6579",
    groupTitleFontSize: 11,
  },
};
// Component-level token overrides so we move away from "default AntD" look.
export const componentTokens = (mode) => ({
  Layout: {
    headerBg:
      mode === "dark"
        ? mbfitColors.darkBgContainer
        : mbfitColors.lightBgContainer,
    siderBg:
      mode === "dark" ? mbfitColors.siderBgDark : mbfitColors.siderBgLight,
    bodyBg:
      mode === "dark" ? mbfitColors.darkBgLayout : mbfitColors.lightBgLayout,
    headerHeight: 68,
    headerPadding: "0 24px",
  },
  Menu: {
    itemBorderRadius: mbfitRadius.sm,
    itemHeight: 42,
    itemMarginInline: 8,
    itemMarginBlock: 4,
    iconSize: 17,
    collapsedIconSize: 18,
    itemSelectedBg:
      mode === "dark" ? "rgba(47,111,237,0.18)" : "rgba(47,111,237,0.10)",
    itemSelectedColor: mbfitColors.primary,
    itemHoverBg:
      mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(16,24,40,0.03)",
    itemColor:
      mode === "dark"
        ? mbfitColors.darkTextSecondary
        : mbfitColors.lightTextSecondary,
    groupTitleColor: mode === "dark" ? "#5B6579" : "#98A2B3",
    groupTitleFontSize: 11,
  },
  Card: {
    borderRadiusLG: mbfitRadius.lg,
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
    headerBg: mode === "dark" ? mbfitColors.darkBgElevated : "#FAFBFC",
    borderRadiusLG: mbfitRadius.md,
    cellPaddingBlock: 14,
  },
  Button: {
    borderRadius: mbfitRadius.sm,
    controlHeight: 38,
    fontWeight: 500,
  },
  Tag: {
    borderRadiusSM: 6,
  },
  Progress: {
    defaultColor: mbfitColors.primary,
  },
});
