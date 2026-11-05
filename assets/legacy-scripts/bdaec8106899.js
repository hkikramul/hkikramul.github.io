
(function(){
const url="https://hkikramul.github.io/east-bengal-renaissance/dhakai-muslin.html", title="ঢাকাই মসলিনের প্রত্যাবর্তন", credit="লেখা, তথ্য অনুসন্ধান ও সম্পাদনা: Md. Ikramul Haq Khan (মো. ইকরামুল হক খান)\nপ্রকাশনা: পূর্ববঙ্গ নবজাগরণ", status=document.getElementById("share-status");
async function copy(value){try{await navigator.clipboard.writeText(value);status.textContent="কপি হয়েছে।";}catch(e){status.textContent="কপি করা যায়নি। ব্রাউজারের ঠিকানা থেকে লিংকটি কপি করুন।";}}
document.getElementById("copy-link").addEventListener("click",()=>copy(url));
document.getElementById("copy-credit").addEventListener("click",()=>copy(title+"\n"+credit+"\n"+url));
const native=document.getElementById("share-native");if(navigator.share){native.hidden=false;native.addEventListener("click",async()=>{try{await navigator.share({title:title,text:title+" — "+credit,url:url});}catch(e){if(e.name!=="AbortError")status.textContent="শেয়ার করা যায়নি। লিংক কপি করে চেষ্টা করুন।";}})}
})();
