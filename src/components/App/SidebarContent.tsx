import ExpandMore from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { FC } from "react";
import { useSp } from "src/style/media";

interface SidebarContentProps {
    title?: string;
    defaultExpanded?: boolean;
}
const SidebarContent: FC<SidebarContentProps> = ({ children, title, defaultExpanded = false }) => {
    const isSp = useSp();
    return (
        <Accordion defaultExpanded={defaultExpanded} sx={{ my: 1 }}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                {title}
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
}

export default SidebarContent;
