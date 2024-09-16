export interface IaraNavigationBookmark {
  name: string;
  content: string;
  title: string;
  offset: {
    start: string;
    end: string;
  };
  additive?: IaraAdditiveBookmark;
}

export type SortableList = {
  default: {
    create: (arg0: HTMLElement) => void;
  };
};

export interface IaraAdditiveBookmark {
  title: string;
  delimiterStart: string;
  delimiterEnd: string;
  additiveTexts: {
    identifier: string;
    phrase: string;
  }[];
}
