import { SceneModel } from './scene-model';

export interface QuestModel {
  id: string;
  title: string;
  description: string;
  location: string;
  scenes: Record<string, SceneModel>;
}
