import { Term } from "./AST";

export default function fixReplLocation(expression: Term) {
  expression.location.filename = 'repl';
  
  switch (expression.kind) {
    case 'Call':
      expression.arguments.forEach((term) => fixReplLocation(term));
      fixReplLocation(expression.callee);
      break;
    
    case 'Binary':
      fixReplLocation(expression.lhs);
      fixReplLocation(expression.rhs);
      break;
    
    case 'Function':
      expression.parameters.forEach((parameter) => fixReplLocation(parameter));
      fixReplLocation(expression.value);
      break;
    
    case 'Let':
      fixReplLocation(expression.name);
      fixReplLocation(expression.value);
      fixReplLocation(expression.next);
      break;
    
    case 'If':
      fixReplLocation(expression.condition);
      fixReplLocation(expression.then);
      fixReplLocation(expression.otherwise);
      break;
    
    case 'Print':
      fixReplLocation(expression.value);
      break;
    
    case 'First':
      fixReplLocation(expression.value);
      break;
    
    case 'Second':
      fixReplLocation(expression.value);
      break;
    
    case 'Tuple':
      fixReplLocation(expression.first);
      fixReplLocation(expression.second);
  }
}