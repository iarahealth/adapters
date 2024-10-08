export interface IaraNavigationBookmark {
  name: string;
  content: string;
  title: string;
  offset: {
    start: string;
    end: string;
  };
}

export type SortableList = {
  default: {
    create: (arg0: HTMLElement) => void;
  };
};
