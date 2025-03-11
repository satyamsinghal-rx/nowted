import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Note, Folder } from "../types";
import {
    createFolder, deleteFolder, deleteNote, editFolder, getFolders, getNotes, getRecents,
    getNoteById, editNote, getArchived, getDeleted, restoreNoteById, getFolderById,
    getFavorites
} from "../apis/api";
import { useApi } from "../hooks/useApi";
import { createNote } from "../apis/api";

interface AppContextType {
    notes: Note[];
    folders: Folder[];
    recents: Note[];
    loading: boolean;
    error: string | null;
    selectedNote: Note | null;
    selectedFolder: string | undefined;
    searchQuery: string;
    archived: Note[];
    deleted: Note[];
    setSearchQuery: (query: string) => void;
    setSelectedNote: (note: Note | null) => void;
    setSelectedFolder: (folderId: string | null) => void;
    addNote: (note: Partial<Note>) => Promise<Note | undefined>;
    updateNote: (id: string, note: Partial<Note>) => Promise<Note | undefined>;
    removeNote: (id: string) => Promise<void>;
    addFolder: (folder: Partial<Folder>) => Promise<Folder | undefined>;
    updateFolder: (id: string, folder: Partial<Folder>) => Promise<Folder | undefined>;
    removeFolder: (id: string) => Promise<void>;
    refetchData: () => void;
    createNewNote: (folderId?: string) => Promise<Note | undefined>;
    fetchNoteById: (id: string) => Promise<Note | null>;
    toggleArchive: (note: Note) => Promise<void>;
    restoreNote: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: notesData, loading: notesLoading, error: notesError, refetch: refetchNotes } = useApi(getNotes);
    const { data: foldersData, loading: foldersLoading, error: foldersError, refetch: refetchFolders } = useApi(getFolders);
    const { data: recentsData, loading: recentsLoading, error: recentsError, refetch: refetchRecents } = useApi(getRecents);
    const { data: archivedData, refetch: refetchArchived } = useApi(getArchived);
    const { data: deletedData, refetch: refetchDeleted } = useApi(getDeleted);
    const { data: favoritesData, refetch: refetchFavorites } = useApi(getFavorites);

    const loading = notesLoading || foldersLoading || recentsLoading;
    const error = notesError || foldersError || recentsError;
    const notes = notesData || [];
    const folders = foldersData || [];
    const recents = recentsData || [];
    const archived = archivedData || [];
    const deleted = deletedData || [];
    const favorites = favoritesData || [];


    useEffect(() => {
        if (selectedNote && !notes.find(note => note.id === selectedNote.id)) {
            getNoteById(selectedNote.id).then((note) => {
                if (!note) setSelectedNote(null);
            })
        }
    }, [notes, selectedNote]);

    const refetchData = () => {
        refetchNotes();
        refetchFolders();
        refetchRecents();
        refetchArchived();
        refetchDeleted();
        refetchFavorites();
    }

    const fetchNoteById = useCallback(async (id: string): Promise<Note | null> => {
        try {
            const note = await getNoteById(id);
            if (note) {
                setSelectedNote(note);
                return note;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }, []);

    const fetchFolderById = useCallback(async (id: string): Promise<Folder | null> => {
        try {
            const folder = await getFolderById(id);
            if (folder) {
                setSelectedFolder(folder);
                return folder;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }, []);

    const addNote = useCallback(async (note: Partial<Note>): Promise<Note | undefined> => {
        try {
            const response = await createNote(note);
            refetchNotes();
            return response;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }, [refetchNotes]);

    const addFolder = async (folder: Partial<Folder>): Promise<Folder | null> => {
        try {
            const response = await createFolder(folder);
            refetchFolders();
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const updateNote = async (id: string, note: Partial<Note>): Promise<Note | null> => {
        try {
            const response = await editNote(id, note);
            refetchData();
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const updateFolder = async (id: string, folder: Partial<Folder>) => {
        try {
            const response = await editFolder(id, folder);
            refetchFolders();
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const removeNote = async (id: string): Promise<void> => {
        try {
            await deleteNote(id);
            refetchNotes();

            if (selectedNote?.id === id) {
                setSelectedNote(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const restoreNote = async (id: string) => {
        try {
            await restoreNoteById(id);
            refetchData();

        } catch (error) {
            console.log(error);

        }
    }

    const removeFolder = async (id: string): Promise<void> => {
        try {
            await deleteFolder(id);
            refetchData();
            if (selectedFolder === id) {
                setSelectedFolder(undefined);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleArchive = async (note: Note): Promise<void> => {
        try {
            await editNote(note.id, { isArchived: !note.isArchived });
            refetchData();
            console.log('Notes after toggleArchive:', notes);
        } catch (error) {
            console.error('Error toggling archive:', error);
        }
    };

    const createNewNote = useCallback(async (folderId?: string): Promise<Note | undefined> => {
        try {
            const newNote = {
                title: 'Untitled Note',
                content: '',
                preview: '',
                folderId: folderId || undefined,
                isFavorite: false,
                isDeleted: false,
                isArchived: false,
                updatedAt: new Date().toISOString(),
            };
            const response = await createNote(newNote);
            refetchNotes();
            setSelectedNote(response!);
            return response;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }, [refetchNotes, setSelectedNote]);

    const contextValue = {
        notes,
        folders,
        recents,
        loading,
        error,
        selectedNote,
        selectedFolder,
        searchQuery,
        setSearchQuery,
        setSelectedNote,
        setSelectedFolder,
        addNote,
        updateNote,
        removeNote,
        addFolder,
        updateFolder,
        removeFolder,
        refetchData,
        createNewNote,
        fetchNoteById,
        toggleArchive,
        archived,
        deleted,
        restoreNote,
        fetchFolderById,
        favorites,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
