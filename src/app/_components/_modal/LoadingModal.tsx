import {isModalState} from "@/utils/atom";
import {useRecoilState} from "recoil";
import styled from "styled-components";

function LoadingModal() {
  const [_, setModal] = useRecoilState(isModalState);
  return (
    <Wrap>
      <button>x</button>
      <div>LoadingModal</div>
    </Wrap>
  );
}

export default LoadingModal;

const Wrap = styled.div`
  z-index: 1000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rem;
  height: 20rem;
  background-color: aqua;
`;
