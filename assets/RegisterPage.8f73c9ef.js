import{l as c}from"./logo.cd107cd0.js";import{A as _,s as m}from"./api.93f647bf.js";import{_ as p,f as u,o as f,c as g,b as e,i as l,v as n,a as h,w as v,e as a}from"./index.46219c50.js";const w={name:"RegisterPage",data(){return{logoImage:c,form:{email:"",password:""}}},methods:{async submit(){const{data:r,status:s}=await _.register(this.form);m(r.token),await this.$router.replace("/dash")}}},x={class:"LoginPage"},b={class:"cover"},k={class:"header"},y=["src"],P=e("h1",{class:"text-2xl text-center opacity-60"},[e("span",{class:""},"Join"),a(" NeoBase ")],-1),V={class:"form"},A={class:"form-group"},B=e("label",{for:"email"},"Email",-1),C={class:"form-group"},N=e("label",{for:"password"},"Password",-1),R={class:"msg opacity-75"},T=a(" Already registered? "),E=a("Login Here");function I(r,s,L,U,o,i){const d=u("router-link");return f(),g("div",x,[e("div",b,[e("div",k,[e("img",{src:o.logoImage,width:"120",height:"120"},null,8,y),P]),e("div",V,[e("div",A,[B,l(e("input",{id:"email","onUpdate:modelValue":s[0]||(s[0]=t=>o.form.email=t),name:"email",placeholder:"john@doe.com"},null,512),[[n,o.form.email]])]),e("div",C,[N,l(e("input",{id:"password","onUpdate:modelValue":s[1]||(s[1]=t=>o.form.password=t),type:"password",placeholder:"secure password"},null,512),[[n,o.form.password]])]),e("button",{class:"",onClick:s[2]||(s[2]=(...t)=>i.submit&&i.submit(...t))},"Continue")]),e("div",R,[e("p",null,[T,h(d,{class:"text-blue-700 font-bold",to:"/login"},{default:v(()=>[E]),_:1})])])])])}var J=p(w,[["render",I]]);export{J as default};