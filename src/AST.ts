export type Term = Int | Str | Call | Binary | Function | Let | If | Print | First | Second | Bool | Tuple | Var;

export type Value = Int | Str | Bool | Tuple | Function;

export type Callable = Var | Function;

export interface File {
  name: string;
  expression: Term;
  location: Location;
}

export interface Location {
  start: number;
  end: number;
  filename: string;
}

export interface If {
  kind: 'If';
  condition: Term;
  then: Term;
  otherwise: Term;
  location: Location;
}

export interface Var {
  kind: 'Var';
  text: string;
  location: Location;
}

export interface Let {
  kind: 'Let';
  name: Var;
  value: Term;
  next: Term;
  location: Location;
}

export interface Str {
  kind: 'Str';
  value: string;
  location: Location;
}

export interface Bool {
  kind: 'Bool';
  value: boolean;
  location: Location;
}

export interface Int {
  kind: 'Int';
  value: number;
  location: Location;
}

export type BinaryOperation = 'Add' | 'Sub' | 'Mul' | 'Div' | 'Rem' | 'Eq' | 'Neq' | 'Lt' | 'Gt' | 'Lte' | 'Gte' | 'And' | 'Or';

export interface Binary {
  kind: 'Binary';
  lhs: Term;
  op: BinaryOperation;
  rhs: Term;
  location: Location;
}

export interface Call {
  kind: 'Call';
  callee: Term;
  arguments: [Term];
  location: Location;
}

export interface Function {
  kind: 'Function';
  parameters: [Var];
  value: Term;
  location: Location;
}

export interface Print {
  kind: 'Print';
  value: Term;
  location: Location;
}

export interface First {
  kind: 'First';
  value: Term;
  location: Location;
}

export interface Second {
  kind: 'Second';
  value: Term;
  location: Location;
}

export interface Tuple {
  kind: 'Tuple';
  first: Term;
  second: Term;
  location: Location;
}