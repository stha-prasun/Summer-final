export const makeRes = () => {
  const res = {
    _status: 200,
    _body: null,
    _cookies: [],
    _headers: {},
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      this._body = body;
      return this;
    },
    setHeader(name, value) {
      this._headers[name] = value;
    },
    cookie(name, value, opts) {
      this._cookies.push({ name, value, opts });
      return this;
    },
  };
  return res;
};
