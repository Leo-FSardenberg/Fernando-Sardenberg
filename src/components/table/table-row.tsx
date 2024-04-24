import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface TableRowProps extends ComponentProps<'tr'>{}

export function TableRow(props: TableRowProps){
    return(
        <tr {...props} 
        className={twMerge("border-b emerald-500/30 hover:bg-white/20", props.className) }/>
    )
}