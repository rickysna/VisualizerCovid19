export type DataFieldsCo = {
  [key: string]: any;
}

export default class DataFields<Data extends DataFieldsCo> {
  private fields:Data;

  constructor() {
    this.fields = Object.create({});
  }

  addFieldData(field: string | DataFieldsCo, val?: any) {
    if (typeof field === "string") {
      this.fields = Object.assign(this.fields, {
        [field]: val,
      });
    } else {
      this.fields = Object.assign(this.fields, field);
    }
  }

  getFieldData(field: string) {
    return this.fields[field];
  }

  getAll() {
    return this.fields;
  }
}
