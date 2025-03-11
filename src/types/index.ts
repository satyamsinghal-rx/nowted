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
  