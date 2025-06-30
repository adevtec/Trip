/**
 * Legacy Auth Middleware - Disabled
 * 
 * This file contained auth middleware that depended on JWT utilities
 * which are not available in the current project. If auth middleware is needed,
 * it should be reimplemented with proper dependencies.
 */

export const authMiddleware = () => {
  throw new Error("Legacy auth middleware is disabled");
};

export const adminMiddleware = () => {
  throw new Error("Legacy auth middleware is disabled");
};
