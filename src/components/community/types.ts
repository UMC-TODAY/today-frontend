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

// TodoFinder에서 모달로 전달할 데이터 (color/emoji 포함)
export interface SelectedTodoData {
  todo: TodoItem;
  emoji: string;
  bgColor: string;
}
