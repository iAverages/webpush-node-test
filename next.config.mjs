/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import pwa from "next-pwa";

const withPwa = pwa({
  dest: "public",
});

/** @type {import("next").NextConfig} */
const config = {};

// @ts-expect-error - shut up
export default withPwa(config);
