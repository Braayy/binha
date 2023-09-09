import { Function, Term, Tuple, Value } from "./AST";

class MemoizedResult {
  public func: Function;
  public argumentValues: Array<Value>;
  public result: Value;

  public constructor(func: Function, args: Array<Value>, result: Value) {
    this.func = func;
    this.argumentValues = args;
    this.result = result;
  }

  public isEqual(other: MemoizedResult): boolean {
    if (!valueEquals(this.func, other.func))
      return false;

    if (this.argumentValues.length !== other.argumentValues.length)
      return false;

    for (let i = 0; i < this.argumentValues.length; i++) {
      if (!valueEquals(this.argumentValues[i], other.argumentValues[i]))
        return false;
    }

    if (!valueEquals(this.result, other.result))
      return false;

    return true;
  }

  public isMemoizedFor(func: Function, args: Array<Value>): boolean {
    if (!valueEquals(this.func, func))
      return false;

    if (this.argumentValues.length !== args.length)
      return false;

    for (let i = 0; i < this.argumentValues.length; i++) {
      if (!valueEquals(this.argumentValues[i], args[i]))
        return false;
    }


    return true;
  }
}

function valueEquals(a: Value, b: Value): boolean {
  if (a.kind !== b.kind)
    return false;

  switch (a.kind) {
    case "Int":
    case "Str":
    case "Bool":
      return a.value === (b as typeof a).value;
    case "Tuple": {
      // Assume both tuples is already reduced

      const thisFirst = a.first as Value;
      const thisSecond = a.second as Value;

      const otherFirst = (b as Tuple).first as Value;
      const otherSecond = (b as Tuple).second as Value;

      return valueEquals(thisFirst, otherFirst) && valueEquals(thisSecond, otherSecond);
    }
    case "Function": {
      const { start: thisStart, end: thisEnd, filename: thisFilename } = a.location;
      const { start: otherStart, end: otherEnd, filename: otherFilename } = b.location;

      return thisStart === otherStart && thisEnd === otherEnd && thisFilename === otherFilename;
    }
  }
}

export default class Memoization {
  public memoizedResults: Array<MemoizedResult>;

  public constructor() {
    this.memoizedResults = new Array();
  }

  public memoizeResult(func: Function, args: Array<Value>, result: Value) {
    const memoizedResult = new MemoizedResult(func, args, result);

    const alreadyMemoized = this.memoizedResults.some((alreadyMemoizedResult) => alreadyMemoizedResult.isEqual(memoizedResult));

    if (!alreadyMemoized) {
      this.memoizedResults.push(memoizedResult);
    }
  }

  public getMemoizedResult(func: Function, args: Array<Value>): Value | undefined {
    const memoizedResults = this.memoizedResults.filter((alreadyMemoizedResult) => alreadyMemoizedResult.isMemoizedFor(func, args));

    return memoizedResults.length > 0 ? memoizedResults[0].result : undefined;
  }

  public canBeMemoized(func: Function): boolean {
    function containsPrintTerm(term: Term): boolean {
      switch (term.kind) {
        case "Int":
        case "Str":
        case "Bool":
        case "Var":
          return false;
        case "Print":
          return true;
        case "Binary":
          return containsPrintTerm(term.lhs) || containsPrintTerm(term.rhs);
        case "Call": {
          if (containsPrintTerm(term.callee))
            return true;

          return term.arguments.some((argument) => containsPrintTerm(argument));
        }
        case "Function":
          return containsPrintTerm(term.value);
        case "Let":
          return containsPrintTerm(term.value) || containsPrintTerm(term.next);
        case "If":
          return containsPrintTerm(term.condition) || containsPrintTerm(term.then) || containsPrintTerm(term.otherwise);
        case "First":
        case "Second":
          return containsPrintTerm(term.value);
        case "Tuple":
          return containsPrintTerm(term.first) || containsPrintTerm(term.second);
      }
    }

    return !containsPrintTerm(func);
  }
}