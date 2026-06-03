# CLI-CHING

CLI-CHING is a command-line interface tool for consulting the I Ching (Book of Changes). It provides a digital means of casting hexagrams and receiving interpretations, blending ancient wisdom with modern technology. It does not cast for you, you must bring 3 coins and report their results back to the application, which will help you convert them into the correct line. 



https://github.com/user-attachments/assets/133a7d1d-a4bc-4131-b675-4de0b2466ddb



## Features

- Simple command-line interface
- Flexible coin toss input
- **Natural RNG Mode**: Automatic hexagram generation using true random numbers from natural processes
  - Random.org (atmospheric noise)
  - ANU Quantum Random Numbers (quantum phenomena)
  - Graceful fallback to pseudo-random if APIs unavailable
- Hexagram visualization
- AI-powered interpretations
- History of recent consultations
- Supports quick queries via command-line arguments

## Requirements

- **Node.js 18+**
- *(Optional)* A local LLM server on `http://localhost:1234` for AI
  interpretations — e.g. [LM Studio](https://lmstudio.ai) or
  [Ollama](https://ollama.com). **Casting works fully without it**; if no
  server is found, the tool simply draws your hexagram and skips the AI reading.

## Installation

1. Ensure you have Node.js installed on your system.
2. Clone this repository:
   ```
   git clone https://github.com/ejfox/cli-ching.git
   cd cli-ching
   ```
3. Install the required dependencies:
   ```
   npm install
   ```

To get a global `cli-ching` command, also run `npm link` (or `npm install -g .`).

## Usage

### Basic Usage

Run the script with:

```
node index.js
```

Follow the prompts to enter your question and coin tosses.

### Quick Query

You can also start a consultation with a question directly from the command line:

```
node index.js -q "Will my project succeed?"
```

### Natural RNG Mode (Automatic Coin Tosses)

For a fully automated experience, use the `--auto` or `-a` flag to generate hexagrams using true random numbers from natural processes:

```
node index.js --auto -q "What should I focus on today?"
```

This mode uses:
1. **Random.org** - True random numbers generated from atmospheric noise
2. **ANU Quantum Random Numbers** - Random numbers from quantum phenomena (fallback)
3. **Pseudo-random generator** - Standard RNG if natural sources are unavailable

⚠️ **Important Note**: The traditional method of physically throwing coins is considered the proper and preferred way to consult the I Ching. The physical act of casting is an integral part of the divination process. The natural RNG mode should only be used when physical coins are not available.

## Coin Tossing

When prompted, enter the results of your coin tosses using T for tails and H for heads. For example:

- TTT (3 tails)
- TTH, THT, or HTT (2 tails, 1 head)
- THH, HTH, or HHT (1 tail, 2 heads)
- HHH (3 heads)

The order doesn't matter, so HTT is the same as TTH.

## Interpreting Results

The tool will display your hexagram, including any changing lines. It will then provide an AI-generated interpretation based on your question and the resulting hexagram.

## Configuration

CLI-CHING automatically saves your consultations to a `.iching-throws` file in your home directory. The three most recent consultations are displayed when you start the tool.

## Dependencies

- axios: For making HTTP requests to the AI interpretation service
- figlet: For generating ASCII art text
- readline: For handling user input (built into Node.js)

## AI Interpretation (optional)

The tool talks to an OpenAI-compatible chat endpoint at `http://localhost:1234/v1/chat/completions` (e.g. LM Studio or Ollama). Start a local model server on port 1234 before consulting if you want AI readings. **It's entirely optional** — if no server is found, the tool prints a short note and your hexagram stands on its own. Either way, the consultation is saved to your history.

## Customization

You can modify the `getInterpretation` function in `index.js` to use a different AI service or to implement your own interpretation logic.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT — see [LICENSE](LICENSE).
