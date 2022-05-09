import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";
import { Box } from "@mui/material";
import { FC, useEffect } from "react";

const FBE_LANGUAGE = "fbeFormula"
const FBE_THEME = "fbeTheme"

type CodeEditorProps = EditorProps & {}
const CodeEditor: FC<CodeEditorProps> = ({ ...other }) => {
    const monaco = useMonaco();
    useEffect(() => {
        if (!monaco) return
        monaco.languages.register({
            id: FBE_LANGUAGE
        })
        monaco.languages.setMonarchTokensProvider(FBE_LANGUAGE, {
            tokenizer: {
                root: [
                    [/\s+/, "custom-ws"],
                    [/[0-9]+(\.(0-9)+)?/, "custom-number"],
                    [/(true)|(false)/, "custom-bool"],
                    [/".*"/, "custom-str"]
                ]
            }
        })
        monaco.editor.defineTheme(FBE_THEME, {
            base: "vs",
            inherit: false,
            rules: [
                { token: 'custom-number', foreground: 'FFA500' },
                { token: 'custom-var', foreground: '0000FF' },
                { token: 'custom-bool', foreground: '00FF00' },
                { token: 'custom-str', foreground: '00AAEE' },
            ],
            colors: {
                "editor.foreground": "#000000"
            }
        })
        monaco.languages.registerCompletionItemProvider(FBE_LANGUAGE, {
            provideCompletionItems: () => {
                return {
                    //補完
                    suggestions: [
                        // {
                        //     label: "fc",
                        //     kind: monaco.languages.CompletionItemKind.Text,
                        //     insertText: "simpleText"
                        // }
                    ],
                }
            }
        })
    }, [monaco])
    return (
        <Box sx={{
            px: "3px",
            py: "6px",
            border: "solid 1px #eeeeee"
        }}>
            <Editor
                width="50vw"
                height="2.5em"
                language={FBE_LANGUAGE}
                theme={FBE_THEME}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    lineNumbers: "off",
                }}
                {...other}
            />
        </Box>
    );
}

export default CodeEditor;