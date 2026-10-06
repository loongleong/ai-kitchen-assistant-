import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

export function useNativeModal() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const element=ref.current;
    const returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    element?.showModal();
    return ()=>{
      if(element?.open)element.close();
      if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    };
  },[]);
  return ref;
}

export function DesignHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <div className="section-heading"><span className="eyebrow"><Sparkles size={13} aria-hidden="true" />{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}
export function DesignAction({children,onClick,disabled=false}:{children:ReactNode;onClick:()=>void;disabled?:boolean}) {
  return <button type="button" className="action" disabled={disabled} onClick={onClick}>{children}<ArrowRight size={17} aria-hidden="true" /></button>;
}

/** Native modal supplies focus containment, Escape, and return focus without new dependencies. */
export function DesignSheet({open,title,onClose,children}:{open:boolean;title:string;onClose:()=>void;children:ReactNode}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current?.close();
  },[open]);
  return <dialog ref={dialog} className="design-sheet savor-design" aria-label={title} onCancel={onClose} onClose={onClose}>
    <div className="sheet-top"><div><span className="eyebrow">A LITTLE MORE YOU</span><h2>{title}</h2></div><button type="button" className="icon-button" aria-label="Close" onClick={onClose}><X size={20} /></button></div>{children}
  </dialog>;
}
