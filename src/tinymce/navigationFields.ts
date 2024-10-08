import { IaraEditorNavigationFieldManager } from "../editor/navigationFields";
import { IaraNavigationBookmark } from "../syncfusion/navigationFields/navigationBookmark";

export class IaraTinyMceNavigationFieldManager extends IaraEditorNavigationFieldManager {
  bookmarks: IaraNavigationBookmark[] = [] as IaraNavigationBookmark[];
  nextField(): void {
    throw new Error("Method not implemented.");
  }
  previousField(): void {
    throw new Error("Method not implemented.");
  }
  goToField(title: string): void {
    console.log(title);
    throw new Error(`Method not implemented.`);
  }
  hasEmptyRequiredFields(): boolean {
    throw new Error("Method not implemented.");
  }
  insertField(): void {
    throw new Error("Method not implemented.");
  }
}
