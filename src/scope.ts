import { Value } from "./AST";

export default class Scope {
  private variables: Map<String, Value>;

  public constructor() {
    this.variables = new Map();
  }

  public getVariable(name: string): Value | undefined {
    return this.variables.get(name)
  }

  public setVariable(name: string, term: Value) {
    return this.variables.set(name, term)
  }

  public clone(): Scope {
    const scope = new Scope();
    scope.variables = new Map(this.variables);
    
    return scope;
  }
}