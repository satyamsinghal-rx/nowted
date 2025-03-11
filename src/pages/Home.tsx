import { useEffect } from "react";
import NotesList from "../components/NotesList";
import { useAppContext } from "../hooks/useAppContext";
import { useParams } from "react-router";
import NoteEditor from "../components/NoteEditor";

function Home() {
  const {
    notes,
    setSelectedNote,
    setSelectedFolder,
    archived,
    deleted,
    folders,
  } = useAppContext();
  const { folderId, noteId, view } = useParams();

  useEffect(() => {
    if (folderId) setSelectedFolder(folderId);
    else setSelectedFolder(null);

    if (noteId) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setSelectedNote(note);
      }
    }
  }, [folderId, noteId, notes, setSelectedFolder, setSelectedNote]);

  const getFilteredNotes = () => {
    let filteredNotes = notes;

    if (view === "favorites") {
      filteredNotes = notes.filter(
        (note) => note.isFavorite && !note.isDeleted
      );
    } else if (view === "trash") {
      filteredNotes = deleted.filter((note) => note.deletedAt != null);
    } else if (view === "archived") {
      filteredNotes = archived.filter(
        (note) => note.isArchived && note.deletedAt === null
      );
    } else if (folderId) {
      filteredNotes = notes.filter((note) => note.folderId === folderId);
    } else {
      filteredNotes = notes.filter(
        (note) =>
          note.folderId === folders[0].id && !note.isArchived && !note.isDeleted
      );
    }
    // if (searchQuery) {
    //   const query = searchQuery.toLowerCase();
    //   filteredNotes = filteredNotes.filter(note => note?.title?.toLowerCase().includes(query));
    // }

    return filteredNotes;
  };

  const getTitle = (): string => {
    if (view === "favorites") return "Favorites";
    if (view === "archived") return "Archived";
    if (view === "trash") return "Trash";
    if (folderId) {
      // const folderNotes = notes.find(note => note.folderId === folderId)
      // return folderNotes?.folder.name || 'Folder'
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.name || "Select A Folder";
    }
    if (folders.length > 0) {
      return folders[0].name;
    }
    return "No Folder";
  };

  if (view === "new-note") {
    return (
      <div className="flex flex-1 h-full">
        <div className="w-80 h-screen overflow-hidden">
          <NotesList title={getTitle()} notes={getFilteredNotes()} />
        </div>
        <NoteEditor />
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full">
      <div className="w-80 h-screen overflow-hidden">
        <NotesList title={getTitle()} notes={getFilteredNotes()} />
      </div>
      <NoteEditor />
    </div>
  );
}

export default Home;
