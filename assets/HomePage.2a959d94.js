import{r as n,a as c,o as d,c as p,b as t,d as e,w as _,v as u,e as r,f as m,u as h,g as i}from"./index.a259c8be.js";import{_ as f}from"./NavBar.7b5b2c9f.js";import{C as v}from"./chevron-forward.eee5af4c.js";const g={class:"HomePage"},x={class:"cover container mx-auto px-6"},y=m('<div class="big-text"><h1 class="whitespace-nowrap"> The <span class="supertext">SuperPowered </span><br> Backend for developers </h1></div><div class="desc text-2xl leading-9 opacity-60"><p> NeoBase helps you build faster and scale further than any other Serverless Platform or App Framework. Just create a Project, and get a powerful Rest API &amp; beautiful Management UI for content and data. </p><p class="mt-8"> No dev-ops or server \u2013 just elegant APIs to help you ship what that matters without sacrificing the flexibility or power of a bespoke back-end. </p></div>',2),w={class:"access sm:flex justify-start gap-4 mt-16 text-lg"},b=i(" Get started "),k={class:"login py-4 text-lg"},P=i(" login "),N=e("span",{class:"text-gray-500"}," if you already have an account. ",-1),B={name:"HomePage"},H=Object.assign(B,{setup(V){const a=n("");return(j,s)=>{const o=c("router-link");return d(),p("div",g,[t(f),e("div",x,[y,e("div",w,[_(e("input",{id:"email","onUpdate:modelValue":s[0]||(s[0]=l=>a.value=l),class:"",placeholder:"Enter your Email Address",type:"email",name:"email"},null,512),[[u,a.value]]),t(o,{to:"/register?email="+a.value},{default:r(()=>[b,t(h(v))]),_:1},8,["to"])]),e("div",k,[t(o,{class:"text-primary dark:text-primary-300 font-bold",to:"/login"},{default:r(()=>[P]),_:1}),N])])])}}});export{H as default};
