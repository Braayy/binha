import { Term, Function, Value } from './AST';
import { binary } from './binary';
import Scope from './scope';
import { assertCallable, assertFunctionParameterLength, assertKind, assertValue, assertVariableExists } from './error';
import Memoization from './memoization';

export function evaluate(expression: Term, scope: Scope, memoization: Memoization): Term {
  switch (expression.kind) {
    case 'Int': {
      expression.value = BigInt(expression.value);
      
      return expression;
    }
    case 'Str':
    case 'Bool':
    case 'Function':
      return expression;

    case 'Binary': {
      const lhs = evaluate(expression.lhs, scope, memoization);
      assertValue(lhs);

      const rhs = evaluate(expression.rhs, scope, memoization);
      assertValue(rhs);

      return binary(lhs, rhs, expression.op);
    }

    case 'Tuple': {
      const first = evaluate(expression.first, scope, memoization);
      assertValue(first);

      const second = evaluate(expression.second, scope, memoization);
      assertValue(second);

      return {
        kind: 'Tuple',
        first,
        second,
        location: expression.location,
      }
    }

    case 'First' : {
      const tuple = evaluate(expression.value, scope, memoization);
      assertKind(tuple, 'Tuple');

      const first = evaluate(tuple.first, scope, memoization);

      return first;
    }

    case 'Second' : {
      const tuple = evaluate(expression.value, scope, memoization);
      assertKind(tuple, 'Tuple');

      const first = evaluate(tuple.second, scope, memoization);

      return first;
    }

    case 'Print': {
      const value = evaluate(expression.value, scope, memoization);
      assertValue(value);

      console.log(valueToString(value));
      return value;
    }

    case 'If': {
      const condition = evaluate(expression.condition, scope, memoization);
      assertKind(condition, 'Bool');

      if (condition.value) {
        return evaluate(expression.then, scope, memoization);
      } else {
        return evaluate(expression.otherwise, scope, memoization);
      }
    }

    case 'Var': {
      const name = expression.text;
      
      const value = scope.getVariable(name);
      assertVariableExists(name, value, expression.location);

      return value;
    }

    case 'Let': {
      const name = expression.name.text;
      const value = evaluate(expression.value, scope, memoization);
      assertValue(value);

      scope.setVariable(name, value);

      return evaluate(expression.next, scope, memoization);
    }
    
    case 'Call': {
      const callee = expression.callee;
      assertCallable(callee);

      let func: Function;
      if (callee.kind === 'Var') {
        const value = evaluate(callee, scope, memoization);
        assertKind(value, 'Function');

        func = value;
      } else {
        func = callee;
      }

      assertFunctionParameterLength(func, expression);

      const innerScope = scope.clone();
      const args: Array<Value> = [];

      for (let i = 0; i < func.parameters.length; i++) {
        const value = evaluate(expression.arguments[i], scope, memoization);
        assertValue(value);

        innerScope.setVariable(func.parameters[i].text, value);
        args.push(value);
      }

      const memoizedResult = memoization.getMemoizedResult(func, args);

      if (memoizedResult) {
        return memoizedResult;
      }

      const result = evaluate(func.value, innerScope, memoization);
      assertValue(result);

      if (memoization.canBeMemoized(func)) {
        memoization.memoizeResult(func, args, result);
      }

      return result;
    }
  }
}

export function valueToString(term: Value): string {
  switch (term.kind) {
    case 'Int': return String(term.value);
    case 'Str': return `"${term.value}"`;
    case 'Bool': return String(term.value);
    case 'Function': return `fn(${term.parameters.map((p) => p.text).join(', ')})`;
    case 'Tuple': return `(${valueToString(term.first as Value)},${valueToString(term.second as Value)})`;
  }
}