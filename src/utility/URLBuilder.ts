import { ResourceId } from 'ts/types'

export default class URLBuilder {
  private _baseUrl: string

  private _url: string

  private _queryParams: string[]

  private _queryParamValues: string[]

  constructor(version?: number) {
    this._baseUrl = `/api/v${version || 1}`
    this._url = this._baseUrl
    this._queryParams = []
    this._queryParamValues = []
  }

  private addId(id: ResourceId): URLBuilder {
    this._url += `/${id}`
    return this
  }

  public addQueryParam(name: string, value: string): URLBuilder {
    this._queryParams.push(name)
    this._queryParamValues.push(value)
    return this
  }

  public wishlists(id?: ResourceId): URLBuilder {
    this._url += '/wishlists'
    if (id) this.addId(id)
    return this
  }

  public items(id?: ResourceId): URLBuilder {
    this._url += '/items'
    if (id) this.addId(id)
    return this
  }

  public exchanges(id?: ResourceId): URLBuilder {
    this._url += '/exchanges'
    if (id) this.addId(id)
    return this
  }

  public build(): string {
    let url = this._url
    // Reset the url to the base url for the next build operation
    this._url = this._baseUrl
    if (this._queryParams.length > 0) {
      url += '?'
      this._queryParams.forEach((param, index) => {
        url += `${param}=${this._queryParamValues[index]}`
        if (index < this._queryParams.length - 1) {
          url += '&'
        }
      })
    }
    return url
  }
}
