export interface TodoItem {
  taskId: string;
  title: string;
  description: string;
  subTasks: string[];
  defaultDurationMin: number;
  repeatRule: string;
  difficulty: number;
  tags: string[];
  template: {
    recommendedTimes: string[];
    minPerSession: number;
  };
  status: string;
}

export interface Category {
  categoryKey: string;
  items: TodoItem[];
}
