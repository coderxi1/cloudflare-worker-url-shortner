import { defineStore } from "pinia";

export const useStatusStore = defineStore(
  "status",
  () => ({
    token: ref<string|undefined>(),
    isLogin: ref(false),
    siteLang: ref<"zh-CN" | "en" | "ja-JP">("zh-CN"),
    theme: ref<"light" | "dark" | "auto">("auto"),
  }),
  {
    persist: {
      storage: localStorage,
    },
  }
);
