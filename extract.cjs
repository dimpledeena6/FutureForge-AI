const fs = require('fs');
const code = fs.readFileSync('legacy/app.js', 'utf8');
const pathsMatch = code.match(/const PATHS = {[\s\S]*?};/);
const startIndex = code.indexOf('function buildDebateData(');
const endIndex = code.lastIndexOf('return `${intro}\\n\\n${body}\\n\\n${outro}`;') + 42;
const funcsStr = code.substring(startIndex, code.indexOf('}', endIndex) + 1);

let newCode = 'export ' + pathsMatch[0] + '\n\n' + funcsStr.replace(/state\./g, 'params.') + '\n\n' +
`export function generateSimulationData(params) {
  const lower = params.decision.toLowerCase();
  let path = 'GENERAL';
  for (const [key, list] of Object.entries(PATHS)) {
    if (list.some(keyword => lower.includes(keyword))) {
      path = key;
      break;
    }
  }
  return {
    path,
    debate: buildDebateData(path, params.decision, 'A'),
    timeline: buildTimelineData(path),
    regret: calculateRegret(path, 'A'),
    story: buildCinematicStory(path, 'A')
  };
}`;

fs.writeFileSync('src/lib/engine.js', newCode);
