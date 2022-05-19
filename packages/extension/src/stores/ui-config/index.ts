/**
 * Store the config related to UI.
 */
import { action, makeObservable, observable, runInAction, toJS } from "mobx";
import { KVStore } from "@keplr-wallet/common";

export interface UIConfigOptions {
  showAdvancedIBCTransfer: boolean;
  showDarkMode: boolean;
}

export class UIConfigStore {
  @observable.deep
  protected options: UIConfigOptions = {
    showAdvancedIBCTransfer: false,
    showDarkMode: false,
  };

  constructor(protected readonly kvStore: KVStore) {
    makeObservable(this);

    this.init();
  }

  protected async init() {
    // There is no guarantee that this value will contain all options fields, as the options field may be added later.
    const data = await this.kvStore.get<Partial<UIConfigOptions>>("options");

    runInAction(() => {
      this.options = {
        ...this.options,
        ...data,
      };
    });
  }

  /**
   * Currently, keplr only supports the IBC UI which the users should set the counterparty channel manually.
   * However, it makes the normal users take a mistake.
   * So, to reduce this problem, show the IBC UI to users who only turns on the `showAdvancedIBCTransfer` explicitly.
   */
  get showAdvancedIBCTransfer(): boolean {
    return this.options.showAdvancedIBCTransfer;
  }

  @action
  setShowAdvancedIBCTransfer(value: boolean) {
    this.options.showAdvancedIBCTransfer = value;
    // No need to await
    this.save();
  }

  @action
  darkStyle(value: boolean) {
    if (value == true) {
      const dark = document.querySelectorAll(".drk");
      dark.forEach((dm) => {
        dm.remove();
      });

      const style = document.createElement("style");
      style.classList.add("drk");
      style.innerHTML = `
      p, span, h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, div {color: #d3d3d3 !important;}
      nav, div[class^='inner'],div[class^='container'], .card, .container-2IREuiOyDNqzjBAjd_KV_F div, .container-2r_sTVfDeimjo0VLAYOa4O {background-color: #252525 !important;}
      div[class^='inner-container'] > p, i.fa-user, canvas, .popover-body div {color: grey !important}
      .container-2uHDJYw0Nr96cUDJhKob26 {border-top: #585858 solid 1px !important}
      .container-2uHDJYw0Nr96cUDJhKob26:last-of-type { border-bottom: #585858 solid 1px; }
      .popper { background-color: rgba(0,0,0,.90) !important; }
      .chain-name-3y9Cmcj2vnhF87NtAYca07 { color: rgba(255,255,255,.5) !important; }
      .selected, .btn-primary div {color: white !important}
      .menu-img-3Ws5G3zOf3NqQMjVQuWomF svg path { stroke: grey !important; }
      .form-control { background-color: #b1b1b1 !important; color: #f5f5f5 !important;}
      `;
      document.head.appendChild(style);
    }
    if (value == false) {
      const dark = document.querySelectorAll(".drk");
      dark.forEach((dm) => {
        dm.remove();
      });

      const style = document.createElement("style");
      style.classList.add("drk");
      style.innerHTML = `
      p, span, h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, div {color:#32325d !important;}
      .h4 {color: #8898aa !important}
      div[class^='chain-name'], div[class^='icon'] div {color: rgba(255,255,255,.5) !important}
      .selected, .btn-primary div {color: white !important}
      .tooltip-inner {color: grey !important}
      div[class^='value-'] {color: rgb(82, 95, 127) !important}
      
      nav, div[class^='inner'],div[class^='container'], .card {background-color: white !important;}
      `;
      document.head.appendChild(style);
    }
  }

  get showDarkMode(): boolean {
    return this.options.showDarkMode;
  }

  @action
  setDarkMode(value: boolean) {
    this.options.showDarkMode = value;

    this.darkStyle(value);
    // No need to await
    this.save();
  }

  async save() {
    const data = toJS(this.options);
    await this.kvStore.set("options", data);
  }
}
