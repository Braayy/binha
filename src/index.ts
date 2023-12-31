import { unlinkSync } from 'node:fs';
import readline from 'node:readline/promises';
import { File, Term } from './AST';
import Scope from './scope';
import { assertValue } from './error';
import { evaluate, valueToString } from './evalutation';
import fixReplLocation from './replLocationFixer';
import Memoization from './memoization';

async function parseExpression(code: string): Promise<Term> {
  const tempfile = '.tempfile.rinha';

  Bun.write(tempfile, code);
  
  try {
    const proc = Bun.spawn(['rinha', tempfile], {
      stdin: "ignore",
      stderr: "ignore",
    });

    await proc.exited;

    if (proc.exitCode !== 0)
      throw { syntaxError: true };

    const ast = await new Response(proc.stdout).json() as File;

    return ast.expression;
  } catch (error) {
    throw error;
  } finally {
    unlinkSync(tempfile);
  }
}

function run(expression: Term): Term {
  const scope = new Scope();
  const memoization = new Memoization();

  try {
    return evaluate(expression, scope, memoization);
  } catch (error) {
    console.error(error);

    throw '';
  }
}

if (process.argv.length < 3) {
  console.error(`Usage: bun src/index.ts <ast file>`)
  process.exit(-1);
}

const astFilename = process.argv[2];

if (astFilename === '-') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  while (true) {
    const expression = await rl.question('> ');

    try {
      const parsedCode = await parseExpression(expression);
      fixReplLocation(parsedCode);

      const value = run(parsedCode);
      assertValue(value);

      console.log(valueToString(value));
    }
    catch (error: any) {
      if (error.syntaxError) {
        console.error(`Invalid syntax!`)
      }
    }
  }
} else {
  const astFile = Bun.file(astFilename);

  if (!await astFile.exists()) {
    console.error(`File ${astFilename} not found!`)
    process.exit(-1);
  }

  const ast = await astFile.json() as File;

  const startTime = performance.now();
  const startMemoryUsage = process.memoryUsage();

  run(ast.expression);
  
  const elapsedTime = performance.now() - startTime;
  const usedMemory = process.memoryUsage(startMemoryUsage).heapUsed;

  console.log(`\nElapsed Time: ${elapsedTime.toFixed(2)} ms`);
  console.log(`Used Memory: ${(usedMemory / 1024).toFixed(2)} kB`);
}