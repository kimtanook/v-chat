import {useEffect, useState} from "react";
import ReactDom from "react-dom";

function ModalPortal({children}: any) {
  const [isCSR, setIsCSR] = useState<boolean>(false); // 두번째 이슈해결

  useEffect(() => {
    // 두번째 이슈해결
    setIsCSR(true);
  }, []);

  if (typeof window === "undefined") return <></>; // 첫번째 이슈해결
  if (!isCSR) return <></>; // 두번째 이슈해결

  const el = document.getElementById("modal") as HTMLDivElement;

  return ReactDom.createPortal(<div>{children}</div>, el);
}

export default ModalPortal;
