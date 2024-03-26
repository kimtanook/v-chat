import {isModalState} from "@/utils/atom";
import {useRecoilValue} from "recoil";
import styled from "styled-components";
import ModalPortal from "../_portal/ModalPortal";

function ModalContainer() {
  const isModal = useRecoilValue(isModalState);
  return (
    <ModalPortal>
      {/* {!isModal.LoginModal && <Wrap>LoginModal</Wrap>} */}
      {/* {!isModal.LoginModal && <Wrap>LoginModal</Wrap>} */}
      {/* {!isModal.LoginModal && <Wrap>LoginModal</Wrap>} */}
    </ModalPortal>
  );
}

export default ModalContainer;

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
