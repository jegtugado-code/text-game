export type Stat =
  | 'health'
  | 'strength'
  | 'vitality'
  | 'intelligence'
  | 'dexterity'
  | 'agility';

export type Stats = Record<Stat, number>;
