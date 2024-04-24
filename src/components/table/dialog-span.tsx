import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";


interface DialogSpanProps extends ComponentProps<'span'>{

}

export function DialogSpan(props: DialogSpanProps){
    return(
               <span {...props} 
               className={twMerge("p-4 mt-2 text-emerald-500 ring-1 ring-emerald-500 text-sm rounded-md", props.className) }>

               </span>
    )
} 