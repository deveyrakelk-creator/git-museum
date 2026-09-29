(function(){
'use strict';
const $ = id => document.getElementById('guide-'+id);
const state = {user:null, csrf:'', plan:null, routes:[], device:null, config:null, polling:false,epoch:0,recovering:false,narration:null};
const labels = {moving:'模拟行驶中', explaining:'模拟到站讲解', completed:'模拟导览完成', stopped:'模拟已停止', failed:'模拟连接异常', interrupted:'模拟任务已中断'};
const styles = {brief:'简短讲解',detailed:'详细讲解',youth:'青少年视角'};
function tell(message, error=false){ $('notice').textContent=message; $('notice').classList.toggle('error',error); $('notice').hidden=false; }
function element(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
async function api(path,method='GET',body){
  const epoch = state.epoch;
  try {
    const result = await window.guideCloudApi(path,method,body);
    if(!path.startsWith('/api/auth/') && epoch !== state.epoch) throw new Error('账号状态已变化，请重试。');
    return result;
  }
  catch(e){ if(e.status===401&&!path.startsWith('/api/auth/'))resetUser();throw e; }
}

function needUser(){if(state.user)return true;tell('请先注册或登录，参观方案将保存在你的账号中。',true);$('auth').scrollIntoView({behavior:'smooth'});return false;}
async function busy(button,action){if(button)button.disabled=true;try{await action();}catch(e){tell(e.message,true);}finally{if(button)button.disabled=false;if(button&&['guide-start','guide-stop','guide-release'].includes(button.id))renderDevice();}}
function resetUser(){state.epoch++;state.recovering=false;$('password-tools').hidden=false;$('password-form').hidden=true;state.user=null;state.csrf='';state.routes=[];state.device=null;state.plan=null;state.narration=null;stopSpeech();$('ai').hidden=true;$('auth').hidden=false;$('logout').hidden=true;$('username').textContent='访客';$('plan-result').hidden=true;renderRoutes();renderDevice();}
function setUser(user){state.epoch++;$('password-tools').hidden=!state.recovering;state.user=user.username;state.csrf=user.csrf;$('auth').hidden=true;$('logout').hidden=false;$('username').textContent=user.username;}
function pathText(stops){return stops.map(s=>state.config.stations[s].name).join(' → ');}
function planContent(plan){const fragment=document.createDocumentFragment();fragment.append(element('h3',plan.title),element('p',pathText(plan.stops),'route-path'),element('p',plan.reason),element('p',styles[plan.explanation_style]+' · 仅模拟执行','muted'));return fragment;}

let speechRun=0;
function stopSpeech(){speechRun++;if('speechSynthesis' in window)window.speechSynthesis.cancel();}
function narrationVoice(){
  const voices=window.speechSynthesis.getVoices().filter(v=>/^zh/i.test(v.lang));
  const score=voice=>{const name=voice.name.toLowerCase();return (name.includes('xiaoxiao')?100:0)+(name.includes('xiaoyi')?90:0)+(name.includes('yunxi')?80:0)+(name.includes('natural')?40:0)+(name.includes('online')?20:0)+(voice.localService?5:0);};
  return voices.sort((a,b)=>score(b)-score(a))[0];
}
function speak(text){
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window))throw new Error('当前浏览器不支持语音朗读');
  stopSpeech();const run=speechRun;const sentences=(String(text).match(/[^。！？；…]+[。！？；…]?/g)||[String(text)]).map(s=>s.trim()).filter(Boolean);let index=0;
  const playNext=()=>{if(run!==speechRun||index>=sentences.length)return;const sentence=sentences[index++];const utterance=new SpeechSynthesisUtterance(sentence);utterance.lang='zh-CN';utterance.voice=narrationVoice()||null;utterance.volume=1;utterance.rate=sentence.endsWith('？')?0.9:0.88;utterance.pitch=sentence.endsWith('？')?1.08:1.02;
    utterance.onend=()=>{const pause=/[！？]$/.test(sentence)?260:/[。…]$/.test(sentence)?190:120;setTimeout(playNext,pause);};utterance.onerror=event=>{if(event.error!=='canceled')tell('语音朗读被浏览器中断，请重试。',true);};window.speechSynthesis.speak(utterance);};
  playNext();
}
function renderNarration(){
  const panel=$('ai');const narration=state.narration;
  if(!narration){panel.hidden=true;return;}
  panel.hidden=false;$('ai-title').textContent=narration.title||'AI 个性化讲解';
  $('ai-status').textContent=(narration.cached?'已读取缓存 · ':'刚刚生成 · ')+(narration.model||'deepseek-flash');
  const list=$('ai-segments');list.replaceChildren();
  for(const segment of narration.segments||[]){
    const card=element('article',undefined,'ai-segment');
    const heading=element('div',undefined,'ai-segment-head');
    heading.append(element('span',segment.station+' · '+(state.config.stations[segment.station]?.name||'展点'),'tag'),element('h3',segment.title));
    const play=element('button','朗读此段','secondary');play.type='button';play.addEventListener('click',()=>{try{speak(segment.script+(segment.question?' '+segment.question:''));}catch(e){tell(e.message,true);}});
    card.append(heading,element('p',segment.script));if(segment.question)card.append(element('p','互动思考：'+segment.question,'ai-question'));card.append(play);list.append(card);
  }
}
async function generateNarration(route){
  tell('DeepSeek 正在为收藏路线生成讲解，请稍候……');
  const data=await api('/api/ai/narration','POST',{route_id:route.id});
  state.narration={...data.narration,cached:Boolean(data.cached)};renderNarration();$('ai').scrollIntoView({behavior:'smooth',block:'start'});
  tell(data.cached?'已读取这条路线的 AI 讲解缓存。':'AI 个性讲解已生成并保存。');
}

function renderRoutes(){
  const list=$('routes');list.replaceChildren();$('route-count').textContent=state.routes.length+' 条路线';
  const selected=$('selected-route').value;$('selected-route').replaceChildren(element('option',state.routes.length?'选择一条收藏路线':'请先收藏路线'));$('selected-route').firstChild.value='';
  if(!state.routes.length)list.append(element('div',state.user?'还没有收藏。先聊聊你的兴趣，生成第一条路线。':'登录后，在这里查看自己的收藏路线。','empty'));
  for(const route of state.routes){
    const card=element('article',undefined,'route-card');card.append(planContent(route.plan));
    const actions=element('div',undefined,'actions');const use=element('button','用于现场导览');const ai=element('button','生成 AI 讲解','secondary');const remove=element('button','删除','quiet');
    use.addEventListener('click',()=>{$('selected-route').value=route.id;$('journey').scrollIntoView({behavior:'smooth'});tell('已选择收藏路线。领取模拟小车使用权后即可开始。');});
    ai.addEventListener('click',()=>busy(ai,()=>generateNarration(route)));remove.addEventListener('click',()=>busy(remove,async()=>{await api('/api/routes/'+route.id,'DELETE',{});if(state.narration?.route_id===route.id){state.narration=null;renderNarration();}await refreshRoutes();tell('收藏已删除。');}));actions.append(use,ai,remove);card.append(actions);list.append(card);
    const option=element('option',route.plan.title);option.value=route.id;$('selected-route').append(option);
  }
  if(state.routes.some(r=>r.id===selected))$('selected-route').value=selected;else if(state.routes.length)$('selected-route').value=state.routes[0].id;
}
async function refreshRoutes(){const data=await api('/api/routes');state.routes=data.routes;renderRoutes();}
function renderDevice(){
  const d=state.device,task=d?.task,active=task&&['moving','explaining'].includes(task.status);
  $('device-state').textContent=!d?'登录后查看状态':!d.online?'模拟设备离线':d.mine?'在线 · 你正在使用':d.occupied?'在线 · 其他用户正在使用':'在线 · 可领取使用权';
  $('lease').textContent=d?.mine?'使用权有效至 '+new Date(d.expires*1000).toLocaleTimeString():'一次领取可体验 20 分钟，同一时刻只允许一位使用者。';
  $('start').disabled=!d?.mine||!d.online||Boolean(active);$('stop').disabled=!active;$('release').disabled=!d?.mine||Boolean(active);
  $('task-status').textContent=task?labels[task.status]||task.status:'尚未开始';$('task-title').textContent=task?task.plan.title:'从收藏中选择路线，即可体验完整流程。';
  $('progress-stops').replaceChildren();$('events').replaceChildren();
  if(!task){$('events').append(element('li','这里将显示模拟出发、到站、讲解和完成事件。'));return;}
  task.plan.stops.forEach((s,i)=>{const done=task.status==='completed'||i<task.step;const current=i===task.step&&active;$('progress-stops').append(element('div',s+' · '+state.config.stations[s].name,'progress-stop'+(done?' done':current?' current':'')));});
  for(const event of [...task.events].reverse()){const li=element('li');li.append(element('time',new Date(event.time*1000).toLocaleTimeString()),document.createTextNode(event.message));$('events').append(li);}
}
async function refreshDevice(){if(!state.user)return;state.device=await api('/api/device');renderDevice();}
$('auth-form').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.target);const intent=event.submitter?.value||'login';busy(event.submitter,async()=>{const user=await api('/api/auth/'+intent,'POST',{username:form.get('username'),password:form.get('password'),nickname:form.get('nickname')});event.target.reset();if(user.confirmationRequired){tell(user.message);return;}setUser(user);await refreshRoutes();await refreshDevice();tell('欢迎，'+user.username+'。现在可以开始规划参观。');});});
$('logout').addEventListener('click',()=>busy($('logout'),async()=>{await api('/api/auth/logout','POST',{});resetUser();tell('已退出，收藏仍保存在原账号中。');}));
document.querySelectorAll('#guide-center [data-interest]').forEach(b=>b.addEventListener('click',()=>{$('interest').value=b.dataset.interest;$('interest').focus();}));
$('plan-form').addEventListener('submit',event=>{event.preventDefault();if(!needUser())return;busy($('generate'),async()=>{const data=await api('/api/plans','POST',{interest:$('interest').value,explanation_style:$('style').value});state.plan=data.plan;$('plan-content').replaceChildren(planContent(data.plan));$('plan-result').hidden=false;tell(data.message);});});
$('save-plan').addEventListener('click',()=>busy($('save-plan'),async()=>{if(!needUser()||!state.plan)return;const data=await api('/api/routes','POST',{plan:state.plan});await refreshRoutes();$('selected-route').value=data.id;tell('已收藏。重新登录后仍可使用这条路线。');}));
$('claim-form').addEventListener('submit',event=>{event.preventDefault();if(!needUser())return;busy(event.submitter,async()=>{await api('/api/devices/claim','POST',{code:$('code').value});await refreshDevice();tell('已领取模拟小车使用权，可以开始导览。');});});
$('release').addEventListener('click',()=>busy($('release'),async()=>{await api('/api/devices/release','POST',{});await refreshDevice();tell('已释放使用权。');}));
$('start').addEventListener('click',()=>busy($('start'),async()=>{if(!needUser())return;const route=$('selected-route').value;if(!route)throw new Error('请先选择一条收藏路线');await api('/api/tasks','POST',{route_id:route,request_id:crypto.randomUUID()});await refreshDevice();tell('模拟导览已开始。未连接或控制真实小车。');}));
$('stop').addEventListener('click',()=>busy($('stop'),async()=>{if(!state.device?.task)return;await api('/api/tasks/'+state.device.task.id+'/stop','POST',{});await refreshDevice();tell('模拟设备已确认停止。');}));
for(const [id,online] of [['disconnect',false],['reconnect',true]])$(id).addEventListener('click',()=>busy($(id),async()=>{if(!needUser())return;await api('/api/simulator/connection','POST',{online});await refreshDevice();tell(online?'模拟连接已恢复，旧任务不会自动重启。':'已模拟断线。');}));
async function boot(){try{state.config=await api('/api/config');const model=state.config.planner_mode==='model'?'模型接口模式':'规则演示 · 非 AI';$('model-mode').textContent=model;$('planner-badge').textContent=model;$('experience-code').textContent=state.config.experience_code;const link=state.config.school_agent_url;if(link&&/^https:\/\//i.test(link)){$('school-link').href=link;$('school-link').hidden=false;}try{setUser(await api('/api/me'));await refreshRoutes();await refreshDevice();}catch(e){resetUser();if(e.status!==401)throw e;}}catch(e){tell(e.message,true);}}
setInterval(async()=>{if(!state.user||state.polling||document.hidden)return;state.polling=true;try{await refreshDevice();}catch(e){tell('无法获取最新设备状态：'+e.message,true);$('device-state').textContent='状态未知 · 无法连接服务';$('start').disabled=true;}finally{state.polling=false;}},5000);
window.addEventListener('museum-interest',event=>{
  $('interest').value='我对博物馆中的'+event.detail.title+'感兴趣，希望了解文博主题。';
  document.getElementById('guide-center').scrollIntoView({behavior:'smooth'});
  tell('已带入展品兴趣。生成参观方案并点击收藏后，会保存到你的账号。');
});

window.addEventListener('guide-auth-change',event=>{
  if(event.detail==='SIGNED_OUT')resetUser();
  if(event.detail==='PASSWORD_RECOVERY'){
    state.recovering=true;
    $('password-tools').hidden=false;
    $('password-form').hidden=false;
    $('password-tools').scrollIntoView({behavior:'smooth'});
    tell('邮箱验证成功，请在下方设置新密码。');
  }
});
$('recover-form').addEventListener('submit',event=>{
  event.preventDefault();busy(event.submitter,async()=>{
    await api('/api/auth/recover','POST',{email:new FormData(event.target).get('email')});
    tell('如果该邮箱已注册，将收到密码重置邮件。请检查收件箱。');
  });
});
$('password-form').addEventListener('submit',event=>{
  event.preventDefault();busy(event.submitter,async()=>{
    await api('/api/auth/password','POST',{password:new FormData(event.target).get('password')});
    event.target.reset();event.target.hidden=true;state.recovering=false;$('password-tools').hidden=true;tell('密码已更新。');
  });
});
$('ai-play-all').addEventListener('click',()=>{try{if(!state.narration)throw new Error('请先生成 AI 讲解');speak(state.narration.segments.map(s=>s.script+(s.question?' '+s.question:'')).join(' '));}catch(e){tell(e.message,true);}});
$('ai-stop').addEventListener('click',stopSpeech);
boot();

})();
