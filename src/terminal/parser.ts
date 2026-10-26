/**
 * Milestone 3. Split input into a command and arguments.
 * Must handle extra whitespace and quoted args: cat "my file.txt" -> ["my file.txt"].
 */
export function parseInput(input: string): { cmd: string; args: string[] } {
  const tokens: string[] = [];   // finished words
  let current = "";              // the word being built right now
  let inQuotes = false;          // am I between a pair of quotes?

  for (const ch of input) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    }
    else if (ch === ' ' && !inQuotes) {
      if (current !== "") tokens.push(current);
      current = "";
    }
    else {
      current += ch;
    }
  }

  if (current !== "") tokens.push(current);

  return {
    cmd: tokens[0] ?? "",
    args: tokens.slice(1,)
  };
}
