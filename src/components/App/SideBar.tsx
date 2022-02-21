import React,{ FC } from "react";

import { useMode } from "src/redux/app/operations";
import EditSidebar from "./EditSidebar";
import ExecuteSidebar from "./ExecuteSidebar";

export interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const [mode,] = useMode() ;
  return (
      <>
          {mode==="edit" && 
          <EditSidebar />
          }
          
          {mode==="execute" && 
          <ExecuteSidebar />
          }

      </>
  );
};
export default React.memo(Sidebar);
