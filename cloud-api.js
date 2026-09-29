(function () {
  'use strict';
  const config = window.GUIDE_CLOUD_CONFIG;
  let client;
  function getClient() {
    if (!window.supabase) throw new Error('账号组件加载失败，请刷新页面。');
    if (!client) {
      client = window.supabase.createClient(config.url, config.publishableKey, {
        auth: {persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, storageKey:'shanda-guide-cloud-session'}
      });
      // 在回调外处理界面，避免在 SDK 认证锁内再次调用认证接口。
      client.auth.onAuthStateChange((event) => {
        setTimeout(() => window.dispatchEvent(new CustomEvent('guide-auth-change', {detail:event})), 0);
      });
    }
    return client;
  }
  function fail(error) {
    if (!error) return;
    const messages = {
      invalid_credentials:'邮箱或密码不正确。', email_not_confirmed:'请先通过邮件验证邮箱，再登录。',
      over_email_send_rate_limit:'验证邮件发送次数已达限制，请稍后再试。',
      email_address_not_authorized:'当前邮件服务尚未对这个邮箱开放，请联系团队配置邮件发送服务。',
      user_already_exists:'该邮箱已注册，请直接登录。', weak_password:'密码强度不足，请使用更长的密码。'
    };
    let message = messages[error.code] || error.message || '请求失败，请稍后重试。';
    if (error.code === 'PGRST202') message = '云端数据库尚未初始化，请先在 Supabase 执行 001_init.sql。';
    if (/Failed to fetch|NetworkError|fetch failed/i.test(message)) message = '暂时无法连接云端服务，请检查网络后重试。';
    const e = new Error(message); e.status = error.status; throw e;
  }
  function userInfo(user) {
    if (!user) { const e = new Error('请先登录'); e.status=401; throw e; }
    return {id:user.id,username:user.user_metadata?.nickname || user.email,csrf:''};
  }
  async function rpc(action,payload={}) {
    const {data,error} = await getClient().rpc('guide_api',{action,payload}); fail(error); return data;
  }
  window.guideCloudApi = async function(path,method='GET',body={}) {
    if(path==='/api/config') return {
      planner_mode:'rules',experience_code:'GUIDE2026',school_agent_url:config.schoolAgentUrl,
      stations:{A:{name:'校史展点'},B:{name:'校友展点'},C:{name:'博物馆展点'}}
    };
    if(path==='/api/me') {
      const {data:{session},error:sessionError}=await getClient().auth.getSession(); fail(sessionError);
      if(!session) return userInfo(null);
      const {data,error}=await getClient().auth.getUser(); fail(error); return userInfo(data.user);
    }
    if(path==='/api/auth/register') {
      const {data,error}=await getClient().auth.signUp({email:body.username.trim(),password:body.password,
        options:{data:{nickname:(body.nickname||'').trim()},emailRedirectTo:location.origin+location.pathname}});
      fail(error);
      if(!data.session) return {confirmationRequired:true,message:'请检查邮箱中的验证邮件，完成验证后再登录。若已有账号，请直接登录。'};
      return userInfo(data.user);
    }
    if(path==='/api/auth/login') {
      const {data,error}=await getClient().auth.signInWithPassword({email:body.username.trim(),password:body.password});
      fail(error); return userInfo(data.user);
    }
    if(path==='/api/auth/logout') {
      const {error}=await getClient().auth.signOut({scope:'local'}); fail(error); return {ok:true};
    }
    if(path==='/api/auth/recover') {
      const {error}=await getClient().auth.resetPasswordForEmail(body.email,{redirectTo:location.origin+location.pathname});
      fail(error); return {ok:true};
    }
    if(path==='/api/auth/password') {
      const {error}=await getClient().auth.updateUser({password:body.password}); fail(error); return {ok:true};
    }
    if(path==='/api/routes') return rpc(method==='GET'?'routes':'save_route',body);
    if(path.startsWith('/api/routes/')&&method==='DELETE') return rpc('delete_route',{id:path.split('/').pop()});
    if(path==='/api/plans') return rpc('plan',body);
    if(path==='/api/ai/narration') {
      const {data,error}=await getClient().functions.invoke('ai-guide',{body:{route_id:body.route_id}});
      if(error) {
        let message='AI 讲解服务暂时不可用，请稍后重试。';
        try { const detail=await error.context?.json(); if(detail?.error)message=detail.error; } catch(_) {}
        const e=new Error(message);e.status=error.context?.status;throw e;
      }
      if(data?.error)throw new Error(data.error);
      return data;
    }
    if(path==='/api/device') return rpc('device');
    if(path==='/api/devices/claim') return rpc('claim',body);
    if(path==='/api/devices/release') return rpc('release');
    if(path==='/api/tasks') return rpc('start',body);
    if(/^\/api\/tasks\/[^/]+\/stop$/.test(path)) return rpc('stop',{id:path.split('/')[3]});
    if(path==='/api/simulator/connection') return rpc('connection',body);
    throw new Error('不支持的请求');
  };
})();
