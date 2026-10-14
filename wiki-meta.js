(function(){
'use strict';
var DEFAULT_AUTHOR='HPZ Aquaroom';
var AUTHORS={};
/* Số liệu minh họa để xem các cấp màu. Thay bằng số thật khi có backend. */
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
/* S(tier, suffix): selector cho cả thẻ và bài chi tiết, suffix gắn vào TỪNG selector */
function S(n,suffix){suffix=suffix||'';return '.hpz-wiki-card[data-tier="'+n+'"]'+suffix+',.hpz-article[data-tier="'+n+'"]'+suffix}
function C(n){return '.hpz-wiki-card[data-tier="'+n+'"]'}
var TIERS=['gold','silver','bronze'];
function all(suffix){return TIERS.map(function(n){return S(n,suffix)}).join(',')}
var css='.hpz-trust{display:inline-flex;align-items:center;gap:6px;color:#3ddc84;font-weight:800;font-size:14px;line-height:1}'
+'.hpz-trust svg{color:#3ddc84}'
+'.hpz-wiki-card,.hpz-article{position:relative}'
+'.hpz-wiki-card>.hpz-trust{position:absolute;top:22px;right:22px}'
+'.hpz-wiki-author{display:block;margin-top:6px;color:#B6C6D4;font-size:14px}'
+'button.hpz-trust{border:1px solid rgba(61,220,132,.45);border-radius:999px;padding:6px 12px;background:rgba(61,220,132,.08);cursor:pointer;min-height:36px}'
+'button.hpz-trust[aria-pressed="true"]{background:rgba(61,220,132,.22)}'
+'.hpz-article__meta{display:flex;flex-wrap:wrap;align-items:center;gap:12px}'
+'.hpz-wiki-card[data-tier],.hpz-article[data-tier]{border-width:2px!important}'
+S('gold')+'{background-color:#5E4B07!important;border-color:#FFC83D!important}'
+S('silver')+'{background-color:#435260!important;border-color:#D9E2EA!important}'
+S('bronze')+'{background-color:#5A2C12!important;border-color:#E8833A!important}'
+all(' p')+','+all(' small')+','+all(' .hpz-wiki-author')+'{color:#F2F7FB!important}'
+all(' .hpz-status')+'{background:rgba(8,19,31,.7);border-color:rgba(255,255,255,.25)}'
+C('gold')+'{background-image:repeating-linear-gradient(45deg,rgba(255,200,61,.16) 0 6px,transparent 6px 16px)!important}'
+C('silver')+'{background-image:radial-gradient(circle,rgba(255,255,255,.2) 1.6px,transparent 1.8px)!important;background-size:14px 14px!important}'
+C('bronze')+'{background-image:repeating-linear-gradient(45deg,rgba(232,131,58,.18) 0 2px,transparent 2px 12px),repeating-linear-gradient(-45deg,rgba(232,131,58,.18) 0 2px,transparent 2px 12px)!important}'
+all('::after')+'{position:absolute;right:18px;bottom:16px;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;line-height:1.2;pointer-events:none;white-space:nowrap}'
+S('gold','::after')+'{content:"🥇 Vàng";background:#FFC83D;color:#3a2c00}'
+S('silver','::after')+'{content:"🥈 Bạc";background:#D9E2EA;color:#1f2a33}'
+S('bronze','::after')+'{content:"🥉 Đồng";background:#E8833A;color:#2e1305}'
+'.hpz-article[data-tier]::after{top:20px;bottom:auto}';
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
