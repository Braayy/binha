import { Term, Function, Value } from './AST';
import { binary } from './binary';
import Scope from './scope';
import { assertCallable, assertFunctionParameterLength, assertKind, assertValue, assertVariableExists } from './error';

export function evaluate(expression: Term, scope: Scope): Term {
  switch (expression.kind) {
    case 'Int':
    case 'Str':
    case 'Bool':
    case 'Function':
      return expression;

    case 'Binary': {
      const lhs = evaluate(expression.lhs, scope);
      assertValue(lhs);

      const rhs = evaluate(expression.rhs, scope);
      assertValue(rhs);

      return binary(lhs, rhs, expression.op);
    }

    case 'Tuple': {
      const first = evaluate(expression.first, scope);
      assertValue(first);

      const second = evaluate(expression.second, scope);
      assertValue(second);

      return {
        kind: 'Tuple',
        first,
        second,
        location: expression.location,
      }
    }

    case 'First' : {
      const tuple = evaluate(expression.value, scope);
      assertKind(tuple, 'Tuple');

      const first = evaluate(tuple.first, scope);

      return first;
    }

    case 'Second' : {
      const tuple = evaluate(expression.value, scope);
      assertKind(tuple, 'Tuple');

      const first = evaluate(tuple.second, scope);

      return first;
    }

    case 'Print': {
      const value = evaluate(expression.value, scope);
      assertValue(value);

      console.log(valueToString(value));
      return value;
    }

    case 'If': {
      const condition = evaluate(expression.condition, scope);
      assertKind(condition, 'Bool');

      if (condition.value) {
        return evaluate(expression.then, scope);
      } else {
        return evaluate(expression.otherwise, scope);
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
      const value = evaluate(expression.value, scope);
      assertValue(value);

      scope.setVariable(name, value);

      return evaluate(expression.next, scope);
    }
    
    case 'Call': {
      const callee = expression.callee;
      assertCallable(callee);

      let func: Function;
      if (callee.kind === 'Var') {
        const value = evaluate(callee, scope);
        assertKind(value, 'Function');

        func = value;
      } else {
        func = callee;
      }

      assertFunctionParameterLength(func, expression);

      const innerScope = scope.clone();

      for (let i = 0; i < func.parameters.length; i++) {
        const value = evaluate(expression.arguments[i], scope);
        assertValue(value);

        innerScope.setVariable(func.parameters[i].text, value);
      }

      const value = evaluate(func.value, innerScope);
      assertValue(value);

      return value;
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