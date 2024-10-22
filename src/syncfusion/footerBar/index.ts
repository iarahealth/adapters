import { IaraSyncfusionConfig } from "..";
import { IaraSyncfusionLanguageManager } from "../language";

export class IaraSyncfusionFooterBarManager {
  private _finishReportButton: HTMLSpanElement =
    document.createElement("button");
  private _statusBarElement: HTMLElement | null =
    document.querySelector(".e-de-status-bar");
  private _savingReportSpan: HTMLSpanElement = document.createElement("span");

  constructor(
    private _languageManager: IaraSyncfusionLanguageManager,
    private _config: IaraSyncfusionConfig,
    private _onFinishReportClick: () => void
  ) {
    this._initSavingReportSpan();
    if (this._config.showFinishReportButton) {
      this._initFinishReportSpan();
    }
  }

  private _initSavingReportSpan() {
    this._savingReportSpan.style.width = "120px";
    this._savingReportSpan.style.margin = "10px";
    this._savingReportSpan.style.fontSize = "12px";
    this._savingReportSpan.style.color = "black";
    const spanContent =
      this._languageManager.languages.language.iaraTranslate.saveMessage
        .success;
    this._savingReportSpan.innerHTML = `<span class="e-icons e-check" style="margin-right: 4px; color: #b71c1c"></span>${spanContent}`;

    this._statusBarElement?.insertBefore(
      this._savingReportSpan,
      this._statusBarElement.firstChild
    );
  }

  private _initFinishReportSpan() {
    this._finishReportButton.classList.add("e-control");
    this._finishReportButton.classList.add("e-btn");
    this._finishReportButton.classList.add("e-lib");
    this._finishReportButton.classList.add("e-primary");
    this._finishReportButton.innerHTML = `Finalizar laudo`;
    this._finishReportButton.setAttribute("type", "button");
    this._finishReportButton.setAttribute("title", "Finalizar laudo");
    this._finishReportButton.style.margin = "0px 10px";
    this._finishReportButton.style.backgroundColor = "#b71c1c";

    this._statusBarElement?.insertBefore(
      this._finishReportButton,
      this._statusBarElement.children[2]
    );
    this._finishReportButton.addEventListener(
      "click",
      this._onFinishReportClick
    );
  }

  updateSavingReportStatus(status: "success" | "error" | "loading") {
    let spanContent = "";
    switch (status) {
      case "success":
        spanContent =
          this._languageManager.languages.language.iaraTranslate.saveMessage
            .success;
        this._savingReportSpan.innerHTML = `<span class="e-icons e-check" style="margin-right: 4px; color: #b71c1c"></span>${spanContent}`;
        break;
      case "error":
        spanContent =
          this._languageManager.languages.language.iaraTranslate.saveMessage
            .error;
        this._savingReportSpan.innerHTML = `<span class="e-icons e-warning" style="margin-right: 4px; color: #ffb300"></span>${spanContent}`;
        break;
      case "loading":
        spanContent =
          this._languageManager.languages.language.iaraTranslate.saveMessage
            .loading;
        this._savingReportSpan.innerHTML = `<span class="e-icons e-refresh-2" style="margin-right: 4px"></span>${spanContent}`;
        break;
    }
  }
}
