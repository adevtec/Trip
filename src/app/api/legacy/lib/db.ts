/**
 * Legacy Database utilities - Disabled
 * 
 * This file contained database utilities that depended on mysql2 package
 * which is not installed in the current project. If database functionality is needed,
 * it should be reimplemented with proper dependencies.
 */

export const query = () => {
  throw new Error("Legacy database utilities are disabled");
};
