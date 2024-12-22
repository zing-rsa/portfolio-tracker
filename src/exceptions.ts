export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RequestException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
  }
}