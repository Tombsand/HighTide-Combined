<template>
  <header
    class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-100000"
  >
    <div
      class="mx-auto flex h-16 w-full items-center justify-between px-6"
    >
    <RouterLink to="/" class="flex items-center gap-2 text-foreground">
      <img
        src="/logo.png"
        alt="highTide"
        class="h-10 w-10 rounded-md object-contain dark:invert mt-1"
      />
      <span class="text-lg font-semibold tracking-tight">High tide</span>
    </RouterLink>

      <Button variant="outline" size="sm" class="gap-2" @click="toggleTheme">
        <Transition name="theme-toggle">
          <component :is="isDark ? Sun : Moon" class="size-4" />
        </Transition>
      </Button>
    </div>
  </header>
</template>

<script setup>
import Button from "@/components/ui/button/Button.vue";
import { Moon, Sun } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const theme = ref("light");

const applyTheme = (value) => {
  document.documentElement.classList.toggle("dark", value === "dark");
  localStorage.setItem("theme", value);
}

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    theme.value = savedTheme;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme.value = "dark";
  }
  applyTheme(theme.value);
})

const isDark = computed(() => theme.value === "dark")

const toggleTheme = () => {
  theme.value = isDark.value ? "light" : "dark";
  applyTheme(theme.value);
}

</script>
