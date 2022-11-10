import React from "react";
import Menu from "../../components/Menu/Menu";

const LayoutGeneral = (props) => {
  const  {children } = props;

  return (
      <>
        <Menu />
        <section style={{marginTop: "75px"}}>
          <div>{ children}</div>
        </section>{" "}
      </>
  );
};

export default LayoutGeneral;
