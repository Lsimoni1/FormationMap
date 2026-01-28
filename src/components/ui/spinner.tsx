import { cn } from "@/lib/utils";

interface SpinnerProps {                                                                                                                                                                                  
    className?: string;                                                                                                                                                                                     
  }                                                                                                                                                                                                         
                                                                                                                                                                                                            
export const Spinner = ({ className }: SpinnerProps) => (                                                                                                                                                 
    <div className={cn("h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent", className)} />                                                                                             
);     