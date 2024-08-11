const readline = require('readline');
const axios = require('axios');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.iching-throws');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
}

function saveConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

const hex = [
  '䷀','䷁','䷂','䷃','䷄','䷅','䷆','䷇','䷈','䷉','䷊','䷋','䷌','䷍','䷎','䷏',
  '䷐','䷑','䷒','䷓','䷔','䷕','䷖','䷗','䷘','䷙','䷚','䷛','䷜','䷝','䷞','䷟',
  '䷠','䷡','䷢','䷣','䷤','䷥','䷦','䷧','䷨','䷩','䷪','䷫','䷬','䷭','䷮','䷯',
  '䷰','䷱','䷲','䷳','䷴','䷵','䷶','䷷','䷸','䷹','䷺','䷻','䷼','䷽','䷾','䷿'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let question, results = [];

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function displayLogo() {
  console.log(figlet.textSync('CLI-CHING', { font: 'Small' }));
  console.log('Your I Ching Oracle\n');
}

async function getCoinToss(tossNumber) {
  while (true) {
    const answer = await askQuestion(`[Toss ${tossNumber}/6] Enter coin results (e.g., TTH, HTT): `);
    const upperAnswer = answer.toUpperCase();
    if (upperAnswer.length === 3 && upperAnswer.split('').every(char => char === 'T' || char === 'H')) {
      const value = upperAnswer.split('').filter(char => char === 'H').length;
      return value;
    }
    console.log("Invalid input. Please enter exactly three T's or H's in any order.");
  }
}

async function buildHexagram() {
  for (let i = 0; i < 6; i++) {
    const result = await getCoinToss(i + 1);
    results.push(result);
    console.log(`Current hexagram:\n${results.map(n => n % 2 === 1 ? '───' : '— —').join('\n')}`);
  }
}

function interpretHexagram() {
  const hexNum = parseInt(results.map(n => n % 2).join(''), 2);
  const changingLines = results.map((v, i) => v === 0 || v === 3 ? i : -1).filter(i => i !== -1);
  const transformedHex = results.map(v => v === 0 ? 1 : v === 3 ? 2 : v);
  const transformedHexNum = parseInt(transformedHex.map(n => n % 2).join(''), 2);

  console.log(`\nYour hexagram:

${results.map((n, i) => `${n % 2 === 1 ? '───' : '— —'} ${changingLines.includes(i) ? '<' : ' '}`).join('\n')}

Primary Hexagram: ${hex[hexNum]} (${hexNum + 1})
${changingLines.length > 0 ? `Transformed Hexagram: ${hex[transformedHexNum]} (${transformedHexNum + 1})` : 'No changing lines'}

Changing Lines: ${changingLines.length > 0 ? changingLines.map(l => l + 1).join(', ') : 'None'}`);

  return { hexNum, transformedHexNum, changingLines };
}

async function getInterpretation(hexNum, transformedHexNum, changingLines) {
  console.log("\nInterpreting...");
  try {
    const resp = await axios.post(
      "http://localhost:1234/v1/chat/completions",
      {
        model: "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF",
        messages: [{ role: "user", content: `Interpret I Ching hexagram ${hexNum + 1}${transformedHexNum !== hexNum ? ` transforming to ${transformedHexNum + 1}` : ''} for question: ${question}. ${changingLines.length > 0 ? `Focus on changing lines: ${changingLines.map(l => l + 1).join(', ')}.` : ''}` }],
        stream: true,
      },
      { responseType: "stream" }
    );
    
    console.log(`\n${hex[hexNum]}${transformedHexNum !== hexNum ? ` → ${hex[transformedHexNum]}` : ''}\n`);
    
    let output = "";
    resp.data.on("data", (chunk) => {
      chunk.toString()
        .split("\n")
        .filter((line) => line.trim() !== "")
        .forEach((line) => {
          if (line.startsWith("data: "))
            try {
              const content = JSON.parse(line.slice(6)).choices[0].delta.content || "";
              output += content;
              process.stdout.write(content);
            } catch (e) {}
        });
    });

    resp.data.on("end", () => {
      const config = loadConfig();
      config.push({
        date: new Date().toISOString(),
        question,
        hexagram: `${hexNum + 1}${transformedHexNum !== hexNum ? ` → ${transformedHexNum + 1}` : ''}`,
        changingLines: changingLines.map(l => l + 1)
      });
      saveConfig(config);
      rl.close();
      process.exit(0);
    });

  } catch (e) {
    console.log(`Error: ${e.message}`);
    rl.close();
    process.exit(1);
  }
}

async function main() {
  displayLogo();
  
  const config = loadConfig();
  if (config.length > 0) {
    console.log("Recent throws:");
    config.slice(-3).forEach(throw_ => {
      console.log(`${throw_.date.split('T')[0]} - ${throw_.hexagram} - "${throw_.question.slice(0, 30)}${throw_.question.length > 30 ? '...' : ''}"`);
    });
    console.log();
  }

  if (process.argv[2] === '-q') {
    question = process.argv.slice(3).join(' ');
  } else {
    question = await askQuestion("Enter your question: ");
  }
  
  console.log("\nPrepare your 3 coins. We'll guide you through six tosses to build your hexagram.");
  
  await buildHexagram();
  
  const { hexNum, transformedHexNum, changingLines } = interpretHexagram();
  
  await getInterpretation(hexNum, transformedHexNum, changingLines);
}

main();