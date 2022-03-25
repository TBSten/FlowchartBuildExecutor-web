import Box from "@mui/material/Box";
import React, { FC, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { selectItemOne } from "src/redux/app/actions";
import { useDragAndDropItem, useMode } from "src/redux/app/hooks";
import { Mode } from "src/redux/app/types";
import { useSym } from "src/redux/items/hooks";
import { ItemId, Sym } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";


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
    const ChildCon: FC<{}> = ({ children, ...other }) => (
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
            {...other}
        >
            {children}
        </Box>
    );
    const Sym: SymComponent = ({ itemId }) => {
        const {
            handleSelect,
            canvasRef,
            sym,
            isDragging,
            props,
        } = useSymBase({ itemId, render });
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
                    userSelect: "none",
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
                <ChildCon
                    {...props}
                >
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
    const [isDragging, dragProps] = useSymDragAndDrop(itemId);
    return {
        handleSelect,
        canvasRef,
        sym,
        isDragging,
        props: {
            ...dragProps,
        }
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
    const isSelect = useAppSelector(state =>
        state.app.selectItemIds.includes(itemId)
    );
    const [mode] = useMode();
    const isExecuting = useAppSelector(state => {
        return state.app.runtime?.executingItemId === itemId;
    });
    const { isDragging } = useDragAndDropItem(itemId);
    useEffect(() => {
        console.log("canvas render", itemId);

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
            if (isSelect || isDragging) {
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
    }, [mode, itemId, isSelect, isDragging, isExecuting, render]);
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

export function useSymDragAndDrop(itemId: ItemId) {
    const { isDragging, ...other } = useDragAndDropItem(itemId);
    return [
        isDragging,
        other,
    ] as const;
}

