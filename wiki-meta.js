(function(){
'use strict';
var DEFAULT_AUTHOR='HPZ Aquaroom';
var AUTHORS={};
/* Số liệu minh họa, không phải số người tin tưởng thực tế. */
var BASE={'benh-dom-trang':128,'thay-nuoc-dinh-ky':112,'chu-trinh-nito':84,'benh-thoi-vay':67,'setup-be-60cm':45,'don-ca-betta-moi':33,'chon-loc-be':18,'nhiet-do-va-suoi':7};
var KEY='hpzwiki-trust';
var mine={};
try{mine=JSON.parse(localStorage.getItem(KEY)||'{}');if(!mine||typeof mine!=='object'||Array.isArray(mine))mine={}}catch(e){mine={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(mine))}catch(e){}}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function author(slug){return AUTHORS[slug]||DEFAULT_AUTHOR}
function count(slug){return (BASE[slug]||0)+(mine[slug]?1:0)}
function tier(n){return n>100?'gold':n>60?'silver':n>30?'bronze':''}
var RANKS={gold:{label:'Vàng',rule:'Trên 100 người tin tưởng'},silver:{label:'Bạc',rule:'Trên 60 đến 100 người tin tưởng'},bronze:{label:'Đồng',rule:'Trên 30 đến 60 người tin tưởng'}};
var PERSON='<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/></svg>';
var SHIELD='<svg class="hpz-rank__shield" viewBox="0 0 32 36" width="26" height="30" aria-hidden="true"><path d="M16 2 29 7v11c0 8-7 13-13 16C10 31 3 26 3 18V7Z" fill="currentColor"/><path d="m16 9 2.2 4.6 5.1.7-3.7 3.6.9 5.1-4.5-2.4-4.5 2.4.9-5.1-3.7-3.6 5.1-.7Z" fill="#08131F"/></svg>';
var css=`
.hpz-wiki-grid{grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr));gap:22px;align-items:stretch}
.hpz-wiki-card,.hpz-article{--rank-accent:#54C7E8;--rank-bg:#122638;--rank-border:#294457;position:relative;min-width:0}
.hpz-wiki-card[data-tier="gold"],.hpz-article[data-tier="gold"]{--rank-accent:#FFD45A;--rank-bg:#302B19;--rank-border:#8F7531}
.hpz-wiki-card[data-tier="silver"],.hpz-article[data-tier="silver"]{--rank-accent:#DFE9F3;--rank-bg:#263645;--rank-border:#8195A8}
.hpz-wiki-card[data-tier="bronze"],.hpz-article[data-tier="bronze"]{--rank-accent:#F3A06A;--rank-bg:#35251F;--rank-border:#A36542}
.hpz-wiki-card{display:flex;flex-direction:column;gap:14px;padding:22px;border:1px solid var(--rank-border)!important;border-top:4px solid var(--rank-accent)!important;background:var(--rank-bg)!important;border-radius:18px;box-shadow:none!important;backdrop-filter:none!important;transition:transform .16s ease,border-color .16s ease;isolation:isolate}
.hpz-wiki-card::before,.hpz-wiki-card::after,.hpz-article::after{content:none!important}
.hpz-wiki-card:hover{transform:translateY(-3px);border-color:var(--rank-accent)!important}
.hpz-wiki-card:focus-visible{outline:3px solid var(--rank-accent);outline-offset:4px}
.hpz-wiki-card__head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;min-width:0;padding-bottom:14px;border-bottom:1px solid var(--rank-border)}
.hpz-wiki-card__identity{display:flex;align-items:center;gap:10px;min-width:0;flex-wrap:wrap}
.hpz-wiki-card__icon{font-size:26px;line-height:1;flex-shrink:0}
.hpz-rank{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:6px 12px 6px 8px;border:1px solid var(--rank-accent);border-radius:10px;background:#08131F;color:var(--rank-accent);font-size:14px;font-weight:800;line-height:1.3;white-space:nowrap}
.hpz-rank__shield{flex-shrink:0;filter:drop-shadow(0 1px 1px rgba(0,0,0,.2))}
[data-tier="gold"] .hpz-rank{background:linear-gradient(120deg,#FFDE79,#F5BD35);color:#2D2104;border-color:#FFE59C}
[data-tier="silver"] .hpz-rank{background:linear-gradient(120deg,#EFF5FA,#B8C9DA);color:#142638;border-color:#F3F7FB}
[data-tier="bronze"] .hpz-rank{background:linear-gradient(120deg,#F6B384,#D57C49);color:#32190D;border-color:#FFC69F}
.hpz-rank--none{color:#B6C6D4;border-color:#294457;font-size:12px;padding:8px 10px;min-height:34px}
.hpz-trust{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;color:#70F0A8;font-weight:800;font-size:14px;line-height:1.3;border:1px solid #32664C;border-radius:999px;padding:7px 10px;background:#0C221D;min-height:36px;box-sizing:border-box}
.hpz-trust svg{color:#70F0A8;flex-shrink:0}
.hpz-trust b{font-variant-numeric:tabular-nums}
.hpz-trust__label{font-size:12px;font-weight:600;color:#B8E6CD}
button.hpz-trust{cursor:pointer;font-family:inherit}
button.hpz-trust:hover{border-color:#70F0A8}
button.hpz-trust[aria-pressed="true"]{background:#15422D;border-color:#70F0A8}
.hpz-wiki-card>.hpz-status{align-self:flex-start;max-width:100%;width:auto;box-sizing:border-box;background:#08131F!important;border:1px solid #486074!important;color:#B9EAF7!important;font-size:12px;line-height:1.5;white-space:normal}
.hpz-wiki-card h2{margin:0;color:#F5F8FC!important;font-size:20px;line-height:1.4;font-weight:800;overflow-wrap:anywhere}
.hpz-wiki-card p{margin:0;color:#D0DDE8!important;font-size:15px;line-height:1.7;overflow-wrap:anywhere}
.hpz-wiki-card__footer{display:flex;flex-direction:column;gap:6px;margin-top:auto;padding-top:14px;border-top:1px solid var(--rank-border)}
.hpz-wiki-card__footer small{margin:0;color:#BACBDA!important;font-size:12px;line-height:1.5}
.hpz-wiki-author{display:block;margin:0;color:#D4E2EC!important;font-size:13px;line-height:1.5;overflow-wrap:anywhere}
.hpz-article[data-tier]{background:#122638!important;border:1px solid var(--rank-border)!important;border-top:4px solid var(--rank-accent)!important}
.hpz-article__rankbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:16px 0;margin-bottom:16px;border-bottom:1px solid var(--rank-border)}
.hpz-article__meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.hpz-article__rankbar .hpz-rank{max-width:100%;box-sizing:border-box}
@media(max-width:480px){.hpz-wiki-grid{gap:16px}.hpz-wiki-card{padding:18px;gap:12px}.hpz-wiki-card__head{gap:10px}.hpz-wiki-card__identity{gap:8px}.hpz-wiki-card__icon{font-size:24px}.hpz-rank{font-size:13px;padding:5px 9px 5px 6px}.hpz-rank--none{font-size:12px}.hpz-trust{padding:7px 9px}.hpz-wiki-card h2{font-size:19px}}
@media(prefers-reduced-motion:reduce){.hpz-wiki-card{transition:none}.hpz-wiki-card:hover{transform:none}}
`;
var st=document.createElement('style');st.id='hpz-rank-styles';st.textContent=css;document.head.appendChild(st);
function applyTier(el,slug){
  var t=tier(count(slug));if(t)el.setAttribute('data-tier',t);else el.removeAttribute('data-tier');
  var badge=el.querySelector('.hpz-rank');if(!badge||badge.getAttribute('data-rank')===t)return;
  badge.setAttribute('data-rank',t);badge.classList.toggle('hpz-rank--none',!t);
  badge.innerHTML=t?SHIELD+'<span>Hạng '+RANKS[t].label+'</span>':'<span>Chưa xếp hạng</span>';
  badge.title=t?RANKS[t].rule:'30 người tin tưởng trở xuống';
}
function trustHtml(slug,tag){return '<'+tag+' class="hpz-trust" data-trust="'+esc(slug)+'" title="Số minh họa cộng lượt tin tưởng trên trình duyệt này" aria-label="'+count(slug)+' người tin tưởng (số minh họa)"'+(tag==='button'?' type="button" aria-pressed="'+(!!mine[slug])+'"':'')+'>'+PERSON+'<b>'+count(slug)+'</b><span class="hpz-trust__label">tin tưởng</span></'+tag+'>'}
function enhance(){
  document.querySelectorAll('a.hpz-wiki-card:not([data-meta])').forEach(function(a){
    var m=(a.getAttribute('href')||'').match(/#\/wiki\/(.+)$/);if(!m)return;
    var slug;try{slug=decodeURIComponent(m[1])}catch(e){return}
    a.setAttribute('data-meta','1');a.setAttribute('data-slug',slug);
    var head=document.createElement('div');head.className='hpz-wiki-card__head';
    head.innerHTML='<div class="hpz-wiki-card__identity"><span class="hpz-rank"></span></div>'+trustHtml(slug,'span');
    var icon=a.querySelector('.hpz-wiki-card__icon');if(icon)head.querySelector('.hpz-wiki-card__identity').prepend(icon);
    a.prepend(head);
    var footer=document.createElement('div');footer.className='hpz-wiki-card__footer';
    var date=a.querySelector('small');if(date)footer.appendChild(date);
    var by=document.createElement('span');by.className='hpz-wiki-author';by.textContent='Tác giả: '+author(slug);footer.appendChild(by);a.appendChild(footer);
    applyTier(a,slug);
  });
  var art=document.querySelector('article.hpz-article:not([data-meta])');
  if(art){
    var mm=location.hash.match(/^#\/wiki\/([^/]+)$/);if(!mm)return;
    var slug2;try{slug2=decodeURIComponent(mm[1])}catch(e){return}
    art.setAttribute('data-meta','1');art.setAttribute('data-slug',slug2);
    var bar=document.createElement('div');bar.className='hpz-article__rankbar';bar.innerHTML='<span class="hpz-rank"></span>'+trustHtml(slug2,'button');
    var actions=art.querySelector('.hpz-actions');if(actions)actions.after(bar);else art.prepend(bar);
    var meta=art.querySelector('.hpz-article__meta');if(meta){var by2=document.createElement('small');by2.textContent='Tác giả: '+author(slug2);meta.appendChild(by2)}
    applyTier(art,slug2);
  }
}
document.addEventListener('click',function(e){
  var b=e.target.closest('button[data-trust]');if(!b)return;
  var slug=b.getAttribute('data-trust');mine[slug]=!mine[slug];save();
  document.querySelectorAll('[data-trust]').forEach(function(item){if(item.getAttribute('data-trust')!==slug)return;item.setAttribute('aria-label',count(slug)+' người tin tưởng (số minh họa)');item.querySelector('b').textContent=count(slug);if(item.tagName==='BUTTON')item.setAttribute('aria-pressed',String(!!mine[slug]))});
  document.querySelectorAll('[data-slug]').forEach(function(el){if(el.getAttribute('data-slug')===slug)applyTier(el,slug)});
});
var view=document.getElementById('view');if(view)new MutationObserver(enhance).observe(view,{childList:true,subtree:true});
enhance();
})();
