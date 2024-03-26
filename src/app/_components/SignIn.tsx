"use client";

import {userInfoState} from "@/utils/atom";
import {authService} from "@/utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {useRecoilValue} from "recoil";
import styled from "styled-components";

function SignIn() {
  const router = useRouter();

  const userInfo = useRecoilValue(userInfoState);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const onSubmitAuth = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLogin) {
      if (!email || !password) {
        alert("정보를 모두 입력해주세요.");
        return;
      }
      if (password !== passwordCheck) {
        alert("비밀번호를 확인해주세요.");
        return;
      }
      await createUserWithEmailAndPassword(authService, email, password);
      updateProfile(authService.currentUser!, {
        displayName: name,
      });
      return alert("회원가입 완료");
    } else {
      if (!email || !password) {
        alert("정보를 모두 입력해주세요.");
        return;
      }
      await signInWithEmailAndPassword(authService, email, password);

      alert("로그인 완료");
      router.push("/main");
      return;
    }
  };

  return (
    <Wrap>
      <Form onSubmit={onSubmitAuth}>
        <InputBox>
          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isLogin && (
            <input
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
            />
          )}
          <input
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              onChange={(e) => setPasswordCheck(e.target.value)}
              placeholder="password confirm"
            />
          )}
        </InputBox>
        <ButtonBox>
          <button type="submit">{isLogin ? "로그인" : "회원가입"}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "회원가입하러가기" : "로그인하러가기"}
          </button>
        </ButtonBox>
      </Form>
    </Wrap>
  );
}

export default SignIn;

const Wrap = styled.div`
  z-index: 1000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20rem;
  height: 20rem;
  border: 1px solid red;
`;

const Form = styled.form`
  margin: auto;
  border: 1px solid blue;
  padding: 1rem;
`;
const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid green;
  gap: 1rem;
  padding: 1rem;
`;
const ButtonBox = styled.div`
  display: flex;
  gap: 1rem;
  border: 1px solid aqua;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  & button {
    width: 12rem;
    border: 1px solid pink;
  }
`;
