import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, ArrowLeft, ChevronLeft, ChevronRight, X, Upload, FileImage, Trash2, Search, User, CheckCircle, Edit } from 'lucide-react'

// API Base URL
const API_BASE_URL = 'https://acc-backend-4.onrender.com/api';

function App() {
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPaperFilter, setSelectedPaperFilter] = useState('all')
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [noteToDelete, setNoteToDelete] = useState(null)

  // API Service Functions
  const apiService = {
    async getNotes() {
      try {
        const response = await fetch(`${API_BASE_URL}/notes`);
        if (!response.ok) throw new Error('Network response was not ok');
        const notes = await response.json();
        return notes;
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
    },

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
          formData.append('images', imageFile);
        });

        const response = await fetch(`${API_BASE_URL}/notes`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const savedNote = await response.json();
        return savedNote;
      } catch (error) {
        console.error('Error creating note:', error);
        throw error;
      }
    },

    async updateNote(noteId, noteData) {
      try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', noteData.title);
        formData.append('authorName', noteData.authorName);
        formData.append('paper', noteData.paper);
        formData.append('chapterId', noteData.chapterId.toString());
        formData.append('existingImages', JSON.stringify(noteData.existingImages || []));
        
        // Add new image files if any
        if (noteData.newImages && noteData.newImages.length > 0) {
          noteData.newImages.forEach((imageFile) => {
            formData.append('images', imageFile);
          });
        }

        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const updatedNote = await response.json();
        return updatedNote;
      } catch (error) {
        console.error('Error updating note:', error);
        throw error;
      }
    },

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
    }
  };

  // Load notes from backend on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const allNotes = await apiService.getNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const accounting1Chapters = [
    { id: 1, title: "হিসাববিজ্ঞান পরিচিতি", paper: "1st Paper" },
    { id: 2, title: "হিসাব বইসমূহ", paper: "1st Paper" },
    { id: 3, title: "ব্যাংক সমন্বয় বিবরণী", paper: "1st Paper" },
    { id: 4, title: "রেওয়ামিল", paper: "1st Paper" },
    { id: 5, title: "হিসাবের নীতিমালা", paper: "1st Paper" },
    { id: 6, title: "প্রাপ্য হিসাবসমূহের হিসাবরক্ষণ", paper: "1st Paper" },
    { id: 7, title: "কার্যপত্র", paper: "1st Paper" },
    { id: 8, title: "দৃশ্যমান ও অদৃশ্যমান সম্পদের হিসাবরক্ষণ", paper: "1st Paper" },
    { id: 9, title: "আর্থিক বিবরণী", paper: "1st Paper" },
    { id: 10, title: "একতরফা দাখিলা পদ্ধতি", paper: "1st Paper" }
  ]

  const accounting2Chapters = [
    { id: 1, title: "অংশীদারি ব্যবসায়ের হিসাব", paper: "2nd Paper" },
    { id: 2, title: "কোম্পানি হিসাব", paper: "2nd Paper" },
    { id: 3, title: "ব্যয় হিসাববিজ্ঞান", paper: "2nd Paper" },
    { id: 4, title: "বাজেট ও বাজেট নিয়ন্ত্রণ", paper: "2nd Paper" },
    { id: 5, title: "আর্থিক বিবরণী বিশ্লেষণ", paper: "2nd Paper" },
    { id: 6, title: "অলাভজনক প্রতিষ্ঠানের হিসাব", paper: "2nd Paper" },
    { id: 7, title: "শাখা হিসাব", paper: "2nd Paper" },
    { id: 8, title: "বিভাগীয় হিসাব", paper: "2nd Paper" },
    { id: 9, title: "কম্পিউটারাইজড হিসাববিজ্ঞান", paper: "2nd Paper" }
  ]

  const getChapterNotes = (chapter) => {
    return notes.filter(note => 
      note.chapterId === chapter.id && note.paper === chapter.paper
    )
  }

  // Edit note function
  const editNote = (note) => {
    setEditingNote(note);
    setShowEditForm(true);
  }

  // Update note function
  const updateNote = async (updatedNoteData) => {
    try {
      const updatedNote = await apiService.updateNote(editingNote._id, updatedNoteData);
      setNotes(prev => prev.map(note => 
        note._id === editingNote._id ? updatedNote : note
      ));
      setShowEditForm(false);
      setEditingNote(null);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error updating note:', error);
      alert(`নোট আপডেট করতে সমস্যা হয়েছে: ${error.message}`);
    }
  }

  const deleteNote = async (noteId) => {
    setNoteToDelete(noteId);
    setShowPinModal(true);
  }

  const handlePinSubmit = async () => {
    if (pinInput === '5566') {
      try {
        await apiService.deleteNote(noteToDelete);
        setNotes(prev => prev.filter(note => note._id !== noteToDelete));
        setSelectedNoteId(null);
        setCurrentImageIndex(0);
        setShowPinModal(false);
        setPinInput('');
        setNoteToDelete(null);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('নোট মুছতে সমস্যা হয়েছে');
      }
    } else {
      alert('ভুল PIN! সঠিক PIN দিন।');
      setPinInput('');
    }
  }

  const filterChapters = (chapters) => {
    if (!searchTerm) return chapters
    return chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const SuccessPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">সফল!</h3>
        <p className="text-gray-600 mb-6">আপনার নোট সফলভাবে সংরক্ষণ করা হয়েছে।</p>
        <button
          onClick={() => setShowSuccessPopup(false)}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold transition-all"
        >
          ঠিক আছে
        </button>
      </div>
    </div>
  )

  const PinModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">PIN দিন</h3>
        <p className="text-gray-600 mb-4 text-center">নোট মুছতে PIN প্রয়োজন</p>
        <input
          type="password"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="PIN লিখুন"
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-all text-center text-lg"
        />
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setShowPinModal(false);
              setPinInput('');
              setNoteToDelete(null);
            }}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-semibold transition-all"
          >
            বাতিল
          </button>
          <button
            onClick={handlePinSubmit}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 font-semibold transition-all"
          >
            মুছুন
          </button>
        </div>
      </div>
    </div>
  )

  const AddNotesForm = () => {
    const [title, setTitle] = useState('')
    const [authorName, setAuthorName] = useState('')
    const [selectedPaper, setSelectedPaper] = useState(selectedChapter ? selectedChapter.paper : '1st Paper')
    const [selectedChapterId, setSelectedChapterId] = useState(selectedChapter ? selectedChapter.id.toString() : '1')
    const [uploadedImages, setUploadedImages] = useState([])
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleDrop = (e) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
      handleFiles(files)
    }

    const handleFiles = (files) => {
      const imagePreviews = files.map(file => URL.createObjectURL(file))
      setUploadedImages(prev => [...prev, ...imagePreviews])
      setUploadedFiles(prev => [...prev, ...files])
    }

    const removeImage = (index) => {
      setUploadedImages(prev => prev.filter((_, i) => i !== index))
      setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
      if (!title || !authorName || uploadedFiles.length === 0) {
        alert('দয়া করে শিরোনাম, আপনার নাম এবং ছবি যোগ করুন')
        return
      }
      
      setSubmitting(true);
      try {
        const newNote = {
          title,
          authorName,
          paper: selectedPaper,
          chapterId: parseInt(selectedChapterId),
          images: uploadedFiles,
        };
        
        const savedNote = await apiService.createNote(newNote);
        setNotes(prev => [...prev, savedNote]);
        setShowAddForm(false);
        setTitle('');
        setAuthorName('');
        setUploadedImages([]);
        setUploadedFiles([]);
        setShowSuccessPopup(true);
      } catch (error) {
        console.error('Error creating note:', error);
        alert(`নোট সংরক্ষণ করতে সমস্যা হয়েছে: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    }

    const availableChapters = selectedPaper === '1st Paper' ? accounting1Chapters : accounting2Chapters

    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Plus className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">নতুন নোট যোগ করুন</h2>
          </div>
          <button 
            onClick={() => setShowAddForm(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">নোটের শিরোনাম</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
              placeholder="যেমন: অধ্যায় ১ - সম্পূর্ণ নোট"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">আপনার নাম</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">পেপার নির্বাচন করুন</label>
              <select
                value={selectedPaper}
                onChange={(e) => {
                  setSelectedPaper(e.target.value)
                  setSelectedChapterId('1')
                }}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
              >
                <option value="1st Paper">হিসাববিজ্ঞান ১ম পত্র</option>
                <option value="2nd Paper">হিসাববিজ্ঞান ২য় পত্র</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">অধ্যায় নির্বাচন করুন</label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
              >
                {availableChapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-3 font-semibold">ছবি আপলোড করুন</label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-4 md:p-8 text-center transition-all ${
                isDragging 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600 mb-2 font-medium text-sm md:text-base">
                ছবি টেনে এনে ছাড়ুন অথবা ক্লিক করুন
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-700 cursor-pointer transition-all font-medium text-sm md:text-base"
              >
                ফাইল নির্বাচন করুন
              </label>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700 font-semibold flex items-center gap-2 text-sm md:text-base">
                    <FileImage size={16} className="text-green-600" />
                    {uploadedImages.length} টি ছবি নির্বাচিত
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 md:h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 md:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 md:px-2 md:py-1 rounded">
                        পৃষ্ঠা {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={uploadedFiles.length === 0 || !title || !authorName || submitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 md:py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'সংরক্ষণ করা হচ্ছে...' : 'নোট সংরক্ষণ করুন'}
          </button>
        </div>
      </div>
    )
  }

  const EditNotesForm = () => {
    const [title, setTitle] = useState(editingNote?.title || '')
    const [authorName, setAuthorName] = useState(editingNote?.authorName || '')
    const [selectedPaper, setSelectedPaper] = useState(editingNote?.paper || '1st Paper')
    const [selectedChapterId, setSelectedChapterId] = useState(editingNote?.chapterId?.toString() || '1')
    const [existingImages, setExistingImages] = useState(editingNote?.images || [])
    const [newImages, setNewImages] = useState([])
    const [newImagePreviews, setNewImagePreviews] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleNewImageUpload = (e) => {
      const files = Array.from(e.target.files)
      handleNewFiles(files)
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleDrop = (e) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
      handleNewFiles(files)
    }

    const handleNewFiles = (files) => {
      const imagePreviews = files.map(file => URL.createObjectURL(file))
      setNewImagePreviews(prev => [...prev, ...imagePreviews])
      setNewImages(prev => [...prev, ...files])
    }

    const removeExistingImage = (index) => {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index) => {
      setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
      setNewImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
      if (!title || !authorName || (existingImages.length === 0 && newImages.length === 0)) {
        alert('দয়া করে শিরোনাম, আপনার নাম এবং অন্তত একটি ছবি যোগ করুন')
        return
      }
      
      setSubmitting(true);
      try {
        await updateNote({
          title,
          authorName,
          paper: selectedPaper,
          chapterId: parseInt(selectedChapterId),
          existingImages,
          newImages
        });
      } catch (error) {
        console.error('Error updating note:', error);
      } finally {
        setSubmitting(false);
      }
    }

    const availableChapters = selectedPaper === '1st Paper' ? accounting1Chapters : accounting2Chapters

    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Edit className="text-blue-600" size={20} />
            </div>
          </div>
          <button 
            onClick={() => {
              setShowEditForm(false)
              setEditingNote(null)
            }}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">নোটের শিরোনাম</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              placeholder="যেমন: অধ্যায় ১ - সম্পূর্ণ নোট"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">আপনার নাম</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">পেপার নির্বাচন করুন</label>
              <select
                value={selectedPaper}
                onChange={(e) => {
                  setSelectedPaper(e.target.value)
                  setSelectedChapterId('1')
                }}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="1st Paper">হিসাববিজ্ঞান ১ম পত্র</option>
                <option value="2nd Paper">হিসাববিজ্ঞান ২য় পত্র</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">অধ্যায় নির্বাচন করুন</label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              >
                {availableChapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-gray-700 mb-3 font-semibold">বর্তমান ছবি</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 md:h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 md:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 md:px-2 md:py-1 rounded">
                      পৃষ্ঠা {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Upload */}
          <div>
            <label className="block text-gray-700 mb-3 font-semibold">নতুন ছবি যোগ করুন</label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-4 md:p-8 text-center transition-all ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600 mb-2 font-medium text-sm md:text-base">
                নতুন ছবি টেনে এনে ছাড়ুন অথবা ক্লিক করুন
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageUpload}
                className="hidden"
                id="edit-file-upload"
              />
              <label
                htmlFor="edit-file-upload"
                className="inline-block bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-all font-medium text-sm md:text-base"
              >
                নতুন ফাইল যোগ করুন
              </label>
            </div>
            
            {newImagePreviews.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700 font-semibold flex items-center gap-2 text-sm md:text-base">
                    <FileImage size={16} className="text-blue-600" />
                    {newImagePreviews.length} টি নতুন ছবি যোগ করা হয়েছে
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {newImagePreviews.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`New Preview ${index + 1}`}
                        className="w-full h-24 md:h-32 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <button
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white p-1 md:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-blue-600 text-white text-xs px-1 py-0.5 md:px-2 md:py-1 rounded">
                        নতুন {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={(existingImages.length === 0 && newImages.length === 0) || !title || !authorName || submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 md:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'আপডেট করা হচ্ছে...' : 'নোট আপডেট করুন'}
          </button>
        </div>
      </div>
    )
  }

  const NotesViewer = () => {
    const chapterNotes = getChapterNotes(selectedChapter)
    const selectedNote = chapterNotes.find(note => note._id === selectedNoteId)

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Mobile Optimized */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button 
              onClick={() => {
                setSelectedChapter(null)
                setSelectedNoteId(null)
                setCurrentImageIndex(0)
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all w-fit"
            >
              <ArrowLeft size={18} />
              <span className="text-sm md:text-base">ফিরে যান</span>
            </button>
            
            <div className="text-center flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 break-words">{selectedChapter.title}</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{selectedChapter.paper}</p>
            </div>

            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all font-semibold text-sm md:text-base w-fit md:w-auto"
            >
              <Plus size={16} />
              <span>নোট যুক্ত করুন</span>
            </button>
          </div>
        </div>

        {selectedNote ? (
          <>
            {/* Note Viewer - Mobile Optimized */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              {/* Note Header - Mobile Optimized */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <button
                  onClick={() => {
                    setSelectedNoteId(null)
                    setCurrentImageIndex(0)
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold hover:bg-gray-100 px-3 py-2 rounded-lg transition-all w-fit"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm">নোট তালিকায় ফিরুন</span>
                </button>
                <div className="text-center flex-1">
                  <h3 className="text-base md:text-xl font-bold text-gray-800 break-words">{selectedNote.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
                    <User size={12} />
                    {selectedNote.authorName} - এর নোট
                  </p>
                </div>
                <div className="flex gap-2 justify-center md:justify-end">
                  {/* <button
                    onClick={() => editNote(selectedNote)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold text-xs md:text-sm"
                  >
                    <Edit size={14} />
                    <span>এডিট</span>
                  </button> */}
                  <button
                    onClick={() => deleteNote(selectedNote._id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg hover:bg-red-700 transition-all font-semibold text-xs md:text-sm"
                  >
                    <Trash2 size={14} />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
              
              {/* Image Display - Mobile Optimized */}
              <div className="bg-gray-50 rounded-lg p-2">
                <img 
                  src={selectedNote.images[currentImageIndex]}
                  alt={`Note page ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[60vh] md:max-h-[700px] object-contain mx-auto rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', selectedNote.images[currentImageIndex]);
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>

            {/* Navigation - Mobile Optimized */}
            {selectedNote.images.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentImageIndex === 0}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all font-semibold text-sm md:text-base w-full md:w-auto justify-center"
                  >
                    <ChevronLeft size={18} />
                    <span>আগের পৃষ্ঠা</span>
                  </button>
                  
                  <div className="text-center">
                    <span className="text-gray-700 font-bold text-base md:text-lg">
                      পৃষ্ঠা {currentImageIndex + 1} / {selectedNote.images.length}
                    </span>
                  </div>

                  <button 
                    onClick={() => setCurrentImageIndex(prev => Math.min(selectedNote.images.length - 1, prev + 1))}
                    disabled={currentImageIndex === selectedNote.images.length - 1}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all font-semibold text-sm md:text-base w-full md:w-auto justify-center"
                  >
                    <span>পরের পৃষ্ঠা</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Notes List - Mobile Optimized
          <div>
            {chapterNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {chapterNotes.map(note => (
                  <div 
                    key={note._id}
                    className="bg-white p-4 md:p-5 rounded-2xl shadow-md border-2 border-transparent cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all transform hover:-translate-y-1"
                  >
                    <div 
                      onClick={() => {
                        setSelectedNoteId(note._id);
                        setCurrentImageIndex(0);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="relative mb-3 md:mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={note.images[0]}
                          alt={note.title}
                          className="w-full h-32 md:h-48 object-cover"
                          onError={(e) => {
                            console.error('Thumbnail failed to load:', note.images[0]);
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23f0f0f0" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {note.images.length} পৃষ্ঠা
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 text-base md:text-lg mb-2 line-clamp-2">{note.title}</h3>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                        <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                          <User size={12} />
                          {note.authorName}
                        </p>
                        <p className="text-xs text-gray-500">
                          তারিখ: {new Date(note.createdAt).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => {
                          setSelectedNoteId(note._id);
                          setCurrentImageIndex(0);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all text-xs md:text-sm font-semibold"
                      >
                        দেখুন
                      </button>
                      {/* <button 
                        onClick={() => editNote(note)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all text-xs md:text-sm font-semibold"
                      >
                        এডিট
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-20 bg-white rounded-2xl shadow-lg">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-gray-500 text-base md:text-lg mb-2">এই অধ্যায়ের জন্য কোনো নোট নেই</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-700 font-semibold inline-flex items-center gap-2 text-sm md:text-base"
                >
                  <Plus size={16} />
                  নোট যোগ করুন
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const ChaptersList = () => {
    const filtered1st = filterChapters(accounting1Chapters)
    const filtered2nd = filterChapters(accounting2Chapters)
    
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-green-600 p-3 md:p-4 rounded-2xl mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-3">হিসাববিজ্ঞান নোট</h1>
          <p className="text-gray-600 text-base md:text-xl">১ম ও ২য় পত্রের সকল অধ্যায়ের নোট এক জায়গায়</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">নোট লোড হচ্ছে...</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="অধ্যায় খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-base"
            />
          </div>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 md:px-8 md:py-4 rounded-xl hover:from-green-700 hover:to-green-800 font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>নতুন নোট যোগ করুন</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => setSelectedPaperFilter('all')}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
              selectedPaperFilter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            সব পেপার
          </button>
          <button
            onClick={() => setSelectedPaperFilter('1st')}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
              selectedPaperFilter === '1st'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ১ম পত্র
          </button>
          <button
            onClick={() => setSelectedPaperFilter('2nd')}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${
              selectedPaperFilter === '2nd'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ২য় পত্র
          </button>
        </div>

        {(selectedPaperFilter === 'all' || selectedPaperFilter === '1st') && filtered1st.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-blue-700 mb-4 md:mb-6 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="text-blue-700" size={20} />
              </div>
              <span>হিসাববিজ্ঞান ১ম পত্র ({filtered1st.length} টি অধ্যায়)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered1st.map(chapter => {
                const chapterNotes = getChapterNotes(chapter)
                const hasNotes = chapterNotes.length > 0
                return (
                  <div 
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-md border-2 border-transparent cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <h3 className="font-bold text-gray-800 text-base md:text-lg flex-1">{chapter.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold whitespace-nowrap ml-2">
                        ১ম পত্র
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs md:text-sm font-medium ${hasNotes ? 'text-green-600' : 'text-gray-400'}`}>
                        {hasNotes 
                          ? `✓ ${chapterNotes.length} টি নোট আছে` 
                          : 'নোট যোগ করুন'
                        }
                      </p>
                      {hasNotes && (
                        <div className="bg-green-100 p-1.5 md:p-2 rounded-lg">
                          <FileImage className="text-green-600" size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {(selectedPaperFilter === 'all' || selectedPaperFilter === '2nd') && filtered2nd.length > 0 && (
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-green-700 mb-4 md:mb-6 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <BookOpen className="text-green-700" size={20} />
              </div>
              <span>হিসাববিজ্ঞান ২য় পত্র ({filtered2nd.length} টি অধ্যায়)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered2nd.map(chapter => {
                const chapterNotes = getChapterNotes(chapter)
                const hasNotes = chapterNotes.length > 0
                return (
                  <div 
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-md border-2 border-transparent cursor-pointer hover:shadow-xl hover:border-green-300 transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <h3 className="font-bold text-gray-800 text-base md:text-lg flex-1">{chapter.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold whitespace-nowrap ml-2">
                        ২য় পত্র
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs md:text-sm font-medium ${hasNotes ? 'text-green-600' : 'text-gray-400'}`}>
                        {hasNotes 
                          ? `✓ ${chapterNotes.length} টি নোট আছে` 
                          : 'নোট যোগ করুন'
                        }
                      </p>
                      {hasNotes && (
                        <div className="bg-green-100 p-1.5 md:p-2 rounded-lg">
                          <FileImage className="text-green-600" size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {searchTerm && filtered1st.length === 0 && filtered2nd.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <Search className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-500 text-base md:text-xl">কোনো অধ্যায় পাওয়া যায়নি</p>
            <p className="text-gray-400 mt-2 text-sm md:text-base">অন্য কিছু খুঁজে দেখুন</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 md:py-8 px-4">
      <div className="container mx-auto">
        {showAddForm ? (
          <AddNotesForm />
        ) : showEditForm ? (
          <EditNotesForm />
        ) : selectedChapter ? (
          <NotesViewer />
        ) : (
          <ChaptersList />
        )}
        
        {showSuccessPopup && <SuccessPopup />}
        {showPinModal && <PinModal />}
      </div>
    </div>
  )
}

export default App