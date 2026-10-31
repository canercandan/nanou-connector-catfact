// A test connector for nanou's private install flow: reads catfact.ninja
// (no key needed) and keeps favorites in its own folder (a "write", so it
// needs the family's approval card and is refused when installed read-only).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const API = "https://catfact.ninja";
const DIR = join(homedir(), ".config", "connectors", "catfact");
const FILE = join(DIR, "favorites.json");

/** GET a catfact.ninja path as JSON. @param {string} path */
async function get(path) {
  const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`catfact.ninja answered ${res.status}`);
  return res.json();
}

/** The saved favorites. @returns {string[]} */
function favorites() {
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

export default {
  help: [
    "  catfact fact                    one random cat fact",
    "  catfact facts [--limit 5]       several",
    "  catfact meow                    one from meowfacts instead",
    "  catfact favorites               the ones you saved",
    '  catfact favorite --text "..."   save one (approval card)',
  ],
  commands: {
    async fact() {
      return { fact: (await get("/fact")).fact };
    },
    async facts(ctx) {
      const limit = Math.min(Math.max(Number(ctx.flag("limit") ?? 5) || 5, 1), 20);
      return (await get(`/facts?limit=${limit}`)).data.map((f) => f.fact);
    },
    async meow() {
      const res = await fetch("https://meowfacts.herokuapp.com/", { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`meowfacts answered ${res.status}`);
      return { fact: (await res.json()).data?.[0] };
    },
    async favorites() {
      return favorites();
    },
    async favorite(ctx) {
      const text = ctx.flag("text");
      if (!text) ctx.fail('say which fact: catfact favorite --text "..."');
      mkdirSync(DIR, { recursive: true, mode: 0o700 });
      const all = [...new Set([...favorites(), text.slice(0, 500)])];
      writeFileSync(FILE, `${JSON.stringify(all, null, 2)}\n`, { mode: 0o600 });
      return { saved: text, count: all.length };
    },
  },
};
