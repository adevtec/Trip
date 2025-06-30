/**
 * Legacy JWT utilities - Disabled
 * 
 * This file contained JWT utilities that depended on the jsonwebtoken package
 * which is not installed in the current project. If JWT functionality is needed,
 * it should be reimplemented with proper dependencies.
 */

export const generateToken = () => {
  throw new Error("Legacy JWT utilities are disabled");
};

export const verifyToken = () => {
  throw new Error("Legacy JWT utilities are disabled");
};

export const decodeToken = () => {
  throw new Error("Legacy JWT utilities are disabled");
};
