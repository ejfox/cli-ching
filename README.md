# CLI-CHING

CLI-CHING is a command-line interface tool for consulting the I Ching (Book of Changes). It provides a digital means of casting hexagrams and receiving interpretations, blending ancient wisdom with modern technology. It does not cast for you, you must bring 3 coins and report their results back to the application, which will help you convert them into the correct line. 



https://github.com/user-attachments/assets/133a7d1d-a4bc-4131-b675-4de0b2466ddb



## Features

- Simple command-line interface
- Flexible coin toss input
- Hexagram visualization
- AI-powered interpretations
- History of recent consultations
- Supports quick queries via command-line arguments

## Installation

1. Ensure you have Node.js installed on your system.
2. Clone this repository:
   ```
   git clone https://github.com/yourusername/cli-ching.git
   cd cli-ching
   ```
3. Install the required dependencies:
   ```
   npm install
   ```

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

## AI Interpretation

The tool uses a local LLM (Language Model) running on `http://localhost:1234` for generating interpretations. Ensure your LLM server is running before using the interpretation feature.

## Customization

You can modify the `getInterpretation` function in `index.js` to use a different AI service or to implement your own interpretation logic.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
