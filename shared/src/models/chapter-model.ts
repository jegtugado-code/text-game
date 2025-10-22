export interface ChapterModel {
  id: string;
  title: string;
  description: string;
  quests: string[]; // array of QuestModel ids
}
