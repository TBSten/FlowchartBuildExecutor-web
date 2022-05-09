import Box from "@mui/material/Box";
import React, { FC } from "react";
import { useMode } from "src/redux/app/hooks";
import EditSidebar from "./EditSidebar";
import ExecuteSidebar from "./ExecuteSidebar";
import ExportSideBar from "./ExportSideBar";


export interface SidebarProps { }

const Sidebar: FC<SidebarProps> = () => {
  const [mode,] = useMode();
  return (
    <Box>
      {mode === "edit" &&
        <EditSidebar />
      }

      {mode === "execute" &&
        <ExecuteSidebar />
      }

      {mode === "export" &&
        <ExportSideBar />
      }

    </Box>
  );
};
export default React.memo(Sidebar);
