import {atom} from "recoil";
import {v4 as uuidv4} from "uuid";

interface UserInfoType {
  userId: string;
  userName: string;
  userEmail: string;
  userPhotoUrl: string;
  userCreateTime: string;
  userSignInTime: string;
}
interface ModalType {
  LoadingModal: boolean;
}
export const userInfoState = atom<UserInfoType | null>({
  key: `userInfo${uuidv4()}`,
  default: {
    userId: "",
    userName: "",
    userEmail: "",
    userPhotoUrl: "",
    userCreateTime: "",
    userSignInTime: "",
  },
});

export const isModalState = atom<ModalType>({
  key: `isModal${uuidv4()}`,
  default: {
    LoadingModal: false,
  },
});

export const roomsState = atom<string[]>({
  key: `roomsState${uuidv4()}`,
  default: [],
});
