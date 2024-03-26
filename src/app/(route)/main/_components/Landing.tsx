"use client";

import {useGetRooms} from "@/api/broadcast/room";
import {useRouter} from "next/navigation";
import {MouseEvent, useEffect} from "react";
import {v4 as uuidv4} from "uuid";

function Landing() {
  const router = useRouter();

  const {data: rooms} = useGetRooms();

  const onRouter = (event: MouseEvent<HTMLButtonElement>) => {
    router.push(`/media/${event.currentTarget.value}`);
  };

  useEffect(() => {
    console.log("rooms : ", rooms);
  }, []);

  return (
    <div>
      {rooms?.map((item: any) => (
        <div key={uuidv4()}>
          <button value={item.roomName} onClick={onRouter}>
            {item.roomName}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Landing;
