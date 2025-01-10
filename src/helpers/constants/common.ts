const COMMON_CONSTANT = {
  // HTTP status
  HTTP_STATUS: {
    SUCCESS: {
      OK: 200,
      CREATED: 201,
    },
    CLIENT_ERROR: {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
    },
    SERVER_ERROR: {
      INTERNAL_SERVER_ERROR: 500,
    },
  },

  TOAST_STATUS: {
    ERROR: "error",
    SUCCESS: "success",
    WARNING: "warning",
    INFO: "info",
  },

  HTTP_METHOD: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
  },

  CONDITION: {
    TRUE: true,
    FALSE: false,
  },

  SYSTEM_ERROR: {
    SERVER_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau",
  },
};

export { COMMON_CONSTANT };
