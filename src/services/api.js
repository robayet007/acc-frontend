const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Get all notes
  async getNotes() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  // Get notes by chapter and paper
  async getChapterNotes(paper, chapterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${paper}/${chapterId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chapter notes:', error);
      throw error;
    }
  },

  // Create new note
  async createNote(noteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  // Delete note
  async deleteNote(noteId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  // Get chapters
  async getChapters(paper) {
    try {
      const response = await fetch(`${API_BASE_URL}/chapters/${paper}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  }
};