const TOLERANCE_RATE = 0.0001; // 0.01%
const ROLE_CONFIG = {
  fuel_field:{label:'Fuel Field Operator',site:'Fuel Blending',scope:'Operasi unit Fuel Blending',modules:['dashboard','pre_inspection','loading','after_inspection','shipment_monitor']},
  fuel_spv:{label:'Fuel SPV Operator',site:'Fuel Blending',scope:'Dashboard supervisi data operator, analisis BL, custody transfer, discharge, barge loading dan approval operasional',modules:['spv_dashboard','shipment_monitor','bl_analysis','custody_transfer','cargo_calculator','discharge','marine_loading','validation']},
  rf_operator:{label:'RF Operator',site:'Riau Fiber',scope:'Hanya shipment tujuan Riau Fiber dan data receiving site sendiri',modules:['dashboard','receiving','site_history']},
  mill_operator:{label:'Mill Operator',site:'Mill',scope:'Hanya shipment tujuan Mill dan data receiving site sendiri',modules:['dashboard','receiving','site_history']},
  maintank_operator:{label:'Maintank Operator',site:'Maintank',scope:'Hanya shipment tujuan Maintank dan data receiving site sendiri',modules:['dashboard','receiving','site_history']},
  it_admin:{label:'IT Administrator',site:'Enterprise',scope:'Akses seluruh site, master data, audit dan role management',modules:['dashboard','spv_dashboard','pre_inspection','loading','after_inspection','shipment_monitor','receiving','site_history','bl_analysis','custody_transfer','cargo_calculator','discharge','marine_loading','validation','admin']}
};
const NAV = [
  {label:'Overview',items:[['dashboard','▦','Live Dashboard'],['spv_dashboard','▤','SPV Dashboard']]},
  {label:'Fuel Blending',items:[['pre_inspection','✓','Before Loading Inspection'],['loading','⇆','Loading Operation'],['after_inspection','◆','After Loading Inspection'],['shipment_monitor','↗','Shipment Monitor']]},
  {label:'Customer Receiving',items:[['receiving','⌁','Receiving Validation'],['site_history','≡','Receiving History'],['validation','◉','Custody Validation']]},
  {label:'Port Operation',items:[['bl_analysis','▤','BL Analysis Report'],['custody_transfer','◫','Custody Receive & Transfer'],['cargo_calculator','∑','Cargo & Tanker Calculator']]},
  {label:'Marine & Cargo',items:[['discharge','⚓','Discharge Cargo'],['marine_loading','▱','Loading to Barge']]},
  {label:'System',items:[['admin','⚙','Access & Governance']]}
];
const DEST = {RF:'Riau Fiber',MILL:'Mill',MAINTANK:'Maintank'};
const DEST_ROLE = {rf_operator:'RF',mill_operator:'MILL',maintank_operator:'MAINTANK'};
const state = {
  role:'fuel_spv', page:'spv_dashboard',
  inspections:[],
  shipments:[],
  discharge:[],
  cargoTransfers:[],
  blAnalyses:[{
    id:'BLA-OEXP26016-150726',
    status:'DOCUMENT_RECONCILIATION',
    vessel:'MT ORKIM EXPRESS',
    voyage:'OEXP 26016',
    cargoNo:'PTT CP 07 07 26',
    product:'DIESEL FUEL / ADF 0.25 PCT SULFUR',
    loadingPort:'PENGERANG',
    dischargePort:'FUTONG',
    terminal:'VOPAK PENGERANG TERMINAL 1 · B603',
    blDate:'15/07/2026',
    jobFile:'501-26-12416',
    sourceDocuments:['SURVEYOR DOCS.pdf','SHIPS DOCS(1).pdf'],
    bl:{
      label:'Bill of Lading / Terminal Computation',
      gov:4485.200,
      gsv:4425.231,
      densityVac:0.8488,
      densityAir:0.8477,
      mtAir:3751.392,
      bbl:27847,
      longTons:3692.158
    },
    ship:{
      label:"Ship's Ullage Report",
      gov:4474.327,
      gsv:4417.229,
      mtAir:3744.485,
      bbl:27797.63,
      reportedPct:-0.18
    },
    surveyorRaw:{
      label:'Independent Surveyor · After Loading',
      gov:4474.327,
      gsv:4415.638,
      mtAir:3743.136,
      bbl:27786,
      vef:null,
      reportedPct:-0.22
    },
    surveyorVef:{
      label:'Independent Surveyor · VEF Applied',
      gsv:4419.173,
      mtAir:3746.133,
      bbl:27809,
      vef:0.9992,
      reportedPct:-0.14
    }
  }],
  audit:[]
};
const $ = s => document.querySelector(s);
const fmt = n => new Intl.NumberFormat('id-ID',{maximumFractionDigits:3}).format(Number(n||0));
const nowText = () => new Date().toLocaleString('id-ID',{hour12:false});
function role(){return ROLE_CONFIG[state.role]}
function defaultPageForRole(){return state.role==='fuel_spv'?'spv_dashboard':'dashboard'}
function siteScope(){return DEST_ROLE[state.role] || null}
function allowedShipments(){const s=siteScope(); return s?state.shipments.filter(x=>x.dest===s):state.shipments}
function badge(status){
  const m={IN_TRANSIT:['info','IN TRANSIT'],RECEIVED:['good','RECEIVED'],HOLD:['bad','HOLD / INVESTIGATE'],AWAITING_AFTER:['warn','WAIT AFTER INSPECTION'],PASS:['good','PASS'],REJECT:['bad','REJECT'],COMPLETED:['good','COMPLETED'],IN_PROGRESS:['warn','IN PROGRESS']};
  const x=m[status]||['neutral',status]; return `<span class="badge ${x[0]}">${x[1]}</span>`;
}
function audit(action,detail){state.audit.unshift({time:nowText(),role:role().label,action,detail});}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function setupRoles(){
  $('#roleSelect').innerHTML=Object.entries(ROLE_CONFIG).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');
  $('#roleSelect').value=state.role;
  $('#roleSelect').onchange=e=>{state.role=e.target.value;state.page=defaultPageForRole();renderAll();};
}
function renderNav(){
  const allowed=role().modules;
  $('#nav').innerHTML=NAV.map(g=>{
    const items=g.items.filter(i=>allowed.includes(i[0])); if(!items.length)return '';
    return `<div class="nav-label">${g.label}</div>${items.map(i=>`<a href="#" class="nav-item ${state.page===i[0]?'active':''}" data-page="${i[0]}"><span class="nav-icon">${i[1]}</span><span>${i[2]}</span>${i[0]==='receiving'?`<span class="nav-badge">${allowedShipments().filter(x=>x.status==='IN_TRANSIT').length}</span>`:''}</a>`).join('')}`;
  }).join('');
  document.querySelectorAll('.nav-item').forEach(a=>a.onclick=e=>{e.preventDefault();state.page=a.dataset.page;renderAll();closeMenu();});
}
function renderIdentity(){
  $('#roleScope').innerHTML=`<b style="color:var(--muted)">${role().site}</b><br>${role().scope}`;
  $('#userName').textContent=role().label; $('#userRole').textContent=role().site; $('#avatar').textContent=role().label.split(' ').map(x=>x[0]).slice(0,2).join('');
}
function renderTicker(){
  const items=state.shipments.slice(0,5).map(s=>`<span class="ticker-item"><span>${s.id}</span><b>${DEST[s.dest]}</b><span>${fmt(s.total)} L</span><span class="${s.status==='HOLD'?'text-bad':s.status==='RECEIVED'?'text-good':'text-blue'}">${s.status.replaceAll('_',' ')}</span></span>`);
  if(!items.length){
    $('#tickerTrack').innerHTML='<span class="ticker-item ticker-empty"><b>FUEL BLENDING DATA STREAM</b><span>Menunggu data baru dari Fuel Field Operator</span><span class="text-good">SYSTEM READY</span></span>';
    return;
  }
  $('#tickerTrack').innerHTML=[...items,...items].join('');
}
function pageTitle(title,desc,actions=''){return `<div class="page-head"><div><div class="page-title">${title}</div><div class="page-desc">${desc}</div></div><div class="head-actions">${actions}</div></div>`}
function dashboard(){
  const ships=allowedShipments(); const today=ships.filter(s=>s.id.includes('260718')); const transit=ships.filter(s=>s.status==='IN_TRANSIT').length; const holds=ships.filter(s=>s.status==='HOLD').length; const received=ships.filter(s=>s.status==='RECEIVED');
  const volume=today.reduce((a,b)=>a+(b.total||0),0); const pass=received.filter(s=>s.validation?.volumePass&&s.validation?.sealPass).length;
  const avgLoss=received.length?received.reduce((a,b)=>a+Math.abs(b.validation?.pct||0),0)/received.length:0;
  const siteLabel=siteScope()?DEST[siteScope()]:'All Network';
  return `${pageTitle('Live Operations Dashboard',`Pemantauan custody chain secara real-time untuk ${siteLabel}. Status unit, volume, seal, receiving dan indikasi anomali ditampilkan dalam satu layar.`,'<button class="btn" onclick="renderAll()">Refresh Live Data</button>')}
  <div class="grid-kpi">
    ${kpi('Volume dispatch hari ini',fmt(volume)+' L','Akumulasi flowmeter final','78')}
    ${kpi('Unit in transit',transit,'Sedang menuju receiving site',transit?'64':'15')}
    ${kpi('Receiving verified',pass,'Volume + seal + identity sesuai','88')}
    ${kpi('Exception / hold',holds,'Butuh investigasi custody',holds?'72':'8',holds?'text-bad':'')}
    ${kpi('Avg. variance',fmt(avgLoss)+'%','Batas toleransi: 0,01%','42',avgLoss>.01?'text-bad':'text-good')}
    ${kpi('Data integrity','99.94%','Sinkronisasi custody packet','96','text-good')}
  </div>
  <div class="layout-2">
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Volume Movement — 24 Hours</div><div class="panel-sub">Dispatch vs actual receiving</div></div><div class="legend"><span class="lg-orange">Dispatch</span><span class="lg-cyan">Receiving</span></div></div><div class="panel-body"><div class="chart-wrap"><div class="chart-grid"></div><svg class="chart-svg" viewBox="0 0 800 240" preserveAspectRatio="none"><defs><linearGradient id="area1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f0a43a" stop-opacity=".22"/><stop offset="1" stop-color="#f0a43a" stop-opacity="0"/></linearGradient></defs><path d="M0 195 C60 185,75 165,120 172 S190 120,235 132 S305 88,355 105 S425 55,475 76 S550 43,610 60 S720 28,800 42 L800 220 L0 220 Z" fill="url(#area1)"/><path d="M0 195 C60 185,75 165,120 172 S190 120,235 132 S305 88,355 105 S425 55,475 76 S550 43,610 60 S720 28,800 42" fill="none" stroke="#f0a43a" stroke-width="3"/><path d="M0 206 C72 202,85 180,130 184 S200 141,250 150 S320 109,370 117 S440 78,493 91 S565 68,630 74 S730 55,800 63" fill="none" stroke="#50d5c7" stroke-width="2.5" stroke-dasharray="7 5"/></svg><div class="chart-labels"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span></div></div></div></div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Live Site Performance</div><div class="panel-sub">Custody validation by destination</div></div><span class="badge good">NETWORK ONLINE</span></div><div class="panel-body"><div class="market-list">
      ${sitePerf('Riau Fiber','2 active','99.85%','-0.15%',false)}${sitePerf('Mill','1 active','99.98%','-0.02%',true)}${sitePerf('Maintank','1 pending','99.99%','-0.01%',true)}${sitePerf('Fuel Blending','3 process','100.00%','SOURCE',true)}
    </div></div></div>
  </div>
  <div class="layout-2">
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Active Custody Chain</div><div class="panel-sub">Status pengiriman yang sedang berjalan</div></div><button class="btn btn-sm" onclick="goPage('shipment_monitor')">Open monitor</button></div><div class="panel-body flush">${shipmentTable(ships.slice(0,6),true)}</div></div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Risk & Exception Feed</div><div class="panel-sub">Prioritas pemeriksaan berdasarkan mismatch</div></div></div><div class="panel-body">${riskFeed(ships)}</div></div>
  </div>`;
}

function spvDashboard(){
  const inspections=[...state.inspections];
  const passInspections=inspections.filter(x=>x.result==='PASS');
  const rejectedInspections=inspections.filter(x=>x.result==='REJECT');
  const shipments=[...state.shipments];
  const awaitingAfter=shipments.filter(x=>x.status==='AWAITING_AFTER');
  const dispatched=shipments.filter(x=>['IN_TRANSIT','RECEIVED','HOLD'].includes(x.status));
  const completed=shipments.filter(x=>x.status==='RECEIVED');
  const exceptions=shipments.filter(x=>x.status==='HOLD');
  const totalLoaded=shipments.reduce((sum,x)=>sum+Number(x.total||0),0);
  const latestOperatorData=[
    ...inspections.map(x=>({kind:'BEFORE INSPECTION',time:x.time||'',title:`${x.unitCode||'-'} · ${x.plate||'-'}`,meta:`${DEST[x.destination]||x.destination||'-'} · ${x.result||'-'}`,status:x.result==='PASS'?'PASS':'REJECT'})),
    ...shipments.map(x=>({kind:'LOADING / SHIPMENT',time:x.dispatchAt||'',title:`${x.id} · ${x.unitCode}`,meta:`${DEST[x.dest]||x.dest} · ${fmt(x.total)} L · ${x.plate}`,status:x.status}))
  ].sort((a,b)=>String(b.time).localeCompare(String(a.time))).slice(0,10);

  const stageCard=(label,value,sub,stateClass='')=>`<div class="spv-stage-card ${stateClass}"><div class="spv-stage-label">${label}</div><div class="spv-stage-value">${value}</div><div class="spv-stage-sub">${sub}</div></div>`;
  const empty=(title,desc)=>`<div class="spv-empty"><div class="spv-empty-icon">◎</div><div><b>${title}</b><span>${desc}</span></div></div>`;

  return `${pageTitle('SPV Dashboard','Halaman supervisi khusus untuk melihat data yang berhasil dibuat oleh Fuel Blending Operator. BL Analysis Report tetap berdiri sendiri dan hanya menampilkan hasil analisis dokumen.','<button class="btn" onclick="renderAll()">Refresh Operator Data</button><button class="btn btn-primary" onclick="goPage(\'shipment_monitor\')">Open Shipment Monitor</button>')}
  <div class="spv-source-banner">
    <div><div class="section-kicker">DATA SOURCE</div><div class="spv-source-title">Fuel Blending Operator → SPV Review</div><div class="spv-source-desc">Dashboard ini hanya membaca data operasional yang dibuat melalui Before Loading Inspection, Loading Operation dan After Loading Inspection.</div></div>
    <div class="spv-source-status"><span class="live-dot"></span><b>LIVE OPERATOR FEED</b></div>
  </div>

  <div class="grid-kpi spv-kpis">
    ${kpi('Before inspections',inspections.length,'Total record dibuat operator',inspections.length?72:8)}
    ${kpi('Inspection PASS',passInspections.length,'Unit eligible untuk loading',passInspections.length?82:8,'text-good')}
    ${kpi('Loading records',shipments.length,fmt(totalLoaded)+' L total recorded',shipments.length?76:8)}
    ${kpi('Waiting after inspection',awaitingAfter.length,'Perlu final check & sealing',awaitingAfter.length?68:8,awaitingAfter.length?'text-warn':'')}
    ${kpi('Dispatched custody',dispatched.length,'Custody packet sudah dikirim',dispatched.length?88:8,'text-blue')}
    ${kpi('Exception / hold',exceptions.length,'Perlu review SPV',exceptions.length?75:5,exceptions.length?'text-bad':'text-good')}
  </div>

  <div class="spv-stage-grid">
    ${stageCard('01 · Before Inspection',inspections.length,`${passInspections.length} PASS · ${rejectedInspections.length} REJECT`,rejectedInspections.length?'has-warning':'')}
    ${stageCard('02 · Loading',shipments.length,`${fmt(totalLoaded)} L tercatat`)}
    ${stageCard('03 · After Inspection',awaitingAfter.length,awaitingAfter.length?'Menunggu final inspection':'Tidak ada antrean',awaitingAfter.length?'has-warning':'')}
    ${stageCard('04 · Dispatch',dispatched.length,`${completed.length} received · ${exceptions.length} hold`,exceptions.length?'has-alert':'')}
  </div>

  <div class="layout-2 spv-dashboard-grid">
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">Latest Fuel Blending Operator Data</div><div class="panel-sub">Record terbaru yang dibuat dari workflow lapangan</div></div><span class="badge info">READ-ONLY SPV VIEW</span></div>
      <div class="panel-body spv-feed-body">${latestOperatorData.length?latestOperatorData.map(x=>`<div class="spv-feed-row"><div class="spv-feed-kind">${x.kind}</div><div class="spv-feed-main"><b>${x.title}</b><span>${x.meta}</span></div><div class="spv-feed-status">${badge(x.status)}</div></div>`).join(''):empty('Belum ada data Fuel Blending Operator','Data akan muncul otomatis setelah operator membuat inspection atau loading record.')}</div>
    </div>
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">SPV Review Queue</div><div class="panel-sub">Record yang membutuhkan perhatian supervisor</div></div></div>
      <div class="panel-body">${awaitingAfter.length||exceptions.length?
        [...awaitingAfter,...exceptions].slice(0,8).map(x=>`<div class="alert"><div class="alert-top"><div class="alert-title">${x.id} · ${x.unitCode}</div>${badge(x.status)}</div><div class="alert-meta">${DEST[x.dest]} · ${x.plate} · ${fmt(x.total)} L<br>${x.status==='AWAITING_AFTER'?'Menunggu after loading inspection dan penguncian seal.':'Shipment berada pada status HOLD dan membutuhkan review.'}</div></div>`).join(''):
        empty('Tidak ada antrean review','Semua record operator yang tersedia tidak memiliki exception atau pending action.')}</div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><div><div class="panel-title">Fuel Blending Shipment Dataset</div><div class="panel-sub">Data loading yang berhasil dibuat operator dan menjadi dasar custody packet</div></div><button class="btn btn-sm" onclick="goPage('shipment_monitor')">View Full Monitor</button></div>
    <div class="panel-body flush">${shipmentTable(shipments.slice(0,8),true)}</div>
  </div>`;
}

function kpi(label,value,sub,w,cls=''){return `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value ${cls}">${value}</div><div class="kpi-sub">${sub}</div><div class="mini-line"><span style="width:${w}%"></span></div></div>`}
function sitePerf(name,meta,value,delta,good){return `<div class="market-row"><div><div class="market-name">${name}</div><div class="market-meta">${meta}</div></div><div class="market-value">${value}</div><div class="market-delta ${good?'text-good':'text-bad'}">${delta}</div></div>`}
function riskFeed(ships){
  const risky=ships.filter(s=>s.status==='HOLD' || s.validation&&!s.validation.volumePass);
  if(!risky.length)return `<div class="alert"><div class="alert-title text-good">Tidak ada exception aktif</div><div class="alert-meta">Semua custody packet dalam scope role saat ini berada dalam kondisi normal.</div></div>`;
  return risky.map(s=>`<div class="alert"><div class="alert-top"><div class="alert-title">${s.id} · ${s.unitCode}</div><span class="badge bad">${s.validation?.risk||'HIGH'}</span></div><div class="alert-meta">${DEST[s.dest]} · selisih ${fmt(s.validation?.diff||0)} L · seal ${s.validation?.sealPass?'match':'mismatch'}<br>${s.validation?.notes||'Perlu review data receiving.'}</div></div>`).join('');
}
function shipmentTable(ships,compact=false){
  if(!ships.length)return `<div style="padding:25px;color:var(--dim);text-align:center">Tidak ada shipment dalam scope akses ini.</div>`;
  return `<div class="${compact?'':'table-wrap'}"><table><thead><tr><th>Shipment</th><th>Destination</th><th>Unit</th><th>Driver / Transporter</th><th>Dispatch Volume</th><th>Seal</th><th>Status</th><th>Variance</th></tr></thead><tbody>${ships.map(s=>`<tr><td><div class="cell-main mono">${s.id}</div><div class="cell-sub">${s.dispatchAt||'Belum dispatch'}</div></td><td>${DEST[s.dest]}</td><td><div class="cell-main">${s.unitCode}</div><div class="cell-sub">${s.plate}</div></td><td><div>${s.driver}</div><div class="cell-sub">${s.transporter}</div></td><td class="mono">${fmt(s.total)} L</td><td>${s.seals.length?`<span class="badge good">${s.seals.length} VERIFIED</span>`:'<span class="badge warn">PENDING</span>'}</td><td>${badge(s.status)}</td><td class="mono ${s.validation&&!s.validation.volumePass?'text-bad':'text-good'}">${s.validation?fmt(s.validation.diff)+' L':'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function flowSteps(active){const steps=[['01','Before Inspection'],['02','Loading'],['03','After Inspection'],['04','Transport'],['05','Receiving']];return `<div class="flow-steps">${steps.map((s,i)=>`<div class="step ${i<active?'done':i===active?'active':''}"><div class="step-no">PHASE ${s[0]}</div><div class="step-title">${s[1]}</div><div class="step-status">${i<active?'Completed':i===active?'Current phase':'Waiting'}</div></div>`).join('')}</div>`}
function preInspection(){
  return `${pageTitle('Before Loading Inspection','Pemeriksaan unit kosong sebelum diizinkan masuk ke proses pengisian. Unit yang gagal tidak dapat dibuatkan loading record.')}${flowSteps(0)}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">New Unit Inspection</div><div class="panel-sub">Identity, physical condition dan empty seal status</div></div></div><div class="panel-body"><form id="preForm"><div class="form-grid">
    ${field('Unit code','unitCode','FT-052')}${field('Nomor plat','plate','BM 9521 ZX')}${field('Nama driver','driver','')}${field('Transporter','transporter','')}
    <div class="field"><label>Destination</label><select name="destination" required>${Object.entries(DEST).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
    ${selectField('Kondisi tanki','tank',['Good','Minor defect','Reject'])}${selectField('Valve / outlet','valve',['Good','Minor defect','Leak / Reject'])}${selectField('Manhole / cover','manhole',['Good','Minor defect','Reject'])}
    ${selectField('Status seal unit kosong','emptySeal',['Open / verified','Seal lama masih terpasang','Tidak dapat diverifikasi'])}<div class="field span-2"><label>Kerusakan / temuan</label><input name="damage" placeholder="Tidak ada atau jelaskan temuan"></div><div class="field"><label>Inspection result</label><select name="result"><option>PASS</option><option>REJECT</option></select></div>
  </div><div class="form-actions"><button type="reset" class="btn">Reset</button><button class="btn btn-primary">Save Inspection</button></div></form></div></div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Inspection Queue</div><div class="panel-sub">Latest unit readiness</div></div></div><div class="panel-body">${state.inspections.slice(0,6).map(i=>`<div class="alert"><div class="alert-top"><div class="alert-title">${i.unitCode} · ${i.plate}</div>${badge(i.result)}</div><div class="alert-meta">${DEST[i.destination]} · ${i.driver} · ${i.transporter}<br>${i.time}</div></div>`).join('')}</div></div></div>`;
}
function field(label,name,placeholder='',type='text'){return `<div class="field"><label>${label}</label><input type="${type}" name="${name}" placeholder="${placeholder}" required></div>`}
function selectField(label,name,options){return `<div class="field"><label>${label}</label><select name="${name}">${options.map(x=>`<option>${x}</option>`).join('')}</select></div>`}
function loadingPage(){
  const eligible=state.inspections.filter(i=>i.result==='PASS');
  return `${pageTitle('Loading Operation','Input data pengisian berdasarkan unit yang sudah lolos before loading inspection. Total flowmeter dihitung otomatis dari final minus initial.')}${flowSteps(1)}
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Create Loading Record</div><div class="panel-sub">Flowmeter, sounding dan requested volume</div></div><span class="badge info">SOURCE: FUEL BLENDING</span></div><div class="panel-body"><form id="loadingForm"><div class="form-grid">
    <div class="field span-2"><label>Approved inspection</label><select name="preId" required>${eligible.map(i=>`<option value="${i.id}">${i.id} · ${i.unitCode} · ${i.plate} → ${DEST[i.destination]}</option>`).join('')}</select></div>
    ${field('Requested volume (L)','request','32000','number')}${field('Flowmeter initial','flowStart','500000','number')}${field('Flowmeter final','flowEnd','532000','number')}${field('Sounding before','soundingBefore','10.250','number')}${field('Sounding after','soundingAfter','42.250','number')}
    <div class="field"><label>Calculated flow volume</label><input id="calcFlow" value="0 L" readonly></div>
    <div class="field span-4"><label>Loading remarks</label><textarea name="remarks" placeholder="Catatan proses pengisian, abnormal condition, stop/start atau informasi penting lain."></textarea></div>
  </div><div class="form-actions"><button type="reset" class="btn">Reset</button><button class="btn btn-primary">Complete Loading</button></div></form></div></div>`;
}
function afterInspection(){
  const waiting=state.shipments.filter(s=>s.status==='AWAITING_AFTER');
  return `${pageTitle('After Loading Inspection','Final check setelah pengisian. Nomor segel yang disahkan pada tahap ini menjadi referensi utama receiving site.')}${flowSteps(2)}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Finalize Unit & Seal</div><div class="panel-sub">Shipment baru terkirim ke customer setelah tahap ini PASS</div></div></div><div class="panel-body">${waiting.length?`<form id="afterForm"><div class="form-grid"><div class="field span-2"><label>Shipment waiting inspection</label><select name="shipmentId">${waiting.map(s=>`<option value="${s.id}">${s.id} · ${s.unitCode} · ${DEST[s.dest]}</option>`).join('')}</select></div>${field('Seal 1','seal1','SL88101')}${field('Seal 2','seal2','SL88102')}${field('Seal 3','seal3','SL88103')}${field('Seal 4','seal4','SL88104')}${selectField('Final tank condition','condition',['Good','Minor damage','Reject'])}<div class="field span-2"><label>Final remarks</label><input name="remarks" placeholder="Seal terpasang dan tanki aman"></div></div><div class="form-actions"><button class="btn btn-primary">PASS & Dispatch Custody Packet</button></div></form>`:`<div style="padding:25px;text-align:center;color:var(--dim)">Tidak ada loading record yang menunggu after inspection.</div>`}</div></div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Dispatch Rule</div><div class="panel-sub">Data yang dikunci setelah PASS</div></div></div><div class="panel-body"><div class="check-list">${['Unit code & plate','Driver & transporter','Flowmeter initial / final / total','Sounding before / after','4 nomor seal final','Destination & dispatch time'].map(x=>`<div class="check-row"><span class="check-name">${x}</span><span class="badge good">LOCKED</span></div>`).join('')}</div></div></div></div>`;
}
function shipmentMonitor(){return `${pageTitle('Shipment Monitor','Monitoring unit dari Fuel Blending sampai receiving. IT Admin dan Fuel SPV melihat seluruh jaringan; customer tidak memiliki menu ini.')}${shipmentTable(state.shipments)}`}
function receivingPage(){
  const site=siteScope(); const source=site?state.shipments.filter(s=>s.dest===site&&s.status==='IN_TRANSIT'):state.shipments.filter(s=>s.status==='IN_TRANSIT');
  const defaultShip=source[0];
  return `${pageTitle('Receiving Validation',site?`Validasi shipment masuk untuk ${DEST[site]}. Data sumber hanya ditampilkan sebagai custody packet yang memang ditujukan ke site ini.`:'Admin receiving console untuk seluruh customer.')} ${flowSteps(4)}
  ${source.length?`<div class="panel"><div class="panel-head"><div><div class="panel-title">Incoming Shipment</div><div class="panel-sub">Bandingkan physical check dengan locked dispatch packet</div></div><span class="badge warn">TOLERANCE 0.01%</span></div><div class="panel-body"><form id="receivingForm"><div class="field" style="margin-bottom:13px"><label>Select shipment</label><select name="shipmentId" id="receivingShipment">${source.map(s=>`<option value="${s.id}">${s.id} · ${s.unitCode} · ${DEST[s.dest]}</option>`).join('')}</select></div><div id="dispatchPacket">${dispatchPacket(defaultShip)}</div><div style="height:14px"></div><div class="form-grid">
    ${field('Unit code actual','unitCode',defaultShip?.unitCode||'')}${field('Nomor plat actual','plate',defaultShip?.plate||'')}${field('Nama driver actual','driver',defaultShip?.driver||'')}${field('Transporter actual','transporter',defaultShip?.transporter||'')}
    ${field('Seal 1 actual','seal1',defaultShip?.seals?.[0]||'')}${field('Seal 2 actual','seal2',defaultShip?.seals?.[1]||'')}${field('Seal 3 actual','seal3',defaultShip?.seals?.[2]||'')}${field('Seal 4 actual','seal4',defaultShip?.seals?.[3]||'')}
    ${field('Actual receiving volume (L)','received','31970','number')}${field('Receiving sounding before','soundBefore','8.200','number')}${field('Receiving sounding after','soundAfter','40.150','number')}${selectField('Physical damage','damage',['Tidak ada','Ada kerusakan ringan','Ada kerusakan serius'])}
    <div class="field span-4"><label>Receiving remarks</label><textarea name="notes" placeholder="Catatan kondisi unit, seal, kebocoran, discrepancy atau kejadian lain."></textarea></div>
  </div><div class="form-actions"><button class="btn btn-primary">Validate & Close Receiving</button></div></form></div></div>`:`<div class="panel"><div class="panel-body" style="padding:40px;text-align:center;color:var(--dim)">Tidak ada shipment in-transit yang tersedia untuk role/site ini.</div></div>`}`;
}
function dispatchPacket(s){if(!s)return '';return `<div class="readonly-card"><div class="readonly-grid"><div><div class="ro-label">Shipment</div><div class="ro-value mono">${s.id}</div></div><div><div class="ro-label">Destination</div><div class="ro-value">${DEST[s.dest]}</div></div><div><div class="ro-label">Dispatch volume</div><div class="ro-value mono">${fmt(s.total)} L</div></div><div><div class="ro-label">Tolerance 0.01%</div><div class="ro-value mono">± ${fmt(s.total*TOLERANCE_RATE)} L</div></div><div><div class="ro-label">Unit / Plate</div><div class="ro-value">${s.unitCode} · ${s.plate}</div></div><div><div class="ro-label">Driver</div><div class="ro-value">${s.driver}</div></div><div><div class="ro-label">Transporter</div><div class="ro-value">${s.transporter}</div></div><div><div class="ro-label">Locked seals</div><div class="ro-value mono">${s.seals.join(' · ')}</div></div></div></div>`}
function siteHistory(){
  const s=allowedShipments().filter(x=>['RECEIVED','HOLD'].includes(x.status));
  return `${pageTitle('Receiving History','Riwayat receiving sesuai scope akses. Customer hanya melihat histori site sendiri.')}${shipmentTable(s)}`;
}
function validationPage(){
  const evaluated=state.shipments.filter(s=>s.validation);
  return `${pageTitle('Custody Validation','Ringkasan kontrol volume, seal dan identitas unit. Exception diprioritaskan untuk investigasi.')}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Network Integrity Score</div><div class="panel-sub">Composite custody validation</div></div></div><div class="panel-body"><div class="validation-card"><div class="score-box"><div class="score-ring"><span>88%</span></div><div style="font-size:10.5px;color:var(--muted);margin-top:10px">1 critical exception dari ${evaluated.length} validation</div></div><div class="check-list">${check('Identity match','100%',true)}${check('Seal integrity','50%',false)}${check('Volume within 0.01%','50%',false)}${check('Receiving completeness','100%',true)}</div></div></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Investigation Priority</div><div class="panel-sub">Rule-based anomaly signals</div></div></div><div class="panel-body">${riskFeed(state.shipments)}</div></div></div>
  ${shipmentTable(evaluated)}`;
}
function check(name,value,good){return `<div class="check-row"><span class="check-name">${name}</span><span class="${good?'text-good':'text-bad'} mono">${value}</span></div>`}
function numSmart(value){
  if(typeof value==='number')return Number.isFinite(value)?value:0;
  let v=String(value??'').trim().replace(/\s/g,'');
  if(!v)return 0;
  const c=v.lastIndexOf(','), d=v.lastIndexOf('.');
  if(c>-1&&d>-1){const dec=c>d?',':'.';const thou=dec===','?'.':',';v=v.split(thou).join('').replace(dec,'.');}
  else if(c>-1)v=v.replace(',','.');
  return Number(v.replace(/[^0-9+\-.]/g,''))||0;
}
function cargoCalc(gov,temp,density){
  gov=numSmart(gov);temp=numSmart(temp);density=numSmart(density);
  if(!(gov>0)&&!(density>0))return {gov,temp,density,alpha:0,vcf:0,gsv:0,mtVac:0,mtAir:0,longTon:0};
  if(!(density>0))return {gov,temp,density,alpha:0,vcf:0,gsv:0,mtVac:0,mtAir:0,longTon:0};
  const deltaT=temp-15;
  const alpha=(613.9723/(density*density))/1000000;
  const vcf=Math.exp(-alpha*deltaT*(1+0.8*alpha*deltaT));
  const gsv=gov*vcf;
  const mtVac=gsv*density;
  const mtAir=mtVac-(gsv*0.0011);
  const longTon=mtAir*0.984207;
  return {gov,temp,density,alpha,vcf,gsv,mtVac,mtAir,longTon};
}
function cargoFmt(n,d=3){return Number(n||0).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d})}
function metricBox(label,id,value='0.000'){return `<div class="metric-output"><div class="mo-label">${label}</div><div class="mo-value" id="${id}">${value}</div></div>`}
function cargoInput(label,id,placeholder,type='number',extra=''){return `<div class="field"><label>${label}</label><input ${type==='number'?'step="any"':''} type="${type}" id="${id}" placeholder="${placeholder}" ${extra}></div>`}
function cargoReadingCard(code,title){return `<div class="reading-card"><div class="reading-head"><div><div class="reading-code">${code}</div><div class="reading-phase">${title}</div></div><span class="badge info">SHORE READING</span></div><div class="reading-body"><div class="reading-fields">${cargoInput('Gross Observed Volume / GOV (m³)',`${code}_gov`,'0.000')}${cargoInput('Actual Temperature (°C)',`${code}_temp`,'15.0')}${cargoInput('Density @15°C (kg/L)',`${code}_density`,'0.8400')}</div><div class="reading-result">${metricBox('VCF',`${code}_vcf`)}${metricBox('GSV (m³)',`${code}_gsv`)}${metricBox('MT Air',`${code}_mtair`)}${metricBox('Long Ton',`${code}_lt`)}</div></div></div>`}

function blVariance(actual,base){
  const diff=Number(actual||0)-Number(base||0);
  const pct=Number(base)?diff/Number(base)*100:0;
  return {diff,pct};
}
function blToleranceBadge(pct){
  if(pct < -0.3) return '<span class="badge bad">EXCEEDS -0.300%</span>';
  if(pct < 0) return '<span class="badge good">LOSS WITHIN TOLERANCE</span>';
  if(pct > 0) return '<span class="badge info">POSITIVE VARIANCE</span>';
  return '<span class="badge neutral">BALANCED</span>';
}
function blAnalysisPage(){
  const a=state.blAnalyses[0];
  if(!a){
    return `${pageTitle('BL Analysis Report','Belum ada dataset BL. Upload atau masukkan dokumen untuk memulai analisis.')}<div class="panel"><div class="panel-body"><div style="padding:42px;text-align:center;color:var(--dim)">No BL analysis data loaded.</div></div></div>`;
  }
  const shipG=blVariance(a.ship.gsv,a.bl.gsv), shipM=blVariance(a.ship.mtAir,a.bl.mtAir);
  const rawG=blVariance(a.surveyorRaw.gsv,a.bl.gsv), rawM=blVariance(a.surveyorRaw.mtAir,a.bl.mtAir);
  const vefG=blVariance(a.surveyorVef.gsv,a.bl.gsv), vefM=blVariance(a.surveyorVef.mtAir,a.bl.mtAir);
  const crossRaw=blVariance(a.surveyorRaw.gsv,a.ship.gsv), crossVef=blVariance(a.surveyorVef.gsv,a.ship.gsv);
  const overallAlert=Math.min(shipG.pct,rawG.pct,vefG.pct)<-0.3;
  const row=(name,gsv,mt,bbl,v)=>`<tr><td><div class="cell-main">${name}</div></td><td class="mono">${cargoFmt(gsv)}</td><td class="mono">${cargoFmt(mt)}</td><td class="mono">${cargoFmt(bbl,2)}</td><td class="mono ${v.pct<0?'text-warn':'text-good'}">${v.diff>=0?'+':''}${cargoFmt(v.diff)} m³</td><td class="mono ${v.pct<-.3?'text-bad':v.pct<0?'text-warn':'text-good'}">${v.pct>=0?'+':''}${v.pct.toFixed(3)}%</td><td>${blToleranceBadge(v.pct)}</td></tr>`;
  return `${pageTitle('BL Analysis Report','Halaman khusus hasil analisis dokumen BL. Tidak menampilkan data shipment, inspection, atau dashboard operasional Fuel Blending Operator.')}
  <div class="bl-report-shell">
    <div class="bl-case-head">
      <div><div class="section-kicker">ACTIVE DOCUMENT CASE</div><div class="bl-case-title">${a.vessel} · ${a.voyage}</div><div class="bl-case-sub">${a.product} · BL Date ${a.blDate} · Job File ${a.jobFile}</div></div>
      <div class="bl-doc-tags">${a.sourceDocuments.map(x=>`<span class="bl-doc-tag">${x}</span>`).join('')}</div>
    </div>
    <div class="grid-kpi bl-kpi-grid">
      ${kpi('BL GSV @15°C',cargoFmt(a.bl.gsv)+' KL','Terminal computation / BL baseline','100','text-blue')}
      ${kpi('BL Metric Tons Air',cargoFmt(a.bl.mtAir)+' MT','Mass baseline','100','text-blue')}
      ${kpi('Ship vs BL',shipG.pct.toFixed(3)+'%','GSV variance · '+(shipG.diff>=0?'+':'')+cargoFmt(shipG.diff)+' KL','60',shipG.pct<-.3?'text-bad':'text-warn')}
      ${kpi('Surveyor Raw vs BL',rawG.pct.toFixed(3)+'%','Independent after-loading figure','58',rawG.pct<-.3?'text-bad':'text-warn')}
      ${kpi('Surveyor VEF vs BL',vefG.pct.toFixed(3)+'%','VEF '+a.surveyorVef.vef+' applied','76',vefG.pct<-.3?'text-bad':'text-good')}
      ${kpi('Tolerance Status',overallAlert?'ALERT':'WITHIN -0.300%','Application analysis threshold','92',overallAlert?'text-bad':'text-good')}
    </div>

    <div class="layout-2 bl-overview-grid">
      <div class="panel">
        <div class="panel-head"><div><div class="panel-title">Cargo & Voyage Identity</div><div class="panel-sub">Data yang direkonsiliasi dari dua document sets</div></div></div>
        <div class="panel-body"><div class="bl-identity-grid">
          ${[['Vessel',a.vessel],['Voyage',a.voyage],['Cargo / Product',a.product],['Loading Port',a.loadingPort],['Discharge Port',a.dischargePort],['Terminal / Berth',a.terminal],['Cargo No.',a.cargoNo],['Job File',a.jobFile]].map(([k,v])=>`<div class="bl-identity-item"><div>${k}</div><b>${v}</b></div>`).join('')}
        </div></div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><div class="panel-title">BL Quantity Baseline</div><div class="panel-sub">Terminal computation used as commercial reference</div></div></div>
        <div class="panel-body"><div class="bl-baseline-grid">
          ${[['GOV @ Obs Temp',cargoFmt(a.bl.gov)+' KL'],['GSV @15°C',cargoFmt(a.bl.gsv)+' KL'],['Density @15°C VAC',a.bl.densityVac.toFixed(4)],['Density @15°C AIR',a.bl.densityAir.toFixed(4)],['Metric Tons Air',cargoFmt(a.bl.mtAir)+' MT'],['US Barrels @60°F',cargoFmt(a.bl.bbl,0)+' bbl'],['Long Tons',cargoFmt(a.bl.longTons)+' LT']].map(([k,v])=>`<div class="metric-output"><div class="mo-label">${k}</div><div class="mo-value">${v}</div></div>`).join('')}
        </div></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">Cross-Document Quantity Reconciliation</div><div class="panel-sub">Variance dihitung ulang terhadap BL; reported document percentages ditampilkan sebagai reference.</div></div><span class="badge ${overallAlert?'bad':'good'}">${overallAlert?'INVESTIGATE':'WITHIN APP TOLERANCE'}</span></div>
      <div class="panel-body flush"><div class="table-wrap" style="border:0;border-radius:0"><table class="recon-table bl-recon-table"><thead><tr><th>Source Figure</th><th>GSV @15°C (KL)</th><th>Metric Tons</th><th>Barrels @60°F</th><th>GSV Difference vs BL</th><th>GSV Variance</th><th>Assessment</th></tr></thead><tbody>
        <tr class="bl-row-base"><td><div class="cell-main">Bill of Lading / Terminal</div><div class="cell-sub">Commercial baseline</div></td><td class="mono">${cargoFmt(a.bl.gsv)}</td><td class="mono">${cargoFmt(a.bl.mtAir)}</td><td class="mono">${cargoFmt(a.bl.bbl,0)}</td><td class="mono">—</td><td class="mono">0.000%</td><td><span class="badge info">BASELINE</span></td></tr>
        ${row(a.ship.label,a.ship.gsv,a.ship.mtAir,a.ship.bbl,shipG)}
        ${row(a.surveyorRaw.label,a.surveyorRaw.gsv,a.surveyorRaw.mtAir,a.surveyorRaw.bbl,rawG)}
        ${row(a.surveyorVef.label,a.surveyorVef.gsv,a.surveyorVef.mtAir,a.surveyorVef.bbl,vefG)}
      </tbody></table></div></div>
    </div>

    <div class="bl-analysis-grid">
      <div class="panel">
        <div class="panel-head"><div><div class="panel-title">Document Variance Analysis</div><div class="panel-sub">Perbedaan angka bukan hanya BL vs vessel, tetapi juga antar sumber vessel figures.</div></div></div>
        <div class="panel-body">
          <div class="analysis-cards">
            <div class="analysis-card"><div class="ac-label">Ship Ullage vs BL · GSV</div><div class="ac-value text-warn">${shipG.diff.toFixed(3)} KL</div><div class="ac-sub">${shipG.pct.toFixed(3)}% calculated. Ship note of protest reports ${a.ship.reportedPct.toFixed(2)}%.</div></div>
            <div class="analysis-card"><div class="ac-label">Surveyor Raw vs BL · GSV</div><div class="ac-value text-warn">${rawG.diff.toFixed(3)} KL</div><div class="ac-sub">${rawG.pct.toFixed(3)}% calculated. Surveyor discrepancy notice reports ${a.surveyorRaw.reportedPct.toFixed(2)}%.</div></div>
            <div class="analysis-card"><div class="ac-label">Surveyor VEF vs BL · GSV</div><div class="ac-value text-good">${vefG.diff.toFixed(3)} KL</div><div class="ac-sub">${vefG.pct.toFixed(3)}% calculated after VEF ${a.surveyorVef.vef}. Reported notice: ${a.surveyorVef.reportedPct.toFixed(2)}%.</div></div>
          </div>
          <div class="bl-finding-list">
            <div class="bl-finding"><span>01</span><div><b>BL is higher than every vessel-based figure.</b><p>The largest GSV shortfall is the independent surveyor raw figure at ${Math.abs(rawG.diff).toFixed(3)} KL (${rawG.pct.toFixed(3)}%).</p></div></div>
            <div class="bl-finding"><span>02</span><div><b>Ship and surveyor figures are not identical.</b><p>Surveyor raw GSV is ${Math.abs(crossRaw.diff).toFixed(3)} KL ${crossRaw.diff<0?'below':'above'} the ship ullage report. After VEF, surveyor GSV is ${Math.abs(crossVef.diff).toFixed(3)} KL ${crossVef.diff<0?'below':'above'} the ship figure.</p></div></div>
            <div class="bl-finding"><span>03</span><div><b>VEF materially changes the apparent discrepancy.</b><p>Independent surveyor variance improves from ${rawG.pct.toFixed(3)}% raw to ${vefG.pct.toFixed(3)}% after VEF. The analysis should preserve both figures instead of overwriting the raw measurement.</p></div></div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div><div class="panel-title">Decision & Custody Baseline</div><div class="panel-sub">Recommended treatment before discharge analysis</div></div></div>
        <div class="panel-body">
          <div class="status-banner ${overallAlert?'alerting':'ok'}"><div><div class="status-main">${overallAlert?'DISCREPANCY ALERT':'WITHIN -0.300% APP TOLERANCE'}</div><div class="status-detail">All recorded loading-port GSV variances are ${overallAlert?'not':'currently'} within the application threshold, but source figures must remain separately traceable.</div></div><div class="status-score">${vefG.pct.toFixed(3)}%</div></div>
          <div class="bl-decision-box"><b>Recommended baseline hierarchy</b><ol><li><strong>BL / terminal computation</strong> remains the commercial reference for discharge reconciliation.</li><li><strong>Surveyor VEF-applied figure</strong> is stored as independent vessel comparison, not as a replacement for BL.</li><li><strong>Raw surveyor and ship ullage figures</strong> remain immutable evidence for document-level variance analysis.</li></ol></div>
          <div class="formula-note">Mass variance reference — Ship vs BL: ${shipM.diff.toFixed(3)} MT (${shipM.pct.toFixed(3)}%). Surveyor raw vs BL: ${rawM.diff.toFixed(3)} MT (${rawM.pct.toFixed(3)}%). Surveyor VEF vs BL: ${vefM.diff.toFixed(3)} MT (${vefM.pct.toFixed(3)}%).</div>
        </div>
      </div>
    </div>
  </div>`;
}
function custodyTransferPage(){
  return `${pageTitle('Fuel Blending Cargo Handling — Custody Receive & Transfer','Port Operation untuk Cargo Surveyor dan Loading Master: membaca data Bill of Lading dari port asal, menghitung tanker figure, memantau penerimaan Shore Tank R1–R4, lalu menganalisis cargo loss/gain dan tanker loss/gain.','<div class="cargo-toolbar"><button class="btn" id="populateCargoBtn">Populate Sample Data</button><button class="btn btn-primary" id="saveCargoBtn">Save Analysis Result</button></div>')}
  <div class="cargo-shell">
    <section class="cargo-section"><div class="cargo-section-head"><div><div class="section-kicker">Section 01 · Source Cargo Document</div><div class="cargo-section-title">Data Umum & Bill of Lading (BL)</div><div class="cargo-section-sub">Upload BL dari port asal, baca dokumen, lalu verifikasi angka custody sebelum discharge dimulai.</div></div><span class="section-number">01</span></div><div class="cargo-section-body">
      <div class="form-grid">
        ${cargoInput('Operation / Cargo Reference','ct_ref','CTR-2026-001','text')}${cargoInput('MT Tanker / Vessel','ct_vessel','MT Nusantara 8','text')}${cargoInput('Voyage No.','ct_voyage','V.018/2026','text')}${cargoInput('Product / Grade','ct_product','HSD / ADF 0.25% S','text')}
        ${cargoInput('Port of Loading / Origin','ct_origin','Tanjung Uban','text')}${cargoInput('Receiving Terminal','ct_terminal','Fuel Blending Terminal','text')}${cargoInput('Bill of Lading No.','ct_blno','BLS/010/2026','text')}${cargoInput('BL Date','ct_bldate','','date')}
      </div>
      <div style="height:12px"></div>
      <div class="doc-drop"><div class="doc-row"><div class="doc-file"><div class="doc-icon">BL</div><div><div class="doc-name" id="blDocName">No document selected</div><div class="doc-meta" id="blDocMeta">Supported reader: PDF text layer, TXT, CSV and JSON. Scanned image PDF requires OCR/backend.</div></div></div><div class="doc-actions"><label class="btn" style="display:inline-flex;align-items:center">Add BL Document<input id="blFile" type="file" accept=".pdf,.txt,.csv,.json,text/plain,application/pdf" hidden></label><button class="btn" id="readBlBtn" disabled>Read Document</button><button class="btn btn-danger" id="clearBlBtn">Clear</button></div></div><div class="doc-preview hidden" id="blDocPreview"></div></div>
      <div style="height:12px"></div>
      <div class="layout-2" style="margin-bottom:0"><div><div class="panel" style="border-color:var(--line)"><div class="panel-head"><div><div class="panel-title">Bill of Lading — Cargo Quantity</div><div class="panel-sub">Input / hasil ekstraksi dokumen port asal</div></div><span class="badge info" id="blReadStatus">MANUAL INPUT</span></div><div class="panel-body"><div class="input-inline">${cargoInput('BL GOV (m³)','BL_gov','4.485,650')}${cargoInput('BL Temperature (°C)','BL_temp','30.0')}${cargoInput('BL Density @15°C (kg/L)','BL_density','0.8350')}</div><div class="calc-grid">${metricBox('VCF','BL_vcf')}${metricBox('GSV (m³)','BL_gsv')}${metricBox('MT Vacuum','BL_mtvac')}${metricBox('MT Air','BL_mtair')}${metricBox('Long Ton','BL_lt')}</div></div></div></div>
      <div><div class="panel" style="border-color:var(--line)"><div class="panel-head"><div><div class="panel-title">Tanker Arrival Figure</div><div class="panel-sub">Figure kapal sebelum discharge untuk analisis tanker loss / gain terhadap BL</div></div><span class="badge warn">OPTIONAL CHECK</span></div><div class="panel-body"><div class="input-inline">${cargoInput('Tanker GOV (m³)','TK_gov','4.478,100')}${cargoInput('Tanker Temperature (°C)','TK_temp','29.5')}${cargoInput('Tanker Density @15°C (kg/L)','TK_density','0.8350')}</div><div class="calc-grid">${metricBox('VCF','TK_vcf')}${metricBox('GSV (m³)','TK_gsv')}${metricBox('MT Vacuum','TK_mtvac')}${metricBox('MT Air','TK_mtair')}${metricBox('Long Ton','TK_lt')}</div></div></div></div></div>
      <div class="formula-note">VCF simulation: exp(-alpha × ΔT × (1 + 0.8 × alpha × ΔT)), dengan alpha = (613.9723 / Density@15²) / 1,000,000. Kalkulator ini adalah simulasi pendekatan internal dan bukan pengganti tabel ASTM resmi / certified custody software.</div>
    </div></section>

    <section class="cargo-section"><div class="cargo-section-head"><div><div class="section-kicker">Section 02 · Shore Tank Receiving Progress</div><div class="cargo-section-title">Tahapan Penerimaan Tangki Darat — R1 sampai R4</div><div class="cargo-section-sub">Masukkan pembacaan kumulatif setiap tahap. Setiap reading otomatis dikoreksi ke standard volume dan mass.</div></div><span class="section-number">02</span></div><div class="cargo-section-body"><div class="reading-grid">${cargoReadingCard('R1','Initial Receiving')}${cargoReadingCard('R2','Intermediate Reading 1')}${cargoReadingCard('R3','Intermediate Reading 2')}${cargoReadingCard('R4','Final Shore Tank Figure')}</div></div></section>

    <section class="cargo-section"><div class="cargo-section-head"><div><div class="section-kicker">Section 03 · Reconciliation & Result</div><div class="cargo-section-title">Ringkasan Rekonsiliasi BL vs Tanker vs Shore R4</div><div class="cargo-section-sub">Hasil final menampilkan cargo loss/gain, tanker loss/gain, transfer variance, dan peringatan jika final loss melewati -0,3%.</div></div><span class="section-number">03</span></div><div class="cargo-section-body">
      <div class="status-banner ok" id="cargoStatusBanner"><div><div class="status-main" id="cargoStatusTitle">READY FOR INPUT</div><div class="status-detail" id="cargoStatusDetail">Masukkan BL dan Shore R4 untuk menjalankan rekonsiliasi.</div></div><div class="status-score" id="cargoStatusPct">0.000%</div></div>
      <div class="analysis-cards"><div class="analysis-card"><div class="ac-label">Tanker Loss / Gain vs BL · GSV</div><div class="ac-value" id="tankerVariance">0.000 m³</div><div class="ac-sub" id="tankerVariancePct">0.000% · waiting data</div></div><div class="analysis-card"><div class="ac-label">Cargo / Shore Loss or Gain vs BL · GSV</div><div class="ac-value" id="shoreVariance">0.000 m³</div><div class="ac-sub" id="shoreVariancePct">0.000% · tolerance loss -0.300%</div></div><div class="analysis-card"><div class="ac-label">Discharge Transfer Variance · Shore R4 vs Tanker</div><div class="ac-value" id="transferVariance">0.000 m³</div><div class="ac-sub" id="transferVariancePct">0.000% · vessel to shore movement</div></div></div>
      <div style="height:14px"></div><div class="summary-split"><div><div class="table-wrap"><table class="recon-table"><thead><tr><th>Parameter</th><th>Bill of Lading</th><th>Tanker Arrival</th><th>Shore R4 Final</th><th>Shore - BL</th><th>Variance %</th><th>Status</th></tr></thead><tbody><tr><td><div class="cell-main">GSV</div><div class="cell-sub">Gross Standard Volume · m³</div></td><td class="mono" id="rec_bl_gsv">0.000</td><td class="mono" id="rec_tk_gsv">0.000</td><td class="mono" id="rec_r4_gsv">0.000</td><td class="mono" id="rec_diff_gsv">0.000</td><td class="mono" id="rec_pct_gsv">0.000%</td><td id="rec_status_gsv"><span class="badge neutral">WAIT</span></td></tr><tr><td><div class="cell-main">Metric Tons in Air</div><div class="cell-sub">Mass reconciliation · MT</div></td><td class="mono" id="rec_bl_mt">0.000</td><td class="mono" id="rec_tk_mt">0.000</td><td class="mono" id="rec_r4_mt">0.000</td><td class="mono" id="rec_diff_mt">0.000</td><td class="mono" id="rec_pct_mt">0.000%</td><td id="rec_status_mt"><span class="badge neutral">WAIT</span></td></tr></tbody></table></div></div><div><div class="progress-chart" id="cargoProgressChart">${['R1','R2','R3','R4'].map(x=>`<div class="progress-bar-wrap"><div class="progress-value" id="barVal${x}">0</div><div class="progress-bar" id="bar${x}" style="height:2px"></div><div class="progress-label">${x}</div></div>`).join('')}</div></div></div>
    </div></section>
  </div>`;
}

function cargoCalculatorPage(){
  return `${pageTitle('Custody Transfer Cargo & Tanker Discharge Calculator','Halaman hitung khusus Cargo Surveyor dan Loading Master untuk mengonversi BL, tanker arrival figure, Shore Tank R1–R4 dan melakukan rekonsiliasi final.','<div class="cargo-toolbar"><button class="btn" id="populateCargoBtn">Populate Sample Data</button><button class="btn" id="resetCargoBtn">Reset Calculator</button><button class="btn btn-primary" id="saveCargoBtn">Save Calculation</button></div>')}
  <div class="cargo-shell calculator-only">
    <section class="cargo-section">
      <div class="cargo-section-head"><div><div class="section-kicker">Section 01 · General Data & Bill of Lading</div><div class="cargo-section-title">Data Umum dan Input Bill of Lading (BL)</div><div class="cargo-section-sub">Masukkan data dasar cargo. BL menjadi referensi utama untuk seluruh perbandingan loss/gain.</div></div><span class="section-number">01</span></div>
      <div class="cargo-section-body">
        <div class="form-grid">
          ${cargoInput('Operation / Cargo Reference','ct_ref','CTR-2026-001','text')}${cargoInput('MT Tanker / Vessel','ct_vessel','MT Nusantara 8','text')}${cargoInput('Voyage No.','ct_voyage','V.018/2026','text')}${cargoInput('Product / Grade','ct_product','HSD / ADF 0.25% S','text')}
          ${cargoInput('Port of Loading / Origin','ct_origin','Tanjung Uban','text')}${cargoInput('Receiving Terminal','ct_terminal','Fuel Blending Terminal','text')}${cargoInput('Bill of Lading No.','ct_blno','BLS/010/2026','text')}${cargoInput('BL Date','ct_bldate','','date')}
        </div>
        <div class="calculator-source-grid">
          <div class="panel calculator-panel"><div class="panel-head"><div><div class="panel-title">Bill of Lading — Reference Quantity</div><div class="panel-sub">GOV, actual temperature dan density @15°C</div></div><span class="badge info">PRIMARY REFERENCE</span></div><div class="panel-body">
            <div class="input-inline">${cargoInput('BL GOV (m³)','BL_gov','4.485,650')}${cargoInput('BL Temperature (°C)','BL_temp','30.0')}${cargoInput('BL Density @15°C (kg/L)','BL_density','0.8350')}</div>
            <div class="calc-grid">${metricBox('VCF','BL_vcf')}${metricBox('GSV (m³)','BL_gsv')}${metricBox('MT Vacuum','BL_mtvac')}${metricBox('MT Air','BL_mtair')}${metricBox('Long Ton','BL_lt')}</div>
          </div></div>
          <div class="panel calculator-panel"><div class="panel-head"><div><div class="panel-title">Tanker Arrival Figure</div><div class="panel-sub">Opsional untuk analisis tanker loss/gain sebelum discharge</div></div><span class="badge warn">TANKER CHECK</span></div><div class="panel-body">
            <div class="input-inline">${cargoInput('Tanker GOV (m³)','TK_gov','4.478,100')}${cargoInput('Tanker Temperature (°C)','TK_temp','29.5')}${cargoInput('Tanker Density @15°C (kg/L)','TK_density','0.8350')}</div>
            <div class="calc-grid">${metricBox('VCF','TK_vcf')}${metricBox('GSV (m³)','TK_gsv')}${metricBox('MT Vacuum','TK_mtvac')}${metricBox('MT Air','TK_mtair')}${metricBox('Long Ton','TK_lt')}</div>
          </div></div>
        </div>
        <div class="formula-note"><b>VCF simulation:</b> exp(-alpha × ΔT × (1 + 0.8 × alpha × ΔT)), ΔT = Temperature − 15, alpha = (613.9723 / Density@15²) / 1,000,000. Kalkulator ini menggunakan pendekatan matematis untuk simulasi dan tidak menggantikan ASTM Table 54B resmi atau certified custody software.</div>
      </div>
    </section>

    <section class="cargo-section">
      <div class="cargo-section-head"><div><div class="section-kicker">Section 02 · Shore Tank Receiving Stages</div><div class="cargo-section-title">Tahapan Penerimaan Tangki Darat — R1 sampai R4</div><div class="cargo-section-sub">Setiap reading dihitung otomatis menjadi VCF, GSV, Metric Tons Vacuum, Metric Tons Air dan Long Tons.</div></div><span class="section-number">02</span></div>
      <div class="cargo-section-body"><div class="reading-grid">${cargoReadingCard('R1','Initial Receiving')}${cargoReadingCard('R2','Intermediate Reading 1')}${cargoReadingCard('R3','Intermediate Reading 2')}${cargoReadingCard('R4','Final Shore Tank Figure')}</div></div>
    </section>

    <section class="cargo-section">
      <div class="cargo-section-head"><div><div class="section-kicker">Section 03 · Final Reconciliation</div><div class="cargo-section-title">Ringkasan BL vs Shore R4 Final</div><div class="cargo-section-sub">Loss di bawah -0,300% memicu discrepancy alert. Tanker arrival tetap ditampilkan sebagai secondary custody reference.</div></div><span class="section-number">03</span></div>
      <div class="cargo-section-body">
        <div class="status-banner ok" id="cargoStatusBanner"><div><div class="status-main" id="cargoStatusTitle">READY FOR INPUT</div><div class="status-detail" id="cargoStatusDetail">Masukkan BL dan Shore R4 untuk menjalankan rekonsiliasi.</div></div><div class="status-score" id="cargoStatusPct">0.000%</div></div>
        <div class="analysis-cards"><div class="analysis-card"><div class="ac-label">Tanker Loss / Gain vs BL · GSV</div><div class="ac-value" id="tankerVariance">0.000 m³</div><div class="ac-sub" id="tankerVariancePct">0.000% · waiting data</div></div><div class="analysis-card"><div class="ac-label">Shore R4 Loss / Gain vs BL · GSV</div><div class="ac-value" id="shoreVariance">0.000 m³</div><div class="ac-sub" id="shoreVariancePct">0.000% · tolerance loss -0.300%</div></div><div class="analysis-card"><div class="ac-label">Discharge Transfer Variance · Shore R4 vs Tanker</div><div class="ac-value" id="transferVariance">0.000 m³</div><div class="ac-sub" id="transferVariancePct">0.000% · vessel to shore movement</div></div></div>
        <div class="reconciliation-layout">
          <div class="table-wrap"><table class="recon-table"><thead><tr><th>Parameter</th><th>Bill of Lading</th><th>Tanker Arrival</th><th>Shore R4 Final</th><th>Shore − BL</th><th>Variance %</th><th>Status</th></tr></thead><tbody>
            <tr><td><div class="cell-main">GSV</div><div class="cell-sub">Gross Standard Volume · m³</div></td><td class="mono" id="rec_bl_gsv">0.000</td><td class="mono" id="rec_tk_gsv">0.000</td><td class="mono" id="rec_r4_gsv">0.000</td><td class="mono" id="rec_diff_gsv">0.000</td><td class="mono" id="rec_pct_gsv">0.000%</td><td id="rec_status_gsv"><span class="badge neutral">WAIT</span></td></tr>
            <tr><td><div class="cell-main">Metric Tons in Air</div><div class="cell-sub">Mass reconciliation · MT</div></td><td class="mono" id="rec_bl_mt">0.000</td><td class="mono" id="rec_tk_mt">0.000</td><td class="mono" id="rec_r4_mt">0.000</td><td class="mono" id="rec_diff_mt">0.000</td><td class="mono" id="rec_pct_mt">0.000%</td><td id="rec_status_mt"><span class="badge neutral">WAIT</span></td></tr>
          </tbody></table></div>
          <div class="chart-card"><div class="chart-card-head"><div><div class="panel-title">Cumulative Shore Volume Progress</div><div class="panel-sub">GSV progression from R1 to R4</div></div><span class="badge info">LIVE CALC</span></div><div class="chart-stage"><canvas id="cargoVolumeChart" aria-label="R1 to R4 cumulative GSV chart"></canvas><div class="progress-chart chart-fallback" id="cargoProgressChart">${['R1','R2','R3','R4'].map(x=>`<div class="progress-bar-wrap"><div class="progress-value" id="barVal${x}">0</div><div class="progress-bar" id="bar${x}" style="height:2px"></div><div class="progress-label">${x}</div></div>`).join('')}</div></div></div>
        </div>
      </div>
    </section>
  </div>`;
}

function setCargoOutputs(prefix,c){
  const ids={vcf:c.vcf,gsv:c.gsv,mtvac:c.mtVac,mtair:c.mtAir,lt:c.longTon};
  Object.entries(ids).forEach(([k,v])=>{const el=document.getElementById(`${prefix}_${k}`);if(el)el.textContent=k==='vcf'?Number(v||0).toFixed(7):cargoFmt(v,3)});
}
function readCargoSet(prefix){return cargoCalc(document.getElementById(`${prefix}_gov`)?.value,document.getElementById(`${prefix}_temp`)?.value,document.getElementById(`${prefix}_density`)?.value)}
function varianceText(diff,pct){return `${diff>=0?'+':''}${cargoFmt(diff,3)} m³ · ${pct>=0?'+':''}${pct.toFixed(3)}%`}
function cargoStatusBadge(pct){if(!Number.isFinite(pct))return '<span class="badge neutral">WAIT</span>';if(pct<-.3)return '<span class="badge bad">EXCEEDS TOLERANCE</span>';if(pct>0)return '<span class="badge info">GAIN</span>';return '<span class="badge good">WITHIN TOLERANCE</span>'}

let cargoVolumeChartInstance=null;
function renderCargoVolumeChart(data){
  const canvas=document.getElementById('cargoVolumeChart');
  const fallback=document.getElementById('cargoProgressChart');
  if(!canvas)return;
  const labels=['R1','R2','R3','R4'];
  const values=labels.map(k=>Number(data[k]?.gsv||0));
  if(window.Chart){
    if(fallback)fallback.classList.add('hidden');
    if(cargoVolumeChartInstance){try{cargoVolumeChartInstance.destroy()}catch(e){}}
    const ctx=canvas.getContext('2d');
    cargoVolumeChartInstance=new Chart(ctx,{
      type:'line',
      data:{labels,datasets:[{label:'GSV (m³)',data:values,borderWidth:2,pointRadius:4,pointHoverRadius:6,tension:.25,fill:true}]},
      options:{responsive:true,maintainAspectRatio:false,animation:{duration:220},plugins:{legend:{display:false},tooltip:{callbacks:{label:(c)=>` ${cargoFmt(c.parsed.y,3)} m³`}}},scales:{x:{grid:{display:false},ticks:{color:'#8d9aa5'}},y:{beginAtZero:true,grid:{color:'rgba(141,154,165,.12)'},ticks:{color:'#8d9aa5',callback:v=>Number(v).toLocaleString('id-ID')}}}}
    });
  }else{
    canvas.classList.add('hidden');
    if(fallback)fallback.classList.remove('hidden');
  }
}

function updateCargoCalculator(){
  const prefixes=['BL','TK','R1','R2','R3','R4'];const data={};prefixes.forEach(p=>{data[p]=readCargoSet(p);setCargoOutputs(p,data[p])});
  const bl=data.BL,tk=data.TK,r4=data.R4;
  const gsvDiff=r4.gsv-bl.gsv, gsvPct=bl.gsv?gsvDiff/bl.gsv*100:NaN;
  const mtDiff=r4.mtAir-bl.mtAir, mtPct=bl.mtAir?mtDiff/bl.mtAir*100:NaN;
  const tankerDiff=tk.gsv-bl.gsv,tankerPct=bl.gsv?tankerDiff/bl.gsv*100:NaN;
  const transferDiff=r4.gsv-tk.gsv,transferPct=tk.gsv?transferDiff/tk.gsv*100:NaN;
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
  set('rec_bl_gsv',cargoFmt(bl.gsv));set('rec_tk_gsv',cargoFmt(tk.gsv));set('rec_r4_gsv',cargoFmt(r4.gsv));set('rec_diff_gsv',`${gsvDiff>=0?'+':''}${cargoFmt(gsvDiff)}`);set('rec_pct_gsv',Number.isFinite(gsvPct)?`${gsvPct>=0?'+':''}${gsvPct.toFixed(3)}%`:'0.000%');
  set('rec_bl_mt',cargoFmt(bl.mtAir));set('rec_tk_mt',cargoFmt(tk.mtAir));set('rec_r4_mt',cargoFmt(r4.mtAir));set('rec_diff_mt',`${mtDiff>=0?'+':''}${cargoFmt(mtDiff)}`);set('rec_pct_mt',Number.isFinite(mtPct)?`${mtPct>=0?'+':''}${mtPct.toFixed(3)}%`:'0.000%');
  const sg=document.getElementById('rec_status_gsv'),sm=document.getElementById('rec_status_mt');if(sg)sg.innerHTML=cargoStatusBadge(gsvPct);if(sm)sm.innerHTML=cargoStatusBadge(mtPct);
  set('tankerVariance',`${tankerDiff>=0?'+':''}${cargoFmt(tankerDiff)} m³`);set('tankerVariancePct',Number.isFinite(tankerPct)?`${tankerPct>=0?'+':''}${tankerPct.toFixed(3)}% · ${tankerPct<0?'tanker loss':tankerPct>0?'tanker gain':'balanced'}`:'0.000% · waiting data');
  set('shoreVariance',`${gsvDiff>=0?'+':''}${cargoFmt(gsvDiff)} m³`);set('shoreVariancePct',Number.isFinite(gsvPct)?`${gsvPct>=0?'+':''}${gsvPct.toFixed(3)}% · ${gsvPct<-.3?'exceeds -0.300% tolerance':gsvPct<0?'loss within tolerance':gsvPct>0?'cargo gain':'balanced'}`:'0.000% · tolerance loss -0.300%');
  set('transferVariance',`${transferDiff>=0?'+':''}${cargoFmt(transferDiff)} m³`);set('transferVariancePct',Number.isFinite(transferPct)?`${transferPct>=0?'+':''}${transferPct.toFixed(3)}% · shore R4 vs tanker arrival`:'0.000% · vessel to shore movement');
  const banner=document.getElementById('cargoStatusBanner');const title=document.getElementById('cargoStatusTitle');const detail=document.getElementById('cargoStatusDetail');const pctEl=document.getElementById('cargoStatusPct');
  if(banner&&title&&detail&&pctEl){banner.className='status-banner '+(!Number.isFinite(gsvPct)?'ok':gsvPct<-.3?'alerting':gsvPct>0?'gain':'ok');if(!Number.isFinite(gsvPct)){title.textContent='READY FOR INPUT';detail.textContent='Masukkan BL dan Shore R4 untuk menjalankan rekonsiliasi.';pctEl.textContent='0.000%';}else if(gsvPct<-.3){title.textContent='DISCREPANCY ALERT / EXCEEDS TOLERANCE';detail.textContent='Final Shore R4 menunjukkan kehilangan lebih besar dari batas -0,300% terhadap BL. Hold result untuk investigation dan document review.';pctEl.textContent=gsvPct.toFixed(3)+'%';}else if(gsvPct>0){title.textContent='CARGO GAIN / POSITIVE VARIANCE';detail.textContent='Final Shore R4 lebih tinggi dari BL. Review measurement uncertainty, temperature correction dan source figures sebelum final acceptance.';pctEl.textContent='+'+gsvPct.toFixed(3)+'%';}else{title.textContent='WITHIN CUSTODY TOLERANCE';detail.textContent='Final Shore R4 berada dalam batas kehilangan -0,300% terhadap BL.';pctEl.textContent=gsvPct.toFixed(3)+'%';}}
  const vals=['R1','R2','R3','R4'].map(p=>data[p].gsv);const max=Math.max(...vals,1);vals.forEach((v,i)=>{const p=['R1','R2','R3','R4'][i];const bar=document.getElementById('bar'+p),label=document.getElementById('barVal'+p);if(bar)bar.style.height=Math.max(2,(v/max)*100)+'%';if(label)label.textContent=cargoFmt(v,1)});
  renderCargoVolumeChart(data);
}
function populateCargoSample(){
  const values={ct_ref:'CTR-260718-001',ct_vessel:'MT Nusantara 8',ct_voyage:'V.018/2026',ct_product:'HSD / ADF 0.25% S',ct_origin:'Tanjung Uban',ct_terminal:'Fuel Blending Terminal',ct_blno:'BLS/010/2026',ct_bldate:'2026-07-17',BL_gov:'4485.650',BL_temp:'30.2',BL_density:'0.8350',TK_gov:'4477.900',TK_temp:'29.6',TK_density:'0.8350',R1_gov:'1120.500',R1_temp:'29.1',R1_density:'0.8350',R2_gov:'2242.950',R2_temp:'28.6',R2_density:'0.8350',R3_gov:'3359.400',R3_temp:'28.0',R3_density:'0.8350',R4_gov:'4468.200',R4_temp:'27.5',R4_density:'0.8350'};
  Object.entries(values).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v});updateCargoCalculator();toast('Sample cargo discharge data populated');
}
function clearBLDocument(){const file=document.getElementById('blFile'),name=document.getElementById('blDocName'),meta=document.getElementById('blDocMeta'),prev=document.getElementById('blDocPreview'),btn=document.getElementById('readBlBtn'),status=document.getElementById('blReadStatus');if(file)file.value='';if(name)name.textContent='No document selected';if(meta)meta.textContent='Supported reader: PDF text layer, TXT, CSV and JSON. Scanned image PDF requires OCR/backend.';if(prev){prev.textContent='';prev.classList.add('hidden')}if(btn)btn.disabled=true;if(status){status.className='badge info';status.textContent='MANUAL INPUT'}window.__blSelectedFile=null;}
async function extractPDFText(file){if(!window.pdfjsLib)throw new Error('PDF reader library not available');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';const buf=await file.arrayBuffer();const pdf=await pdfjsLib.getDocument({data:buf}).promise;let text='';for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p);const tc=await page.getTextContent();text+='\n'+tc.items.map(x=>x.str).join(' ')}return text.trim()}
async function readBLDocument(){
  const file=window.__blSelectedFile;if(!file){toast('Select BL document first');return}const prev=document.getElementById('blDocPreview'),status=document.getElementById('blReadStatus');if(status){status.className='badge warn';status.textContent='READING...'}
  try{let text='';if(file.type==='application/pdf'||file.name.toLowerCase().endsWith('.pdf'))text=await extractPDFText(file);else text=await file.text();if(!text.trim())throw new Error('No readable text layer found');if(prev){prev.textContent=text.slice(0,7000);prev.classList.remove('hidden')}parseBLText(text);if(status){status.className='badge good';status.textContent='DOC READ'}toast('BL document read and mapped to available fields');}
  catch(err){if(status){status.className='badge bad';status.textContent='READ FAILED'}if(prev){prev.textContent='Unable to extract readable text automatically. '+err.message+'\n\nFor scanned BL, use OCR/backend in production or enter verified BL values manually.';prev.classList.remove('hidden')}toast('Document cannot be auto-read; manual input remains available');}
}
function matchDoc(text,patterns){for(const p of patterns){const m=text.match(p);if(m&&m[1])return m[1].trim()}return ''}
function parseBLText(text){
  const map={ct_blno:[/(?:bill\s*of\s*lading|b\/l|bl)\s*(?:no\.?|number)?\s*[:#-]?\s*([A-Z0-9\/-]{4,})/i],ct_vessel:[/(?:vessel|ship|mt\.?\s*tanker)\s*(?:name)?\s*[:#-]?\s*([^\n]{3,50})/i],ct_product:[/(?:product|grade|cargo)\s*[:#-]?\s*([^\n]{2,60})/i],ct_origin:[/(?:port\s*of\s*loading|loading\s*port|origin)\s*[:#-]?\s*([^\n]{2,60})/i],BL_gov:[/(?:gross\s*observed\s*volume|\bGOV\b)[^0-9]{0,25}([0-9][0-9.,]*)/i],BL_temp:[/(?:temperature|temp(?:erature)?|suhu)[^0-9-]{0,20}(-?[0-9][0-9.,]*)/i],BL_density:[/(?:density\s*@?\s*15(?:°?c)?|density\s*15)[^0-9]{0,25}([0-9][0-9.,]*)/i]};
  let found=0;Object.entries(map).forEach(([id,patterns])=>{const v=matchDoc(text,patterns);const el=document.getElementById(id);if(v&&el){el.value=v.replace(/\s{2,}.*/,'').trim();found++}});updateCargoCalculator();const status=document.getElementById('blReadStatus');if(status)status.textContent=found?`DOC READ · ${found} FIELD${found>1?'S':''}`:'DOC READ · VERIFY MANUALLY';
}
function bindCustodyTransfer(){
  const root=document.querySelector('.cargo-shell');if(!root)return;root.addEventListener('input',e=>{if(e.target.matches('input[id$="_gov"],input[id$="_temp"],input[id$="_density"]'))updateCargoCalculator()});
  const pop=document.getElementById('populateCargoBtn');if(pop)pop.onclick=populateCargoSample;const reset=document.getElementById('resetCargoBtn');if(reset)reset.onclick=()=>{root.querySelectorAll('input').forEach(el=>{if(el.type!=='file')el.value=''});updateCargoCalculator();toast('Calculator cleared')};
  const file=document.getElementById('blFile');if(file)file.onchange=e=>{const f=e.target.files?.[0];window.__blSelectedFile=f||null;const name=document.getElementById('blDocName'),meta=document.getElementById('blDocMeta'),btn=document.getElementById('readBlBtn'),prev=document.getElementById('blDocPreview');if(f){name.textContent=f.name;meta.textContent=`${f.type||'unknown type'} · ${(f.size/1024).toFixed(1)} KB · ready to read`;btn.disabled=false;if(prev)prev.classList.add('hidden')}else clearBLDocument()};
  const read=document.getElementById('readBlBtn');if(read)read.onclick=readBLDocument;const clear=document.getElementById('clearBlBtn');if(clear)clear.onclick=clearBLDocument;
  const save=document.getElementById('saveCargoBtn');if(save)save.onclick=()=>{const bl=readCargoSet('BL'),tk=readCargoSet('TK'),r4=readCargoSet('R4');if(!(bl.gsv>0&&r4.gsv>0)){toast('BL and Shore R4 data are required before saving');return}const pct=(r4.gsv-bl.gsv)/bl.gsv*100;const rec={id:document.getElementById('ct_ref')?.value||'CTR-'+Date.now(),vessel:document.getElementById('ct_vessel')?.value||'-',blNo:document.getElementById('ct_blno')?.value||'-',product:document.getElementById('ct_product')?.value||'-',blGsv:bl.gsv,tankerGsv:tk.gsv,shoreGsv:r4.gsv,variancePct:pct,status:pct<-.3?'DISCREPANCY':'WITHIN_TOLERANCE',time:nowText()};state.cargoTransfers.unshift(rec);audit('SAVE CUSTODY TRANSFER RESULT',`${rec.id} · ${rec.vessel} · ${pct.toFixed(3)}% · ${rec.status}`);toast('Custody transfer analysis result saved in prototype session')};
  updateCargoCalculator();
}
function dischargePage(type='discharge'){
  const isBarge=type==='marine_loading';
  return `${pageTitle(isBarge?'Loading to Barge':'Discharge Cargo',isBarge?'Pencatatan custody transfer dari shore tank ke barge/kapal.':'Pencatatan data discharge vessel ke terminal oleh SPV operator, termasuk observed volume, volume @15°C, metric ton dan long ton.')}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">${isBarge?'New Barge Loading Record':'New Discharge Record'}</div><div class="panel-sub">Custody data marine operation</div></div></div><div class="panel-body"><form id="marineForm" data-kind="${isBarge?'barge':'discharge'}"><div class="form-grid">
    ${field(isBarge?'Barge / Vessel':'Vessel name','vessel','')}${field('Product','product','HSD')}${field('Observed volume (KL)','obs','0','number')}${field('Volume @15°C (KL)','at15','0','number')}${field('Metric tons (MT)','mt','0','number')}${field('Long tons (LT)','lt','0','number')}<div class="field span-2"><label>Custody reference</label><input name="reference" placeholder="B/L, CQD, tank ticket atau reference number"></div><div class="field span-4"><label>Remarks</label><textarea name="remarks" placeholder="Kondisi operasi, stop time, weather, tank transfer atau catatan custody lain."></textarea></div>
  </div><div class="form-actions"><button class="btn btn-primary">Save Marine Record</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Latest Marine Operations</div><div class="panel-sub">Observed / @15 / mass summary</div></div></div><div class="panel-body">${state.discharge.map(d=>`<div class="alert"><div class="alert-top"><div class="alert-title">${d.id} · ${d.vessel}</div>${badge(d.status)}</div><div class="alert-meta">${d.type} · ${d.product}<br>OBS ${fmt(d.obs)} KL · @15 ${fmt(d.at15)} KL · ${fmt(d.mt)} MT · ${fmt(d.lt)} LT</div></div>`).join('')}</div></div></div>`;
}
function adminPage(){
  const rows=Object.entries(ROLE_CONFIG).map(([k,v])=>`<tr><td><div class="cell-main">${v.label}</div><div class="cell-sub">${k}</div></td><td>${v.site}</td><td>${v.scope}</td><td class="mono">${v.modules.length}</td><td>${k==='it_admin'?'<span class="badge bad">ALL DATA</span>':'<span class="badge good">SCOPED</span>'}</td></tr>`).join('');
  return `${pageTitle('Access & Data Governance','Model role-based access untuk mencegah customer melihat data operasional Fuel Blending yang tidak terkait dengan shipment mereka.')}
  <div class="layout-3">${kpi('Configured roles','6','Field, SPV, 3 customer, IT','95')}${kpi('Customer isolation','3 sites','RF · Mill · Maintank','100','text-good')}${kpi('Audit events',state.audit.length,'Prototype in-memory log','45')}</div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Role Access Matrix</div><div class="panel-sub">Prinsip least privilege berdasarkan site dan fungsi</div></div></div><div class="panel-body flush"><div class="table-wrap" style="border:0;border-radius:0"><table><thead><tr><th>Role</th><th>Site</th><th>Data Scope</th><th>Modules</th><th>Privilege</th></tr></thead><tbody>${rows}</tbody></table></div></div></div>
  <div style="height:14px"></div><div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Recommended Backend Controls</div><div class="panel-sub">Wajib saat prototype dipindah ke Firebase / API backend</div></div></div><div class="panel-body"><div class="check-list">${['Role claim divalidasi di server, bukan hanya hide menu','Customer query wajib dibatasi destination/site claim','Custody packet dikunci setelah after inspection PASS','Setiap perubahan seal dan volume masuk audit log immutable','Upload bukti foto disimpan dengan checksum dan metadata','Alert volume / seal mismatch tidak dapat dihapus oleh receiving operator'].map(x=>`<div class="check-row"><span class="check-name">${x}</span><span class="badge good">REQUIRED</span></div>`).join('')}</div></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Recent Prototype Audit</div><div class="panel-sub">Aktivitas selama sesi browser ini</div></div></div><div class="panel-body">${state.audit.length?state.audit.slice(0,8).map(a=>`<div class="alert"><div class="alert-title">${a.action}</div><div class="alert-meta">${a.time} · ${a.role}<br>${a.detail}</div></div>`).join(''):'<div style="padding:25px;text-align:center;color:var(--dim)">Belum ada aktivitas baru pada sesi ini.</div>'}</div></div></div>`;
}
function bindForms(){
  bindCustodyTransfer();
  const clearBl=$('#clearBlAnalysisBtn');if(clearBl)clearBl.onclick=()=>{state.blAnalyses=[];audit('CLEAR BL ANALYSIS','All BL analysis records cleared');toast('BL analysis data cleared');renderAll();};
  const pre=$('#preForm'); if(pre)pre.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(pre));const id='PRE-'+Date.now().toString().slice(-8);state.inspections.unshift({...f,id,time:nowText()});audit('CREATE PRE-INSPECTION',`${id} · ${f.unitCode} · ${f.result}`);toast('Before loading inspection tersimpan');renderAll();};
  const lf=$('#loadingForm'); if(lf){const calc=()=>{const f=new FormData(lf);const total=Number(f.get('flowEnd')||0)-Number(f.get('flowStart')||0);$('#calcFlow').value=fmt(total)+' L';};lf.addEventListener('input',calc);calc();lf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(lf));const ins=state.inspections.find(i=>i.id===f.preId);const total=Number(f.flowEnd)-Number(f.flowStart);if(total<=0){toast('Flowmeter final harus lebih besar dari initial');return;}const id='SHP-'+Date.now().toString().slice(-9);state.shipments.unshift({id,preId:ins.id,dest:ins.destination,unitCode:ins.unitCode,plate:ins.plate,driver:ins.driver,transporter:ins.transporter,request:Number(f.request),flowStart:Number(f.flowStart),flowEnd:Number(f.flowEnd),total,soundingBefore:Number(f.soundingBefore),soundingAfter:Number(f.soundingAfter),seals:[],status:'AWAITING_AFTER',dispatchAt:null,eta:null,afterCondition:null,validation:null});audit('COMPLETE LOADING',`${id} · ${fmt(total)} L`);toast('Loading record selesai, menunggu after inspection');state.page='after_inspection';renderAll();};}
  const af=$('#afterForm'); if(af)af.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(af));const s=state.shipments.find(x=>x.id===f.shipmentId);s.seals=[f.seal1,f.seal2,f.seal3,f.seal4].map(x=>x.trim());s.afterCondition=f.condition;s.status=f.condition==='Reject'?'HOLD':'IN_TRANSIT';s.dispatchAt=nowText();s.eta='Calculated by route service';audit('FINALIZE AFTER INSPECTION',`${s.id} · ${s.status} · seals locked`);toast('Custody packet terkunci dan dikirim ke destination');state.page='shipment_monitor';renderAll();};
  const rf=$('#receivingForm'); if(rf){const sel=$('#receivingShipment');sel.onchange=()=>{const s=state.shipments.find(x=>x.id===sel.value);$('#dispatchPacket').innerHTML=dispatchPacket(s);autoFillReceiving(rf,s);};rf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(rf));const s=state.shipments.find(x=>x.id===f.shipmentId);const received=Number(f.received);const diff=received-s.total;const tolerance=s.total*TOLERANCE_RATE;const volumePass=Math.abs(diff)<=tolerance;const given=[f.seal1,f.seal2,f.seal3,f.seal4].map(x=>x.trim().toUpperCase());const expected=s.seals.map(x=>x.trim().toUpperCase());const sealPass=JSON.stringify(given)===JSON.stringify(expected);const identityPass=f.unitCode.trim().toUpperCase()===s.unitCode.toUpperCase()&&f.plate.trim().toUpperCase()===s.plate.toUpperCase()&&f.driver.trim().toUpperCase()===s.driver.toUpperCase()&&f.transporter.trim().toUpperCase()===s.transporter.toUpperCase();const seriousDamage=f.damage==='Ada kerusakan serius';let risk='LOW';if(!sealPass||seriousDamage)risk='CRITICAL';else if(!volumePass||!identityPass)risk='HIGH';s.validation={received,diff,pct:Math.abs(diff)/s.total*100,tolerance,volumePass,sealPass,identityPass,risk,time:nowText(),notes:f.notes||''};s.status=(volumePass&&sealPass&&identityPass&&!seriousDamage)?'RECEIVED':'HOLD';audit('RECEIVING VALIDATION',`${s.id} · ${s.status} · variance ${fmt(diff)} L · risk ${risk}`);toast(s.status==='RECEIVED'?'Receiving valid dan shipment ditutup':'Exception terdeteksi — shipment masuk HOLD');state.page='site_history';renderAll();};}
  const mf=$('#marineForm');if(mf)mf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(mf));const kind=mf.dataset.kind;const id=(kind==='barge'?'BL-':'DC-')+Date.now().toString().slice(-8);state.discharge.unshift({id,type:kind==='barge'?'Shore Tank → Barge':'Vessel → Shore Tank',vessel:f.vessel,product:f.product,obs:Number(f.obs),at15:Number(f.at15),mt:Number(f.mt),lt:Number(f.lt),status:'COMPLETED',time:nowText()});audit('CREATE MARINE RECORD',`${id} · ${f.vessel}`);toast('Marine custody record tersimpan');renderAll();};
}
function autoFillReceiving(form,s){['unitCode','plate','driver','transporter'].forEach(k=>{if(form.elements[k])form.elements[k].value=s[k]});['seal1','seal2','seal3','seal4'].forEach((k,i)=>{if(form.elements[k])form.elements[k].value=s.seals[i]||''});if(form.elements.received)form.elements.received.value=s.total;}
function goPage(p){if(role().modules.includes(p)){state.page=p;renderAll()}}
window.goPage=goPage;
function renderPage(){
  const pages={dashboard,spv_dashboard:spvDashboard,pre_inspection:preInspection,loading:loadingPage,after_inspection:afterInspection,shipment_monitor:shipmentMonitor,receiving:receivingPage,site_history:siteHistory,validation:validationPage,bl_analysis:blAnalysisPage,custody_transfer:custodyTransferPage,cargo_calculator:cargoCalculatorPage,discharge:()=>dischargePage('discharge'),marine_loading:()=>dischargePage('marine_loading'),admin:adminPage};
  if(!role().modules.includes(state.page))state.page=defaultPageForRole();
  $('#content').innerHTML=(pages[state.page]||pages[defaultPageForRole()]||dashboard)();
  $('#crumb').textContent=NAV.flatMap(x=>x.items).find(x=>x[0]===state.page)?.[2]||'Dashboard';
  bindForms();
}
function renderAll(){renderIdentity();renderNav();renderTicker();renderPage();}
function closeMenu(){$('#sidebar').classList.remove('open');$('#overlay').classList.remove('show')}
$('#menuBtn').onclick=()=>{$('#sidebar').classList.toggle('open');$('#overlay').classList.toggle('show')};$('#overlay').onclick=closeMenu;
setInterval(()=>$('#clock').textContent=new Date().toLocaleString('id-ID',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}),1000);
setupRoles();renderAll();
