
export default function corners(w :number,h :number,lw :number) {
    return {
        "leftTop":[lw/2,lw/2],
        "leftCenter":[lw/2,h/2],
        "leftBottom":[lw/2,h-lw/2],
        "centerTop":[w/2,lw/2],
        "centerBottom":[w/2,h-lw/2],
        "rightTop":[w-lw/2,lw/2],
        "rightCenter":[w-lw/2,h/2],
        "rightBottom":[w-lw/2,h-lw/2],
    } as const;
}
