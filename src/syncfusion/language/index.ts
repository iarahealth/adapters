import { IaraSyncfusionConfig } from "..";
import { IaraSyncfusionLanguages } from "./iaraLanguages";
import { IaraLanguages } from "./language";

export class IaraSyncfusionLanguageManager {
  public languages: IaraLanguages;

  constructor(private _config: IaraSyncfusionConfig) {
    const locale = new IaraSyncfusionLanguages();
    this._config.language;
    switch (this._config.language) {
      case "es":
        this.languages = locale.es;
        break;
      default:
        this.languages = locale.ptBr;
        break;
    }
  }
}
