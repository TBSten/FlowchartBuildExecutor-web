import { FC } from "react";
import { Item, ItemId } from "src/redux/items/types";

export type RuntimeTab = {
    label: string;
    component: FC<{}>;
};

export type Mode = "edit" | "execute" | "export";

