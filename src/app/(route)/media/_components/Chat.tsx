import {userInfoState} from "@/utils/atom";
import {FormEvent, useState} from "react";
import {useRecoilValue} from "recoil";
import styled from "styled-components";

function Chat({
  myDataChannel,
  chatList,
  setChatList,
  message,
  setMessage,
}: any) {
  const userInfo = useRecoilValue(userInfoState);

  const [image, setImage] = useState();

  // 메세지 보내기
  const onSubmitChat = (e: FormEvent) => {
    e.preventDefault();
    if (myDataChannel.current) {
      setChatList((prev: any) => [
        ...prev,
        `${userInfo?.userName} : ${message}`,
      ]);
      myDataChannel.current?.send(`${userInfo?.userName} : ${message}`);
      setMessage("");
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // 이미지 보내기
  const sendImageOnExistingChannel = () => {
    if (!myDataChannel || !image) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result;
      myDataChannel.current?.send(dataURL);
      setChatList((prev: any) => [...prev, `${dataURL}`]);
    };
    reader.readAsDataURL(image);
  };

  const dataUrlRegex = /^data:image\/\w+;base64,/;

  return (
    <ChatWrap>
      <ChatList>
        {chatList.map((item: string, index: number) => (
          <div key={index}>
            {dataUrlRegex.test(item) ? (
              <Img src={item} alt="channel-image" />
            ) : (
              <div key={index}>{item}</div>
            )}
          </div>
        ))}
      </ChatList>
      <form onSubmit={onSubmitChat}>
        <ChatInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
      <input type="file" onChange={handleImageChange} />
      <button onClick={sendImageOnExistingChannel}>사진 보내기</button>
    </ChatWrap>
  );
}

export default Chat;

const ChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid green;
  padding: 1rem;
`;

const ChatList = styled.div`
  border: 1px solid red;
  flex: 1;
  max-width: 10rem;
`;
const ChatInput = styled.input`
  border: 1px solid blue;
  flex: 1;
`;

const Img = styled.img`
  width: 10rem;
`;
