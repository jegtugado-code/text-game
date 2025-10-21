export interface Condition {
  type: ConditionType;
  value: string;
}

export type ConditionType =
  | 'hasItem'
  | 'noItem'
  | 'choiceMade'
  | 'noChoiceMade';
