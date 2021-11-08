import Button,{ButtonProps} from "@material-ui/core/Button" ;



export default function MyButton(props :ButtonProps) {
    return (
        <Button 
            color="primary"
            variant="outlined" 
            {...props}>
                {props.children}
        </Button>
    ) ;
}


