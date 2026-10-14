(function(){
'use strict';
var DEFAULT_AUTHOR='HPZ Aquaroom';
var AUTHORS={};
/* Số liệu minh họa để xem các cấp viền. Thay bằng số thật khi có backend. */
var BASE={
  'benh-dom-trang':128,
  'thay-nuoc-dinh-ky':112,
  'chu-trinh-nito':84,
  'benh-thoi-vay':67,
  'setup-be-60cm':45,
  'don-ca-betta-moi':33,
  'chon-loc-be':18,
  'nhiet-do-va-suoi':7
};
var KEY='hpzwiki-trust';
var mine={};
try{mine=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){mine={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(mine))}catch(e){}}
function author(slug){return AUTHORS[slug]||DEFAULT_AUTHOR}
function count(slug){return (BASE[slug]||0)+(mine[slug]?1:0)}
function tier(n){return n>100?'gold':n>60?'silver':n>30?'bronze':''}
function applyTier(el,slug){var t=tier(count(slug));if(t)el.setAttribute('data-tier',t);else el.removeAttribute('data-tier')}
var ICON='<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/></svg>';
var css='.hpz-trust{display:inline-flex;align-items:center;gap:6px;color:#3ddc84;font-weight:800;font-size:14px;line-height:1}'
+'.hpz-trust svg{color:#3ddc84}'
+'.hpz-wiki-card{position:relative}'
+'.hpz-wiki-card>.hpz-trust{position:absolute;top:22px;right:22px}'
+'.hpz-wiki-author{display:block;margin-top:6px;color:#B6C6D4;font-size:14px}'
+'button.hpz-trust{border:1px solid rgba(61,220,132,.45);border-radius:999px;padding:6px 12px;background:rgba(61,220,132,.08);cursor:pointer;min-height:36px}'
+'button.hpz-trust[aria-pressed="true"]{background:rgba(61,220,132,.22)}'
+'.hpz-article__meta{display:flex;flex-wrap:wrap;align-items:center;gap:12px}'
+'.hpz-wiki-card[data-tier],.hpz-article[data-tier]{border-width:2px!important}'
+'.hpz-wiki-card[data-tier="gold"],.hpz-article[data-tier="gold"]{border-color:#E7B93C!important}'
+'.hpz-wiki-card[data-tier="silver"],.hpz-article[data-tier="silver"]{border-color:#C5CED6!important}'
+'.hpz-wiki-card[data-tier="bronze"],.hpz-article[data-tier="bronze"]{border-color:#C07A45!important}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function trustHtml(slug,tag){return '<'+tag+' class="hpz-trust" data-trust="'+slug+'" title="Số người tin tưởng Wiki này" aria-label="'+count(slug)+' người tin tưởng"'+(tag==='button'?' type="button" aria-pressed="'+(!!mine[slug])+'"':'')+'>'+ICON+'<b>'+count(slug)+'</b></'+tag+'>'}
function enhance(){
  document.querySelectorAll('a.hpz-wiki-card:not([data-meta])').forEach(function(a){
    var m=(a.getAttribute('href')||'').match(/#\/wiki\/(.+)$/);if(!m)return;
    var slug=decodeURIComponent(m[1]);a.setAttribute('data-meta','1');a.setAttribute('data-slug',slug);
    a.insertAdjacentHTML('afterbegin',trustHtml(slug,'span'));
    var s=a.querySelector('small');
    if(s)s.insertAdjacentHTML('afterend','<span class="hpz-wiki-author">Tác giả: '+author(slug)+'</span>');
    applyTier(a,slug);
  });
  var art=document.querySelector('article.hpz-article:not([data-meta])');
  if(art){
    var mm=location.hash.match(/^#\/wiki\/([^/]+)$/);
    if(mm){
      var slug2=decodeURIComponent(mm[1]);art.setAttribute('data-meta','1');art.setAttribute('data-slug',slug2);
      var meta=art.querySelector('.hpz-article__meta');
      if(meta){meta.insertAdjacentHTML('beforeend','<small>Tác giả: '+author(slug2)+'</small>'+trustHtml(slug2,'button'))}
      applyTier(art,slug2);
    }
  }
}
document.addEventListener('click',function(e){
  var b=e.target.closest('button[data-trust]');if(!b)return;
  var slug=b.getAttribute('data-trust');mine[slug]=!mine[slug];save();
  b.setAttribute('aria-pressed',String(!!mine[slug]));
  b.setAttribute('aria-label',count(slug)+' người tin tưởng');
  b.querySelector('b').textContent=count(slug);
  var art=b.closest('article');if(art)applyTier(art,slug);
});
var view=document.getElementById('view');
if(view){new MutationObserver(enhance).observe(view,{childList:true,subtree:true});}
enhance();
})();
