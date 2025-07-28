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
  constructor(code: string = NisixErrorCode.UnknownError, status: number = 500, metaData: any = null) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.status = status;
    this.metaData = metaData;
    switch (code) {
      case NisixErrorCode.Unauthenticated:
        this.status = NisixErrorStatus.Unauthorized; // 401
        break;
      case NisixErrorCode.BadRequest:
        this.status = NisixErrorStatus.BadRequest; // 400
        break;
      case NisixErrorCode.Unauthorized:
        this.status = NisixErrorStatus.Forbidden; // 403
        break;
      case NisixErrorCode.NotFound:
        this.status = NisixErrorStatus.NotFound; // 404
        break;
      case NisixErrorCode.ServiceUnavailable:
        this.status = NisixErrorStatus.ServiceUnavailable; // 503
        break;
      case NisixErrorCode.GatewayTimeout:
        this.status = NisixErrorStatus.GatewayTimeout; // 504
        break;
      case NisixErrorCode.BadGateway:
        this.status = NisixErrorStatus.BadGateway; // 502
        break;
      case NisixErrorCode.InternalServerError:
        this.status = NisixErrorStatus.InternalServerError; // 500
        break;
      case NisixErrorCode.MethodNotAllowed:
        this.status = NisixErrorStatus.MethodNotAllowed; // 405
        break;
      case NisixErrorCode.NotAcceptable:
        this.status = NisixErrorStatus.NotAcceptable; // 406
        break;
      case NisixErrorCode.ProxyAuthenticationRequired:
        this.status = NisixErrorStatus.ProxyAuthenticationRequired; // 407
        break;
      case NisixErrorCode.RequestTimeout:
        this.status = NisixErrorStatus.RequestTimeout; // 408
        break;
      case NisixErrorCode.Conflict:
        this.status = NisixErrorStatus.Conflict; // 409
        break;
      case NisixErrorCode.Gone:
        this.status = NisixErrorStatus.Gone; // 410
        break;
      case NisixErrorCode.LengthRequired:
        this.status = NisixErrorStatus.LengthRequired; // 411
        break;
      case NisixErrorCode.PreconditionFailed:
        this.status = NisixErrorStatus.PreconditionFailed; // 412
        break;
      case NisixErrorCode.PayloadTooLarge:
        this.status = NisixErrorStatus.PayloadTooLarge; // 413
        break;
      case NisixErrorCode.URITooLong:
        this.status = NisixErrorStatus.URITooLong; // 414
        break;
      case NisixErrorCode.UnsupportedMediaType:
        this.status = NisixErrorStatus.UnsupportedMediaType; // 415
        break;
      case NisixErrorCode.RangeNotSatisfiable:
        this.status = NisixErrorStatus.RangeNotSatisfiable; // 416
        break;
      case NisixErrorCode.ExpectationFailed:
        this.status = NisixErrorStatus.ExpectationFailed; // 417
        break;
      case NisixErrorCode.ImATeapot:
        this.status = NisixErrorStatus.ImATeapot; // 418
        break;
      case NisixErrorCode.MisdirectedRequest:
        this.status = NisixErrorStatus.MisdirectedRequest; // 421
        break;
      case NisixErrorCode.UnprocessableEntity:
        this.status = NisixErrorStatus.UnprocessableEntity; // 422
        break;
      case NisixErrorCode.Locked:
        this.status = NisixErrorStatus.Locked; // 423
        break;
      case NisixErrorCode.FailedDependency:
        this.status = NisixErrorStatus.FailedDependency; // 424
        break;
      case NisixErrorCode.TooEarly:
        this.status = NisixErrorStatus.TooEarly; // 425
        break;
      case NisixErrorCode.UpgradeRequired:
        this.status = NisixErrorStatus.UpgradeRequired; // 426
        break;
      case NisixErrorCode.PreconditionRequired:
        this.status = NisixErrorStatus.PreconditionRequired; // 428
        break;
      case NisixErrorCode.TooManyRequests:
        this.status = NisixErrorStatus.TooManyRequests; // 429
        break;
      case NisixErrorCode.RequestHeaderFieldsTooLarge:
        this.status = NisixErrorStatus.RequestHeaderFieldsTooLarge; // 431
        break;
      case NisixErrorCode.UnavailableForLegalReasons:
        this.status = NisixErrorStatus.UnavailableForLegalReasons; // 451
        break;
      case NisixErrorCode.NotImplemented:
        this.status = NisixErrorStatus.NotImplemented; // 501
        break;
      case NisixErrorCode.HTTPVersionNotSupported:
        this.status = NisixErrorStatus.HTTPVersionNotSupported; // 505
        break;
      case NisixErrorCode.VariantAlsoNegotiates:
        this.status = NisixErrorStatus.VariantAlsoNegotiates; // 506
        break;
      case NisixErrorCode.InsufficientStorage:
        this.status = NisixErrorStatus.InsufficientStorage; // 507
        break;
      case NisixErrorCode.LoopDetected:
        this.status = NisixErrorStatus.LoopDetected; // 508
        break;
      case NisixErrorCode.NotExtended:
        this.status = NisixErrorStatus.NotExtended; // 510
        break;
      case NisixErrorCode.NetworkAuthenticationRequired:
        this.status = NisixErrorStatus.NetworkAuthenticationRequired; // 511
        break;
      default:
        this.status = NisixErrorStatus.InternalServerError; // Default to 500
        break;
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
