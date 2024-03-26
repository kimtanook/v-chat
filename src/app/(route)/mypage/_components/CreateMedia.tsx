"use client";

import {useAddRoom} from "@/api/broadcast/room";
import {roomsState, userInfoState} from "@/utils/atom";
import {useRouter} from "next/navigation";
import {MouseEvent} from "react";
import {useRecoilState, useRecoilValue} from "recoil";

function CreateMedia() {
  const router = useRouter();
  const [rooms, setRooms] = useRecoilState(roomsState);
  const userInfo = useRecoilValue(userInfoState);

  const {mutateAsync: addRoom} = useAddRoom();

  const onCreateMedia = (event: MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    if (confirm("방을 만드시겠습니까?")) {
      addRoom({roomName: value, roomId: userInfo?.userId!});
      router.push(`/media/${value}`);
    }
  };

  setTimeout(() => {
    console.log("rooms : ", rooms);
  }, 300);

  return (
    <div>
      <button value={userInfo?.userName} onClick={onCreateMedia}>
        방 만들기
      </button>
    </div>
  );
}

export default CreateMedia;
