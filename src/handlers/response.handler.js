import Logging from '../library/Logging.js';

const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).json(data);

const error = (res, err) => {
  Logging.error(err);
  return responseWithData(res, 500, {
    status: 500,
    msg: 'Internal Server Error!',
  });
};

const badrequest = (res, data) =>
  responseWithData(res, 400, {
    status: 400,
    data,
  });

const ok = (res, data) => responseWithData(res, 200, { status: 200, data });

const created = (res, data) =>
  responseWithData(res, 201, {
    status: 201,
    data,
  });

const unauthorize = (res, { err }) =>
  responseWithData(res, 401, {
    status: '401',
    err,
  });

const notfound = (res) =>
  responseWithData(res, 404, {
    status: 404,
    msg: 'Resource not found!',
  });

const unprocessableEntity = (res, err) =>
  responseWithData(res, 422, { status: 422, err });

export default {
  ok,
  error,
  created,
  unauthorize,
  notfound,
  badrequest,
  unprocessableEntity,
};
