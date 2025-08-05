import type { Palette } from "./colors";
import { computed } from "vue";

export default function useTailwindTheme(palette: Palette) {
  // Source code for Tailwind CSS v4
  const getV4Source = () => {
    const themeVariables = computed(() =>
      Object.entries(palette.colors)
        .map(([shade, colorValue]) => `  --color-${palette.name.toLowerCase()}-${shade}: ${colorValue};`)
        .join("\n")
    );

    return `@theme {\n${themeVariables.value}\n}`;
  }

    return `'${palette.name.toLowerCase()}': {
${shadesSource.value.join(", \n")}
}`;
  }

  return getV4Source();
}
