/**
 * Frontend and standalone evaluation judge for NodeWars.
 * Executes JavaScript code against test cases, comparing real output to expected output.
 */

export function parseInput(inputStr) {
  if (typeof inputStr !== 'string') return [inputStr];
  let cleaned = inputStr.trim();
  cleaned = cleaned.replace(/^[a-zA-Z0-9_$]+\s*=\s*/, '');

  try {
    const parsed = JSON.parse(cleaned);
    return [parsed];
  } catch (e) {
    try {
      const parsedArgs = new Function(`return [${cleaned}];`)();
      return Array.isArray(parsedArgs) ? parsedArgs : [parsedArgs];
    } catch (e2) {
      return [inputStr];
    }
  }
}

export function executeUserCode(code, args, starterCode = '') {
  let funcName = null;
  const starterMatch = (starterCode || '').match(/function\s+([a-zA-Z0-9_$]+)/);
  if (starterMatch) {
    funcName = starterMatch[1];
  }
  if (!funcName) {
    const codeMatch = (code || '').match(/function\s+([a-zA-Z0-9_$]+)/);
    if (codeMatch) {
      funcName = codeMatch[1];
    }
  }

  const clonedArgs = JSON.parse(JSON.stringify(args));
  const startTime = Date.now();

  let result;
  if (funcName) {
    const runner = new Function(
      'clonedArgs',
      `
      ${code}
      if (typeof ${funcName} === 'function') {
        return ${funcName}(...clonedArgs);
      }
      if (typeof Solution === 'function') {
        const sol = new Solution();
        if (typeof sol.${funcName} === 'function') {
          return sol.${funcName}(...clonedArgs);
        }
      }
      throw new Error('Function "${funcName}" is not defined.');
      `
    );
    result = runner(clonedArgs);
  } else {
    const runner = new Function(
      'clonedArgs',
      `
      ${code}
      if (typeof Solution === 'function') {
        const sol = new Solution();
        const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(sol)).filter(k => k !== 'constructor');
        if (keys.length > 0 && typeof sol[keys[0]] === 'function') {
          return sol[keys[0]](...clonedArgs);
        }
      }
      throw new Error('No executable function found.');
      `
    );
    result = runner(clonedArgs);
  }

  const duration = Date.now() - startTime;
  return { result, duration };
}

export function areOutputsEqual(actual, expectedStr) {
  if (actual === undefined) return false;

  const actualStr = typeof actual === 'string' ? actual : JSON.stringify(actual);
  const expectedString = String(expectedStr).trim();

  const normActual = String(actualStr).replace(/\s+/g, '');
  const normExpected = expectedString.replace(/\s+/g, '');

  if (normActual === normExpected) return true;

  try {
    const parsedActual = typeof actual === 'string' ? JSON.parse(actual) : actual;
    const parsedExpected = JSON.parse(expectedString);
    return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
  } catch (e) {
    return false;
  }
}

export function runSimulatedJudge({ code, language, problem, mode = 'submit' }) {
  const starter = problem?.starterCode?.[language] || problem?.starterCode?.javascript || '';
  const tests = problem?.testCases || [];
  const total = tests.length;

  const runCount = mode === 'run' ? Math.min(2, total) : total;
  const results = [];

  for (let i = 0; i < runCount; i++) {
    const tc = tests[i];
    const args = parseInput(tc.input);

    let pass = false;
    let outputVal = '';
    let runtimeMs = 0;

    try {
      const { result, duration } = executeUserCode(code, args, starter);
      runtimeMs = duration;
      outputVal = result === undefined ? 'undefined' : (typeof result === 'string' ? result : JSON.stringify(result));
      pass = areOutputsEqual(result, tc.expected);
    } catch (err) {
      outputVal = `Runtime Error: ${err.message}`;
      pass = false;
    }

    results.push({
      id: tc.id || i + 1,
      input: tc.input,
      expected: tc.expected,
      output: outputVal,
      passed: pass,
      runtime: `${Math.max(1, runtimeMs)}ms`,
      memory: '40.0 MB'
    });
  }

  const passed = results.filter((r) => r.passed).length;
  const allPassed = passed === runCount && runCount > 0;

  const status = allPassed ? 'accepted' : 'wrong_answer';

  return {
    status,
    passed,
    total: runCount,
    allPassed,
    runtimeMs: allPassed ? 30 + runCount * 2 : null,
    results,
    progressBoost: allPassed ? (mode === 'submit' ? 100 : 65) : Math.min(40, Math.floor((passed / (total || 1)) * 40))
  };
}
