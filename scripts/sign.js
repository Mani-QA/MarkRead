/**
 * Post-build script — signs the Windows executable with signtool.
 *
 * PREREQUISITES
 * ─────────────
 * 1. A valid code-signing certificate (.pfx) is required. You can obtain one
 *    from a Certificate Authority (DigiCert, Sectigo, etc.) or create a
 *    self-signed certificate for testing:
 *
 *      New-SelfSignedCertificate -Type CodeSigning `
 *        -Subject "CN=MarkRead Dev" `
 *        -CertStoreLocation Cert:\CurrentUser\My
 *
 *    Then export it to a .pfx file from the Windows Certificate Manager.
 *
 * 2. signtool.exe must be on your PATH. It ships with the Windows SDK:
 *      C:\Program Files (x86)\Windows Kits\10\bin\<version>\x64\signtool.exe
 *
 * 3. Set these environment variables before running:
 *      SIGN_PFX_PATH  — absolute path to your .pfx certificate file
 *      SIGN_PFX_PASS  — password for the .pfx file
 *
 * WINDOWS DEFENDER NOTE
 * ─────────────────────
 * Unsigned executables built from source are often flagged by Windows
 * Defender / SmartScreen. If you cannot sign the binary, add an exclusion
 * for the build output directory to prevent false-positive quarantine:
 *
 *   PowerShell (Admin):
 *     Add-MpPreference -ExclusionPath "C:\path\to\MarkRead\dist"
 *
 *   Or via Windows Security → Virus & Threat Protection → Exclusions.
 */

const { execSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const EXE_NAME = "MarkRead-win_x64.exe";
const DIST_DIR = path.resolve(__dirname, "..", "dist", "MarkRead");
const EXE_PATH = path.join(DIST_DIR, EXE_NAME);

function sign() {
  if (!fs.existsSync(EXE_PATH)) {
    console.error(`[sign] Executable not found: ${EXE_PATH}`);
    console.error("[sign] Run 'npm run build' first.");
    process.exit(1);
  }

  const pfxPath = process.env.SIGN_PFX_PATH;
  const pfxPass = process.env.SIGN_PFX_PASS;

  if (!pfxPath || !pfxPass) {
    console.warn("[sign] SIGN_PFX_PATH or SIGN_PFX_PASS not set — skipping code signing.");
    console.warn("[sign] The unsigned .exe may be flagged by Windows Defender / SmartScreen.");
    console.warn("[sign] To suppress false positives, add a Defender exclusion for the dist folder.");
    return;
  }

  if (!fs.existsSync(pfxPath)) {
    console.error(`[sign] Certificate file not found: ${pfxPath}`);
    process.exit(1);
  }

  const cmd = [
    "signtool",
    "sign",
    "/f",  `"${pfxPath}"`,
    "/p",  `"${pfxPass}"`,
    "/fd", "SHA256",
    "/tr", "http://timestamp.digicert.com",
    "/td", "SHA256",
    "/d",  '"MarkRead — Markdown Viewer"',
    `"${EXE_PATH}"`,
  ].join(" ");

  console.log(`[sign] Signing ${EXE_NAME} ...`);

  try {
    execSync(cmd, { stdio: "inherit" });
    console.log("[sign] Successfully signed.");
  } catch (err) {
    console.error("[sign] signtool failed. Ensure signtool.exe is on your PATH");
    console.error("[sign] and the certificate / password are correct.");
    process.exit(1);
  }
}

sign();
