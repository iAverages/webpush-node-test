/* eslint-disable */
// @ts-nocheck

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
import pwa from "next-pwa";
import path from "path";

const withPwa = pwa({
  dest: "public",
  buildExcludes: ["app-build-manifest.json"],
});

const generateAppDirEntry = (entry) => {
  const packagePath = require.resolve("next-pwa");
  const packageDirectory = path.dirname(packagePath);
  const registerJs = path.join(packageDirectory, "register.js");

  return entry().then((entries) => {
    // Register SW on App directory, solution: https://github.com/shadowwalker/next-pwa/pull/427
    if (entries["main-app"] && !entries["main-app"].includes(registerJs)) {
      if (Array.isArray(entries["main-app"])) {
        entries["main-app"].unshift(registerJs);
      } else if (typeof entries["main-app"] === "string") {
        entries["main-app"] = [registerJs, entries["main-app"]];
      }
    }
    return entries;
  });
};

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    const entry = generateAppDirEntry(config.entry);
    config.entry = () => entry;

    return config;
  },
};

// @ts-expect-error - shut up
export default withPwa(config);
