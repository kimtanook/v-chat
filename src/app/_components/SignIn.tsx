"use client";

import logo from "@/app/logo.svg";
import {userInfoState} from "@/utils/atom";
import {authService} from "@/utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Image from "next/image";
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
      return;
    }
  };

  return (
    <Wrap>
      <ImageBox>
        <Image fill src={logo} alt="logo" />
      </ImageBox>
      <Box>
        <Form onSubmit={onSubmitAuth}>
          <InputBox>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required
            />
            {!isLogin && (
              <input
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
                required
              />
            )}
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              required
            />
            {!isLogin && (
              <input
                onChange={(e) => setPasswordCheck(e.target.value)}
                type="password"
                placeholder="password confirm"
                required
              />
            )}
          </InputBox>
          <ButtonBox>
            <button type="submit">{isLogin ? "SIGN IN" : "SIGN UP"}</button>
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "GO TO SIGN UP" : "GO TO SIGN IN"}
            </button>
          </ButtonBox>
        </Form>
      </Box>
    </Wrap>
  );
}

export default SignIn;

const Wrap = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImageBox = styled.div`
  position: relative;
  height: 10rem;
  width: 10rem;
  margin-bottom: 2rem;
`;

const Box = styled.div`
  width: 100%;
  max-width: 20rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  background-color: #f7f7f7;
  box-shadow: 0px 1px 3px #a8a8a8;
  border-radius: 1rem;
  margin: auto;
  /* border: 1px solid red; */
`;

const Form = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 1rem;
  gap: 2rem;
  /* border: 1px solid blue; */
`;
const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* border: 1px solid red; */
  & input {
    padding-left: 1rem;
    height: 2rem;
    border: 1px solid #e2e2e2;
    border-radius: 0.5rem;
  }
  ::placeholder {
    color: #c1c1c1;
  }
`;
const ButtonBox = styled.div`
  display: flex;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid green; */
  & button {
    width: 100%;
    height: 2rem;
    background-color: #a598ff;
    border: 1px solid #ffffff;
    border-radius: 0.5rem;
    color: white;
  }
  & button[type="button"] {
    background-color: #302671;
  }
`;
