/* TOAST */
function toast(msg,type,ms){
  type=type||''; ms=ms||3000;
  var c=document.getElementById('tc');
  if(!c){c=document.createElement('div');c.id='tc';document.body.appendChild(c);}
  var t=document.createElement('div');
  t.className='toast'+(type?' '+type:'');
  t.textContent=msg;
  c.appendChild(t);
  setTimeout(function(){
    t.style.transition='opacity .3s';t.style.opacity='0';
    setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},320);
  },ms);
}

/* VALIDATION */
function clrE(inp){
  inp.style.borderColor=''; inp.style.boxShadow='';
  var e=inp.parentElement.querySelector('.ferr');
  if(e)e.parentNode.removeChild(e);
}
function setE(inp,msg){
  clrE(inp);
  inp.style.borderColor='#EF4444';
  var e=document.createElement('span');e.className='ferr';e.textContent=msg;
  inp.parentElement.appendChild(e);
}
function vForm(rules){
  var ok=true;
  rules.forEach(function(rule){
    clrE(rule.inp);
    for(var i=0;i<rule.fns.length;i++){
      var err=rule.fns[i](rule.inp.value);
      if(err){setE(rule.inp,err);ok=false;break;}
    }
  });
  return ok;
}
var V={
  req:function(l){return function(v){return(!v||!v.trim())?l+' مطلوب':null;};},
  email:function(v){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?null:'البريد الإلكتروني غير صحيح';},
  phone:function(v){
    var d=String(v||'').replace(/[\s-]/g,'');
    return/^(?:\+9665\d{8}|9665\d{8}|05\d{8})$/.test(d)?null:'\u0631\u0642\u0645 \u0627\u0644\u062c\u0648\u0627\u0644 \u0627\u0644\u0633\u0639\u0648\u062f\u064a \u063a\u064a\u0631 \u0635\u062d\u064a\u062d';
  },
  pass:function(v){return(!v||v.length<8)?'يجب أن تحتوي على 8 أحرف على الأقل':null;},
  match:function(other){return function(v){return v!==other.value?'كلمة المرور غير متطابقة':null;};}
};

/* SAUDI AUTOCOMPLETE */
var SA_DATA={
  cities:[
    '\u0627\u0644\u0631\u064a\u0627\u0636','\u062c\u062f\u0629','\u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629','\u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0627\u0644\u0645\u0646\u0648\u0631\u0629','\u0627\u0644\u062f\u0645\u0627\u0645','\u0627\u0644\u062e\u0628\u0631','\u0627\u0644\u0637\u0627\u0626\u0641','\u062a\u0628\u0648\u0643','\u0628\u0631\u064a\u062f\u0629','\u0639\u0646\u064a\u0632\u0629','\u0623\u0628\u0647\u0627','\u062e\u0645\u064a\u0633 \u0645\u0634\u064a\u0637','\u062c\u0627\u0632\u0627\u0646','\u0646\u062c\u0631\u0627\u0646','\u062d\u0627\u0626\u0644','\u0627\u0644\u062c\u0628\u064a\u0644','\u064a\u0646\u0628\u0639','\u0627\u0644\u0623\u062d\u0633\u0627\u0621','\u0627\u0644\u0642\u0637\u064a\u0641','\u0627\u0644\u0628\u0627\u062d\u0629','\u0633\u0643\u0627\u0643\u0627','\u0639\u0631\u0639\u0631','\u0627\u0644\u062e\u0631\u062c','\u062d\u0641\u0631 \u0627\u0644\u0628\u0627\u0637\u0646'
  ],
  clubs:[
    '\u0646\u0627\u062f\u064a \u0627\u0644\u0647\u0644\u0627\u0644','\u0646\u0627\u062f\u064a \u0627\u0644\u0646\u0635\u0631','\u0646\u0627\u062f\u064a \u0627\u0644\u0627\u062a\u062d\u0627\u062f','\u0627\u0644\u0646\u0627\u062f\u064a \u0627\u0644\u0623\u0647\u0644\u064a','\u0646\u0627\u062f\u064a \u0627\u0644\u0634\u0628\u0627\u0628','\u0646\u0627\u062f\u064a \u0627\u0644\u0631\u064a\u0627\u0636','\u0646\u0627\u062f\u064a \u0627\u0644\u0648\u062d\u062f\u0629','\u0646\u0627\u062f\u064a \u0627\u0644\u0642\u0627\u062f\u0633\u064a\u0629','\u0646\u0627\u062f\u064a \u0627\u0644\u0627\u062a\u0641\u0627\u0642','\u0646\u0627\u062f\u064a \u0627\u0644\u0641\u062a\u062d','\u0646\u0627\u062f\u064a \u0627\u0644\u0641\u064a\u062d\u0627\u0621','\u0646\u0627\u062f\u064a \u0627\u0644\u062a\u0639\u0627\u0648\u0646','\u0646\u0627\u062f\u064a \u0636\u0645\u0643','\u0646\u0627\u062f\u064a \u0627\u0644\u062e\u0644\u064a\u062c','\u0646\u0627\u062f\u064a \u0627\u0644\u0623\u062e\u062f\u0648\u062f','\u0645\u0631\u0643\u0632 \u0634\u0628\u0627\u0628 \u0627\u0644\u0641\u0631\u0633\u0627\u0646'
  ],
  names:[
    '\u0646\u0648\u0631\u0629 \u0627\u0644\u0642\u062d\u0637\u0627\u0646\u064a','\u0633\u0627\u0631\u0629 \u0627\u0644\u0639\u062a\u064a\u0628\u064a','\u0631\u064a\u0645 \u0627\u0644\u0634\u0647\u0631\u064a','\u0645\u0631\u064a\u0645 \u0627\u0644\u063a\u0627\u0645\u062f\u064a','\u0644\u064a\u0627\u0646 \u0627\u0644\u062d\u0631\u0628\u064a','\u062c\u0648\u062f \u0627\u0644\u062f\u0648\u0633\u0631\u064a','\u0647\u064a\u0627 \u0627\u0644\u0645\u0637\u064a\u0631\u064a','\u062f\u0644\u0627\u0644 \u0627\u0644\u0645\u0627\u0644\u0643\u064a','\u0634\u0647\u062f \u0627\u0644\u0632\u0647\u0631\u0627\u0646\u064a','\u0631\u063a\u062f \u0627\u0644\u0634\u0645\u0631\u064a'
  ],
  managerNames:[
    '\u062e\u0627\u0644\u062f \u0627\u0644\u0639\u062a\u064a\u0628\u064a','\u0641\u0647\u062f \u0627\u0644\u062f\u0648\u0633\u0631\u064a','\u0645\u0627\u062c\u062f \u0627\u0644\u063a\u0627\u0645\u062f\u064a','\u0623\u062d\u0645\u062f \u0627\u0644\u0634\u0647\u0631\u064a','\u0639\u0628\u062f\u0627\u0644\u0644\u0647 \u0627\u0644\u0645\u0627\u0644\u0643\u064a','\u0646\u0627\u0635\u0631 \u0627\u0644\u0642\u062d\u0637\u0627\u0646\u064a','\u0647\u0646\u062f \u0627\u0644\u062d\u0631\u0628\u064a','\u0645\u0646\u0649 \u0627\u0644\u0632\u0647\u0631\u0627\u0646\u064a'
  ],
  emails:[
    'nora@gmail.com','sarah@gmail.com','reem@hotmail.com','layan@outlook.com','player@example.sa'
  ],
  clubEmails:[
    'info@club.sa','admin@club.sa','contact@club.sa','media@club.sa','support@club.sa'
  ],
  phones:[
    '+966 50 123 4567','+966 53 234 5678','+966 54 345 6789','+966 55 456 7890','+966 56 567 8901','05 1234 5678'
  ],
  ages:['12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
};

function initSaudiAutocomplete(){
  var path=location.pathname||'';
  var configs={
    'ms-em':{ac:'email',list:'emails'},
    em:{ac:'email',list:'emails'},
    email:{ac:'email',list:'emails'},
    remail:{ac:'email',list:'emails'},
    cemail:{ac:'email',list:'clubEmails'},
    rname:{ac:'name',list:'names'},
    name:{ac:'name',list:'names'},
    mname:{ac:'name',list:'managerNames'},
    cname:{ac:'organization',list:'clubs'},
    rcity:{ac:'address-level2',list:'cities'},
    ccity:{ac:'address-level2',list:'cities'},
    rphone:{ac:'tel',list:'phones',mode:'tel'},
    cphone:{ac:'tel',list:'phones',mode:'tel'},
    rage:{ac:'on',list:'ages',mode:'numeric'},
    srch:{ac:'on',list:'clubs'},
    'national-id':{ac:'on',mode:'numeric',name:'national-id'},
    pw:{ac:/create-security\.html$/.test(path)?'new-password':'current-password'},
    'ms-pw':{ac:'current-password'},
    rpw:{ac:'new-password'},
    rconf:{ac:'new-password'},
    pwc:{ac:'new-password'}
  };
  Object.keys(configs).forEach(function(id){
    var inp=document.getElementById(id);
    if(!inp)return;
    var cfg=configs[id];
    inp.setAttribute('autocomplete',cfg.ac);
    if(!inp.getAttribute('name'))inp.setAttribute('name',cfg.name||id);
    if(cfg.mode)inp.setAttribute('inputmode',cfg.mode);
    if(cfg.list&&SA_DATA[cfg.list]){
      inp.setAttribute('list',ensureSaudiList(cfg.list,SA_DATA[cfg.list]));
    }
  });
}

function ensureSaudiList(key,values){
  var id='sa-list-'+key;
  var list=document.getElementById(id);
  if(list)return id;
  list=document.createElement('datalist');
  list.id=id;
  values.forEach(function(value){
    var opt=document.createElement('option');
    opt.value=value;
    list.appendChild(opt);
  });
  document.body.appendChild(list);
  return id;
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initSaudiAutocomplete);
}else{
  initSaudiAutocomplete();
}

/* CUSTOM SELECT */
function initSel(btnId,menuId,hidId,cb){
  var btn=document.getElementById(btnId);
  var menu=document.getElementById(menuId);
  var hid=hidId?document.getElementById(hidId):null;
  if(!btn||!menu)return;
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var was=btn.classList.contains('open');
    closeAllSel();
    if(!was){btn.classList.add('open');menu.style.display='block';}
  });
  var opts=menu.querySelectorAll('.sel-option');
  opts.forEach(function(opt){
    opt.addEventListener('click',function(e){
      e.stopPropagation();
      var v=opt.dataset.v, lbl=opt.textContent.trim();
      var txt=btn.querySelector('.sel-text');
      if(txt)txt.textContent=lbl;
      btn.classList.add('has-val');
      opts.forEach(function(o){o.classList.remove('picked');});
      opt.classList.add('picked');
      btn.classList.remove('open');menu.style.display='none';
      if(hid)hid.value=v;
      if(cb)cb(v,lbl);
    });
  });
  document.addEventListener('click',function(){closeAllSel();});
}
function closeAllSel(){
  document.querySelectorAll('.sel-btn.open').forEach(function(b){b.classList.remove('open');});
  document.querySelectorAll('.sel-dropdown').forEach(function(m){m.style.display='none';});
}

/* UPLOAD ZONE */
function initUpload(zoneId,inputId){
  var zone=document.getElementById(zoneId);
  var inp=document.getElementById(inputId);
  if(!zone)return;
  zone.addEventListener('click',function(){if(inp)inp.click();});
  zone.addEventListener('dragover',function(e){
    e.preventDefault();zone.style.borderColor='#8B5CF6';zone.style.background='#F5F0FF';
  });
  zone.addEventListener('dragleave',function(){zone.style.borderColor='';zone.style.background='';});
  zone.addEventListener('drop',function(e){
    e.preventDefault();zone.style.borderColor='';zone.style.background='';
    if(e.dataTransfer.files[0])_setFile(zone,e.dataTransfer.files[0]);
  });
  if(inp)inp.addEventListener('change',function(){
    if(inp.files&&inp.files[0])_setFile(zone,inp.files[0]);
  });
}
function _setFile(zone,f){
  if(f.size>100*1024*1024){toast('الحجم يتجاوز 100MB','e');return;}
  var el=zone.querySelector('.upload-main');if(el)el.textContent=f.name;
  zone.style.borderColor='#10B981';zone.style.background='rgba(16,185,129,.04)';
}

/* PASSWORD STRENGTH */
function chkPass(val,barId,hintId){
  var bar=document.getElementById(barId);
  var hint=document.getElementById(hintId);
  if(!bar)return;
  var fill=bar.querySelector('.s-fill');
  var s=0;
  if(val.length>=8)s++;
  if(/[A-Z]/.test(val))s++;
  if(/[0-9]/.test(val))s++;
  if(/[^A-Za-z0-9]/.test(val))s++;
  var lvls=[
    {w:'20%',c:'#EF4444',t:'ضعيفة'},
    {w:'50%',c:'#F59E0B',t:'متوسطة'},
    {w:'75%',c:'#06B6D4',t:'جيدة'},
    {w:'100%',c:'#10B981',t:'قوية ✓'}
  ];
  var lvl=lvls[Math.max(s-1,0)];
  if(fill){fill.style.width=val?lvl.w:'0';fill.style.background=lvl.c;}
  if(hint)hint.textContent=val?'قوة كلمة المرور: '+lvl.t:'يجب أن تحتوي على 8 أحرف على الأقل';
}

/* URL PARAM */
function gp(k){return new URLSearchParams(window.location.search).get(k);}
