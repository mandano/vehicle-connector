export class Address {
  private readonly _street: string;
  private readonly _number?: string;
  private readonly _postCode: string;
  private readonly _country_code: string;

  constructor(street: string, postCode: string, country_code: string, number?: string) {
    this._street = street;
    this._number = number;
    this._postCode = postCode;
    this._country_code = country_code;
  }

  get street(): string {
    return this._street;
  }

  get number(): string | undefined {
    return this._number;
  }

  get postCode(): string {
    return this._postCode;
  }

  get country_code(): string {
    return this._country_code;
  }
}
