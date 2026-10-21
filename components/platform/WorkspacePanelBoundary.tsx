"use client";
import {Component,type ReactNode} from "react";

/** Isolate a failed lazy panel from the signed-in workspace shell. */
export default class WorkspacePanelBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){
    if(this.state.failed)return <section className="platform-card platform-form" role="alert">
      <h2>This workspace panel could not load.</h2>
      <p>Your saved settings are unchanged. Reload the page to try again; any unsaved edits on this page will be cleared.</p>
      <button className="platform-primary" onClick={()=>window.location.reload()}>Reload workspace</button>
    </section>;
    return this.props.children;
  }
}
