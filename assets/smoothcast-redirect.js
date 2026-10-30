(() => {
 const supported=['system','en','zh','ja','ko','de','fr','es','pt'];
 let lang=new URLSearchParams(location.search).get('lang');
 if(!supported.includes(lang)){try{lang=localStorage.getItem('ksicSupportLanguage')}catch{}}
 if(!supported.includes(lang))lang='system';
 const target=new URL(document.querySelector('link[rel="canonical"]').href);
 target.searchParams.set('lang',lang);
 location.replace(target.href);
})();
