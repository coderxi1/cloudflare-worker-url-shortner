import type { SelectOption } from "naive-ui";
import zh from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import en from "./locales/en.json";
import jp from "./locales/ja-JP.json";

import { createI18n } from 'vue-i18n';

const i18n = createI18n(({
  legacy: false,
  locale: "zh-CN",
  messages: {
    "zh-CN": zh,
    "zh-TW": zhTW,
    "en": en,
    "ja-JP": jp
  },
  fallbackLocale: "zh-CN"
}));

const i18nSelectOptions : SelectOption[] = [
  {
    label: "简体中文",
    value: "zh-CN",
  },
  {
    label: "繁體中文",
    value: "zh-TW",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "日本語",
    value: "ja-JP",
  }
]

export default i18n;

export { i18nSelectOptions }
