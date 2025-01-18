/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable camelcase */

/**
 * @typedef {import('../types/NoteTypes.js').Note} Note
 */

/**
 * @param {{id: string, title: string, body: string, tags: string[], created_at: string, updated_at: string}} noteDB
 * @returns {Note}
 */
function mapDBToNoteModel({ id, title, body, tags, created_at, updated_at }) {
  return {
    id,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

module.exports = {
  mapDBToNoteModel,
};
