/* English Quest v12 - optional Speaking/Writing studio.
   This file is independent of the existing TOEIC practice engine and score storage.
   No paid API is called: guided content is local; WebLLM runs in-browser; PC mode uses
   a user-owned Tailscale endpoint. Audio is only uploaded when PC mode is selected. */
(function(){
'use strict';
const KEY='english-quest-studio-v1';
const TOPICS=[
 {id:'travel',title:'Travel plans',level:'A2',opening:'If you could travel anywhere next month, where would you go and why?',follow:['What would you do on your first day there?','Would you rather travel alone or with friends? Why?','What food would you like to try?','How would you prepare for your trip?','What is one problem you might face there?','How could you solve that problem?','What would you tell a friend about the trip?','What did you learn from discussing this topic?']},
 {id:'robot',title:'Robots in daily life',level:'B1',opening:'How could robots make our everyday lives easier?',follow:['What kind of robot would you like to build?','Which tasks should always remain under human control?','How could robots help older people?','What problems could robots create?','How would you make a robot safe?','Which robot would you buy if it were affordable?','How might robotics change in ten years?','What is your main opinion on this topic?']},
 {id:'food',title:'Food and cooking',level:'A2',opening:'What food do you enjoy eating, and what makes it special?',follow:['Can you describe how to cook it?','Do you usually cook or eat out? Why?','What is a food you did not like at first?','How would you introduce Japanese food to a visitor?','What would you prepare for a small party?','Do you think healthy food is expensive?','What is one food habit you want to change?','What would you recommend to a friend?']},
 {id:'work',title:'Future career',level:'B1',opening:'What kind of job would you like to have in the future?',follow:['What interests you about that career?','What skills would you need to develop?','Would you prefer to work alone or in a team?','What would make a workplace enjoyable?','How would you handle an unexpected problem at work?','Would you consider working abroad?','What advice would you give to a new employee?','What could you do this month to prepare?']},
 {id:'study',title:'Effective studying',level:'B1',opening:'What study method works best for you, and why?',follow:['How do you stay focused when you feel tired?','Do you prefer studying in the morning or at night?','How do you remember new English vocabulary?','What distracts you most often?','How do you review something difficult?','Should students use AI for learning?','What would you change about your study routine?','What is one small goal for tomorrow?']},
 {id:'technology',title:'AI and technology',level:'B2',opening:'Do you think AI will make our lives better overall? Explain your view.',follow:['Which area will benefit the most?','What risks should people consider?','How could AI be used in schools?','Should AI-generated content always be labeled?','Can AI and humans collaborate effectively?','What task would you never delegate to AI?','How would you regulate powerful AI systems?','Has this discussion changed your opinion?']},
 {id:'city',title:'Life in a city',level:'A2',opening:'Would you rather live in a big city or a small town?',follow:['What do you like about your neighborhood?','What is one thing you would improve there?','How do you usually travel around the city?','What makes a city comfortable?','Do cities need more parks? Why?','What is the biggest problem with public transport?','Where would you take a first-time visitor?','Where would you like to live in ten years?']},
 {id:'shopping',title:'Shopping habits',level:'A2',opening:'Do you prefer shopping online or in a store? Why?',follow:['What is the last thing you bought?','How do you compare two products?','Have you ever regretted buying something?','Do customer reviews influence your decisions?','Would you pay more for environmentally friendly products?','How do you save money when shopping?','What gift would you choose for a close friend?','What is the most important thing to check before buying?']},
 {id:'environment',title:'Protecting the environment',level:'B1',opening:'What is one practical way people can protect the environment?',follow:['Is it easy to reduce waste in daily life?','How do you think cities could use less energy?','Should public transportation be cheaper?','What could schools teach about recycling?','What is one environmental problem near you?','How could technology help solve it?','What should companies do differently?','What action could you take this week?']},
 {id:'hobby',title:'Hobbies and free time',level:'A2',opening:'What do you like doing in your free time?',follow:['How did you become interested in that hobby?','Would you recommend it to someone else?','Do you prefer indoor or outdoor activities?','What hobby would you like to try next?','How much time do you spend on hobbies?','Can hobbies help people make friends?','What is the best memory from your hobby?','What would you do with one extra free day?']},
 {id:'health',title:'Healthy routines',level:'B1',opening:'What habits help you stay healthy?',follow:['How do you manage stress after a busy day?','What is your ideal sleep schedule?','Would you rather exercise alone or with friends?','Is it difficult to eat healthy food?','Should workplaces encourage exercise?','How can smartphones affect our health?','What health habit would you like to improve?','How would you start tomorrow?']},
 {id:'books',title:'Books and movies',level:'A2',opening:'Tell me about a book or movie you enjoyed recently.',follow:['Who is your favorite character, and why?','What is the most memorable scene?','Would you recommend it to a friend?','Do you prefer reading books or watching movies?','What would you change about the ending?','How can stories help us learn English?','What kind of story would you like to write?','What will you read or watch next?']},
 {id:'education',title:'University education',level:'B2',opening:'What should universities teach students besides academic knowledge?',follow:['Are group projects useful for learning?','How could practical experience improve classes?','Should attendance affect grades?','What role should online classes play?','How can teachers encourage curiosity?','Should all students learn programming?','What would you change about university exams?','What is the most important skill after graduation?']},
 {id:'language',title:'Learning languages',level:'A2',opening:'Why do you want to become more confident speaking English?',follow:['Which part of English is hardest for you?','How often do you use English outside class?','What makes a good conversation partner?','Do you prefer listening or reading practice?','How do you feel when you make a mistake?','Which English expressions do you use often?','What could make language practice more fun?','What speaking goal would you set for next month?']},
 {id:'team',title:'Teamwork',level:'B1',opening:'What makes someone a good teammate?',follow:['How do you deal with different opinions?','Can a team work well without a leader?','What should people do when a deadline is close?','Have you learned something from a group project?','How do you help a teammate who is struggling?','Is online teamwork harder than in-person teamwork?','How can a team celebrate success?','What would you improve about your teamwork skills?']},
 {id:'future',title:'Life in 2040',level:'B2',opening:'What changes do you expect in everyday life by 2040?',follow:['Will people work from home more often?','How might transportation change?','Could robots become common in hospitals?','What changes could happen in education?','Will cities use more renewable energy?','Which predictions seem unrealistic to you?','What worries you about the future?','What are you most excited about?']},
 {id:'problem',title:'Solving problems',level:'B1',opening:'When you face a difficult problem, what do you usually do first?',follow:['Do you ask other people for advice?','How do you decide between two solutions?','What can you learn from a failed attempt?','Is it important to solve problems quickly?','How does stress affect your decisions?','Can technology help you think more clearly?','What advice would you give to someone who feels stuck?','What did you learn about your problem-solving style?']},
 {id:'interview',title:'Job interview',level:'B1',opening:'Imagine you are in a job interview. Could you introduce yourself briefly?',follow:['Why are you interested in this position?','What is one of your strengths?','Tell me about a challenging project.','How do you organize your work?','How do you respond to feedback?','What would you like to learn in this role?','Why should the company hire you?','Do you have any questions for the interviewer?']},
 {id:'restaurant',title:'At a restaurant',level:'A2',opening:'You are at a restaurant. What would you like to order?',follow:['Would you like something to drink?','Do you have any questions about the menu?','Would you like an appetizer?','How spicy would you like the dish?','Would you like to share a dessert?','Was everything satisfactory?','How would you ask for the bill politely?','Would you recommend this restaurant to a friend?']},
 {id:'office',title:'Office communication',level:'B1',opening:'You need to reschedule a team meeting. How would you explain the situation?',follow:['What time would be convenient for everyone?','How would you apologize for the change?','What information should the invitation include?','What would you do if someone could not attend?','How could the meeting be more efficient?','How would you summarize the main decisions?','What should the team do before the next meeting?','What did you learn about professional communication?']}
];
const defaultData=()=>({version:1,topicsSeen:[],sessions:{speaking:null,writing:null},archives:{speaking:[],writing:[]},settings:{engine:'auto',serverUrl:'',autoSpeak:true},totalTurns:{speaking:0,writing:0}});
function load(){try{const data=JSON.parse(localStorage.getItem(KEY));if(!data||data.version!==1)return defaultData();const d=defaultData();return {...d,...data,sessions:{...d.sessions,...data.sessions},archives:{...d.archives,...data.archives},settings:{...d.settings,...data.settings}};}catch(e){return defaultData();}}
let data=load(),token='';try{token=sessionStorage.getItem('eq-pc-token')||'';}catch(e){}
let api=null,activeMode=null,working=false,engine=null,recorder=null,recStream=null,recChunks=[],audioBlob=null,audioUrl='',deviceStatus='',lastStatus='', lastEngine='guided';
const el=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){lastStatus='保存容量の上限に達した可能性があります。履歴をエクスポートしてください。';}}
function randomIndex(max){if(!max)return 0;const buf=new Uint32Array(1);if(globalThis.crypto?.getRandomValues){crypto.getRandomValues(buf);return Math.floor(buf[0]/4294967296*max)}return Math.floor(Math.random()*max)}
function topicFor(s){return TOPICS.find(t=>t.id===s?.topicId)||TOPICS[0]}
function now(){return new Date().toLocaleString('ja-JP')}
function pickTopic(){
 let available=TOPICS.filter(x=>!data.topicsSeen.includes(x.id));
 if(!available.length){data.topicsSeen=[];available=TOPICS;}
 const topic=available[randomIndex(available.length)];data.topicsSeen.push(topic.id);return topic;
}
function begin(mode){
 const previous=data.sessions[mode];if(previous?.turns){data.archives=data.archives||{speaking:[],writing:[]};data.archives[mode]=[...(data.archives[mode]||[]),previous].slice(-30);}
 const topic=pickTopic();
 data.sessions[mode]={topicId:topic.id,started:now(),turns:0,followupIndex:0,messages:[{role:'assistant',text:topic.opening,engine:'guided'}]};
 lastStatus='新しいトピックを開始しました。';save();refresh();
 if(mode==='speaking'&&data.settings.autoSpeak)say(topic.opening);
}
function ensure(mode){if(!data.sessions[mode])begin(mode);return data.sessions[mode]}
function stopSpeech(){try{speechSynthesis.cancel()}catch(e){}}
function say(text){
 if(!('speechSynthesis'in window))return status('このブラウザでは音声読み上げが使えません。');
 stopSpeech();const utter=new SpeechSynthesisUtterance(String(text).slice(0,800));utter.lang='en-US';utter.rate=.92;
 const voices=speechSynthesis.getVoices();const choice=voices.find(v=>v.lang.toLowerCase().startsWith('en')&&/enhanced|premium|samantha/i.test(v.name))||voices.find(v=>v.lang.toLowerCase().startsWith('en'));
 if(choice)utter.voice=choice;try{speechSynthesis.speak(utter)}catch(e){status('音声の再生に失敗しました。')}
}
function status(message){lastStatus=message;const node=el('studioStatus');if(node)node.textContent=message;}
function feedback(text,mode){
 const a=[];const x=text.trim();if(/\bi\b/.test(x))a.push('代名詞 I は常に大文字にしましょう。');
 if(x.length>15&&!/[.!?]$/.test(x))a.push('文末にピリオドや疑問符を付けると読みやすくなります。');
 if(mode==='writing'&&x.split(/\s+/).length<8)a.push('理由や具体例を1文追加してみましょう。');
 return a.length?a.join(' '):'自動チェックで明らかな表記上の問題は見つかりませんでした（文法全体の判定ではありません）。';
}
function guidedAnswer(s,mode){
 const topic=topicFor(s),idx=s.followupIndex++;
 if(idx<topic.follow.length)return {reply:'Thank you for sharing your thoughts. '+topic.follow[idx],feedback_ja:''};
 return {reply:'We have finished the questions for this topic. Please choose “新しいトピック” to keep practicing.',feedback_ja:''};
}
function normalizedEndpoint(){
 const raw=(data.settings.serverUrl||'').trim();if(!raw)throw Error('PC接続先URLを設定してください。');
 const url=new URL(raw);
 const validHttps=url.protocol==='https:';
 const localHttp=url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname);
 if(!validHttps&&!localHttp)throw Error('PC接続先にはHTTPSのTailscale Serve URLを設定してください。');
 if(url.username||url.password||url.search||url.hash)throw Error('URLに認証情報やパラメータを含めないでください。');
 return url.origin;
}
async function requestPC(path,options={}){
 if(!token)throw Error('PC連携トークンがありません。接続設定を開いて入力してください。');
 const signal=AbortSignal.timeout?.(90000);
 let response;
 try{response=await fetch(normalizedEndpoint()+path,{...options,headers:{...options.headers,Authorization:'Bearer '+token},signal});}
 catch(e){throw Error('PCに接続できません（PC・Tailscale・URL・CORS設定を確認）。');}
 if(!response.ok)throw Error('PC応答エラー '+response.status+'：'+(await response.text()).slice(0,120));
 return response.json();
}
async function checkPC(){
 try{const r=await requestPC('/health');status('PC接続成功：'+(r.model||'AIサーバー')+' を利用できます。');return true;}
 catch(e){status(e.message);return false;}
}
function systemPrompt(mode,topic){
 return 'You are an encouraging English conversation partner for a Japanese learner. Topic: '+topic.title+
 '. Stay on topic but adapt naturally to the student. Reply in natural conversational English, in 1-3 short sentences, ending with exactly one relevant follow-up question. '+(mode==='writing'?'Help the student practice writing in 2-4 sentences.':'Help the student practice spoken English.')+
 ' Do not claim to know the user. Avoid repeating earlier questions. Do not quote copyrighted texts.';
}
function conversationFor(s,mode){
 const topic=topicFor(s);
 return [{role:'system',content:systemPrompt(mode,topic)},...s.messages.slice(-12).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}))];
}
async function pcAnswer(s,mode){
 const result=await requestPC('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,topic:topicFor(s).title,messages:conversationFor(s,mode)})});
 if(!result.reply||typeof result.reply!=='string')throw Error('PCから返答がありません。');
 return {reply:result.reply.slice(0,1600),feedback_ja:String(result.feedback_ja||'').slice(0,500),engine:'pc'};
}
async function deviceAnswer(s,mode){
 if(!engine)throw Error('端末内AIが読み込まれていません。');
 const r=await engine.chat.completions.create({messages:conversationFor(s,mode),temperature:.7,max_tokens:120});
 const reply=String(r?.choices?.[0]?.message?.content||'').trim();if(!reply)throw Error('端末内AIが返答を生成できませんでした。');
 return {reply:reply.slice(0,1600),feedback_ja:'',engine:'device'};
}
async function answerFor(s,mode){
 const setting=data.settings.engine;
 if(setting==='guided')return {...guidedAnswer(s,mode),engine:'guided'};
 if(setting==='pc'||(setting==='auto'&&data.settings.serverUrl&&token)){
   try{return await pcAnswer(s,mode)}catch(e){lastStatus='PC連携失敗。教材モードに切り替えました：'+e.message;}
 }
 if(setting==='device'||(setting==='auto'&&engine)){
   try{return await deviceAnswer(s,mode)}catch(e){lastStatus='端末内AI失敗。教材モードに切り替えました：'+e.message;}
 }
 return {...guidedAnswer(s,mode),engine:'guided'};
}
async function send(){
 if(working||!activeMode)return;
 const field=el('studioInput');const msg=String(field?.value||'').trim();
 if(!msg){status('英文を入力してください。');return;}
 if(msg.length>1500){status('1回の入力は1500文字までです。');return;}
 const s=ensure(activeMode),mode=activeMode;working=true;
 s.messages.push({role:'user',text:msg});s.turns++;data.totalTurns[mode]++;save();
 if(field)field.value='';refresh();status('返答を作成しています…');
 try{
   const output=await answerFor(s,mode);
   s.messages.push({role:'assistant',text:output.reply,engine:output.engine,feedback:output.feedback_ja||(output.engine==='guided'?('簡易表記チェック：'+feedback(msg,mode)):'')});
   lastEngine=output.engine;
   if(mode===activeMode&&mode==='speaking'&&data.settings.autoSpeak)say(output.reply);
   if(!lastStatus.includes('失敗'))lastStatus=output.engine==='guided'?'教材モード：事前に用意された質問で練習中（自由なAI対話ではありません）。':output.engine==='pc'?'PCのローカルAIが返答しました。':'端末内AIが返答しました。';
 }catch(e){lastStatus='エラー：'+e.message; s.messages.push({role:'assistant',text:guidedAnswer(s,mode).reply,engine:'guided'});}
 finally{working=false;save();if(activeMode===mode)refresh();}
}
function clearAudio(){if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl='';}audioBlob=null;}
async function record(){
 if(working)return;
 if(recorder&&recorder.state==='recording'){recorder.stop();return;}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){status('このブラウザでは録音できません。入力欄を利用してください。');return;}
 try{
   recStream=await navigator.mediaDevices.getUserMedia({audio:true});recChunks=[];
   const prefer=['audio/mp4','audio/webm;codecs=opus','audio/webm'];
   const mime=prefer.find(type=>MediaRecorder.isTypeSupported?.(type));
   recorder=new MediaRecorder(recStream,mime?{mimeType:mime}:undefined);
   recorder.ondataavailable=e=>{if(e.data.size)recChunks.push(e.data)};
   recorder.onerror=()=>status('録音に失敗しました。');
   recorder.onstop=async()=>{
    recStream?.getTracks().forEach(t=>t.stop());recStream=null;
    const blob=new Blob(recChunks,{type:recorder.mimeType||'audio/mp4'});recorder=null;
    clearAudio();audioBlob=blob;audioUrl=URL.createObjectURL(blob);
    if(!blob.size){status('録音が空でした。');refresh();return;}
    const wantsPc=data.settings.engine==='pc'||(data.settings.engine==='auto'&&data.settings.serverUrl&&token);
    if(wantsPc){
     status('PCで音声認識中…');working=true;
     try{
      const fd=new FormData();fd.append('audio',blob,'recording.'+(blob.type.includes('mp4')?'m4a':'webm'));
      const result=await requestPC('/transcribe',{method:'POST',body:fd});
      const transcription=String(result.text||'').trim();
      refresh();
      const field=el('studioInput');if(field&&transcription)field.value=transcription;
      status(transcription?'音声認識完了。必要に応じて修正し、送信してください。':'音声を認識できませんでした。録音を聞き直してください。');
     }catch(e){refresh();status('音声認識に失敗：'+e.message+'。録音の再生はできます。');}
     finally{working=false;}
    }else status('録音しました。再生して発音を確認し、発言内容を英文入力してください（iPhone単独では自動文字起こしなし）。');
    if(!wantsPc)refresh();
   };
   recorder.start();status('録音中です。もう一度押すと終了します。');refresh();
 }catch(e){recStream?.getTracks().forEach(t=>t.stop());recStream=null;status('マイクを使用できません：'+e.message);}
}
function cancelRecording(){if(recorder&&recorder.state==='recording'){recorder.onstop=null;recorder.stop()}recorder=null;recStream?.getTracks().forEach(t=>t.stop());recStream=null;}
function pause(){cancelRecording();stopSpeech();}
async function loadDevice(){
 if(engine){status('端末内AIは読み込み済みです。');return;}
 if(!navigator.gpu){status('WebGPUが利用できません。iOS/Safariのバージョンや端末の対応状況を確認してください。');return;}
 if(working)return;working=true;status('端末内AIを準備中。初回は数百MB程度のダウンロードが必要な場合があります。');
 try{
  const webllm=await import('https://esm.run/@mlc-ai/web-llm@0.2.86');
  const choices=webllm.prebuiltAppConfig.model_list.filter(x=>/Qwen2(?:\.5)?-0\.5B-Instruct/i.test(x.model_id));
  if(!choices.length)throw Error('使用可能な0.5Bモデルが見つかりません。');
  const selected=choices.find(x=>/q4f16_1/i.test(x.model_id))||choices[0];
  engine=await webllm.CreateMLCEngine(selected.model_id,{initProgressCallback:p=>status('端末内AI読み込み：'+Math.round((p.progress||0)*100)+'% '+(p.text||''))});
  data.settings.engine='device';save();status('端末内AI '+selected.model_id+' を読み込みました。');
 }catch(e){engine=null;status('端末内AIを起動できません：'+e.message+'。教材モードとPC連携は引き続き利用できます。');}
 finally{working=false;refresh();}
}
function exportHistory(){
 const payload=JSON.stringify({exportedAt:new Date().toISOString(),version:1,topicsSeen:data.topicsSeen,sessions:data.sessions,archives:data.archives,totalTurns:data.totalTurns},null,2);
 const url=URL.createObjectURL(new Blob([payload],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='english-quest-speaking-writing-history.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
 status('会話履歴をJSONで書き出しました。');
}
function settingsHTML(){
 const st=data.settings,opts=[['auto','自動（PC → 端末内AI → 教材）'],['guided','教材会話（必ず利用可能）'],['device','端末内AI（試験運用）'],['pc','PCのローカルAI']];
 return '<details class="studio-settings"><summary>⚙ 会話エンジン・PC連携の設定</summary>'+
 '<label for="studioEngine">利用する会話方式</label><select id="studioEngine" class="select">'+opts.map(([v,l])=>'<option value="'+v+'"'+(st.engine===v?' selected':'')+'>'+l+'</option>').join('')+'</select>'+
 '<p class="studio-tip">教材会話はAIではなく、話題ごとの事前作成質問です。端末内AIはiPhone 13では動作しない場合があります。</p>'+
 '<button class="btn btn-secondary" id="studioLoadDevice" type="button">端末内AI（0.5B）を読み込む</button>'+
 '<label for="studioUrl">PC接続URL（Tailscale ServeのHTTPS URL）</label><input id="studioUrl" type="url" autocomplete="off" placeholder="https://your-pc.your-tailnet.ts.net" value="'+esc(st.serverUrl)+'">'+
 '<label for="studioToken">PC認証トークン（このタブのみ保存）</label><input id="studioToken" type="password" autocomplete="off" placeholder="PCで設定したトークン" value="'+esc(token)+'">'+
 '<div class="studio-actions"><button class="btn btn-secondary" id="studioConnect" type="button">接続設定を保存・確認</button><button class="btn btn-ghost" id="studioExport" type="button">履歴を保存</button></div>'+
 '<label class="studio-check"><input type="checkbox" id="studioAutoSpeak"'+(st.autoSpeak?' checked':'')+'> SpeakingのAI音声を自動再生</label>'+
 '<p class="studio-tip">GitHub Pages上には認証トークンを公開しません。会話の音声はPC連携を選んだ場合だけ指定したPCに送られます。端末内AI初回はインターネット接続が必要です。</p></details>';
}
function render(ctx){
 api=ctx;activeMode=ctx.mode;
 const mode=activeMode,s=ensure(mode),topic=topicFor(s),isSpeaking=mode==='speaking';
 const messages=s.messages.map((m,i)=>'<div class="studio-msg '+(m.role==='user'?'studio-user':'studio-bot')+'">'+
 '<span class="studio-role">'+(m.role==='user'?'YOU':m.engine==='guided'?'TOPIC GUIDE':m.engine==='pc'?'LOCAL AI':'AI')+'</span>'+
 '<p>'+esc(m.text)+'</p>'+(m.feedback?'<details class="studio-feedback"><summary>英文へのフィードバック</summary>'+esc(m.feedback)+'</details>':'')+
 (m.role==='assistant'?'<button class="studio-say" type="button" data-studio-say="'+i+'">🔊 音声で聞く</button>':'')+'</div>').join('');
 const statusText=lastStatus||'PCがないときは教材会話、PC接続時は自由なAI会話ができます。';
 const deviceMessage=isSpeaking?'<div class="studio-tip">🎙 PC接続時：録音→文字起こし→内容確認→送信。iPhone単独時：録音・再生・手入力による練習（自動音声認識はありません）。</div>':'<div class="studio-tip">英文を2〜4文で入力してください。AI利用時は内容に応じた返答、教材モードでは用意された追加質問を出します。</div>';
 el('game').innerHTML='<div class="studio-wrap"><div class="studio-top"><div><span class="studio-eyebrow">'+(isSpeaking?'SPEAKING QUEST':'WRITING QUEST')+'</span><h3>'+esc(topic.title)+'</h3><span class="studio-level">'+topic.level+' ／ '+(s.turns||0)+' ターン</span></div><button id="studioNew" class="btn btn-secondary" type="button">別の話題</button></div>'+
 '<div class="studio-method">現在の方式：'+(data.settings.engine==='guided'?'教材会話':data.settings.engine==='pc'?'PC連携':data.settings.engine==='device'?'端末内AI（要読み込み）':'自動選択')+
 ' <span class="studio-muted">・教材モードは自由なAI返答ではありません</span></div>'+
 '<div id="studioTranscript" class="studio-thread" aria-live="polite">'+messages+'</div>'+deviceMessage+
 (audioUrl?'<audio class="studio-playback" id="studioPlayback" src="'+esc(audioUrl)+'" controls preload="none"></audio>':'')+
 '<div class="studio-compose"><label for="studioInput">Your response (English)</label><textarea id="studioInput" rows="'+(isSpeaking?'2':'4')+'" maxlength="1500" placeholder="'+(isSpeaking?'話した英文を入力、またはPC連携で音声認識':'2〜4文の英文を入力')+'"></textarea>'+
 '<div class="studio-actions">'+(isSpeaking?'<button class="btn btn-secondary" id="studioRecord" type="button">'+(recorder?.state==='recording'?'■ 録音を終了':'🎙 録音する')+'</button>':'')+
 '<button class="btn btn-primary" id="studioSend" type="button"'+(working?' disabled':'')+'>➤ 送信して会話を続ける</button></div></div>'+
 '<div class="studio-status" id="studioStatus" role="status">'+esc(statusText)+'</div>'+settingsHTML()+'</div>';
 el('studioNew').onclick=()=>{if(working)return;if(s.turns&&!confirm('新しい話題を始めますか？ 現在の会話は履歴エクスポートまで保持されますが、画面からは切り替わります。'))return;pause();clearAudio();begin(mode);};
 el('studioSend').onclick=send;
 el('studioInput').onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();send();}};
 el('studioEngine').onchange=e=>{data.settings.engine=e.target.value;save();refresh();};
 el('studioLoadDevice').onclick=loadDevice;
 el('studioAutoSpeak').onchange=e=>{data.settings.autoSpeak=e.target.checked;save();};
 el('studioConnect').onclick=async()=>{
  data.settings.serverUrl=el('studioUrl').value.trim();
  token=el('studioToken').value.trim();
  try{if(token)sessionStorage.setItem('eq-pc-token',token);else sessionStorage.removeItem('eq-pc-token')}catch(e){}
  save();await checkPC();
 };
 el('studioExport').onclick=exportHistory;
 if(isSpeaking)el('studioRecord').onclick=record;
 document.querySelectorAll('[data-studio-say]').forEach(button=>button.onclick=()=>{const msg=s.messages[Number(button.dataset.studioSay)];if(msg)say(msg.text)});
 const thread=el('studioTranscript');if(thread)thread.scrollTop=thread.scrollHeight;
}
function refresh(){if(api&&activeMode===api.mode)render(api)}
function renderControls(ctx){
 const mode=ctx.mode,s=data.sessions[mode],isSpeaking=mode==='speaking';
 ctx.$('modeHeading').textContent=isSpeaking?'SPEAKING QUEST':'WRITING QUEST';
 ctx.$('modePill').textContent=isSpeaking?'CONVERSATION':'COMPOSITION';
 ctx.$('totalXp').textContent=ctx.state.xp.toLocaleString();
 ctx.$('levelText').textContent='CHAT';
 ctx.$('accuracyText').textContent='—';
 ctx.$('solvedText').textContent=String(data.totalTurns[mode]||0);
 ctx.$('remainingText').textContent='—';
 ctx.$('freshRateText').textContent='—';
 ctx.$('bankSummary').textContent=isSpeaking?'Speaking: テーマ別会話・音声再生・録音練習':'Writing: テーマ別チャット・自由英作文・添削';
 ctx.$('tips').textContent='無料・回数制限なし。教材会話は完全オフライン対応。端末内AIは試験機能、PC連携時はローカルAIが返信します。L&R予測スコアには反映しません。';
 const minutes=Math.floor(ctx.state.studySeconds/60),pct=Math.min(100,Math.round(ctx.state.studySeconds/21600*100));
 ctx.$('studyTime').textContent=minutes+'分 / 360分';ctx.$('percentTime').textContent=pct+'%';ctx.$('timeProgress').style.width=pct+'%';
 ctx.renderScore();
}
window.EnglishStudio={render,renderControls,pause,topicsCount:TOPICS.length};
})();
