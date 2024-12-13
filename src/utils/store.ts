import { IInputParams } from '../interfaces/input-params.interface';

class Store {
  private inputParams: IInputParams = {
    from: '',
    to: [],
    dir: '',
    skipExisting: false,
    genType: '',
    diff: ['', ''],
  };

  public setInputParams(params: IInputParams) {
    this.inputParams = params;
  }

  getInputParams() {
    return this.inputParams;
  }
}

export const store = new Store();
