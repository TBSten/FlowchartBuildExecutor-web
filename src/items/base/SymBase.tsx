import React, { useRef, useEffect } from "react";
import { FC } from "react";
import { ItemId, Sym } from "src/redux/items/types";

import Box from "@mui/material/Box";
import { useSym } from "src/redux/items/operations";
import { useMode } from "src/redux/app/operations";
import { Mode } from "src/redux/app/types";
import { useSelector, useDispatch } from "react-redux";
import { StoreState } from "src/redux/store";
import { selectItemOne } from "src/redux/app/actions";

export const config = {
    size: {
        width: 180,
        height: 40,
        lineWidth: 2,
    },
    color: {
        fore: "black",
        back: "white",
    },
};

export type SymChild = FC<{
    sym: Sym;
}>;
export type SymRender = (
    ctx: CanvasRenderingContext2D,
    size: {
        width: number;
        height: number;
        lineWidth: number;
    },
    color: {
        fore: string;
        back: string;
    },
    mode: Mode,
    isSelect: boolean
) => void;
export type SymComponent = FC<{ itemId: ItemId }>;
export type SymSettings = {
    autoSize?: boolean;
};
function defaultSettings() {
    return {
        autoSize: true,
    };
}
const SymBase = (
    Child: SymChild,
    render: SymRender,
    _settings: SymSettings = {}
): SymComponent => {
    const settings: SymSettings = {
        ...defaultSettings(),
        ..._settings,
    };
    const CanvasCon: FC<{}> = ({ children }) => (
        <Box
            sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
            }}
        >
            {children}
        </Box>
    );
    const ChildCon: FC<{}> = ({ children }) => (
        <Box
            sx={{
                position: "absolute",
                left: 0,
                top: 0,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                fontSize: "14px",
                p: 1,
            }}
        >
            {children}
        </Box>
    );
    const Sym: SymComponent = ({ itemId }) => {
        const { handleSelect, canvasRef, sym } = useSymBase({ itemId, render });
        return (
            <Box
                sx={{
                    ...(settings.autoSize
                        ? {
                            minWidth: config.size.width,
                            minHeight: config.size.height,
                        }
                        : {}),
                    maxWidth: "fit-content",
                    maxHeight: "fit-content",
                    position: "relative",
                }}
                onClick={handleSelect}
            >
                <CanvasCon>
                    <canvas
                        width={config.size.width}
                        height={config.size.height}
                        ref={canvasRef}
                    />
                </CanvasCon>
                <ChildCon>
                    <Child sym={sym} />
                </ChildCon>
            </Box>
        );
    };
    return React.memo(Sym);
};

export default SymBase;

export interface UseSymBaseArg {
    itemId: ItemId;
    render: SymRender;
}
export function useSymBase({ itemId, render }: UseSymBaseArg) {
    const [sym] = useSym(itemId);
    const canvasRef = useSymRender({ itemId, render });
    const handleSelect = useSymSelect({ itemId });
    return {
        handleSelect,
        canvasRef,
        sym,
    };
}

export interface UseSymRenderArg {
    render: SymRender;
    itemId: ItemId;
}

export function useSymRender({
    render,
    itemId,
}: UseSymRenderArg) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isSelect = useSelector((state: StoreState) =>
        state.app.selectItemIds.includes(itemId)
    );
    const [mode] = useMode();
    const isExecuting = useSelector((state: StoreState) => {
        return state.app.runtime?.executingItemId === itemId;
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            const size = {
                width: canvas.width,
                height: canvas.height,
                lineWidth: config.size.lineWidth,
            };
            const color = {
                ...config.color,
            };
            if (isSelect) {
                color.fore = "#0808b1";
            }
            if (isExecuting) {
                color.fore = "#70b108";
            }

            ctx.clearRect(0, 0, size.width, size.height);
            ctx.fillStyle = color.back;
            ctx.strokeStyle = color.fore;
            ctx.lineWidth = size.lineWidth;

            render(ctx, size, color, mode, isSelect);
        }
    }, [mode, itemId, isSelect, isExecuting, render]);
    return canvasRef;
}

export interface UseSymSelectArg {
    itemId: ItemId;
}
export function useSymSelect({ itemId }: UseSymSelectArg) {
    const dispatch = useDispatch();
    const selectOne = (itemId: ItemId) => {
        dispatch(selectItemOne({ itemId }));
    };
    const handleSelect = () => {
        selectOne(itemId);
    };
    return handleSelect;
}
