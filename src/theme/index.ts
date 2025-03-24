import type { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import { lightThemeOverrides, darkThemeOverrides } from "./overrides";
import { lightTheme, darkTheme } from "naive-ui";

const themes = {
  light: { theme: lightTheme, overrides: lightThemeOverrides },
  dark: { theme: darkTheme, overrides: darkThemeOverrides },
}

const theme = ref<GlobalTheme>()
const themeOverrides = ref<GlobalThemeOverrides>()

const switchTheme = (to : "light" | "dark" | "auto") => {
  to = to=='auto'?window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light':to
  theme.value = themes[to].theme
  themeOverrides.value = themes[to].overrides
  document.documentElement.className = to
}

export { themes, theme, themeOverrides, switchTheme };