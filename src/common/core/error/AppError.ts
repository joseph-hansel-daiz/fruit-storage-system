import { APP_ERRORS } from "./errors.constant";

export namespace AppError {
  export class KnownError extends Error {
    public constructor(message: string) {
      super(message);
    }

    public static create(message: string): KnownError {
      return new KnownError(message);
    }
  }

  export class UnexpectedError extends Error {
    public constructor() {
      super(APP_ERRORS.UNEXPECTED);
    }

    public static create(): UnexpectedError {
      return new UnexpectedError();
    }
  }

  export function identifyError(error: Error | unknown): Error {
    if (error instanceof AppError.KnownError) {
      return error;
    } else {
      return AppError.UnexpectedError.create();
    }
  }
}
