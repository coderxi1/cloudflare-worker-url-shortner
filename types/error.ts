export class RespError extends Error {
  private code: number
  constructor(code: number, message?: string) {
    super();
    this.code = code
    this.message = message ?? ''
  }
  public toJsonObject() {
    return {
      code: this.code,
      message: this.message || undefined
    }
  }
}

export const ErrorCode = {
  UNKNOWN: -1,

  HTTP_UNAUTHORIZED: 401,
  HTTP_METHOD_NOT_ALLOWED: 403,

  PASSWORD_WRONG : 10001,

  SAVE_URL_REQUIRED: 20001,
  SAVE_URL_NOT_VAILD: 20002,
  SAVE_URL_NOT_IN_HOST_WHITELIST: 20003,
  SAVE_CUSTOM_KEY_NEED_ADMIN: 20004,
  SAVE_EXPIRE_DAY_NEED_ADMIN: 20005,
  SAVE_KEY_EXSITS: 20006,
  SAVE_KEY_GEN_FAILED: 20007,

  DELETE_NO_KEY: 21001,
  DELETE_KEY_NEED_ADMIN: 21002,

  LIST_KEY_ERROR_PN: 22001,
  LIST_KEY_ERROR_PS: 22002,
  LIST_KEY_NEED_ADMIN: 22003
}