import {userInfoState} from "@/utils/atom";
import {FormEvent} from "react";
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

  const onSubmitChat = (e: FormEvent) => {
    e.preventDefault();
    if (myDataChannel.current) {
      setChatList((prev: any) => [
        ...prev,
        {name: userInfo?.userName, message: message},
      ]);
      myDataChannel.current?.send(
        JSON.stringify({name: userInfo?.userName, message: message})
      );
      setMessage("");
    }
  };

  return (
    <ChatWrap>
      <ChatList>
        {chatList.map(
          (item: {[key: string]: string | undefined}, index: number) => (
            <div key={index}>
              {item.name} : {item.message}
            </div>
          )
        )}
      </ChatList>
      <form onSubmit={onSubmitChat}>
        <ChatInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
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
`;
const ChatInput = styled.input`
  border: 1px solid blue;
  flex: 1;
`;
