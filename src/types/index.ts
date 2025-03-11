export interface Note {
    id: string;
    title: string | undefined;
    content: string;
    preview: string;
    folderId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isFavorite: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    note: Note;

}

export interface Folder {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
  

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }

 export interface AppContextType {
    notes: Note[];
    folders: Folder[];
    recents: Note[];
    loading: boolean;
    error: string | null;
    selectedNote: Note | null;
    selectedFolder: string | undefined | null;
    searchQuery: string;
    archived: Note[];
    deleted: Note[];
    setSearchQuery: (query: string) => void;
    setSelectedNote: (note: Note | null) => void;
    setSelectedFolder: (folderId: string | null | undefined) => void;
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

