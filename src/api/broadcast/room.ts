import {dbService} from "@/utils/firebase";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const useGetRooms = () => {
  return useQuery<any>({
    queryKey: ["getRooms"],
    queryFn: async () => {
      const response: any = [];
      const querySnapshot = await getDocs(collection(dbService, "rooms"));
      querySnapshot.forEach((doc) => {
        response.push({id: doc.id, ...doc.data()});
      });
      return response;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};

export const useAddRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {[key: string]: string}) => {
      await setDoc(doc(dbService, "rooms", data.roomId), data, {merge: true});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getRooms"],
      });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation<any>({
    mutationFn: async (docId: any) => {
      await deleteDoc(doc(dbService, "rooms", docId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getRooms"],
      });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation<any>({
    mutationFn: async (data: any) => {
      await updateDoc(doc(dbService, "rooms", data.id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getRooms"],
      });
    },
  });
};
