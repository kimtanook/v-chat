import {userInfoState} from "@/utils/atom";
import {useParams} from "next/navigation";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import {v4 as uuidv4} from "uuid";

function Video({socket, myPeerConnection, myMediaRef, otherMediaRef}: any) {
  const params = useParams();

  const userInfo = useRecoilValue(userInfoState);

  const myStream = useRef<MediaStream | null>(null);

  const [videoInput, setVideoInput] = useState<MediaDeviceInfo[]>([]);
  const [onMute, setOnMute] = useState(false);
  const [onVideo, setOnVideo] = useState(false);

  // 미디어 가져오기
  const getMedia = async (deviceId: string | undefined) => {
    const initialConstrains = {
      audio: true,
      video: {facingMode: "user"},
    };
    const cameraConstraints = {
      audio: true,
      video: {deviceId: {exact: deviceId}},
    };

    try {
      myStream.current = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstraints : initialConstrains
      );

      if (myMediaRef?.current) {
        myMediaRef.current.srcObject = myStream.current;
      }
      if (!deviceId) {
        await getCamera();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 카메가 정보 가져오기
  const getCamera = async () => {
    try {
      const myCameras = await navigator.mediaDevices.enumerateDevices();
      const videoInputData = myCameras.filter(
        (item) => item.kind === "videoinput"
      );
      const currentCamera = myStream.current?.getVideoTracks()[0];
      setVideoInput(videoInputData);
    } catch (e) {
      console.log("e : ", e);
    }
  };

  // 카메라 변경
  const changeCamera = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    getMedia(value);
  };

  // 비디오 재생 및 중지
  const playVideo = () => {
    if (myMediaRef.current) {
      const videoTracks = myMediaRef.current.srcObject as MediaStream;
      videoTracks.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !track.enabled;
      });
      setOnVideo(!onVideo);
    }
  };

  // 오디오 재생 및 중지
  const muteAudio = () => {
    if (myMediaRef.current) {
      const audioTracks = myMediaRef.current.srcObject as MediaStream;
      audioTracks.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !track.enabled;
      });
      setOnMute(!onMute);
    }
  };

  // RTC 코드 START
  const makeConnection = async () => {
    myPeerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
    });
    myPeerConnection.current?.addEventListener("icecandidate", handleIce);
    myPeerConnection.current?.addEventListener("addstream", handleAddStream);

    myStream.current?.getTracks()?.forEach((track) => {
      if (myPeerConnection) {
        myPeerConnection.current?.addTrack(track, myStream.current!);
      }
    });
  };

  const handleIce = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit("ice", event.candidate, params.id);
    }
  };

  const handleAddStream = (event: any) => {
    if (otherMediaRef?.current) {
      otherMediaRef.current.srcObject = event.stream;
    }
  };
  // RTC 코드 END

  // 방 입장
  const enterRoom = async (data: any) => {
    await getMedia("");
    makeConnection();
    socket?.emit("join_room", data);
  };

  // 미디어 중지
  const stopRecording = () => {
    // 미디어 스트림 트랙 가져오기
    const tracks = myStream.current?.getTracks();
    // 각 트랙에 대해 중지 호출
    tracks?.forEach((track) => {
      track.stop();
    });
  };

  useEffect(() => {
    enterRoom({roomName: params.id, userName: userInfo?.userName});
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <Wrap>
      <VideoWrap>
        <MyVideo ref={myMediaRef} autoPlay playsInline />
        <OtherVideo ref={otherMediaRef} autoPlay playsInline />
      </VideoWrap>
      <div>
        <button onClick={muteAudio}>{onMute ? "Unmute" : "Mute"}</button>
        <button onClick={playVideo}>
          {onVideo ? "Stop Video" : "Start Video"}
        </button>
      </div>
      <select onChange={changeCamera}>
        <option value="">Default Camera</option>
        {videoInput.map((item: any) => (
          <option key={uuidv4()} value={item.deviceId}>
            {item.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export default Video;
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid red;
  flex: 1;
`;
const VideoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const MyVideo = styled.video`
  border: 1px solid red;
  width: 100%;
`;
const OtherVideo = styled.video`
  border: 1px solid blue;
  width: 100%;
`;
