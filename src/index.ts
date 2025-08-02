import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export enum NisixErrorStatus {
  // Client Error Responses
  BadRequest = 400, // The server could not understand the request due to invalid syntax.
  Unauthorized = 401, // The client must authenticate itself to get the requested response.
  PaymentRequired = 402, // Reserved for future use.
  Forbidden = 403, // The client does not have access rights to the content.
  NotFound = 404, // The server can not find the requested resource.
  MethodNotAllowed = 405, // The request method is known by the server but is not supported by the target resource.
  NotAcceptable = 406, // The server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers.
  ProxyAuthenticationRequired = 407, // The client must first authenticate itself with the proxy.
  RequestTimeout = 408, // The server would like to shut down this unused connection.
  Conflict = 409, // The request conflicts with the current state of the server.
  Gone = 410, // The content has been permanently deleted from the server, with no forwarding address.
  LengthRequired = 411, // The server refuses to accept the request without a defined Content-Length header.
  PreconditionFailed = 412, // The client has indicated preconditions in its headers which the server does not meet.
  PayloadTooLarge = 413, // The request entity is larger than limits defined by server.
  URITooLong = 414, // The URI requested by the client is longer than the server is willing to interpret.
  UnsupportedMediaType = 415, // The media format of the requested data is not supported by the server.
  RangeNotSatisfiable = 416, // The range specified by the Range header field in the request cannot be fulfilled.
  ExpectationFailed = 417, // The expectation given in the request's Expect header could not be met.
  ImATeapot = 418, // Any attempt to brew coffee with a teapot should result in the error code 418 I'm a teapot.
  MisdirectedRequest = 421, // The request was directed at a server that is not able to produce a response.
  UnprocessableEntity = 422, // The request was well-formed but was unable to be followed due to semantic errors.
  Locked = 423, // The resource that is being accessed is locked.
  FailedDependency = 424, // The request failed due to failure of a previous request.
  TooEarly = 425, // Indicates that the server is unwilling to risk processing a request that might be replayed.
  UpgradeRequired = 426, // The client should switch to a different protocol.
  PreconditionRequired = 428, // The origin server requires the request to be conditional.
  TooManyRequests = 429, // The user has sent too many requests in a given amount of time.
  RequestHeaderFieldsTooLarge = 431, // The server is unwilling to process the request because its header fields are too large.
  UnavailableForLegalReasons = 451, // The user-agent requested a resource that cannot legally be provided.

  // Server Error Responses
  InternalServerError = 500, // The server has encountered a situation it doesn't know how to handle.
  NotImplemented = 501, // The request method is not supported by the server and cannot be handled.
  BadGateway = 502, // The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
  ServiceUnavailable = 503, // The server is not ready to handle the request.
  GatewayTimeout = 504, // The server is acting as a gateway and cannot get a response in time.
  HTTPVersionNotSupported = 505, // The HTTP version used in the request is not supported by the server.
  VariantAlsoNegotiates = 506, // Transparent content negotiation for the request results in a circular reference.
  InsufficientStorage = 507, // The server is unable to store the representation needed to complete the request.
  LoopDetected = 508, // The server detected an infinite loop while processing the request.
  NotExtended = 510, // Further extensions to the request are required for the server to fulfill it.
  NetworkAuthenticationRequired = 511, // The client needs to authenticate to gain network access.
}

export enum NisixErrorCode {
  UnknownError = 'UnknownError',
  ValidationError = 'ValidationError',
  Unauthenticated = 'Unauthenticated',
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  MethodNotAllowed = 'MethodNotAllowed',
  NotAcceptable = 'NotAcceptable',
  ProxyAuthenticationRequired = 'ProxyAuthenticationRequired',
  RequestTimeout = 'RequestTimeout',
  Conflict = 'Conflict',
  Gone = 'Gone',
  LengthRequired = 'LengthRequired',
  PreconditionFailed = 'PreconditionFailed',
  PayloadTooLarge = 'PayloadTooLarge',
  URITooLong = 'URITooLong',
  UnsupportedMediaType = 'UnsupportedMediaType',
  RangeNotSatisfiable = 'RangeNotSatisfiable',
  ExpectationFailed = 'ExpectationFailed',
  ImATeapot = 'ImATeapot',
  MisdirectedRequest = 'MisdirectedRequest',
  UnprocessableEntity = 'UnprocessableEntity',
  Locked = 'Locked',
  FailedDependency = 'FailedDependency',
  TooEarly = 'TooEarly',
  UpgradeRequired = 'UpgradeRequired',
  PreconditionRequired = 'PreconditionRequired',
  TooManyRequests = 'TooManyRequests',
  RequestHeaderFieldsTooLarge = 'RequestHeaderFieldsTooLarge',
  UnavailableForLegalReasons = 'UnavailableForLegalReasons',
  InternalServerError = 'InternalServerError',
  NotImplemented = 'NotImplemented',
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  HTTPVersionNotSupported = 'HTTPVersionNotSupported',
  VariantAlsoNegotiates = 'VariantAlsoNegotiates',
  InsufficientStorage = 'InsufficientStorage',
  LoopDetected = 'LoopDetected',
  NotExtended = 'NotExtended',
  NetworkAuthenticationRequired = 'NetworkAuthenticationRequired',
}

export class NisixError extends Error {
  public status: number;
  public metaData: any;
  constructor(code: string = NisixErrorCode.UnknownError, status?: number, metaData: any = null) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.metaData = metaData;

    // Use provided status if defined, otherwise determine from code
    this.status = status !== undefined ? status : this.determineStatusFromCode(code);
  }

  private determineStatusFromCode(code: string): number {
    switch (code) {
      case NisixErrorCode.ValidationError:
        return NisixErrorStatus.UnprocessableEntity; // 422
      case NisixErrorCode.Unauthenticated:
        return NisixErrorStatus.Unauthorized; // 401
      case NisixErrorCode.BadRequest:
        return NisixErrorStatus.BadRequest; // 400
      case NisixErrorCode.Unauthorized:
        return NisixErrorStatus.Forbidden; // 403
      case NisixErrorCode.NotFound:
        return NisixErrorStatus.NotFound; // 404
      case NisixErrorCode.ServiceUnavailable:
        return NisixErrorStatus.ServiceUnavailable; // 503
      case NisixErrorCode.GatewayTimeout:
        return NisixErrorStatus.GatewayTimeout; // 504
      case NisixErrorCode.BadGateway:
        return NisixErrorStatus.BadGateway; // 502
      case NisixErrorCode.InternalServerError:
        return NisixErrorStatus.InternalServerError; // 500
      case NisixErrorCode.MethodNotAllowed:
        return NisixErrorStatus.MethodNotAllowed; // 405
      case NisixErrorCode.NotAcceptable:
        return NisixErrorStatus.NotAcceptable; // 406
      case NisixErrorCode.ProxyAuthenticationRequired:
        return NisixErrorStatus.ProxyAuthenticationRequired; // 407
      case NisixErrorCode.RequestTimeout:
        return NisixErrorStatus.RequestTimeout; // 408
      case NisixErrorCode.Conflict:
        return NisixErrorStatus.Conflict; // 409
      case NisixErrorCode.Gone:
        return NisixErrorStatus.Gone; // 410
      case NisixErrorCode.LengthRequired:
        return NisixErrorStatus.LengthRequired; // 411
      case NisixErrorCode.PreconditionFailed:
        return NisixErrorStatus.PreconditionFailed; // 412
      case NisixErrorCode.PayloadTooLarge:
        return NisixErrorStatus.PayloadTooLarge; // 413
      case NisixErrorCode.URITooLong:
        return NisixErrorStatus.URITooLong; // 414
      case NisixErrorCode.UnsupportedMediaType:
        return NisixErrorStatus.UnsupportedMediaType; // 415
      case NisixErrorCode.RangeNotSatisfiable:
        return NisixErrorStatus.RangeNotSatisfiable; // 416
      case NisixErrorCode.ExpectationFailed:
        return NisixErrorStatus.ExpectationFailed; // 417
      case NisixErrorCode.ImATeapot:
        return NisixErrorStatus.ImATeapot; // 418
      case NisixErrorCode.MisdirectedRequest:
        return NisixErrorStatus.MisdirectedRequest; // 421
      case NisixErrorCode.UnprocessableEntity:
        return NisixErrorStatus.UnprocessableEntity; // 422
      case NisixErrorCode.Locked:
        return NisixErrorStatus.Locked; // 423
      case NisixErrorCode.FailedDependency:
        return NisixErrorStatus.FailedDependency; // 424
      case NisixErrorCode.TooEarly:
        return NisixErrorStatus.TooEarly; // 425
      case NisixErrorCode.UpgradeRequired:
        return NisixErrorStatus.UpgradeRequired; // 426
      case NisixErrorCode.PreconditionRequired:
        return NisixErrorStatus.PreconditionRequired; // 428
      case NisixErrorCode.TooManyRequests:
        return NisixErrorStatus.TooManyRequests; // 429
      case NisixErrorCode.RequestHeaderFieldsTooLarge:
        return NisixErrorStatus.RequestHeaderFieldsTooLarge; // 431
      case NisixErrorCode.UnavailableForLegalReasons:
        return NisixErrorStatus.UnavailableForLegalReasons; // 451
      case NisixErrorCode.NotImplemented:
        return NisixErrorStatus.NotImplemented; // 501
      case NisixErrorCode.HTTPVersionNotSupported:
        return NisixErrorStatus.HTTPVersionNotSupported; // 505
      case NisixErrorCode.VariantAlsoNegotiates:
        return NisixErrorStatus.VariantAlsoNegotiates; // 506
      case NisixErrorCode.InsufficientStorage:
        return NisixErrorStatus.InsufficientStorage; // 507
      case NisixErrorCode.LoopDetected:
        return NisixErrorStatus.LoopDetected; // 508
      case NisixErrorCode.NotExtended:
        return NisixErrorStatus.NotExtended; // 510
      case NisixErrorCode.NetworkAuthenticationRequired:
        return NisixErrorStatus.NetworkAuthenticationRequired; // 511
      default:
        return NisixErrorStatus.InternalServerError; // Default to 500
    }
  }
}

interface NisixErrorHandlerOptions {
  debug?: boolean;
}

export interface NisixErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

const nisixErrorHandler = (options: NisixErrorHandlerOptions = {}): ErrorRequestHandler => {
  return (err: NisixError | any, req: Request, res: Response, next: NextFunction): void => {
    const status: number = err.status || err.statusCode || 500;
    const message: string = err.message || 'Internal Server Error';
    const debug: boolean = options.debug ?? process.env.NODE_ENV !== 'production';

    if (err instanceof NisixError) {
      res.status(err.status).send({
        status,
        message: err.message,
        ...(debug && { stack: err.stack }),
        ...(err.metaData && { metaData: err.metaData }),
      });
    } else {
      const response: NisixErrorResponse = {
        status,
        message,
        ...(debug && { stack: err.stack }),
      };

      res.status(status).json({ error: response });
    }
  };
};

export default nisixErrorHandler;
