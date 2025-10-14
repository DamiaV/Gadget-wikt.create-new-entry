// <nowiki>
/**
 * Return the next id from the given array.
 * @param {{id: number}[]} objectsWithId An array of objects with an numerical "id" property.
 * @returns {number} The maximum id of the list + 1, or 1 if the array is empty.
 */
function getNextId(objectsWithId) {
  if (objectsWithId.length === 0) return 1;
  return Math.max(...objectsWithId.map((e) => e.id)) + 1;
}

// </nowiki>
/**
 * This module defines miscellaneous utility functions.
 *
 * [[Catégorie:JavaScript du Wiktionnaire|create-new-entry/utils.js]]
 */
export default {
  getNextId,
};
