/* eslint-disable camelcase */

/**
 * @typedef {import('../types/NoteTypes.js').Note} Note
 */

/**
 * @param {Object} noteDB
 * @param {string} noteDB.id
 * @param {string} noteDB.title
 * @param {string} noteDB.body
 * @param {string[]} noteDB.tags
 * @param {string} noteDB.created_at
 * @param {string} noteDB.updated_at
 * @param {string} noteDB.owner
 * @param {string} noteDB.username
 * @returns {Note}
 */
function mapDBToNoteModel({
  id,
  title,
  body,
  tags,
  created_at,
  updated_at,
  owner,
  username,
}) {
  return {
    id,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
    owner,
    username,
  };
}

module.exports = {
  mapDBToNoteModel,
};
