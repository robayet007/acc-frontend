const API_BASE_URL = '/api'; // Use proxy instead of direct URL

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

  // Create new note - FIXED VERSION
  async createNote(noteData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', noteData.title);
      formData.append('authorName', noteData.authorName);
      formData.append('paper', noteData.paper);
      formData.append('chapterId', noteData.chapterId.toString());
      
      // Add image files
      noteData.images.forEach((imageFile, index) => {
        formData.append('images', imageFile); // Make sure this is actual File object
      });

      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        // REMOVE Content-Type header - let browser set it automatically
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
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