// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  {
    extends: [tanstackConfig],
    rules: {
      "sort-imports": "off",
    },
  },
  {
    files: ["**/*.stories.@(js|jsx|ts|tsx)"],
    extends: [storybook.configs["flat/recommended"]],
  },
];
