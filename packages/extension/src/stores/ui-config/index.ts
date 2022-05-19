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
    showDarkMode : false,
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
      var dark = document.querySelectorAll(".drk");
      dark.forEach(dm => { dm.remove(); });

      var style = document.createElement('style');
      style.classList.add("drk");
      style.innerHTML = `
      p, span, h1, h2, h3, h4 ,h5, div, {color:white !important;}
      nav, div[class^='inner'],div[class^='container'], .card {background-color: dimgrey !important;}
      `;
      document.body.appendChild(style);
    }
    if (value == false) {
      var dark = document.querySelectorAll(".drk");
      dark.forEach(dm => { dm.remove(); });

      var style = document.createElement('style');
      style.classList.add("drk");
      style.innerHTML = `
      p, span, h1, h2, h3, h4 ,h5, div, {color:black !important;}
      nav, div[class^='inner'],div[class^='container'], .card {background-color: white !important;}
      `;
      document.body.appendChild(style);
    }
  }
  
  get showDarkMode(): boolean {
    return this.options.showDarkMode;    
  }

  @action
  setDarkMode(value: boolean) {
    this.options.showDarkMode = value;

    this.darkStyle(value);
    /* if (value == true) {
      var dark = document.querySelectorAll(".drk");
      dark.forEach(dm => { dm.remove(); });

      var style = document.createElement('style');
      style.classList.add("drk");
      style.innerHTML = `
      p, span, h1, h2, h3, h4 ,h5, div, {color:white !important;}
      nav, div[class^='inner'],div[class^='container'], .card {background-color: dimgrey !important;}
      `;
      document.body.appendChild(style);
    }
    if (value == false) {
      var dark = document.querySelectorAll(".drk");
      dark.forEach(dm => { dm.remove(); });

      var style = document.createElement('style');
      style.classList.add("drk");
      style.innerHTML = `
      p, span, h1, h2, h3, h4 ,h5, div, {color:black !important;}
      nav, div[class^='inner'],div[class^='container'], .card {background-color: white !important;}
      `;
      document.body.appendChild(style);
    } */
    // No need to await
    this.save();
  }

  async save() {
    const data = toJS(this.options);
    await this.kvStore.set("options", data);
  }
}
