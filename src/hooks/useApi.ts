import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Note, Folder } from "../types";

interface useApiState {
  data: Note[] | Folder[] | null;
  loading: boolean;
  error: string | null;
}

export function useApi(apiFunction: () => Promise<Note[] | Folder[]>) {
  const [state, setState] = useState<useApiState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await apiFunction();
      setState({
        data: response,
        loading: false,
        error: null,
      });
    } catch (error) {
      const fetchError = error as AxiosError;
      setState({
        data: null,
        loading: false,
        error: fetchError.message,
      });
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}
