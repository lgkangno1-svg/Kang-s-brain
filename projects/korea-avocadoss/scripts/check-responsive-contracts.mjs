import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const layoutPath = path.join(root, 'src/app/[locale]/layout.tsx');
const responsivePath = path.join(root, 'src/app/responsive-system.css');

const layout = fs.readFileSync(layoutPath, 'utf8');
const responsive = fs.readFileSync(responsivePath, 'utf8');

const checks = [
  ['responsive system imported', layout.includes("import '../responsive-system.css';")],
  ['responsive import is after localized quick help', layout.indexOf("stitch-quick-help-localized.css") < layout.indexOf("responsive-system.css")],
  ['device-width viewport configured', layout.includes("width: 'device-width'")],
  ['safe-area viewport configured', layout.includes("viewportFit: 'cover'")],
  ['large desktop breakpoint exists', responsive.includes('@media (max-width: 1180px)')],
  ['mobile breakpoint exists', responsive.includes('@media (max-width: 860px)')],
  ['small phone breakpoint exists', responsive.includes('@media (max-width: 380px)')],
  ['desktop shell can expand beyond legacy screenshot width', responsive.includes('--kc-app-max: 1440px')],
  ['mobile safe-area bottom handled', responsive.includes('env(safe-area-inset-bottom)')],
  ['Quick Help has dynamic viewport sizing', responsive.includes('100dvh')],
  ['coarse pointer touch targets handled', responsive.includes('@media (pointer: coarse)')],
  ['reduced-motion preference handled', responsive.includes('@media (prefers-reduced-motion: reduce)')],
];

const failures = checks.filter(([, pass]) => !pass);
for (const [label, pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`);
if (failures.length) {
  console.error(`\n${failures.length} responsive contract check(s) failed.`);
  process.exit(1);
}
console.log('\nResponsive layout contracts passed.');
