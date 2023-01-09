"use strict";(self.webpackChunknet6_markdown_web_engine=self.webpackChunknet6_markdown_web_engine||[]).push([[330],{3330:(Y,u,i)=>{i.r(u),i.d(u,{default:()=>L});var l=i(8692),r=i(8023),p=i(3528),h=i(3517),x=i(8924),C=i(382),g=i(2098),t=i(4537);function v(e,o){if(1&e&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&e){const n=t.oxw();t.xp6(1),t.hij("Category: ",null==n.document?null:n.document.category,"")}}function y(e,o){if(1&e&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&e){const n=t.oxw();t.xp6(1),t.hij("Last Update: ",null==n.document?null:n.document.date,"")}}function _(e,o){if(1&e&&(t.TgZ(0,"h1"),t._uU(1),t.qZA()),2&e){const n=t.oxw();t.xp6(1),t.Oqu(null==n.document?null:n.document.title)}}class a{constructor(){this.document=g.$}}a.\u0275fac=function(o){return new(o||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-document-header"]],inputs:{document:"document"},standalone:!0,features:[t.jDz],decls:7,vars:4,consts:[[1,"document-header-container","mat-typography"],[1,"header-grid","mat-caption","hint-text"],[4,"ngIf"],[1,"tag-container"],[3,"tags"]],template:function(o,n){1&o&&(t.TgZ(0,"div",0)(1,"div",1),t.YNc(2,v,2,1,"div",2),t.YNc(3,y,2,1,"div",2),t.qZA(),t.YNc(4,_,2,1,"h1",2),t.TgZ(5,"div",3),t._UZ(6,"app-tag-list",4),t.qZA()()),2&o&&(t.xp6(2),t.Q6J("ngIf",null==n.document?null:n.document.category),t.xp6(1),t.Q6J("ngIf",null==n.document?null:n.document.date),t.xp6(1),t.Q6J("ngIf",null==n.document?null:n.document.title),t.xp6(2),t.Q6J("tags",null==n.document?null:n.document.tag))},dependencies:[l.ez,l.O5,C.J],styles:[".document-header-container[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:32px;font-weight:700;margin:8px 0;line-height:1.1em}.document-header-container[_ngcontent-%COMP%]   .header-grid[_ngcontent-%COMP%]{display:grid;justify-content:space-between;grid-template-columns:auto auto}.document-header-container[_ngcontent-%COMP%]   .tag-container[_ngcontent-%COMP%]{border-bottom:2px ridge whitesmoke;padding:4px 2px;margin-bottom:24px}"],changeDetection:0});var f=i(8941),O=i(5557),M=i(2569);function Z(e,o){if(1&e&&(t.TgZ(0,"li",6,7),t.ALo(2,"async"),t.TgZ(3,"a",8),t._uU(4),t.qZA()()),2&e){const n=t.oxw(),c=n.$implicit,m=n.index,U=t.oxw(2);t.Gre("",c.level," mat-caption"),t.ekj("active",m===t.lcZ(2,9,U.activeItemIndex)),t.s9C("title",c.title),t.xp6(3),t.Q6J("routerLink",c.href)("fragment",c.fragment),t.xp6(1),t.hij(" ",c.title," ")}}function T(e,o){if(1&e&&(t.ynx(0),t.YNc(1,Z,5,11,"li",5),t.BQk()),2&e){const n=o.$implicit;t.xp6(1),t.Q6J("ngIf","h1"!==n.level)}}function D(e,o){if(1&e&&(t.TgZ(0,"ul",3),t.YNc(1,T,2,1,"ng-container",4),t.qZA()),2&e){const n=t.oxw();t.xp6(1),t.Q6J("ngForOf",n.tocList)}}class s{constructor(o){this.tocService=o,this.document=g.$,this.tocList=[],this.activeItemIndex=new O.t(1),this.onDestroy=new r.x}ngOnInit(){this.tocService.tocList.pipe((0,p.R)(this.onDestroy)).subscribe(o=>{this.tocList=o}),this.activeItemIndex=this.tocService.activeItemIndex}ngOnDestroy(){this.onDestroy.next(),this.onDestroy.complete()}}s.\u0275fac=function(o){return new(o||s)(t.Y36(M.I))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-document-toc"]],inputs:{document:"document"},standalone:!0,features:[t.jDz],decls:4,vars:1,consts:[[1,"toc-container","mat-typography"],[1,"toc-title","mat-caption"],["class","toc-list",4,"ngIf"],[1,"toc-list"],[4,"ngFor","ngForOf"],[3,"title","class","active",4,"ngIf"],[3,"title"],["tocItem",""],[1,"internal-anchor",3,"routerLink","fragment"]],template:function(o,n){1&o&&(t.TgZ(0,"div",0)(1,"div",1),t._uU(2,"Table of Content"),t.qZA(),t.YNc(3,D,2,1,"ul",2),t.qZA()),2&o&&(t.xp6(3),t.Q6J("ngIf",n.tocList))},dependencies:[l.ez,l.sg,l.O5,l.Ov,f.Bz,f.rH],styles:[".toc-title[_ngcontent-%COMP%]{font-weight:700;width:80%;padding-left:4px;padding-bottom:4px;margin-bottom:4px}ul.toc-list[_ngcontent-%COMP%]{list-style-type:none;margin:0;padding:0 8px;border-left:1px solid #b3e5fc}ul.toc-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding:3px 0}ul.toc-list[_ngcontent-%COMP%]   li.h3[_ngcontent-%COMP%], ul.toc-list[_ngcontent-%COMP%]   li.h4[_ngcontent-%COMP%], ul.toc-list[_ngcontent-%COMP%]   li.h5[_ngcontent-%COMP%], ul.toc-list[_ngcontent-%COMP%]   li.h6[_ngcontent-%COMP%]{padding-left:1em}ul.toc-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#000000de;text-decoration:none}ul.toc-list[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#ff80ab}ul.toc-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover   a[_ngcontent-%COMP%]{color:#f50057}"],changeDetection:0});var P=i(1409),I=i(2869),A=i(2579),Q=i(730);function $(e,o){if(1&e&&(t._UZ(0,"app-document-toc",6),t.ALo(1,"async")),2&e){const n=t.oxw(2);let c;t.Q6J("document",null==(c=t.lcZ(1,1,n.document$))?null:c.content)}}function J(e,o){if(1&e&&(t.ynx(0),t.TgZ(1,"div",2),t.ALo(2,"async"),t._UZ(3,"app-document-header",3),t.ALo(4,"async"),t._UZ(5,"app-document",4),t.YNc(6,$,2,3,"app-document-toc",5),t.ALo(7,"async"),t.qZA(),t.BQk()),2&e){const n=t.oxw();let c;t.xp6(1),t.Q6J("ngClass",t.lcZ(2,4,n.isMedium$)?"":"doc-plus-toc-container"),t.xp6(2),t.Q6J("document",null==(c=t.lcZ(4,6,n.document$))?null:c.content),t.xp6(2),t.Q6J("document$",n.document$),t.xp6(1),t.Q6J("ngIf",!t.lcZ(7,8,n.isMedium$))}}function w(e,o){if(1&e&&(t.ynx(0),t._UZ(1,"app-document-header",7),t.ALo(2,"async"),t._UZ(3,"app-document",8),t.BQk()),2&e){const n=t.oxw();let c;t.xp6(1),t.Q6J("document",null==(c=t.lcZ(2,2,n.document$))?null:c.content),t.xp6(2),t.Q6J("document$",n.document$)}}class d{constructor(o,n){this.breakpointObserverService=o,this.store=n,this.document$=this.store.select(P.P7),this.isMedium$=this.breakpointObserverService.getMediumBreakpoint(),this.onDestroy=new r.x}ngOnInit(){this.store.select(I.eY).pipe((0,p.R)(this.onDestroy),(0,h.g)(100)).subscribe(o=>{this.scrollToAnchor(o)})}ngOnDestroy(){this.onDestroy.next(),this.onDestroy.complete()}scrollToAnchor(o){const n=document.getElementById(o);window.scrollTo(0,n?n.offsetTop-80:0)}}d.\u0275fac=function(o){return new(o||d)(t.Y36(A.n),t.Y36(Q.yh))},d.\u0275cmp=t.Xpm({type:d,selectors:[["app-display"]],standalone:!0,features:[t.jDz],decls:5,vars:6,consts:[[1,"doc-container"],[4,"ngIf"],[3,"ngClass"],[1,"doc-header",3,"document"],[1,"doc-content",3,"document$"],["class","doc-toc",3,"document",4,"ngIf"],[1,"doc-toc",3,"document"],[3,"document"],[3,"document$"]],template:function(o,n){if(1&o&&(t.TgZ(0,"div",0),t.YNc(1,J,8,10,"ng-container",1),t.ALo(2,"async"),t.YNc(3,w,4,4,"ng-container",1),t.ALo(4,"async"),t.qZA()),2&o){let c,m;t.xp6(1),t.Q6J("ngIf","none"!==(null==(c=t.lcZ(2,2,n.document$))||null==c.content?null:c.content.toc)),t.xp6(2),t.Q6J("ngIf","none"===(null==(m=t.lcZ(4,4,n.document$))||null==m.content?null:m.content.toc))}},dependencies:[l.ez,l.mk,l.O5,l.Ov,x.I,a,s],styles:['.doc-container[_ngcontent-%COMP%]{margin:0 16px 24px;font-size:16px}.doc-plus-toc-container[_ngcontent-%COMP%]{display:grid;grid-template-columns:85% 15%;column-gap:16px;grid-template-areas:"header toc" "content toc"}.doc-header[_ngcontent-%COMP%]{grid-area:header}.doc-content[_ngcontent-%COMP%]{grid-area:content}.doc-toc[_ngcontent-%COMP%]{grid-area:toc;position:fixed;width:13%;top:76px;right:0;bottom:12px;margin-right:4px;overflow-y:auto;overflow-x:hidden;background-color:#f5f5f5}'],changeDetection:0});const L=[{path:"",children:[{path:"**",component:d}]}]}}]);