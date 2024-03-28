"use client";

import {useEffect, useRef, useState} from "react";
import {connect} from "socket.io-client";
import styled from "styled-components";
import Chat from "./Chat";
import Video from "./Video";
import VideoDownload from "./VideoDownload";

function MediaWrap({props}: any) {
  const socket = connect("localhost:4000");

  const roomName = props.params.id;

  const myPeerConnection = useRef<RTCPeerConnection | null>(null);
  const myDataChannel = useRef<RTCDataChannel | null>(null);

  const myMediaRef = useRef<HTMLVideoElement>(null);
  const otherMediaRef = useRef<HTMLVideoElement>(null);

  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<string[]>([]);

  // socket 코드 START
  useEffect(() => {
    // peer A
    socket.on("welcome", async () => {
      // data channel code: data channel을 생성
      myDataChannel.current =
        myPeerConnection.current?.createDataChannel("chat")!;
      myDataChannel.current?.addEventListener("message", (event: any) => {
        setChatList((prev) => [...prev, event.data]);
      });
      console.log("made data channel");

      // webRTC: create offer code
      const offer = await myPeerConnection.current?.createOffer();
      myPeerConnection.current?.setLocalDescription(offer);
      console.log("sent the offer");
      socket.emit("offer", offer, roomName);
    });

    // pear B
    socket.on("offer", async (offer) => {
      // data channel code
      myPeerConnection.current?.addEventListener("datachannel", (event) => {
        myDataChannel.current = event.channel;
        myDataChannel.current?.addEventListener("message", (event: any) => {
          setChatList((prev) => [...prev, event.data]);
        });
        myDataChannel.current?.send("알림 : 상대방이 입장하셨습니다.");
      });

      // webRTC: receive offer code
      myPeerConnection.current?.setRemoteDescription(offer);
      const answer = await myPeerConnection.current?.createAnswer();
      myPeerConnection.current?.setLocalDescription(answer);
      socket.emit("answer", answer, roomName);
    });

    socket.on("answer", (answer) => {
      console.log("received the answer");
      myPeerConnection.current?.setRemoteDescription(answer);
    });

    socket.on("ice", (ice) => {
      try {
        console.log("receive the ice");
        myPeerConnection.current?.addIceCandidate(ice);
      } catch (error) {
        console.log("error : ", error);
        myPeerConnection.current?.restartIce();
      }
    });

    return () => {
      socket.off("welcome");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice");
    };
  }, []);
  // socket 코드 END

  const peerConnection = () => {
    if (
      myPeerConnection.current?.iceConnectionState === "disconnected" ||
      myPeerConnection.current?.iceConnectionState === "failed" ||
      myPeerConnection.current?.iceConnectionState === "closed"
    ) {
      // 연결이 끊겼을 때 수행할 작업 추가
      console.log("연결이 끊겼습니다.");
    }
    if (myPeerConnection.current?.iceConnectionState === "connected") {
      console.log("연결중입니다.");
    }
  };

  return (
    <Wrap>
      <div>{roomName}</div>
      <button onClick={peerConnection}>확인</button>
      <MediaBox>
        <Video
          socket={socket}
          myPeerConnection={myPeerConnection}
          myMediaRef={myMediaRef}
          otherMediaRef={otherMediaRef}
        />
        <Chat
          myDataChannel={myDataChannel}
          chatList={chatList}
          setChatList={setChatList}
          message={message}
          setMessage={setMessage}
        />
      </MediaBox>
      <VideoDownload myMediaRef={myMediaRef} />
    </Wrap>
  );
}

export default MediaWrap;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid aqua;
`;

const MediaBox = styled.div`
  display: flex;
  flex-direction: row;
`;
