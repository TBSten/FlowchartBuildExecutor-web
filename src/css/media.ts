
import {
    css,
    CSSObject,
    FlattenSimpleInterpolation,
    SimpleInterpolation,
} from 'styled-components';

export let breakpointByNumber = 560 ;
export let breakpoint = breakpointByNumber+"px" ;

export const sp = (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
): FlattenSimpleInterpolation => css`
    @media (max-width: ${breakpoint}) {
        ${css(first, ...interpolations)}
    }
`;

// export const tab = (
//     first: CSSObject | TemplateStringsArray,
//     ...interpolations: SimpleInterpolation[]
// ): FlattenSimpleInterpolation => css`
//     @media (min-width: 561px) and (max-width: 1024px) {
//         ${css(first, ...interpolations)}
//     }
// `;
export const pc = (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
): FlattenSimpleInterpolation => css`
    @media (min-width: ${breakpoint}) {
        ${css(first, ...interpolations)}
    }
`;



/*
usage

import {sp,pc} from ".../media" ;

const Box = styled.div`
    background-color: red;
    ${sp`
        width: 20px;
        height: 20px;
    `}
    ${pc`
        width: 100px;
        height: 100px;
    `}
`;

*/

