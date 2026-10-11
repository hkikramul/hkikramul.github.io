'use strict';
// Content is public. Saving is handled only by the authenticated Pages CMS app.
(() => {
 const safeURL = value => {
  try {const url = new URL(String(value), location.href);return ['https:', 'mailto:'].includes(url.protocol) ? url.href : null;} catch {return null;}
 };
 function write(node, value) {
  if (typeof value !== 'string') return;
  const current = node.innerText?.trim();
  if (current === value.trim()) return;
  const lines=value.split('\n');node.replaceChildren();
  lines.forEach((line,i)=>{if(i)node.append(document.createElement('br'));node.append(document.createTextNode(line));});
 }
 function populate(scope, data) {
  scope.querySelectorAll('[data-cms-key]').forEach(node=>write(node,data[node.dataset.cmsKey]));
  scope.querySelectorAll('[data-cms-link]').forEach(node=>{
   const value=data[node.dataset.cmsLink];if(typeof value !== 'string')return;
   const url=safeURL(value);node.hidden=!value || !url;if(url)node.href=url;
  });
  scope.querySelectorAll('[data-cms-tags]').forEach(node=>{
   const value=data[node.dataset.cmsTags];if(typeof value!=='string')return;
   node.replaceChildren();value.split(',').map(x=>x.trim()).filter(Boolean).forEach(tag=>{const span=document.createElement('span');span.textContent=tag;node.append(span);});
  });
 }
 document.querySelectorAll('[data-cms-file]').forEach(async section=>{
  try {
   const response=await fetch(section.dataset.cmsFile,{cache:'no-cache'});if(!response.ok)throw Error('Content unavailable');
   const data=await response.json();
   if(data.page_title)document.title=data.page_title;
   if(data.description)document.querySelector('meta[name="description"]').content=data.description;
   populate(section,data);
   section.querySelectorAll('[data-cms-list]').forEach(list=>{
    const key=list.dataset.cmsList;const template=section.querySelector(`template[data-cms-template="${key}"]`);
    if(!Array.isArray(data[key]) || !template)return;
    const fragment=document.createDocumentFragment();
    data[key].forEach((item,i)=>{const copy=template.content.cloneNode(true);populate(copy,item);if(key==='projects_1' && i===0)copy.querySelector('article').classList.add('featured');fragment.append(copy);});
    list.replaceChildren(fragment);
   });
  } catch(error) {console.warn('Using the published fallback content.',error.message);}
 });
})();
