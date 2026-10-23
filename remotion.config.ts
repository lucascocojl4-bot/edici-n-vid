import fs from "fs";
import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");

// En el entorno cloud no se puede descargar el Chrome de Remotion,
// así que usamos el Chromium headless que ya viene preinstalado.
const findBrowser = (): string | null => {
  if (process.env.REMOTION_BROWSER_EXECUTABLE) {
    return process.env.REMOTION_BROWSER_EXECUTABLE;
  }
  const base = "/opt/pw-browsers";
  if (!fs.existsSync(base)) return null;
  for (const dir of fs.readdirSync(base)) {
    if (!dir.startsWith("chromium_headless_shell")) continue;
    for (const rel of [
      "chrome-headless-shell-linux64/chrome-headless-shell",
      "chrome-linux/headless_shell",
    ]) {
      const exe = path.join(base, dir, rel);
      if (fs.existsSync(exe)) return exe;
    }
  }
  return null;
};

const browser = findBrowser();
if (browser) {
  Config.setBrowserExecutable(browser);
}
