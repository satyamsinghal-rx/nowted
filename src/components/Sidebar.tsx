import logoIcon from "../assets/logo.svg";
import searchIcon from "../assets/search.svg";
import docIcon from "../assets/Frame.svg";
import { useAppContext } from "../hooks/useAppContext";
import fileIcon from "../assets/Frame (1).svg";
import trash from "../assets/trash.svg";
import favorite from "../assets/fav.svg";
import archived from "../assets/arch.svg";
import folderAddIcon from "../assets/addfolder.svg";
import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Note } from "../types";
import deleteIcon from "../assets/delete.svg";
import openFolderIcon from "../assets/openFolder.svg";

function Sidebar() {
  const {
    recents,
    folders,
    loading,
    addFolder,
    selectedFolder,
    setSelectedFolder,
    createNewNote,
    selectedNote,
    updateFolder,
    setSelectedNote,
    searchQuery,
    setSearchQuery,
    notes,
    removeFolder,
    refetchData,
  } = useAppContext();

  const [newFolderName, setNewFolderName] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>("");

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName });
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  const handleNewNote = async () => {
    const newNote = await createNewNote(selectedFolder!);
    if (newNote) {
      navigate(`/new-note`);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    navigate(`/folder/${note.folderId}/note/${note.id}`);
  };

  const handleFolderDoubleClick = (folderId: string, name: string) => {
    setEditingFolderId(folderId);
    setFolderName(name);
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  const handleFolderRename = useCallback(async () => {
    if (editingFolderId && folderName.trim()) {
      await updateFolder(editingFolderId, { name: folderName });
    }
    setEditingFolderId(null);
  }, [editingFolderId, folderName, updateFolder]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFolderRename();
    }
  };

  useEffect(() => {
    if (folders.length > 0 && !selectedFolder && location.pathname === "/") {
      setSelectedFolder(folders[0].id);
      navigate(`/folder/${folders[0].id}`);
    }

    if (searchQuery.trim()) {
      setFilteredNotes(
        notes.filter((note) =>
          note?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredNotes([]);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        event.target instanceof Node &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    folders,
    selectedFolder,
    location.pathname,
    setSelectedFolder,
    searchQuery,
    notes,
    navigate,
  ]);

  return (
    <div className="w-80 h-screen py-5 flex flex-col">
      <div className="flex justify-between">
        <img src={logoIcon} alt="Logo" className="px-6" />
        <img
          src={searchIcon}
          alt="Search Icon"
          className="px-6 cursor-pointer"
          onClick={() => setIsSearching((prev) => !prev)}
        />
      </div>

      <div className="relative p-6" ref={searchRef}>
        {isSearching ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary text-white py-2 px-4 rounded"
              autoFocus
            />
            {filteredNotes.length > 0 && (
              <div className="absolute left-0 w-full mt-1 bg-primary z-10 border border-gray-600 rounded max-h-48 overflow-y-auto scrollbar-hide">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(note.title!);
                      setIsSearching(false);
                      navigate(`/folder/${note.folderId}/note/${note.id}`);
                    }}
                  >
                    {note.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleNewNote}
            className="w-full bg-blackLight hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            + New Note
          </button>
        )}
      </div>

      <div className="flex flex-col overflow-hidden">
        <div className="mt-2">
          <div>
            <p className="font-semibold text-sm text-gray-300 px-6 py-2">
              Recents
            </p>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="flex flex-col items-start">
              {recents.map((note) => (
                <div
                  key={note.id}
                  className={`flex items-center w-full px-6 py-1.5 cursor-pointer hover:bg-blackLight
                ${
                  selectedNote?.id === note.id
                    ? "bg-tertiary hover:bg-tertiary"
                    : ""
                }`}
                  onClick={() => handleNoteClick(note)}
                >
                  <img src={docIcon} className="w-4 h-4 opacity-70" />
                  <span className="text-base font-semibold text-gray-300 truncate px-2">
                    {note.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex-grow overflow-y-auto scrollbar-hide">
          <div className="sticky top-0 bg-primary py-2 z-10">
            <div className="flex justify-between">
              <p className="font-semibold text-sm text-gray-300 px-6">
                Folders
              </p>
              <img
                src={folderAddIcon}
                alt=""
                className="px-6 cursor-pointer"
                onClick={() => setIsAddingFolder(true)}
              />
            </div>
          </div>

          {isAddingFolder && (
            <div className="px-6 py-2">
              <input
                type="text"
                className="w-full px-2 py-1 text-white bg-gray-900 rounded"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddFolder()}
                autoFocus
              />
            </div>
          )}

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="flex flex-col items-start overflow-y-auto scrollbar-hide">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`flex items-center w-full px-6 py-1.5 cursor-pointer hover:bg-blackLight ${
                    selectedFolder === folder.id
                      ? "bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]"
                      : ""
                  }`}
                  onDoubleClick={() =>
                    handleFolderDoubleClick(folder.id, folder.name)
                  }
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    navigate(`/folder/${folder.id}`);
                  }}
                >
                  <img
                    src={
                      selectedFolder === folder.id ? openFolderIcon : fileIcon
                    }
                    className="w-4 h-4 opacity-70"
                  />
                  {editingFolderId === folder.id ? (
                    <input
                      type="text"
                      value={folderName}
                      onChange={handleFolderNameChange}
                      onBlur={handleFolderRename}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="bg-transparent text-white border border-gray-500 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="flex justify-between items-center gap-20 w-full">
                      <span className="text-base font-semibold text-gray-300 truncate px-2">
                        {folder.name}
                      </span>
                      <img
                        src={deleteIcon}
                        alt=""
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => removeFolder(selectedFolder!)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div>
            <p className="font-semibold text-sm text-gray-300 px-6 py-2">
              More
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div
              className={`flex items-center w-full px-6 py-1.5 cursor-pointer hover:bg-blackLight
                    ${
                      location.pathname.includes("/favorites")
                        ? "bg-blackLight hover:bg-blackLight"
                        : ""
                    }`}
              onClick={() => {
                navigate("/favorites");
                refetchData();
              }}
            >
              <img src={favorite} className="w-5 h-5 opacity-70" />
              <span className="text-base font-semibold text-gray-300 truncate px-2">
                Favorites
              </span>
            </div>

            <div
              className={`flex items-center w-full px-6 py-1.5 cursor-pointer hover:bg-blackLight
                    ${
                      location.pathname.includes("/trash")
                        ? "bg-blackLight hover:bg-blackLight"
                        : ""
                    }`}
              onClick={() => navigate("/trash")}
            >
              <img src={trash} className="w-5 h-5 opacity-70" />
              <span className="text-base font-semibold text-gray-300 truncate px-2">
                Trash
              </span>
            </div>

            <div
              className={`flex items-center w-full px-6 py-1.5 cursor-pointer hover:bg-blackLight
                    ${
                      location.pathname.includes("/archived")
                        ? "bg-blackLight hover:bg-blackLight"
                        : ""
                    }`}
              onClick={() => {
                navigate("/archived");
              }}
            >
              <img src={archived} className="w-5 h-5 opacity-70" />
              <span className="text-base font-semibold text-gray-300 truncate px-2">
                Archived Notes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
