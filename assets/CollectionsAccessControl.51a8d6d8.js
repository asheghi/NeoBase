import{A as u}from"./api.93f647bf.js";import{_ as h,f as a,o as e,c as t,b as n,F as f,k as p,a as v,T as C,w as r,j as i,g as _,e as k,t as y,n as A}from"./index.46219c50.js";const g={name:"CollectionsAccessControl",data(){return{form:{name:""},collections:[]}},computed:{project(){return this.$route.params.project},collection(){return this.$route.params.collection}},mounted(){this.fetchData()},methods:{async fetchData(){const{data:l}=await u.Collections(this.project).list();this.collections=l}}},w={class:"CollectionsAccessControl"},x={class:"side-bar"},j=n("div",{class:"head"},"Access Collection",-1),B={class:"items"},N={key:0,class:"document w-full h-full relative"},V={key:1,class:"select-document"},D={key:0},T={key:1,class:""};function b(l,F,z,E,c,o){const d=a("router-link"),m=a("router-view");return e(),t("div",w,[n("div",x,[j,n("div",B,[(e(!0),t(f,null,p(c.collections,s=>(e(),_(d,{key:s,to:{name:"access-config",params:{collection:s.name}},class:A(["item name",{selected:s.name===o.collection}])},{default:r(()=>[k(y(s.name),1)]),_:2},1032,["to","class"]))),128))])]),o.collection?(e(),t("div",N,[v(C,{name:"fade"},{default:r(()=>[(e(),_(m,{key:o.collection}))]),_:1})])):i("",!0),o.collection?i("",!0):(e(),t("div",V,[c.collections&&c.collections.length?(e(),t("div",D," select a collection first ")):(e(),t("div",T,"create a collection first"))]))])}var q=h(g,[["render",b]]);export{q as default};