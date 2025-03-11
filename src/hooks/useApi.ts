import { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

interface useApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiFunction: () => Promise<AxiosResponse>,
  // dependencies = []
) {
  const [state, setState] = useState<useApiState<T>>({
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
  }, [fetchData])

  return {...state, refetch}; 
}



export function useChangeApi<T, P>(
    changeApiFunction : (params : P) => Promise<AxiosResponse<T>>    
){
    const [state, setState] = useState<useApiState<T>>({
        data : null,
        loading : false,
        error : null,
    });

    const changeData = async (params : P) => {
        setState(prev => ({...prev, loading : true, error : null}));
        try{
            const response = changeApiFunction(params);
            setState({
                data : response,
                loading : false,
                error : null,
            })
        } catch(error){
            const AxiosError = error as AxiosError;
            setState(prev => ({...prev, loading : false, error : AxiosError.message}))
            throw error;
        }
    }
    return {...state, changeData};
}