import{_ as i,q as _,r as p,x as d,o as n,c,t as l,e as f,b as m}from"./index.46219c50.js";import{A as U}from"./api.93f647bf.js";const h={name:"User",beforeRouteUpdate(){this.fetchUser()},setup(){const e=_(),t=e.params.project,r=U.Users(t),s=p(),a=async()=>{const o=e.params.uid,{data:u}=await r.fetchUser(o);s.value=u};return d(()=>{a()}),{project:t,api:r,fetchUser:a,user:s}}},v={class:"User"},y=f(" User"),x=m("br",null,null,-1);function $(e,t,r,s,a,o){return n(),c("div",v,[y,x,(n(),c("pre",{key:e.$route.params.uid},l(JSON.stringify(s.user,null,"	")),1))])}var k=i(h,[["render",$]]);export{k as default};