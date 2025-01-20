import { type ThemeColors, themes } from "@config/ui";

export function setGlobalColorTheme(color: ThemeColors, defaultThemeColor: ThemeColors, themeMode: "light" | "dark") {
  if (!themes[color]) {
    const theme = themes[defaultThemeColor][themeMode] as {
      [key: string]: string;
    };
    for (const key in theme) {
      document.documentElement.style.setProperty(`--${key}`, theme[key] || null);
    }
    return;
  }

  const theme = themes[color][themeMode] as {
    [key: string]: string;
  };
  for (const key in theme) {
    document.documentElement.style.setProperty(`--${key}`, theme[key] || null);
  }
}

export const parseGradient = (gradient: string) => {
  const colorStops = gradient.match(/#[0-9a-fA-F]{6}/g);
  return colorStops;
};
