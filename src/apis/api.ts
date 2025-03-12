import axios from "axios";
import { Note, Folder } from "../types";

const API_URL = "https://nowted-server.remotestate.com";

export const getNotes = async (
  page: number = 1,
  limit: number = 10,
  folderId?: string,
  deleted?: boolean,
  archived?: boolean,
  favorite?: boolean
): Promise<Note[]> => {
  try {
    console.log(folderId);
    // const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes?limit=100`);
    const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes`, {
      params: {
        page: page,
        limit: limit,
        folderId: folderId,
        deleted: deleted,
        archived: archived,
        favorite: favorite,
      },
    });

    return response.data.notes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const response = await axios.get<Note>(`${API_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFavorites = async (): Promise<Note[]> => {
  try {
    // const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes?favorite=true`);
    const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes`, {
      params: { favorite: true },
    });
    return response.data.notes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getArchived = async (): Promise<Note[]> => {
  try {
    const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes`, {
      params: { archived: true },
    });
    return response.data.notes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getDeleted = async (): Promise<Note[]> => {
  try {
    // const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes?deleted=true`);
    const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes`, {
      params: { deleted: true },
    });

    return response.data.notes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getRecents = async (): Promise<Note[]> => {
  try {
    const response = await axios.get<{ recentNotes: Note[] }>(
      `${API_URL}/notes/recent`
    );
    return response.data.recentNotes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getFolders = async (): Promise<Folder[]> => {
  try {
    const response = await axios.get<{ folders: Folder[] }>(
      `${API_URL}/folders`
    );
    return response.data.folders;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getFolderById = async (id: string): Promise<Folder | null> => {
  try {
    const response = await axios.get<{ folder: Folder }>(
      `${API_URL}/folders/${id}`
    );
    return response.data.folder;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createFolder = async (
  folder: Partial<Folder>
): Promise<Folder | null> => {
  try {
    const response = await axios.post<{ folder: Folder }>(
      `${API_URL}/folders`,
      folder
    );
    return response.data.folder;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createNote = async (
  note: Partial<Note>
): Promise<Note | undefined> => {
  try {
    const response = await axios.post<{ note: Note }>(`${API_URL}/notes`, note);
    return response.data.note;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const editNote = async (
  id: string,
  note: Partial<Note>
): Promise<Note | null> => {
  try {
    const response = await axios.patch<{ note: Note }>(
      `${API_URL}/notes/${id}`,
      note
    );

    return response.data.note;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// export const editNote = async (id: string, note: Partial<Note>): Promise<Note | null> => {
//     try {
//         const cleanedNote = JSON.parse(JSON.stringify(note, (_, value) => (value === undefined ? null : value)));

//         console.log("Final Data Sent to API:", cleanedNote); // Debugging step

//         const response = await axios.patch<{ note: Note }>(
//             `${API_URL}/notes/${id}`,
//             cleanedNote,
//             { headers: { 'Content-Type': 'application/json' } }
//         );

//         console.log("API Response:", response.data);
//         return response.data.note;
//     } catch (error) {
//         console.error("Error updating note:", error);
//         return null;
//     }
// };

export const editFolder = async (
  id: string,
  folder: Partial<Folder>
): Promise<Folder | null> => {
  try {
    const response = await axios.patch<{ folder: Folder }>(
      `${API_URL}/folders/${id}`,
      folder
    );
    return response.data.folder;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/notes/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteFolder = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/folders/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const restoreNoteById = async (id: string) => {
  try {
    await axios.post(`${API_URL}/notes/${id}/restore`);
  } catch (error) {
    console.log(error);
  }
};
