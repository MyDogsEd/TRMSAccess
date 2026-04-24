function wantsJson(req) {
  return req.baseUrl.startsWith("/api") || req.path.startsWith("/api");
}

function handleSuccess(req, res, view, locals) {
  if (wantsJson(req)) {
    res.json(locals);
    return;
  }

  res.render(view, locals);
}

function handleRedirect(req, res, redirectPath, payload, statusCode = 201) {
  if (wantsJson(req)) {
    res.status(statusCode).json(payload);
    return;
  }

  res.redirect(redirectPath);
}

function parseNumericId(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function asyncHandler(handler) {
  return async function wrappedHandler(req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  asyncHandler,
  handleRedirect,
  handleSuccess,
  parseNumericId,
  wantsJson
};
