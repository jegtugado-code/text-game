export type Condition = {
  type: ConditionType;
  value: string; // item ID or choice ID
};

export type ConditionType =
  | 'hasItem'
  | 'noItem'
  | 'choiceMade'
  | 'noChoiceMade';
