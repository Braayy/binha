import { BinaryOperation, Int, Str, Value, Bool } from './AST';
import { assertIntIsNotZero, binaryOperationNotValid } from './error';

export function binary(lhs: Value, rhs: Value, operation: BinaryOperation): Value {
  switch (operation) {
    case 'Add':
      return add(lhs, rhs);
    case 'Sub':
      return sub(lhs, rhs);
    case 'Mul':
      return mul(lhs, rhs);
    case 'Div':
      return div(lhs, rhs);
    case 'Rem':
      return rem(lhs, rhs);
    case 'Eq':
      return eq(lhs, rhs);
    case 'Neq':
      return neq(lhs, rhs);
    case 'Lt':
      return lt(lhs, rhs);
    case 'Gt':
      return gt(lhs, rhs);
    case 'Lte':
      return lte(lhs, rhs);
    case 'Gte':
      return gte(lhs, rhs);
    case 'And':
      return and(lhs, rhs);
    case 'Or':
      return or(lhs, rhs);
  }
}

function add(lhs: Value, rhs: Value): Int | Str {
  if (lhs.kind === 'Int' && rhs.kind === 'Int') {
    const value = lhs.value + rhs.value;

    return {
      kind: 'Int',
      value,
      location: {
        start: lhs.location.start,
        end: rhs.location.end,
        filename: lhs.location.filename
      }
    }
  }

  if ((lhs.kind === 'Str' && rhs.kind === 'Int') || (lhs.kind === 'Int' && rhs.kind === 'Str') || (lhs.kind === 'Str' && rhs.kind === 'Str')) {
    const value = lhs.value.toString() + rhs.value.toString();

    return {
      kind: 'Str',
      value,
      location: {
        start: lhs.location.start,
        end: rhs.location.end,
        filename: lhs.location.filename
      }
    }
  }
  
  binaryOperationNotValid(lhs, rhs, 'Add');
}

function sub(lhs: Value, rhs: Value): Int {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Sub');

  const value = lhs.value - rhs.value;

  return {
    kind: 'Int',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function mul(lhs: Value, rhs: Value): Int {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Mul');

  const value = lhs.value * rhs.value;

  return {
    kind: 'Int',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function div(lhs: Value, rhs: Value): Int {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Div');
  
  assertIntIsNotZero(rhs);

  const value = Math.floor(lhs.value / rhs.value);

  return {
    kind: 'Int',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function rem(lhs: Value, rhs: Value): Int {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Rem');

  assertIntIsNotZero(rhs);

  const value = lhs.value % rhs.value;

  return {
    kind: 'Int',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function eq(lhs: Value, rhs: Value): Bool {
  if ((lhs.kind !== 'Bool' || rhs.kind !== 'Bool') && (lhs.kind !== 'Str' || rhs.kind !== 'Str') && (lhs.kind !== 'Int' || rhs.kind !== 'Int'))
    binaryOperationNotValid(lhs, rhs, 'Eq');

  const value = lhs.value === rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function neq(lhs: Value, rhs: Value): Bool {
  if ((lhs.kind !== 'Bool' || rhs.kind !== 'Bool') && (lhs.kind !== 'Str' || rhs.kind !== 'Str') && (lhs.kind !== 'Int' || rhs.kind !== 'Int'))
    binaryOperationNotValid(lhs, rhs, 'Neq');

  const value = lhs.value !== rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function lt(lhs: Value, rhs: Value): Bool {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Lt');

  const value = lhs.value < rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function gt(lhs: Value, rhs: Value): Bool {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Gt');

  const value = lhs.value > rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function lte(lhs: Value, rhs: Value): Bool {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Lte');

  const value = lhs.value <= rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function gte(lhs: Value, rhs: Value): Bool {
  if (lhs.kind !== 'Int' || rhs.kind !== 'Int')
    binaryOperationNotValid(lhs, rhs, 'Gte');

  const value = lhs.value >= rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function and(lhs: Value, rhs: Value): Bool {
  if (lhs.kind !== 'Bool' || rhs.kind !== 'Bool')
    binaryOperationNotValid(lhs, rhs, 'And');

  const value = lhs.value && rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function or(lhs: Value, rhs: Value): Bool {
  if (lhs.kind !== 'Bool' || rhs.kind !== 'Bool')
    binaryOperationNotValid(lhs, rhs, 'Or');

  const value = lhs.value || rhs.value;

  return {
    kind: 'Bool',
    value,
    location: {
      start: lhs.location.start,
      end: rhs.location.end,
      filename: lhs.location.filename
    }
  }
}

function Int32(n: number): number {
  return n & 0xFFFFFFFF;
}