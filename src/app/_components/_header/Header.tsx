"use client";

import {userInfoState} from "@/utils/atom";
import {authService} from "@/utils/firebase";
import {signOut} from "firebase/auth";
import {useRouter} from "next/navigation";
import {useRecoilValue} from "recoil";
import styled from "styled-components";

function Header() {
  const router = useRouter();
  const userInfo = useRecoilValue(userInfoState);

  const onClickSignOut = async () => {
    await signOut(authService);
    router.push("/");
    alert("로그아웃 되었습니다.");
  };

  return (
    <Wrap>
      <LogoBox>
        <div onClick={() => router.push("/")}>로고</div>
      </LogoBox>
      <AuthBox>
        <div>
          <div onClick={() => router.push(`/mypage/${userInfo?.userName}`)}>
            {userInfo?.userName}
          </div>
          <button onClick={onClickSignOut}>로그아웃</button>
        </div>
      </AuthBox>
    </Wrap>
  );
}

export default Header;

const Wrap = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid red;
  height: var(--header-height);
`;

const LogoBox = styled.div``;
const AuthBox = styled.div`
  display: flex;
  gap: 0.51rem;
  height: 50%;
  & input {
    width: 6rem;
  }
`;
