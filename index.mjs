const b = require('blessed'),
      ax = require('axios'),
      c = require('chalk'),
      f = require('figlet'),
      g = require('gradient-string');

const s = b.screen({smartCSR: true}),
      m = b.box({parent: s, top: 0, left: 0, width: '100%', height: '100%'}),
      t = b.text({parent: m, top: 0, left: 'center', content: g.mind('CLI-CHING')}),
      st = b.text({parent: m, bottom: 0, left: 0, right: 0, height: 1}),
      h = b.box({
        parent: m,
        top: 2,
        left: 0,
        width: '100%',
        height: '100%-3',
        content: '',
        tags: true,
        style: {fg: '#0f0'}
      });

const hex = [
  '䷀','䷁','䷂','䷃','䷄','䷅','䷆','䷇','䷈','䷉','䷊','䷋','䷌','䷍','䷎','䷏',
  '䷐','䷑','䷒','䷓','䷔','䷕','䷖','䷗','䷘','䷙','䷚','䷛','䷜','䷝','䷞','䷟',
  '䷠','䷡','䷢','䷣','䷤','䷥','䷦','䷧','䷨','䷩','䷪','䷫','䷬','䷭','䷮','䷯',
  '䷰','䷱','䷲','䷳','䷴','䷵','䷶','䷷','䷸','䷹','䷺','䷻','䷼','䷽','䷾','䷿'
];

let q, r = [], ci = 0;

const a = async (txt) => {
  h.setContent(g.atlas.multiline(txt));
  s.render();
  await new Promise(resolve => setTimeout(resolve, 100));
};

const th = async () => {
  if (ci < 6) {
    await a(`Toss coin ${ci + 1}/6...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const res = Math.random() < 0.5 ? 2 : 3;
    r.push(res);
    await a(`Coin ${ci + 1}: ${res === 2 ? 'Tails (2)' : 'Heads (3)'}`);
    ci++;
    s.render();
    s.key(['space'], th);
  } else {
    bh();
  }
};

const bh = async () => {
  let lines = r.map(n => n % 2 === 0 ? '- -' : '---');
  for (let i = 0; i < 6; i++) {
    await a(lines.slice(0, i + 1).join('\n'));
  }
  const hexNum = parseInt(r.map(n => n % 2).join(''), 2);
  await a(`${lines.join('\n')}\n\n${hex[hexNum]}`);
  gi(hexNum);
};

const gi = async (num) => {
  try {
    const resp = await ax.post('http://localhost:1234/v1/chat/completions', {
      model: 'lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF',
      messages: [{role: 'user', content: `Interpret I Ching hexagram ${num + 1} for question: ${q}`}],
      stream: true
    }, {responseType: 'stream'});

    let output = '';
    resp.data.on('data', chunk => {
      chunk.toString().split('\n').filter(line => line.trim() !== '').forEach(line => {
        if (line.startsWith('data: ')) {
          try {
            output += JSON.parse(line.slice(6)).choices[0].delta.content || '';
            h.setContent(g.atlas.multiline(`${hex[num]}\n\n${output}`));
            s.render();
          } catch (e) {}
        }
      });
    });
  } catch (e) {
    h.setContent(`Error: ${e.message}`);
  }
  s.render();
};

const init = async () => {
  await a(f.textSync('CLI-CHING', {font: 'Cyberlarge'}));
  await a('Enter your question:');
  const input = b.textarea({parent: s, bottom: 3, height: 3, inputOnFocus: true});
  s.append(input);
  input.focus();
  input.key('enter', () => {
    q = input.getValue().trim();
    input.destroy();
    th();
  });
  s.render();
};

s.key(['escape', 'q'], () => process.exit(0));
st.setContent(c.cyan('Press [SPACE] to toss coins | [ESC] to exit'));

init();
s.render();