import { AppBar, Box, Button as MuiButton, ButtonProps as MuiButtonProps, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { storeStateToJson } from "src/format/util";
import { downloadTextFile } from "src/lib/file";
import { logger } from "src/lib/logger";
import { useTitle } from "src/redux/meta/hooks";


type ButtonProps = MuiButtonProps & {}
const Button: FC<ButtonProps> = ({ children, ...other }) => {
    return (
        <MuiButton
            variant="outlined"
            {...other}
        >
            {children}
        </MuiButton>
    );
}


const ButtonSection: FC<{}> = ({ children, }) => {
    return (
        <Box sx={{
            my: "1.25rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 5,
        }}>
            {children}
        </Box>
    );
}



const Fallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    logger.error(error);
    const [title] = useTitle();
    const handleDownload = () => {
        const saveFormat = storeStateToJson();
        downloadTextFile(saveFormat, title + ".fbe");
    }
    return (
        <Box textAlign="center">
            <AppBar position="static">
                <Toolbar>
                    <Typography>
                        FBE
                    </Typography>
                </Toolbar>
            </AppBar>
            <Typography variant="h2" m="2rem" color="red">
                エラーが発生しました
            </Typography>

            <ButtonSection>
                <Button onClick={handleDownload}>
                    セーブデータのダウンロード
                </Button>
                セーブデータをダウンロードします。
                これを行わないでリロードしたり、別のページへジャンプすると、
                保存内容が失われる可能性があります。
            </ButtonSection>
            <ButtonSection>
                <Button onClick={() => window.location.reload()}>
                    リロード
                </Button>
                ページを再読み込みします。データを維持して復旧できる可能性があります。
            </ButtonSection>
            <ButtonSection>
                <Button href="/reset">
                    復旧する(データが全て削除されます)
                </Button>
                ブラウザ内のデータを全て削除して、復旧を試みます。
            </ButtonSection>

        </Box>
    );
}

interface ErrorProps {
}
const Error: FC<ErrorProps> = ({ children }) => {
    return (
        <ErrorBoundary FallbackComponent={Fallback}>
            {children}
        </ErrorBoundary>
    );
}

export default Error;


