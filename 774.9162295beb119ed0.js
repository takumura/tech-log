"use strict";(self.webpackChunknet6_markdown_web_engine=self.webpackChunknet6_markdown_web_engine||[]).push([[774],{9774:(f,_,a)=>{a.r(_),a.d(_,{NetCoreApiComponent:()=>r});var s=a(8692),c=a(4121),e=a(4537),p=a(5732);function i(n,o){1&n&&(e.TgZ(0,"p")(1,"em"),e._uU(2,"Loading... Please refresh once the ASP.NET backend has started. See "),e.TgZ(3,"a",2),e._uU(4,"https://aka.ms/jspsintegrationangular"),e.qZA(),e._uU(5," for more details."),e.qZA()())}function g(n,o){if(1&n&&(e.TgZ(0,"tr")(1,"td"),e._uU(2),e.qZA(),e.TgZ(3,"td"),e._uU(4),e.qZA(),e.TgZ(5,"td"),e._uU(6),e.qZA(),e.TgZ(7,"td"),e._uU(8),e.qZA()()),2&n){const t=o.$implicit;e.xp6(2),e.Oqu(t.date),e.xp6(2),e.Oqu(t.temperatureC),e.xp6(2),e.Oqu(t.temperatureF),e.xp6(2),e.Oqu(t.summary)}}function u(n,o){if(1&n&&(e.TgZ(0,"table")(1,"thead")(2,"tr")(3,"th"),e._uU(4,"Date"),e.qZA(),e.TgZ(5,"th"),e._uU(6,"Temp. (C)"),e.qZA(),e.TgZ(7,"th"),e._uU(8,"Temp. (F)"),e.qZA(),e.TgZ(9,"th"),e._uU(10,"Summary"),e.qZA()()(),e.TgZ(11,"tbody"),e.YNc(12,g,9,4,"tr",3),e.qZA()()),2&n){const t=e.oxw().ngIf;e.xp6(12),e.Q6J("ngForOf",t)}}function m(n,o){if(1&n&&(e.ynx(0),e.YNc(1,i,6,0,"p",1),e.YNc(2,u,13,1,"table",1),e.BQk()),2&n){const t=o.ngIf;e.xp6(1),e.Q6J("ngIf",0===t.length),e.xp6(1),e.Q6J("ngIf",t.length>0)}}class r{constructor(o){this.forecastsSub=new c.X([]),this.forecasts$=this.forecastsSub.asObservable(),this.title="Test Api",o.get("/weatherforecast").subscribe({next:t=>this.forecastsSub.next(t),error:t=>console.error(t)})}}r.\u0275fac=function(o){return new(o||r)(e.Y36(p.eN))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-net-core-api"]],standalone:!0,features:[e.jDz],decls:6,vars:3,consts:[["id","tableLabel"],[4,"ngIf"],["href","https://aka.ms/jspsintegrationangular"],[4,"ngFor","ngForOf"]],template:function(o,t){1&o&&(e.TgZ(0,"h1",0),e._uU(1,"Weather forecast"),e.qZA(),e.TgZ(2,"p"),e._uU(3,"This component demonstrates fetching data from the server."),e.qZA(),e.YNc(4,m,3,2,"ng-container",1),e.ALo(5,"async")),2&o&&(e.xp6(4),e.Q6J("ngIf",e.lcZ(5,1,t.forecasts$)))},dependencies:[s.ez,s.sg,s.O5,s.Ov],changeDetection:0})}}]);