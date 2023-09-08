import { Term, Location, Value, Tuple, Int, Str, Bool, Function, Callable, Call, BinaryOperation } from "./AST";

export function assertKind(term: Term, kind: 'Bool'): asserts term is Bool;
export function assertKind(term: Term, kind: 'Tuple'): asserts term is Tuple;
export function assertKind(term: Term, kind: 'Function'): asserts term is Function;

export function assertKind(term: Term, kind: Term['kind']) {
  if (term.kind !== kind)
    throw localizedError(`${kind} expected, got ${term.kind}`, term.location);
}

export function assertCallable(term: Term): asserts term is Callable {
  if (term.kind !== 'Var' && term.kind !== 'Function')
    throw localizedError(`Variable or Function expected, got ${term.kind}`, term.location);
}

export function assertValue(term: Term): asserts term is Value {
  if (term.kind !== 'Int' && term.kind !== 'Str' && term.kind !== 'Bool' && term.kind !== 'Tuple' && term.kind !== 'Function')
    throw localizedError(`Int, Str, Bool, Tuple or Function expected, got ${term.kind}`, term.location);
}

export function assertVariableExists(name: string, value: Value | undefined, location: Location): asserts value is Value {
  if (!value)
    throw localizedError(`Variable ${name} not defined`, location);
}

export function assertFunctionParameterLength(func: Function, call: Call) {
  if (func.parameters.length !== call.arguments.length)
    throw localizedError(`Function expected ${func.parameters.length} parameters, got ${call.arguments.length}`, call.location);
}

export function binaryOperationNotValid(lhs: Value, rhs: Value, operation: BinaryOperation): never {
  throw localizedError(`${operation} between ${lhs.kind} and ${rhs.kind} is not valid`, { start: lhs.location.start, end: rhs.location.end, filename: lhs.location.filename });
}

export function assertIntIsNotZero(value: Int) {
  if (value.value === 0)
    throw localizedError(`Division by zero`, value.location);
}

function localizedError(message: string, location: Location): string {
  return `${location.filename} at ${location.start}:${location.end} > ${message}`;
}