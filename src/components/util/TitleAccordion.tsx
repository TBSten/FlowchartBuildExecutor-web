import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FC } from "react";

export type TitleAccordionProps = {
    title: string;
} & AccordionProps;

const TitleAccordion: FC<TitleAccordionProps> = ({
    title,
    children,
    ...other
}) => {
    return (
        <Accordion {...other}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                {title}
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
};
export default TitleAccordion;
