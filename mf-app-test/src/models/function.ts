export interface FunctionModel {
  FunctionId: string;
  FunctionName: string;
  ParentFunctionId?: string;
  Enabled?: boolean;
  Children?: FunctionModel[];
}
