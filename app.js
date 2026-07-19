const TOLERANCE_RATE = 0.0001; // 0.01%
const ROLE_CONFIG = {
  fuel_field:{label:'Fuel Field Operator',site:'Fuel Blending',scope:'Inspeksi unit, data lapangan loading dan final after-loading inspection',modules:['dashboard','pre_inspection','loading','after_inspection','shipment_monitor']},
  fuel_spv:{label:'Fuel SPV Operator',site:'Fuel Blending',scope:'Supervisi order, operator field, custody, receiving, analisis BL dan port operation',modules:['spv_dashboard','order_control','shipment_monitor','receiving_results','notifications','bl_analysis','custody_transfer','cargo_calculator','discharge','marine_loading','validation']},
  cr_operator:{label:'Control Room Operator',site:'Fuel Blending · Control Room',scope:'Order queue, validasi data field, flowmeter final, dispatch dan monitoring receiving',modules:['cr_dashboard','order_control','cr_loading','shipment_monitor','receiving_results','notifications']},
  rf_operator:{label:'RF Operator',site:'Riau Fiber',scope:'Membuat dan mengedit order RF sebelum inspection lock, memantau dispatch, physical arrival dan final receiving',modules:['rf_dashboard','rf_orders','receiving','receiving_results','site_history','notifications']},
  mill_operator:{label:'Mill Operator',site:'Mill',scope:'Hanya shipment tujuan Mill dan data receiving site sendiri',modules:['dashboard','receiving','site_history']},
  maintank_operator:{label:'Maintank Operator',site:'Maintank',scope:'Hanya shipment tujuan Maintank dan data receiving site sendiri',modules:['dashboard','receiving','site_history']},
  it_admin:{label:'IT Administrator',site:'Enterprise',scope:'Akses seluruh site, order, CR, master data, audit dan role management',modules:['dashboard','spv_dashboard','cr_dashboard','rf_dashboard','rf_orders','order_control','pre_inspection','loading','after_inspection','cr_loading','shipment_monitor','receiving','receiving_results','site_history','notifications','bl_analysis','custody_transfer','cargo_calculator','discharge','marine_loading','validation','admin']}
};
const NAV = [
  {label:'Overview',items:[['dashboard','▦','Live Dashboard'],['spv_dashboard','▤','SPV Dashboard'],['cr_dashboard','⌘','Control Room Dashboard'],['rf_dashboard','◈','RF Order Dashboard'],['notifications','●','Live Notifications']]},
  {label:'Order & Control Room',items:[['rf_orders','＋','RF Order Requests'],['order_control','≡','Order Control'],['cr_loading','⇆','CR Loading Verification'],['receiving_results','◎','Receiving Results']]},
  {label:'Fuel Blending',items:[['pre_inspection','✓','Before Loading Inspection'],['loading','↯','Field Loading Data'],['after_inspection','◆','After Loading Inspection'],['shipment_monitor','↗','Shipment Monitor']]},
  {label:'Customer Receiving',items:[['receiving','⌁','RF Receiving Validation'],['site_history','≡','Receiving History'],['validation','◉','Custody Validation']]},
  {label:'Port Operation',items:[['bl_analysis','▤','BL Analysis Report'],['custody_transfer','◫','Custody Receive & Transfer'],['cargo_calculator','∑','Cargo & Tanker Calculator']]},
  {label:'Marine & Cargo',items:[['discharge','⚓','Discharge Cargo'],['marine_loading','▱','Loading to Barge']]},
  {label:'System',items:[['admin','⚙','Access & Governance']]}
];
const DEST = {RF:'Riau Fiber',MILL:'Mill',MAINTANK:'Maintank'};
const DEST_ROLE = {rf_operator:'RF',mill_operator:'MILL',maintank_operator:'MAINTANK'};
const state = {
  role:'fuel_spv', page:'spv_dashboard',
  orderEditing:null,
  orders:[
  {
    "id": "RF-260717-001",
    "loadingDate": "17/07/2026",
    "allocation": "AB",
    "driver": "Irwan",
    "capacityKL": 24,
    "requestLiters": 24000,
    "plate": "BM 8684 RO",
    "location": "Meranti",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-002",
    "loadingDate": "17/07/2026",
    "allocation": "AB",
    "driver": "Delon",
    "capacityKL": 20,
    "requestLiters": 20000,
    "plate": "BM 8324 RO",
    "location": "TBA",
    "address": "TBA",
    "customer": "PT. Cahayamas Lestari Jaya",
    "poPr": "PO-06-18104",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-003",
    "loadingDate": "17/07/2026",
    "allocation": "AB",
    "driver": "Fazri",
    "capacityKL": 20,
    "requestLiters": 20000,
    "plate": "BM 9435 TU",
    "location": "Tasik",
    "address": "TBA",
    "customer": "PT. Selaras Abadi Utama",
    "poPr": "PO-22-00006228",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-004",
    "loadingDate": "17/07/2026",
    "allocation": "AB",
    "driver": "Ariyanto",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 9788 JU",
    "location": "Ekawana",
    "address": "TBA",
    "customer": "PT. Cahayamas Lestari Jaya",
    "poPr": "PO-06-18105",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-005",
    "loadingDate": "17/07/2026",
    "allocation": "AB",
    "driver": "Espi",
    "capacityKL": 20,
    "requestLiters": 20000,
    "plate": "BM 9789 JU",
    "location": "Tasik",
    "address": "TBA",
    "customer": "PT. Selaras Abadi Utama",
    "poPr": "PO-22-00006228",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-006",
    "loadingDate": "17/07/2026",
    "allocation": "AB",
    "driver": "Dasmel",
    "capacityKL": 24,
    "requestLiters": 24000,
    "plate": "BM 9384 TU",
    "location": "CRW",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": true,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-007",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Abdi",
    "capacityKL": 20,
    "requestLiters": 20000,
    "plate": "BM 8314 JU",
    "location": "Meranti",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-008",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Edis",
    "capacityKL": 20,
    "requestLiters": 20000,
    "plate": "BM 9152 TU",
    "location": "Lirik",
    "address": "TBA",
    "customer": "PT. Dunia Karya Sejati",
    "poPr": "PR-12-10209",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-009",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Adi",
    "capacityKL": 18,
    "requestLiters": 18000,
    "plate": "BM 8709 RO",
    "location": "Pelalawan",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-010",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Bastian",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8150 OU",
    "location": "Mandau",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-011",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Dino",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8245 QU",
    "location": "Mandau",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-012",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Iwan",
    "capacityKL": 18,
    "requestLiters": 18000,
    "plate": "BM 8710 RO",
    "location": "Meranti",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-013",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Hepra",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8556 QU",
    "location": "Meranti",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-014",
    "loadingDate": "17/07/2026",
    "allocation": "SRA",
    "driver": "Andri",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8149 OU",
    "location": "Meranti",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-015",
    "loadingDate": "17/07/2026",
    "allocation": "PAI",
    "driver": "Ilham",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8878 NU",
    "location": "CRW",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-016",
    "loadingDate": "17/07/2026",
    "allocation": "PAI",
    "driver": "Apzis",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8877 NU",
    "location": "CRW",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-017",
    "loadingDate": "17/07/2026",
    "allocation": "PAI",
    "driver": "Rado",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8879 NU",
    "location": "CRW",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-018",
    "loadingDate": "17/07/2026",
    "allocation": "PAI",
    "driver": "Yan G",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8881 NU",
    "location": "Logas",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-019",
    "loadingDate": "17/07/2026",
    "allocation": "PAI",
    "driver": "Roma",
    "capacityKL": 16,
    "requestLiters": 16000,
    "plate": "BM 8876 NU",
    "location": "Baserah",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  },
  {
    "id": "RF-260717-020",
    "loadingDate": "17/07/2026",
    "allocation": "STIR",
    "driver": "Agus",
    "capacityKL": 8,
    "requestLiters": 8000,
    "plate": "BH 8775 YX",
    "location": "Meranti",
    "address": "TBA",
    "customer": "Riau Fiber",
    "poPr": "TBA",
    "priority": false,
    "status": "REQUESTED",
    "locked": false,
    "inspectionId": null,
    "shipmentId": null,
    "updatedAt": "17/07/2026",
    "version": 1
  }
],
  inspections:[],
  shipments:[],
  discharge:[],
  cargoTransfers:[],
  notifications:[{id:'NTF-260717-001',time:'17/07/2026',type:'ORDER_BATCH',audience:['rf_operator','cr_operator','fuel_spv','it_admin'],title:'RF allocation imported',detail:'20 order · loading date 17/07/2026 · waiting Fuel Blending inspection'}],
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
    bl:{label:'Bill of Lading / Terminal Computation',gov:4485.200,gsv:4425.231,densityVac:0.8488,densityAir:0.8477,mtAir:3751.392,bbl:27847,longTons:3692.158},
    ship:{label:"Ship's Ullage Report",gov:4474.327,gsv:4417.229,mtAir:3744.485,bbl:27797.63,reportedPct:-0.18},
    surveyorRaw:{label:'Independent Surveyor · After Loading',gov:4474.327,gsv:4415.638,mtAir:3743.136,bbl:27786,vef:null,reportedPct:-0.22},
    surveyorVef:{label:'Independent Surveyor · VEF Applied',gsv:4419.173,mtAir:3746.133,bbl:27809,vef:0.9992,reportedPct:-0.14}
  }],
  audit:[]
};
const STORAGE_KEY='fuelCustodyLive_rfcr_v1';
try{
  if(typeof localStorage!=='undefined'){
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved&&typeof saved==='object'){['orders','inspections','shipments','discharge','cargoTransfers','notifications','audit'].forEach(k=>{if(Array.isArray(saved[k]))state[k]=saved[k]});}
  }
}catch(e){console.warn('Local prototype state could not be restored',e);}
function persistState(){try{if(typeof localStorage!=='undefined')localStorage.setItem(STORAGE_KEY,JSON.stringify({orders:state.orders,inspections:state.inspections,shipments:state.shipments,discharge:state.discharge,cargoTransfers:state.cargoTransfers,notifications:state.notifications,audit:state.audit}));}catch(e){console.warn('Local prototype state could not be saved',e);}}

const $ = s => document.querySelector(s);
const fmt = n => new Intl.NumberFormat('id-ID',{maximumFractionDigits:3}).format(Number(n||0));
const nowText = () => new Date().toLocaleString('id-ID',{hour12:false});
function role(){return ROLE_CONFIG[state.role]}
function defaultPageForRole(){
  if(state.role==='fuel_spv')return 'spv_dashboard';
  if(state.role==='cr_operator')return 'cr_dashboard';
  if(state.role==='rf_operator')return 'rf_dashboard';
  return 'dashboard';
}
function siteScope(){return DEST_ROLE[state.role] || null}
function allowedShipments(){const s=siteScope(); return s?state.shipments.filter(x=>x.dest===s):state.shipments}
function allowedOrders(){return ['rf_operator','fuel_spv','cr_operator','it_admin'].includes(state.role)?state.orders:[]}
function badge(status){
  const m={
    REQUESTED:['info','REQUESTED'],INSPECTION_LOCKED:['warn','ORDER LOCKED'],FIELD_LOADING:['info','FIELD LOADING'],AWAITING_AFTER:['warn','WAIT AFTER INSPECTION'],
    AWAITING_CR:['warn','WAIT CR VERIFICATION'],IN_TRANSIT:['info','IN TRANSIT'],AWAITING_RECEIVING:['warn','WAIT FINAL RECEIVING'],RECEIVED:['good','RECEIVED'],
    HOLD:['bad','HOLD / INVESTIGATE'],PASS:['good','PASS'],REJECT:['bad','REJECT'],COMPLETED:['good','COMPLETED'],IN_PROGRESS:['warn','IN PROGRESS'],
    DISPATCHED:['info','DISPATCHED'],LOCKED:['warn','LOCKED'],UPDATED:['info','UPDATED'],SECURITY_ALERT:['bad','SECURITY ALERT']
  };
  const x=m[status]||['neutral',String(status||'UNKNOWN').replaceAll('_',' ')]; return `<span class="badge ${x[0]}">${x[1]}</span>`;
}
function audit(action,detail){state.audit.unshift({time:nowText(),role:role().label,action,detail});}
function notify(type,title,detail,audience=['rf_operator','cr_operator','fuel_spv','it_admin']){
  state.notifications.unshift({id:'NTF-'+Date.now(),time:nowText(),type,audience,title,detail});
}
function visibleNotifications(){return state.notifications.filter(n=>!n.audience||n.audience.includes(state.role)||state.role==='it_admin')}
function orderById(id){return state.orders.find(o=>o.id===id)}
function shipmentByOrder(id){return state.shipments.find(s=>s.orderId===id)}
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
    return `<div class="nav-label">${g.label}</div>${items.map(i=>{
      let count='';
      if(i[0]==='receiving')count=allowedShipments().filter(x=>x.status==='IN_TRANSIT'||x.status==='AWAITING_RECEIVING').length;
      if(i[0]==='cr_loading')count=state.shipments.filter(x=>x.status==='AWAITING_CR').length;
      if(i[0]==='rf_orders')count=state.orders.filter(x=>!x.locked).length;
      if(i[0]==='notifications')count=visibleNotifications().length;
      return `<a href="#" class="nav-item ${state.page===i[0]?'active':''}" data-page="${i[0]}"><span class="nav-icon">${i[1]}</span><span>${i[2]}</span>${count?`<span class="nav-badge">${count}</span>`:''}</a>`;
    }).join('')}`;
  }).join('');
  document.querySelectorAll('.nav-item').forEach(a=>a.onclick=e=>{e.preventDefault();state.page=a.dataset.page;renderAll();closeMenu();});
}
function renderIdentity(){
  $('#roleScope').innerHTML=`<b style="color:var(--muted)">${role().site}</b><br>${role().scope}`;
  $('#userName').textContent=role().label; $('#userRole').textContent=role().site; $('#avatar').textContent=role().label.split(' ').map(x=>x[0]).slice(0,2).join('');
}
function renderTicker(){
  const items=state.shipments.slice(0,5).map(s=>`<span class="ticker-item"><span>${s.id}</span><b>${DEST[s.dest]}</b><span>${fmt(s.total||s.request||0)} L</span><span class="${s.status==='HOLD'?'text-bad':s.status==='RECEIVED'?'text-good':'text-blue'}">${s.status.replaceAll('_',' ')}</span></span>`);
  if(!items.length){
    const orders=state.orders.slice(0,6).map(o=>`<span class="ticker-item"><span>${o.id}</span><b>${o.driver}</b><span>${fmt(o.requestLiters)} L</span><span>${o.location} · ${o.poPr}</span><span class="${o.locked?'text-warn':'text-blue'}">${o.status.replaceAll('_',' ')}</span></span>`);
    $('#tickerTrack').innerHTML=orders.length?[...orders,...orders].join(''):'<span class="ticker-item ticker-empty"><b>FUEL BLENDING DATA STREAM</b><span>Menunggu data operasional</span><span class="text-good">SYSTEM READY</span></span>';
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

  <div class="spv-order-strip"><div><span class="section-kicker">RF ORDER FLOW</span><b>${state.orders.length} orders · ${fmt(state.orders.reduce((a,b)=>a+b.requestLiters,0)/1000)} KL planned</b></div><div class="spv-order-actions"><button class="btn btn-sm" onclick="goPage('order_control')">Open Order Control</button><button class="btn btn-sm" onclick="goPage('receiving_results')">Receiving Results</button></div></div>

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
  return `<div class="${compact?'':'table-wrap'}"><table><thead><tr><th>Shipment / Order</th><th>Destination</th><th>Unit</th><th>Driver / Transporter</th><th>Volume</th><th>Seal</th><th>Status</th><th>Variance</th></tr></thead><tbody>${ships.map(s=>{const o=orderById(s.orderId);return `<tr><td><div class="cell-main mono">${s.id}</div><div class="cell-sub">${o?`${o.id} · ${o.poPr}`:(s.dispatchAt||'Belum dispatch')}</div></td><td><div>${o?.location||DEST[s.dest]}</div><div class="cell-sub">${o?.customer||DEST[s.dest]}</div></td><td><div class="cell-main">${s.unitCode||'TBA'}</div><div class="cell-sub">${s.plate}</div></td><td><div>${s.driver}</div><div class="cell-sub">${s.transporter}</div></td><td class="mono">${s.total?fmt(s.total)+' L':`Request ${fmt(s.request||0)} L`}</td><td>${s.seals?.length?`<span class="badge good">${s.seals.length} VERIFIED</span>`:'<span class="badge warn">PENDING</span>'}</td><td>${badge(s.status)}</td><td class="mono ${s.validation&&!s.validation.volumePass?'text-bad':'text-good'}">${s.validation?fmt(s.validation.diff)+' L':'—'}</td></tr>`}).join('')}</tbody></table></div>`;
}
function flowSteps(active){const steps=[['00','RF Order'],['01','Before Inspection'],['02','Field Loading'],['03','After Inspection'],['04','CR Verification'],['05','Receiving']];return `<div class="flow-steps flow-six">${steps.map((s,i)=>`<div class="step ${i<active?'done':i===active?'active':''}"><div class="step-no">PHASE ${s[0]}</div><div class="step-title">${s[1]}</div><div class="step-status">${i<active?'Completed':i===active?'Current phase':'Waiting'}</div></div>`).join('')}</div>`}
function notificationFeed(limit=10){
  const rows=visibleNotifications().slice(0,limit);
  if(!rows.length)return `<div class="spv-empty"><div class="spv-empty-icon">●</div><div><b>Belum ada notifikasi</b><span>Perubahan order, dispatch dan receiving akan muncul di sini.</span></div></div>`;
  return rows.map(n=>`<div class="notification-row"><div class="notification-dot ${n.type.includes('ALERT')||n.type.includes('HOLD')?'danger':n.type.includes('RECEIVING')?'success':''}"></div><div class="notification-main"><div class="notification-title">${n.title}</div><div class="notification-detail">${n.detail}</div><div class="notification-time">${n.time} · ${n.type.replaceAll('_',' ')}</div></div></div>`).join('');
}
function notificationsPage(){
  return `${pageTitle('Live Notifications','Perubahan order RF, inspection lock, CR dispatch, physical arrival dan final receiving ditampilkan sesuai scope role.','<button class="btn" onclick="renderAll()">Refresh</button>')}<div class="panel"><div class="panel-head"><div><div class="panel-title">Operational Event Stream</div><div class="panel-sub">RF Operator · Control Room · Fuel SPV</div></div><span class="badge good">LIVE</span></div><div class="panel-body notification-list">${notificationFeed(50)}</div></div>`;
}
function orderTable(orders,editable=false){
  if(!orders.length)return `<div style="padding:28px;text-align:center;color:var(--dim)">Tidak ada order dalam scope ini.</div>`;
  return `<div class="table-wrap order-table"><table><thead><tr><th>Order</th><th>Loading</th><th>Allocation</th><th>Driver / Plate</th><th>Volume</th><th>Destination</th><th>PO / PR</th><th>Status</th>${editable?'<th>Action</th>':''}</tr></thead><tbody>${orders.map(o=>`<tr class="${o.priority?'priority-row':''}"><td><div class="cell-main mono">${o.id}</div><div class="cell-sub">v${o.version}${o.priority?' · PRIORITAS':''}</div></td><td>${o.loadingDate}</td><td><span class="badge neutral">${o.allocation}</span></td><td><div class="cell-main">${o.driver}</div><div class="cell-sub">${o.plate}</div></td><td class="mono">${fmt(o.requestLiters)} L</td><td><div>${o.location}</div><div class="cell-sub">${o.customer}<br>${o.address||'TBA'}</div></td><td class="mono">${o.poPr||'TBA'}</td><td>${badge(o.status)}${o.locked?'<div class="cell-sub">Locked by FB inspection</div>':''}</td>${editable?`<td><button class="btn btn-sm" onclick="editOrder('${o.id}')" ${o.locked?'disabled':''}>${o.locked?'Locked':'Edit'}</button></td>`:''}</tr>`).join('')}</tbody></table></div>`;
}
function rfDashboard(){
  const orders=state.orders, planned=orders.reduce((a,b)=>a+b.requestLiters,0), locked=orders.filter(o=>o.locked).length, dispatched=orders.filter(o=>['DISPATCHED','RECEIVED','HOLD'].includes(o.status)).length, received=orders.filter(o=>o.status==='RECEIVED').length;
  return `${pageTitle('Riau Fiber Order Dashboard','Pantau request alokasi solar dari pembuatan order sampai final receiving. Order dapat diedit sebelum Fuel Blending inspection PASS.','<button class="btn btn-primary" onclick="goPage(\'rf_orders\')">Open RF Orders</button>')}
  <div class="grid-kpi">${kpi('Total orders',orders.length,'Loading 17/07/2026',95)}${kpi('Planned volume',fmt(planned/1000)+' KL','Total requested allocation',88)}${kpi('Editable orders',orders.filter(o=>!o.locked).length,'Belum inspection lock',72)}${kpi('Inspection locked',locked,'Tidak dapat diubah lagi',locked?70:8,'text-warn')}${kpi('Dispatched',dispatched,'CR loading verified',dispatched?82:8,'text-blue')}${kpi('Received',received,'Final receiving completed',received?90:8,'text-good')}</div>
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">RF Allocation · 17/07/2026</div><div class="panel-sub">20 unit request yang diteruskan ke Fuel Blending, CR dan SPV</div></div></div><div class="panel-body flush">${orderTable(orders.slice(0,8),false)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Live Notifications</div><div class="panel-sub">Perubahan status order dan custody</div></div></div><div class="panel-body notification-list">${notificationFeed(8)}</div></div></div>`;
}
function rfOrdersPage(){
  const edit=state.orderEditing?orderById(state.orderEditing):null;
  const val=(k,d='')=>edit?.[k]??d;
  const iv=(label,name,value,type='text',span='')=>`<div class="field ${span}"><label>${label}</label><input type="${type}" name="${name}" value="${value??''}" required></div>`;
  return `${pageTitle('RF Order Requests','RF Operator dapat menambah atau mengubah data order. Nomor PO/PR otomatis menjadi TBA jika kosong. Setelah Before Loading Inspection berstatus PASS, order dikunci dan tidak dapat diubah.','<button class="btn" onclick="cancelOrderEdit()">New / Clear Form</button>')}
  <div class="panel order-form-panel"><div class="panel-head"><div><div class="panel-title">${edit?'Edit RF Order':'Create RF Order'}</div><div class="panel-sub">Request → inspection lock → field loading → CR verification → dispatch → receiving</div></div>${edit&&edit.locked?badge('LOCKED'):''}</div><div class="panel-body"><form id="rfOrderForm"><input type="hidden" name="orderId" value="${edit?.id||''}"><div class="form-grid">
    ${iv('Loading date','loadingDate',val('loadingDate','17/07/2026'))}
    <div class="field"><label>Allocation / Transporter Group</label><select name="allocation">${['AB','SRA','PAI','STIR'].map(x=>`<option ${val('allocation')===x?'selected':''}>${x}</option>`).join('')}</select></div>
    ${iv('Driver','driver',val('driver'))}${iv('Planned volume (KL)','capacityKL',val('capacityKL',16),'number')}${iv('Nomor plat','plate',val('plate'))}${iv('Location','location',val('location','TBA'))}${iv('Destination company','customer',val('customer','Riau Fiber'))}${iv('PO / PR','poPr',val('poPr','TBA'))}
    <div class="field span-2"><label>Destination address</label><input name="address" value="${val('address','TBA')}" placeholder="TBA bila belum tersedia"></div><div class="field"><label>Priority</label><select name="priority"><option value="false" ${!val('priority',false)?'selected':''}>Normal</option><option value="true" ${val('priority',false)?'selected':''}>Priority</option></select></div>
  </div><div class="form-actions"><button type="button" class="btn" onclick="cancelOrderEdit()">Cancel</button><button class="btn btn-primary" ${edit?.locked?'disabled':''}>${edit?'Save Live Changes':'Submit RF Order'}</button></div></form></div></div>
  <div style="height:14px"></div><div class="panel"><div class="panel-head"><div><div class="panel-title">RF Allocation Dataset</div><div class="panel-sub">Order yang sudah inspection PASS tidak dapat diedit</div></div><span class="badge info">${state.orders.length} ORDERS</span></div><div class="panel-body flush">${orderTable(state.orders,true)}</div></div>`;
}
function orderControlPage(){
  const orders=allowedOrders(), open=orders.filter(o=>!o.locked), locked=orders.filter(o=>o.locked), priority=orders.filter(o=>o.priority);
  return `${pageTitle('Order Control','Read-only order queue untuk Control Room dan SPV. Perubahan RF tampil live sampai order dikunci oleh Fuel Blending inspection PASS.','<button class="btn" onclick="renderAll()">Refresh Order Queue</button>')}<div class="grid-kpi">${kpi('Total RF orders',orders.length,'Allocation 17/07/2026',95)}${kpi('Open / editable',open.length,'RF masih dapat mengubah',72)}${kpi('Locked by inspection',locked.length,'Order frozen',locked.length?82:8,'text-warn')}${kpi('Priority orders',priority.length,'Operational priority flag',priority.length?72:8,'text-bad')}${kpi('Awaiting CR',state.shipments.filter(s=>s.status==='AWAITING_CR').length,'Final field packet ready',62)}${kpi('Dispatched',state.shipments.filter(s=>['IN_TRANSIT','AWAITING_RECEIVING','RECEIVED'].includes(s.status)).length,'CR verification completed',76,'text-good')}</div><div class="panel"><div class="panel-head"><div><div class="panel-title">RF Order Queue</div><div class="panel-sub">Driver, plate, requested volume, destination and PO/PR</div></div></div><div class="panel-body flush">${orderTable(orders,false)}</div></div>`;
}
function crDashboard(){
  const queue=state.shipments.filter(s=>s.status==='AWAITING_CR'), transit=state.shipments.filter(s=>s.status==='IN_TRANSIT'), received=state.shipments.filter(s=>s.status==='RECEIVED'), holds=state.shipments.filter(s=>s.status==='HOLD');
  return `${pageTitle('Control Room Dashboard','CR menerima order RF dan final field packet setelah After Loading Inspection. CR memvalidasi sounding, seal, kondisi unit dan memasukkan flowmeter initial/final sebelum dispatch.','<button class="btn btn-primary" onclick="goPage(\'cr_loading\')">Open CR Verification</button>')}<div class="grid-kpi">${kpi('RF order queue',state.orders.length,'Order visible to CR',95)}${kpi('Waiting CR verification',queue.length,'Ready after field inspection',queue.length?82:8,'text-warn')}${kpi('In transit',transit.length,'Successfully loaded & dispatched',transit.length?78:8,'text-blue')}${kpi('Receiving complete',received.length,'Actual receiving recorded',received.length?88:8,'text-good')}${kpi('Exception / hold',holds.length,'Review required',holds.length?72:5,holds.length?'text-bad':'text-good')}${kpi('Live notifications',visibleNotifications().length,'Shared with RF & SPV',70)}</div><div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">CR Verification Queue</div><div class="panel-sub">Unit with completed after-loading inspection</div></div></div><div class="panel-body flush">${shipmentTable(queue,true)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Operational Notifications</div><div class="panel-sub">Dispatch and receiving events</div></div></div><div class="panel-body notification-list">${notificationFeed(10)}</div></div></div>`;
}
function crPacket(s){
  if(!s)return '';
  const o=orderById(s.orderId);
  return `<div class="readonly-card"><div class="packet-title">Locked Field & Order Packet</div><div class="readonly-grid"><div><div class="ro-label">Order / PO-PR</div><div class="ro-value mono">${o?.id||'—'} · ${o?.poPr||'TBA'}</div></div><div><div class="ro-label">Destination</div><div class="ro-value">${o?.location||'TBA'} · ${o?.customer||'Riau Fiber'}</div></div><div><div class="ro-label">Unit / Plate</div><div class="ro-value">${s.unitCode} · ${s.plate}</div></div><div><div class="ro-label">Driver / Group</div><div class="ro-value">${s.driver} · ${s.transporter}</div></div><div><div class="ro-label">Requested volume</div><div class="ro-value mono">${fmt(s.request)} L</div></div><div><div class="ro-label">Field sounding</div><div class="ro-value mono">${fmt(s.soundingBefore)} → ${fmt(s.soundingAfter)}</div></div><div><div class="ro-label">Final seals</div><div class="ro-value mono">${(s.seals||[]).join(' · ')}</div></div><div><div class="ro-label">After loading condition</div><div class="ro-value">${s.afterCondition||'—'}</div></div><div><div class="ro-label">Address</div><div class="ro-value">${o?.address||'TBA'}</div></div><div><div class="ro-label">Priority</div><div class="ro-value">${o?.priority?'PRIORITY':'NORMAL'}</div></div></div></div>`;
}
function crLoadingPage(){
  const queue=state.shipments.filter(s=>s.status==='AWAITING_CR'), first=queue[0];
  return `${pageTitle('CR Loading Verification','Control Room melakukan final custody validation dan memasukkan flowmeter initial/final. Dispatch hanya dibuat setelah CR submit.')} ${queue.length?`<div class="panel"><div class="panel-head"><div><div class="panel-title">Verify Completed Unit</div><div class="panel-sub">Data field bersifat read-only; CR mengisi meter dan validation decision</div></div><span class="badge warn">${queue.length} WAITING</span></div><div class="panel-body"><form id="crLoadingForm"><div class="field" style="margin-bottom:13px"><label>Select shipment</label><select name="shipmentId" id="crShipmentSelect">${queue.map(s=>`<option value="${s.id}">${s.id} · ${s.plate} · ${orderById(s.orderId)?.location||'RF'}</option>`).join('')}</select></div><div id="crPacket">${crPacket(first)}</div><div style="height:14px"></div><div class="form-grid">${field('Flowmeter initial','flowStart','500000','number')}${field('Flowmeter final','flowEnd','516000','number')}<div class="field"><label>Total volume</label><input id="crCalcFlow" readonly value="0 L"></div>${selectField('Sounding validation','soundingValidation',['MATCH / VERIFIED','NEEDS REVIEW'])}${selectField('Seal validation','sealValidation',['MATCH / VERIFIED','NEEDS REVIEW'])}${selectField('After loading condition','conditionValidation',['GOOD / VERIFIED','HOLD'])}<div class="field span-2"><label>CR remarks</label><input name="remarks" placeholder="Validation note"></div></div><div class="form-actions"><button class="btn btn-primary">Submit Loading & Dispatch</button></div></form></div></div>`:`<div class="panel"><div class="panel-body" style="padding:42px;text-align:center;color:var(--dim)">Tidak ada unit yang menunggu CR loading verification.</div></div>`}`;
}
function receivingResultsPage(){
  const rows=allowedShipments().filter(s=>s.arrivalCheck||s.validation||s.status==='HOLD');
  return `${pageTitle('Receiving Results','Read-only comparison actual loading dari CR versus physical arrival dan actual receiving dari RF Operator.')}<div class="panel"><div class="panel-head"><div><div class="panel-title">End-to-End Custody Result</div><div class="panel-sub">Order → Loading → Dispatch → Physical Check → Final Receiving</div></div></div><div class="panel-body flush">${rows.length?`<div class="table-wrap"><table class="result-table"><thead><tr><th>Shipment</th><th>Order / Destination</th><th>Actual Loading</th><th>Physical Arrival</th><th>Actual Receiving</th><th>Variance</th><th>Risk / Status</th></tr></thead><tbody>${rows.map(s=>{const o=orderById(s.orderId),v=s.validation;return `<tr><td><div class="cell-main mono">${s.id}</div><div class="cell-sub">${s.plate}</div></td><td><div>${o?.id||'—'} · ${o?.poPr||'TBA'}</div><div class="cell-sub">${o?.location||'—'} · ${o?.customer||'—'}</div></td><td class="mono">${s.total?fmt(s.total)+' L':'Pending'}</td><td>${s.arrivalCheck?(s.arrivalCheck.pass?'<span class="badge good">MATCH</span>':'<span class="badge bad">MISMATCH</span>'):'—'}</td><td class="mono">${v?fmt(v.received)+' L':'Pending'}</td><td class="mono ${v&&!v.volumePass?'text-bad':'text-good'}">${v?`${fmt(v.diff)} L · ${fmt(v.pct)}%`:'—'}</td><td>${badge(s.status)}${v?`<div class="cell-sub">Risk ${v.risk}</div>`:''}</td></tr>`}).join('')}</tbody></table></div>`:'<div style="padding:35px;text-align:center;color:var(--dim)">Belum ada data physical arrival atau final receiving.</div>'}</div></div>`;
}
window.editOrder=function(id){const o=orderById(id);if(!o||o.locked){toast('Order sudah dikunci dan tidak dapat diedit');return;}state.orderEditing=id;state.page='rf_orders';renderAll();};
window.cancelOrderEdit=function(){state.orderEditing=null;state.page='rf_orders';renderAll();};
function orderPacket(o){if(!o)return '';return `<div class="readonly-card order-packet"><div class="readonly-grid"><div><div class="ro-label">Order</div><div class="ro-value mono">${o.id}</div></div><div><div class="ro-label">PO / PR</div><div class="ro-value mono">${o.poPr||'TBA'}</div></div><div><div class="ro-label">Driver / Plate</div><div class="ro-value">${o.driver} · ${o.plate}</div></div><div><div class="ro-label">Allocation</div><div class="ro-value">${o.allocation}</div></div><div><div class="ro-label">Request</div><div class="ro-value mono">${fmt(o.requestLiters)} L</div></div><div><div class="ro-label">Location</div><div class="ro-value">${o.location}</div></div><div><div class="ro-label">Customer</div><div class="ro-value">${o.customer}</div></div><div><div class="ro-label">Address</div><div class="ro-value">${o.address||'TBA'}</div></div></div></div>`}
function preInspection(){
  const orders=state.orders.filter(o=>!o.locked&&o.status==='REQUESTED'); const first=orders[0];
  return `${pageTitle('Before Loading Inspection','Fuel Blending Operator memilih order RF dan memverifikasi unit kosong. Order otomatis terkunci hanya jika hasil inspection PASS.')} ${flowSteps(1)}
  ${orders.length?`<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Inspection Against RF Order</div><div class="panel-sub">Order data menjadi reference untuk unit yang datang</div></div><span class="badge info">${orders.length} OPEN ORDERS</span></div><div class="panel-body"><form id="preForm"><div class="field" style="margin-bottom:13px"><label>Select RF order</label><select name="orderId" id="preOrderSelect">${orders.map(o=>`<option value="${o.id}">${o.id} · ${o.driver} · ${o.plate} · ${o.location} · ${fmt(o.requestLiters)} L</option>`).join('')}</select></div><div id="preOrderPacket">${orderPacket(first)}</div><div style="height:14px"></div><div class="form-grid">
    ${field('Unit code actual','unitCode','FT-001')}${field('Nomor plat actual','plate',first?.plate||'')}${field('Nama driver actual','driver',first?.driver||'')}${field('Transporter / allocation','transporter',first?.allocation||'')}
    ${selectField('Kondisi tanki','tank',['Good','Minor defect','Reject'])}${selectField('Valve / outlet','valve',['Good','Minor defect','Leak / Reject'])}${selectField('Manhole / cover','manhole',['Good','Minor defect','Reject'])}${selectField('Status seal unit kosong','emptySeal',['Open / verified','Seal lama masih terpasang','Tidak dapat diverifikasi'])}<div class="field span-2"><label>Kerusakan / temuan</label><input name="damage" placeholder="Tidak ada atau jelaskan temuan"></div><div class="field"><label>Inspection result</label><select name="result"><option>PASS</option><option>REJECT</option></select></div>
  </div><div class="form-actions"><button type="reset" class="btn">Reset</button><button class="btn btn-primary">Save Inspection & Lock Order if PASS</button></div></form></div></div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Inspection Queue</div><div class="panel-sub">Latest unit readiness</div></div></div><div class="panel-body">${state.inspections.slice(0,8).map(i=>`<div class="alert"><div class="alert-top"><div class="alert-title">${i.unitCode} · ${i.plate}</div>${badge(i.result)}</div><div class="alert-meta">${i.orderId||'No order'} · ${i.driver} · ${i.transporter}<br>${i.time}</div></div>`).join('')||'<div style="padding:25px;text-align:center;color:var(--dim)">Belum ada inspection.</div>'}</div></div></div>`:`<div class="panel"><div class="panel-body" style="padding:42px;text-align:center;color:var(--dim)">Semua RF order sudah dikunci atau tidak ada order terbuka untuk inspection.</div></div>`}`;
}
function field(label,name,placeholder='',type='text'){return `<div class="field"><label>${label}</label><input type="${type}" name="${name}" placeholder="${placeholder}" required></div>`}
function selectField(label,name,options){return `<div class="field"><label>${label}</label><select name="${name}">${options.map(x=>`<option>${x}</option>`).join('')}</select></div>`}
function loadingPage(){
  const eligible=state.inspections.filter(i=>i.result==='PASS'&&!state.shipments.some(s=>s.preId===i.id)); const first=eligible[0];
  return `${pageTitle('Field Loading Data','Fuel Blending Operator mencatat data lapangan dan sounding. Flowmeter custody final dimasukkan oleh Control Room setelah After Loading Inspection.')} ${flowSteps(2)}
  ${eligible.length?`<div class="panel"><div class="panel-head"><div><div class="panel-title">Create Field Loading Record</div><div class="panel-sub">Sounding dan catatan proses berdasarkan inspection yang sudah PASS</div></div><span class="badge info">SOURCE: FUEL BLENDING FIELD</span></div><div class="panel-body"><form id="loadingForm"><div class="form-grid"><div class="field span-2"><label>Approved inspection</label><select name="preId" id="loadingInspectionSelect">${eligible.map(i=>`<option value="${i.id}">${i.id} · ${i.orderId} · ${i.unitCode} · ${i.plate}</option>`).join('')}</select></div>${field('Sounding before','soundingBefore','10.250','number')}${field('Sounding after','soundingAfter','26.250','number')}${field('Loading start','loadingStart','07:30')}${field('Loading finish','loadingEnd','08:15')}<div class="field span-4"><label>Loading remarks</label><textarea name="remarks" placeholder="Catatan proses pengisian, stop/start atau kondisi abnormal."></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Complete Field Loading Data</button></div></form></div></div>`:`<div class="panel"><div class="panel-body" style="padding:42px;text-align:center;color:var(--dim)">Belum ada inspection PASS yang siap untuk field loading.</div></div>`}`;
}
function afterInspection(){
  const waiting=state.shipments.filter(s=>s.status==='AWAITING_AFTER');
  return `${pageTitle('After Loading Inspection','Final field inspection mengunci nomor seal, kondisi unit dan sounding packet. Setelah PASS, data diteruskan ke Control Room untuk flowmeter verification — belum dispatch ke customer.')} ${flowSteps(3)}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Finalize Unit & Seal</div><div class="panel-sub">PASS → Control Room queue · REJECT → HOLD</div></div></div><div class="panel-body">${waiting.length?`<form id="afterForm"><div class="form-grid"><div class="field span-2"><label>Shipment waiting inspection</label><select name="shipmentId">${waiting.map(s=>`<option value="${s.id}">${s.id} · ${s.unitCode} · ${s.plate} · ${orderById(s.orderId)?.location||'RF'}</option>`).join('')}</select></div>${field('Seal 1','seal1','SL88101')}${field('Seal 2','seal2','SL88102')}${field('Seal 3','seal3','SL88103')}${field('Seal 4','seal4','SL88104')}${selectField('Final tank condition','condition',['Good','Minor damage','Reject'])}${selectField('Seal installation condition','sealCondition',['Good / secured','Needs review','Reject'])}<div class="field span-2"><label>Final remarks</label><input name="remarks" placeholder="Seal terpasang, tanki aman dan siap CR verification"></div></div><div class="form-actions"><button class="btn btn-primary">Submit Final Inspection to CR</button></div></form>`:`<div style="padding:25px;text-align:center;color:var(--dim)">Tidak ada loading record yang menunggu after inspection.</div>`}</div></div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Data Sent to Control Room</div><div class="panel-sub">Field packet setelah final inspection</div></div></div><div class="panel-body"><div class="check-list">${['RF order + PO/PR + destination','Unit code, plate, driver & allocation','Sounding before / after','4 nomor seal final','Tank & seal condition after loading','Field remarks and inspection timestamp'].map(x=>`<div class="check-row"><span class="check-name">${x}</span><span class="badge good">LOCKED FIELD DATA</span></div>`).join('')}</div></div></div></div>`;
}
function shipmentMonitor(){return `${pageTitle('Shipment Monitor','Monitoring unit dari Fuel Blending sampai receiving. IT Admin dan Fuel SPV melihat seluruh jaringan; customer tidak memiliki menu ini.')}${shipmentTable(state.shipments)}`}
function receivingPage(){
  const site=siteScope();
  const incoming=state.shipments.filter(s=>(!site||s.dest===site)&&s.status==='IN_TRANSIT'&&!s.arrivalCheck);
  const finalReady=state.shipments.filter(s=>(!site||s.dest===site)&&s.status==='AWAITING_RECEIVING');
  const a=incoming[0], r=finalReady[0];
  return `${pageTitle('RF Receiving Validation','Receiving dilakukan dua tahap: physical arrival validation terlebih dahulu, kemudian final actual receiving. Sistem membandingkan data dengan locked dispatch packet dari CR.')} ${flowSteps(5)}
  <div class="receiving-stage-grid">
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Stage A · Physical Arrival Check</div><div class="panel-sub">Deteksi mismatch identitas, seal dan kerusakan sebelum unloading</div></div><span class="badge warn">${incoming.length} INCOMING</span></div><div class="panel-body">${incoming.length?`<form id="arrivalForm"><div class="field" style="margin-bottom:13px"><label>Select shipment</label><select name="shipmentId" id="arrivalShipment">${incoming.map(s=>`<option value="${s.id}">${s.id} · ${s.plate} · ${orderById(s.orderId)?.location||'RF'}</option>`).join('')}</select></div><div id="arrivalPacket">${dispatchPacket(a)}</div><div style="height:14px"></div><div class="form-grid">${field('Unit code actual','unitCode',a?.unitCode||'')}${field('Nomor plat actual','plate',a?.plate||'')}${field('Nama driver actual','driver',a?.driver||'')}${field('Transporter actual','transporter',a?.transporter||'')}${field('Seal 1 actual','seal1',a?.seals?.[0]||'')}${field('Seal 2 actual','seal2',a?.seals?.[1]||'')}${field('Seal 3 actual','seal3',a?.seals?.[2]||'')}${field('Seal 4 actual','seal4',a?.seals?.[3]||'')}${selectField('Physical damage','damage',['Tidak ada','Ada kerusakan ringan','Ada kerusakan serius'])}<div class="field span-2"><label>Arrival remarks</label><input name="notes" placeholder="Kondisi segel, unit dan indikasi abnormal"></div></div><div class="form-actions"><button class="btn btn-primary">Validate Physical Arrival</button></div></form>`:'<div style="padding:30px;text-align:center;color:var(--dim)">Tidak ada unit in-transit yang menunggu physical arrival check.</div>'}</div></div>
    <div class="panel"><div class="panel-head"><div><div class="panel-title">Stage B · Final Actual Receiving</div><div class="panel-sub">Actual loading CR dibandingkan dengan total receiving RF</div></div><span class="badge info">${finalReady.length} READY</span></div><div class="panel-body">${finalReady.length?`<form id="finalReceivingForm"><div class="field" style="margin-bottom:13px"><label>Select verified shipment</label><select name="shipmentId" id="finalReceivingShipment">${finalReady.map(s=>`<option value="${s.id}">${s.id} · ${s.plate} · ${fmt(s.total)} L</option>`).join('')}</select></div><div id="finalReceivingPacket">${dispatchPacket(r)}</div><div style="height:14px"></div><div class="form-grid">${field('Actual receiving volume (L)','received',r?.total||0,'number')}${field('Receiving sounding before','soundBefore','8.200','number')}${field('Receiving sounding after','soundAfter','24.150','number')}<div class="field"><label>Tolerance</label><input value="± ${fmt((r?.total||0)*TOLERANCE_RATE)} L" readonly></div><div class="field span-4"><label>Final receiving remarks</label><textarea name="notes" placeholder="Actual receiving result, operational note atau discrepancy."></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Submit Final Receiving & Reconcile</button></div></form>`:'<div style="padding:30px;text-align:center;color:var(--dim)">Belum ada unit yang lolos physical arrival check.</div>'}</div></div>
  </div>`;
}
function dispatchPacket(s){if(!s)return '';const o=orderById(s.orderId);return `<div class="readonly-card"><div class="readonly-grid"><div><div class="ro-label">Shipment / Order</div><div class="ro-value mono">${s.id}<br>${o?.id||'—'} · ${o?.poPr||'TBA'}</div></div><div><div class="ro-label">Destination</div><div class="ro-value">${o?.location||DEST[s.dest]} · ${o?.customer||DEST[s.dest]}</div></div><div><div class="ro-label">Actual Loading CR</div><div class="ro-value mono">${s.total?fmt(s.total)+' L':'Pending CR'}</div></div><div><div class="ro-label">Tolerance 0.01%</div><div class="ro-value mono">± ${fmt((s.total||0)*TOLERANCE_RATE)} L</div></div><div><div class="ro-label">Unit / Plate</div><div class="ro-value">${s.unitCode} · ${s.plate}</div></div><div><div class="ro-label">Driver / Allocation</div><div class="ro-value">${s.driver} · ${s.transporter}</div></div><div><div class="ro-label">Field Sounding</div><div class="ro-value mono">${fmt(s.soundingBefore)} → ${fmt(s.soundingAfter)}</div></div><div><div class="ro-label">Locked seals</div><div class="ro-value mono">${(s.seals||[]).join(' · ')}</div></div><div><div class="ro-label">Flowmeter</div><div class="ro-value mono">${s.flowStart!=null?`${fmt(s.flowStart)} → ${fmt(s.flowEnd)}`:'Pending'}</div></div><div><div class="ro-label">After loading condition</div><div class="ro-value">${s.afterCondition||'—'}</div></div></div></div>`}
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
  <div class="layout-3">${kpi('Configured roles','7','Field, SPV, CR, 3 customer, IT','95')}${kpi('Customer isolation','3 sites','RF · Mill · Maintank','100','text-good')}${kpi('Audit events',state.audit.length,'Persistent local prototype log','45')}</div>
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Role Access Matrix</div><div class="panel-sub">Prinsip least privilege berdasarkan site dan fungsi</div></div></div><div class="panel-body flush"><div class="table-wrap" style="border:0;border-radius:0"><table><thead><tr><th>Role</th><th>Site</th><th>Data Scope</th><th>Modules</th><th>Privilege</th></tr></thead><tbody>${rows}</tbody></table></div></div></div>
  <div style="height:14px"></div><div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Recommended Backend Controls</div><div class="panel-sub">Wajib saat prototype dipindah ke Firebase / API backend</div></div></div><div class="panel-body"><div class="check-list">${['Role claim divalidasi di server, bukan hanya hide menu','Customer query wajib dibatasi destination/site claim','RF order dikunci setelah before inspection PASS; field packet dikunci setelah after inspection','Setiap perubahan seal dan volume masuk audit log immutable','Upload bukti foto disimpan dengan checksum dan metadata','Alert volume / seal mismatch tidak dapat dihapus oleh receiving operator'].map(x=>`<div class="check-row"><span class="check-name">${x}</span><span class="badge good">REQUIRED</span></div>`).join('')}</div></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Recent Prototype Audit</div><div class="panel-sub">Aktivitas selama sesi browser ini</div></div></div><div class="panel-body">${state.audit.length?state.audit.slice(0,8).map(a=>`<div class="alert"><div class="alert-title">${a.action}</div><div class="alert-meta">${a.time} · ${a.role}<br>${a.detail}</div></div>`).join(''):'<div style="padding:25px;text-align:center;color:var(--dim)">Belum ada aktivitas baru pada sesi ini.</div>'}</div></div></div>`;
}
function bindForms(){
  bindCustodyTransfer();
  const clearBl=$('#clearBlAnalysisBtn');if(clearBl)clearBl.onclick=()=>{state.blAnalyses=[];audit('CLEAR BL ANALYSIS','All BL analysis records cleared');toast('BL analysis data cleared');renderAll();};

  const orderForm=$('#rfOrderForm');
  if(orderForm)orderForm.onsubmit=e=>{
    e.preventDefault();const f=Object.fromEntries(new FormData(orderForm));const existing=f.orderId?orderById(f.orderId):null;
    if(existing?.locked){toast('Order sudah dikunci oleh Fuel Blending inspection dan tidak dapat diubah');return;}
    const payload={loadingDate:f.loadingDate||'17/07/2026',allocation:f.allocation||'RF',driver:(f.driver||'').trim(),capacityKL:Number(f.capacityKL||0),requestLiters:Number(f.capacityKL||0)*1000,plate:(f.plate||'').trim().toUpperCase(),location:(f.location||'TBA').trim()||'TBA',address:(f.address||'TBA').trim()||'TBA',customer:(f.customer||'Riau Fiber').trim()||'Riau Fiber',poPr:(f.poPr||'').trim()||'TBA',priority:f.priority==='true',updatedAt:nowText()};
    if(existing){Object.assign(existing,payload,{version:(existing.version||1)+1});audit('UPDATE RF ORDER',`${existing.id} · ${existing.plate} · ${existing.poPr}`);notify('ORDER_UPDATED',`RF order ${existing.id} diperbarui`,`${existing.driver} · ${existing.plate} · ${fmt(existing.requestLiters)} L · ${existing.location} · ${existing.poPr}`);toast('Perubahan order tersimpan dan notifikasi dikirim ke CR & SPV');}
    else{const id='RF-'+new Date().toISOString().slice(2,10).replaceAll('-','')+'-'+String(state.orders.length+1).padStart(3,'0');state.orders.unshift({...payload,id,status:'REQUESTED',locked:false,inspectionId:null,shipmentId:null,version:1});audit('CREATE RF ORDER',`${id} · ${payload.plate}`);notify('ORDER_CREATED',`RF order baru ${id}`,`${payload.driver} · ${payload.plate} · ${fmt(payload.requestLiters)} L · ${payload.location} · ${payload.poPr}`);toast('RF order berhasil dibuat dan diteruskan ke CR & SPV');}
    state.orderEditing=null;renderAll();
  };

  const pre=$('#preForm');
  if(pre){
    const sel=$('#preOrderSelect');
    const fill=()=>{const o=orderById(sel.value);$('#preOrderPacket').innerHTML=orderPacket(o);if(o){pre.elements.plate.value=o.plate;pre.elements.driver.value=o.driver;pre.elements.transporter.value=o.allocation;}};
    sel.onchange=fill;fill();
    pre.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(pre));const o=orderById(f.orderId);if(!o){toast('RF order tidak ditemukan');return;}if(o.locked){toast('Order sudah terkunci');return;}const id='PRE-'+Date.now().toString().slice(-8);const plateMatch=f.plate.trim().toUpperCase()===o.plate.toUpperCase();const driverMatch=f.driver.trim().toUpperCase()===o.driver.toUpperCase();const rec={...f,id,time:nowText(),destination:'RF',orderMatch:plateMatch&&driverMatch};state.inspections.unshift(rec);
      if(f.result==='PASS'){o.locked=true;o.status='INSPECTION_LOCKED';o.inspectionId=id;o.updatedAt=nowText();audit('ORDER LOCKED BY INSPECTION',`${o.id} · ${id}`);notify('ORDER_LOCKED',`Order ${o.id} dikunci oleh Fuel Blending`,`${f.unitCode} · ${f.plate} · inspection PASS${rec.orderMatch?'':' · WARNING: actual identity differs from order'}`);toast('Inspection PASS — RF order dikunci dan tidak dapat diedit');state.page='loading';}
      else{audit('CREATE PRE-INSPECTION',`${id} · ${f.unitCode} · REJECT`);notify('INSPECTION_REJECT',`Inspection REJECT untuk ${o.id}`,`${f.plate} · order tetap dapat diedit / dijadwalkan ulang`);toast('Inspection REJECT — order tetap terbuka untuk perubahan');}
      renderAll();
    };
  }

  const lf=$('#loadingForm');
  if(lf)lf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(lf));const ins=state.inspections.find(i=>i.id===f.preId);if(!ins){toast('Inspection tidak ditemukan');return;}const o=orderById(ins.orderId);const id='SHP-'+Date.now().toString().slice(-9);state.shipments.unshift({id,orderId:o?.id||null,preId:ins.id,dest:'RF',unitCode:ins.unitCode,plate:ins.plate,driver:ins.driver,transporter:ins.transporter,request:Number(o?.requestLiters||0),flowStart:null,flowEnd:null,total:null,soundingBefore:Number(f.soundingBefore),soundingAfter:Number(f.soundingAfter),loadingStart:f.loadingStart,loadingEnd:f.loadingEnd,fieldRemarks:f.remarks||'',fieldLoadingAt:nowText(),seals:[],status:'AWAITING_AFTER',dispatchAt:null,afterCondition:null,arrivalCheck:null,validation:null});if(o){o.status='FIELD_LOADING';o.shipmentId=id;o.updatedAt=nowText();}audit('COMPLETE FIELD LOADING DATA',`${id} · ${o?.id||'-'} · sounding ${f.soundingBefore}→${f.soundingAfter}`);toast('Field loading data selesai, lanjut after loading inspection');state.page='after_inspection';renderAll();};

  const af=$('#afterForm');
  if(af)af.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(af));const s=state.shipments.find(x=>x.id===f.shipmentId);if(!s)return;const o=orderById(s.orderId);s.seals=[f.seal1,f.seal2,f.seal3,f.seal4].map(x=>x.trim());s.afterCondition=f.condition;s.sealCondition=f.sealCondition;s.afterRemarks=f.remarks||'';s.afterInspectionAt=nowText();const rejected=f.condition==='Reject'||f.sealCondition==='Reject';s.status=rejected?'HOLD':'AWAITING_CR';if(o){o.status=s.status;o.updatedAt=nowText();}audit('FINALIZE AFTER INSPECTION',`${s.id} · ${s.status} · field packet locked`);if(rejected){notify('SECURITY_ALERT',`Unit ${s.plate} ditahan setelah final inspection`,`${o?.id||''} · kondisi ${f.condition} · seal ${f.sealCondition}`);toast('Final inspection HOLD — data diteruskan sebagai alert');}
    else{notify('READY_FOR_CR',`Unit ${s.plate} siap verifikasi Control Room`,`${o?.id||''} · ${o?.poPr||'TBA'} · ${o?.location||'RF'} · sounding ${fmt(s.soundingBefore)}→${fmt(s.soundingAfter)} · 4 seal locked`);toast('Final inspection PASS — data masuk CR Loading Verification');}
    state.page='shipment_monitor';renderAll();};

  const crf=$('#crLoadingForm');
  if(crf){const sel=$('#crShipmentSelect');const updatePacket=()=>{const s=state.shipments.find(x=>x.id===sel.value);$('#crPacket').innerHTML=crPacket(s);};const calc=()=>{const start=Number(crf.elements.flowStart.value||0),end=Number(crf.elements.flowEnd.value||0);$('#crCalcFlow').value=fmt(end-start)+' L';};sel.onchange=updatePacket;crf.addEventListener('input',calc);updatePacket();calc();crf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(crf));const s=state.shipments.find(x=>x.id===f.shipmentId);if(!s)return;const start=Number(f.flowStart),end=Number(f.flowEnd),total=end-start;if(total<=0){toast('Flowmeter final harus lebih besar dari initial');return;}const verified=f.soundingValidation.startsWith('MATCH')&&f.sealValidation.startsWith('MATCH')&&f.conditionValidation.startsWith('GOOD');s.flowStart=start;s.flowEnd=end;s.total=total;s.crValidation={sounding:f.soundingValidation,seal:f.sealValidation,condition:f.conditionValidation,remarks:f.remarks||'',verifiedBy:'Control Room Operator',time:nowText()};s.status=verified?'IN_TRANSIT':'HOLD';s.dispatchAt=verified?nowText():null;const o=orderById(s.orderId);if(o){o.status=verified?'DISPATCHED':'HOLD';o.updatedAt=nowText();}audit('CR LOADING VERIFICATION',`${s.id} · ${fmt(total)} L · ${s.status}`);if(verified){notify('UNIT_LOADED',`Unit ${s.plate} berhasil dimuat`,`${o?.id||''} · ${o?.poPr||'TBA'} · ${o?.location||'RF'} · actual loading ${fmt(total)} L · seal & sounding verified`);toast('Loading berhasil divalidasi CR dan dispatch notification dikirim ke RF & SPV');}
      else{notify('SECURITY_ALERT',`CR HOLD untuk unit ${s.plate}`,`${o?.id||''} · sounding ${f.soundingValidation} · seal ${f.sealValidation} · condition ${f.conditionValidation}`);toast('CR validation menemukan mismatch — shipment HOLD');}state.page='cr_dashboard';renderAll();};}

  const arrival=$('#arrivalForm');
  if(arrival){const sel=$('#arrivalShipment');const fill=()=>{const s=state.shipments.find(x=>x.id===sel.value);$('#arrivalPacket').innerHTML=dispatchPacket(s);['unitCode','plate','driver','transporter'].forEach(k=>arrival.elements[k].value=s?.[k]||'');['seal1','seal2','seal3','seal4'].forEach((k,i)=>arrival.elements[k].value=s?.seals?.[i]||'');};sel.onchange=fill;fill();arrival.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(arrival));const s=state.shipments.find(x=>x.id===f.shipmentId);if(!s)return;const expectedSeals=(s.seals||[]).map(x=>x.trim().toUpperCase()),given=[f.seal1,f.seal2,f.seal3,f.seal4].map(x=>x.trim().toUpperCase());const sealPass=JSON.stringify(expectedSeals)===JSON.stringify(given);const identityPass=f.unitCode.trim().toUpperCase()===s.unitCode.toUpperCase()&&f.plate.trim().toUpperCase()===s.plate.toUpperCase()&&f.driver.trim().toUpperCase()===s.driver.toUpperCase()&&f.transporter.trim().toUpperCase()===s.transporter.toUpperCase();const serious=f.damage==='Ada kerusakan serius';const pass=sealPass&&identityPass&&!serious;s.arrivalCheck={pass,sealPass,identityPass,damage:f.damage,notes:f.notes||'',time:nowText(),actual:{unitCode:f.unitCode,plate:f.plate,driver:f.driver,transporter:f.transporter,seals:given}};s.status=pass?'AWAITING_RECEIVING':'HOLD';const o=orderById(s.orderId);if(o){o.status=s.status;o.updatedAt=nowText();}audit('RF PHYSICAL ARRIVAL CHECK',`${s.id} · ${pass?'MATCH':'MISMATCH'}`);if(pass){notify('ARRIVAL_VERIFIED',`Physical arrival verified · ${s.plate}`,`${o?.location||'RF'} · identity and 4 seals match locked CR packet`);toast('Physical arrival sesuai — lanjut final actual receiving');}else{const issues=[!identityPass?'identity mismatch':'',!sealPass?'seal mismatch':'',serious?'serious damage':''].filter(Boolean).join(', ');notify('SECURITY_ALERT',`Potential custody crime alert · ${s.plate}`,`${o?.id||''} · ${issues}`);toast('Mismatch terdeteksi — shipment HOLD untuk investigasi');}renderAll();};}

  const finalRf=$('#finalReceivingForm');
  if(finalRf){const sel=$('#finalReceivingShipment');const fill=()=>{const s=state.shipments.find(x=>x.id===sel.value);$('#finalReceivingPacket').innerHTML=dispatchPacket(s);finalRf.elements.received.value=s?.total||0;};sel.onchange=fill;fill();finalRf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(finalRf));const s=state.shipments.find(x=>x.id===f.shipmentId);if(!s||!s.total)return;const received=Number(f.received),diff=received-s.total,tolerance=s.total*TOLERANCE_RATE,pct=diff/s.total*100,volumePass=Math.abs(diff)<=tolerance;const risk=volumePass?'LOW':'HIGH';s.validation={received,diff,pct,tolerance,volumePass,sealPass:s.arrivalCheck?.sealPass??false,identityPass:s.arrivalCheck?.identityPass??false,risk,time:nowText(),soundBefore:Number(f.soundBefore),soundAfter:Number(f.soundAfter),notes:f.notes||''};s.status=volumePass?'RECEIVED':'HOLD';const o=orderById(s.orderId);if(o){o.status=s.status;o.updatedAt=nowText();}audit('FINAL RF RECEIVING',`${s.id} · ${fmt(received)} L · variance ${fmt(diff)} L (${pct.toFixed(4)}%)`);if(volumePass){notify('RECEIVING_COMPLETED',`Receiving selesai · ${s.plate}`,`${o?.location||'RF'} · loading ${fmt(s.total)} L vs receiving ${fmt(received)} L · variance ${fmt(diff)} L (${pct.toFixed(4)}%)`);toast('Final receiving selesai dan berada dalam toleransi 0,01%');}
      else{notify('RECEIVING_VARIANCE_ALERT',`Receiving variance melebihi toleransi · ${s.plate}`,`${o?.location||'RF'} · loading ${fmt(s.total)} L vs receiving ${fmt(received)} L · variance ${fmt(diff)} L (${pct.toFixed(4)}%)`);toast('Receiving variance melebihi toleransi — HOLD / investigate');}state.page='site_history';renderAll();};}

  const mf=$('#marineForm');if(mf)mf.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(mf));const kind=mf.dataset.kind;const id=(kind==='barge'?'BL-':'DC-')+Date.now().toString().slice(-8);state.discharge.unshift({id,type:kind==='barge'?'Shore Tank → Barge':'Vessel → Shore Tank',vessel:f.vessel,product:f.product,obs:Number(f.obs),at15:Number(f.at15),mt:Number(f.mt),lt:Number(f.lt),status:'COMPLETED',time:nowText()});audit('CREATE MARINE RECORD',`${id} · ${f.vessel}`);toast('Marine custody record tersimpan');renderAll();};
}
function goPage(p){if(role().modules.includes(p)){state.page=p;renderAll()}}
window.goPage=goPage;
function renderPage(){
  const pages={dashboard,spv_dashboard:spvDashboard,cr_dashboard:crDashboard,rf_dashboard:rfDashboard,rf_orders:rfOrdersPage,order_control:orderControlPage,cr_loading:crLoadingPage,receiving_results:receivingResultsPage,notifications:notificationsPage,pre_inspection:preInspection,loading:loadingPage,after_inspection:afterInspection,shipment_monitor:shipmentMonitor,receiving:receivingPage,site_history:siteHistory,validation:validationPage,bl_analysis:blAnalysisPage,custody_transfer:custodyTransferPage,cargo_calculator:cargoCalculatorPage,discharge:()=>dischargePage('discharge'),marine_loading:()=>dischargePage('marine_loading'),admin:adminPage};
  if(!role().modules.includes(state.page))state.page=defaultPageForRole();
  $('#content').innerHTML=(pages[state.page]||pages[defaultPageForRole()]||dashboard)();
  $('#crumb').textContent=NAV.flatMap(x=>x.items).find(x=>x[0]===state.page)?.[2]||'Dashboard';
  bindForms();
}
function renderAll(){persistState();renderIdentity();renderNav();renderTicker();renderPage();}
function closeMenu(){$('#sidebar').classList.remove('open');$('#overlay').classList.remove('show')}
$('#menuBtn').onclick=()=>{$('#sidebar').classList.toggle('open');$('#overlay').classList.toggle('show')};$('#overlay').onclick=closeMenu;
setInterval(()=>$('#clock').textContent=new Date().toLocaleString('id-ID',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}),1000);
setupRoles();renderAll();

/* =========================================================
   ENTERPRISE ROLE & WORKFLOW EXTENSION — 2026-07-19
   Preserves legacy custody, BL analysis and marine tools.
   Adds Maintank, Riau Fiber, Mill, Transport, CR Inventory,
   SPV planning/complaint/maintenance/project/news workflows,
   optional Firebase shared persistence and visitor telemetry.
   ========================================================= */

const APP_VERSION = '20260719-enterprise-v3';
const APP_CONFIG = {
  // Paste the Firebase Web App configuration here to activate shared multi-user persistence.
  // Keep Firestore Security Rules and Firebase Authentication enabled for production use.
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  // Optional Cloudflare Worker endpoint from backend/visitor-worker.js.
  // Example: https://fuel-visitor-log.<subdomain>.workers.dev/event
  visitorLogEndpoint: '',
  appName: 'Fuel Custody Live'
};

// Extend destination dictionary without removing the original mappings.
DEST.RF = 'Riau Fiber';
DEST.MAINTANK = 'Maintank';
DEST.MILL = 'Mill';
DEST.FB = 'Fuel Blending';
DEST_ROLE.rf_operator = 'RF';
DEST_ROLE.maintank_operator = 'MAINTANK';
DEST_ROLE.mill_operator = 'MILL';

Object.assign(ROLE_CONFIG, {
  maintank_operator:{
    label:'Maintank Operator',site:'Maintank',
    scope:'Request truck, receiving custody, final flowmeter reconciliation dan empty-unit sealing. Hanya data Maintank ↔ Fuel Blending.',
    modules:['maintank_dashboard','maintank_requests','site_receiving_v2','empty_units','receiving_results_site','customer_complaints','notifications']
  },
  rf_operator:{
    label:'Riau Fiber Operator',site:'Riau Fiber',
    scope:'Request unit/order, receiving custody, unloading-area data dan complaint. Empty unit kembali ke Maintank.',
    modules:['rf_dashboard_v2','rf_requests_v2','site_receiving_v2','receiving_results_site','customer_complaints','notifications']
  },
  mill_operator:{
    label:'Mill Operator',site:'Mill',
    scope:'Request order, check surat jalan, receiving custody, sample check dan cargo color evidence.',
    modules:['mill_dashboard','mill_requests','site_receiving_v2','receiving_results_site','customer_complaints','notifications']
  },
  transport_operator:{
    label:'Transport Operator',site:'Transport Fleet',
    scope:'Menetapkan unit AVAILABLE, READY, ALLOCATED atau NOT READY / WORKSHOP beserta keterangannya.',
    modules:['transport_dashboard','transport_fleet','notifications']
  },
  fuel_field:{
    label:'Fuel Blending Operator',site:'Fuel Blending',
    scope:'Menerima request seluruh site, before inspection, loading, finish loading, live dashboard dan operational notifications.',
    modules:['fuel_ops_dashboard','request_inbox','pre_inspection_v2','loading_v2','after_inspection_v2','shipment_monitor','ops_bulletin','notifications']
  },
  cr_operator:{
    label:'Control Room Operator',site:'Fuel Blending · Control Room',
    scope:'Control loading, final flowmeter, sounding verification, dispatch, inventory stock control dan operational bulletin.',
    modules:['cr_dashboard_v2','order_control_v2','cr_loading_v2','inventory_control','shipment_monitor','receiving_results','ops_bulletin','notifications']
  },
  fuel_spv:{
    label:'Fuel SPV Operator',site:'Fuel Blending · Superior',
    scope:'Supervisi custody, shipment scheduling, complaint handling, preventive maintenance, project, safety/news dan marine cargo tools.',
    modules:['spv_dashboard_v2','request_inbox','order_control_v2','shipment_monitor','receiving_results','notifications','inventory_control','shipment_schedule','spv_complaints','maintenance_schedule','projects','news_manager','ops_bulletin','bl_analysis','custody_transfer','cargo_calculator','discharge','marine_loading','validation']
  },
  it_admin:{
    label:'IT Administrator',site:'Enterprise',
    scope:'Akses seluruh role, operational workflow, backend status, audit, custody dan governance.',
    modules:['enterprise_dashboard','maintank_dashboard','rf_dashboard_v2','mill_dashboard','transport_dashboard','fuel_ops_dashboard','cr_dashboard_v2','spv_dashboard_v2','maintank_requests','rf_requests_v2','mill_requests','request_inbox','order_control_v2','pre_inspection_v2','loading_v2','after_inspection_v2','cr_loading_v2','inventory_control','transport_fleet','site_receiving_v2','empty_units','receiving_results_site','receiving_results','shipment_monitor','customer_complaints','spv_complaints','shipment_schedule','maintenance_schedule','projects','news_manager','ops_bulletin','notifications','bl_analysis','custody_transfer','cargo_calculator','discharge','marine_loading','validation','admin']
  }
});

// Rebuild navigation while retaining every legacy analytical and marine module.
NAV.length = 0;
NAV.push(
  {label:'Overview',items:[
    ['enterprise_dashboard','▦','Enterprise Dashboard'],
    ['maintank_dashboard','◫','Maintank Live Dashboard'],
    ['rf_dashboard_v2','◈','Riau Fiber Live Dashboard'],
    ['mill_dashboard','▧','Mill Live Dashboard'],
    ['transport_dashboard','▱','Transport Live Dashboard'],
    ['fuel_ops_dashboard','◆','Fuel Blending Dashboard'],
    ['cr_dashboard_v2','⌘','Control Room Dashboard'],
    ['spv_dashboard_v2','▤','SPV Dashboard'],
    ['notifications','●','Live Notifications']
  ]},
  {label:'Request & Allocation',items:[
    ['maintank_requests','＋','Maintank Truck Request'],
    ['rf_requests_v2','＋','Riau Fiber Request'],
    ['mill_requests','＋','Mill Request Order'],
    ['request_inbox','≡','Fuel Blending Request Inbox'],
    ['order_control_v2','◎','Order Control']
  ]},
  {label:'Transport',items:[
    ['transport_fleet','▱','Fleet Availability']
  ]},
  {label:'Fuel Blending Operation',items:[
    ['pre_inspection_v2','✓','Before Loading Inspection'],
    ['loading_v2','↯','Loading Process'],
    ['after_inspection_v2','◆','Finish Loading Inspection'],
    ['shipment_monitor','↗','Shipment Monitor']
  ]},
  {label:'Control Room',items:[
    ['cr_loading_v2','⇆','CR Loading Verification'],
    ['inventory_control','▥','Stock & Inventory Control']
  ]},
  {label:'Customer Receiving',items:[
    ['site_receiving_v2','⌁','Cargo Receiving'],
    ['empty_units','◇','Empty Unit Sealing'],
    ['receiving_results_site','◎','Receiving Results'],
    ['receiving_results','◎','Network Receiving Results']
  ]},
  {label:'Customer Care',items:[
    ['customer_complaints','!','Customer Complaints'],
    ['spv_complaints','!','Complaint Handling']
  ]},
  {label:'Planning & Work',items:[
    ['shipment_schedule','◷','Shipment Schedule'],
    ['maintenance_schedule','⚒','Preventive Maintenance'],
    ['projects','◇','Project Control'],
    ['news_manager','✦','Safety & Operations News'],
    ['ops_bulletin','✦','Operations Bulletin']
  ]},
  {label:'Port Operation',items:[
    ['bl_analysis','▤','BL Analysis Report'],
    ['custody_transfer','◫','Custody Receive & Transfer'],
    ['cargo_calculator','∑','Cargo & Tanker Calculator']
  ]},
  {label:'Marine & Cargo',items:[
    ['discharge','⚓','Discharge Cargo'],
    ['marine_loading','▱','Loading to Barge / Tugboat']
  ]},
  {label:'System',items:[['admin','⚙','Access & Governance']]}
);

// Data model migration — keep all old records and add source/site metadata.
state.orders.forEach(o=>{
  o.requesterSite = o.requesterSite || 'RF';
  o.requesterRole = o.requesterRole || 'rf_operator';
  o.operatorName = o.operatorName || 'Riau Fiber Operator';
  o.areaAllocation = o.areaAllocation || o.allocation || o.location || 'TBA';
  o.unitType = o.unitType || 'Tank Truck';
  o.createdAt = o.createdAt || o.updatedAt || nowText();
  o.updatedAt = o.updatedAt || o.createdAt;
});
state.shipments.forEach(s=>{s.dest=s.dest||'RF';s.sourceSite=s.sourceSite||'FB';});

const existingFleetPlates = [...new Set(state.orders.map(o=>String(o.plate||'').trim()).filter(Boolean))];
state.transportUnits = state.transportUnits || existingFleetPlates.map((plate,i)=>({
  id:`TRK-${String(i+1).padStart(3,'0')}`,plate,unitCode:`TT-${String(i+1).padStart(3,'0')}`,
  type:'Tank Truck',capacityKL:Number(state.orders.find(o=>o.plate===plate)?.capacityKL||0),
  transporter:state.orders.find(o=>o.plate===plate)?.allocation||'Transport',status:'AVAILABLE',remarks:'',updatedAt:nowText()
}));
state.inventory = state.inventory || [
  {id:'T5000',tank:'T.5000',product:'HSD',capacity:5000000,bookStock:0,soundingStock:0,updatedAt:nowText()},
  {id:'T1000',tank:'T.1000',product:'FAME',capacity:1000000,bookStock:0,soundingStock:0,updatedAt:nowText()},
  {id:'T850',tank:'T.850',product:'MULTI / FAME',capacity:850000,bookStock:0,soundingStock:0,updatedAt:nowText()},
  {id:'T04',tank:'T.04',product:'BIOSOLAR / BLENDING',capacity:0,bookStock:0,soundingStock:0,updatedAt:nowText()}
];
state.emptyUnitRecords = state.emptyUnitRecords || [];
state.qualityChecks = state.qualityChecks || [];
state.complaints = state.complaints || [];
state.shipmentSchedules = state.shipmentSchedules || [];
state.maintenance = state.maintenance || [];
state.projects = state.projects || [];
state.bulletins = state.bulletins || [];

const ENTERPRISE_STATE_KEYS = [
  'orders','inspections','shipments','transportUnits','inventory','emptyUnitRecords','qualityChecks','complaints',
  'shipmentSchedules','maintenance','projects','bulletins','discharge','cargoTransfers','notifications','audit','blAnalyses'
];
const ENTERPRISE_STORAGE_KEY = 'fuelCustodyLive_enterprise_v3';
try{
  const savedV3 = JSON.parse(localStorage.getItem(ENTERPRISE_STORAGE_KEY)||'null');
  if(savedV3 && typeof savedV3==='object'){
    ENTERPRISE_STATE_KEYS.forEach(k=>{if(Array.isArray(savedV3[k])) state[k]=savedV3[k];});
  }
}catch(e){console.warn('Enterprise local cache restore failed',e);}

function v3SiteScope(){
  if(state.role==='rf_operator')return 'RF';
  if(state.role==='maintank_operator')return 'MAINTANK';
  if(state.role==='mill_operator')return 'MILL';
  return null;
}
siteScope = v3SiteScope;
allowedShipments = function(){const s=v3SiteScope();return s?state.shipments.filter(x=>x.dest===s):state.shipments;};
allowedOrders = function(){const s=v3SiteScope();return s?state.orders.filter(o=>o.requesterSite===s):state.orders;};
defaultPageForRole = function(){
  const m={
    maintank_operator:'maintank_dashboard',rf_operator:'rf_dashboard_v2',mill_operator:'mill_dashboard',transport_operator:'transport_dashboard',
    fuel_field:'fuel_ops_dashboard',cr_operator:'cr_dashboard_v2',fuel_spv:'spv_dashboard_v2',it_admin:'enterprise_dashboard'
  };
  return m[state.role]||'enterprise_dashboard';
};

function siteName(code){return ({RF:'Riau Fiber',MAINTANK:'Maintank',MILL:'Mill',FB:'Fuel Blending'})[code]||code||'—';}
function roleAudienceForSite(code){return ({RF:'rf_operator',MAINTANK:'maintank_operator',MILL:'mill_operator'})[code]||null;}
function isoNow(){return new Date().toISOString();}
function timestampFields(prefix='Entry'){
  const d=new Date();
  const date=d.toISOString().slice(0,10), time=d.toTimeString().slice(0,5);
  return `<div class="field"><label>${prefix} Date</label><input name="entryDate" type="date" value="${date}" required></div><div class="field"><label>${prefix} Time</label><input name="entryTime" type="time" value="${time}" required></div>`;
}
function operatorField(value='') {return `<div class="field"><label>Operator Name <span class="required-dot">*</span></label><input name="operatorName" value="${value}" placeholder="Nama operator" required></div>`;}
function siteBadge(code){return `<span class="site-badge ${String(code||'').toLowerCase()}">${siteName(code)}</span>`;}
function backendBanner(){
  const s=EnterpriseBackend.status;
  const cls=s==='online'?'online':s==='error'?'error':'';
  const msg=s==='online'?'Shared Firestore synchronization active':s==='connecting'?'Connecting to shared backend…':s==='error'?'Backend unavailable — local cache fallback active':'Local browser cache mode — add Firebase config for cross-user persistence';
  return `<div class="backend-banner ${cls}"><span class="backend-led"></span><b>${s.toUpperCase()}</b><span>${msg}</span></div>`;
}
function newId(prefix){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;}
function activeOrderStatuses(){return ['REQUESTED','TRANSPORT_READY','INSPECTION_LOCKED','FIELD_LOADING','AWAITING_AFTER','AWAITING_CR','DISPATCHED','IN_TRANSIT','AWAITING_RECEIVING'];}
function duplicateUnitRequest(plate,excludeId=null){
  const p=String(plate||'').trim().toUpperCase(); if(!p)return null;
  return state.orders.find(o=>o.id!==excludeId&&String(o.plate||'').trim().toUpperCase()===p&&activeOrderStatuses().includes(o.status));
}
function unitBusy(plate){return !!duplicateUnitRequest(plate);}
function requestById(id){return state.orders.find(o=>o.id===id);}
function fleetUnitByPlate(plate){const p=String(plate||'').trim().toUpperCase();return state.transportUnits.find(u=>String(u.plate||'').trim().toUpperCase()===p);}
function siteOrders(site){return state.orders.filter(o=>o.requesterSite===site);}
function siteShipments(site){return state.shipments.filter(s=>s.dest===site);}
function requestDisplay(o){return `${o.id} · ${o.plate||'AUTO'} · ${fmt(o.requestLiters||0)} L · ${o.areaAllocation||o.location||'TBA'}`;}
function millQualityRequired(site){return site==='MILL';}
function qualityStatusBadge(q){if(!q)return '<span class="badge neutral">NOT CHECKED</span>';return q.colorStatus==='BAIK'?'<span class="badge good">COLOR BAIK</span>':'<span class="badge warn">COLOR KURANG BAGUS</span>';}

// ---------- Optional shared backend (Firestore + Storage) ----------
const EnterpriseBackend = {
  status:'local', ready:false, applyingRemote:false, db:null, storage:null, mods:null, syncTimer:null, lastHashes:{}, listeners:[],
  configured(){const c=APP_CONFIG.firebase;return !!(c&&c.apiKey&&c.projectId&&c.appId);},
  async init(){
    if(!this.configured()){this.status='local';return;}
    this.status='connecting';
    try{
      const v='12.16.0';
      const [appMod,fsMod,storageMod] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`),
        import(`https://www.gstatic.com/firebasejs/${v}/firebase-storage.js`)
      ]);
      const app=appMod.initializeApp(APP_CONFIG.firebase);
      let db;
      try{db=fsMod.initializeFirestore(app,{localCache:fsMod.persistentLocalCache({tabManager:fsMod.persistentMultipleTabManager()})});}
      catch(_){db=fsMod.getFirestore(app);}
      this.db=db;this.storage=storageMod.getStorage(app);this.mods={...fsMod,...storageMod};this.ready=true;this.status='online';
      this.attachListeners();this.scheduleSync();renderAll();
    }catch(err){console.error('Firebase init failed',err);this.status='error';this.ready=false;renderAll();}
  },
  collectionName(key){return `fuel_portal_${key}`;},
  attachListeners(){
    if(!this.ready)return;
    ENTERPRISE_STATE_KEYS.forEach(key=>{
      const col=this.mods.collection(this.db,this.collectionName(key));
      const unsub=this.mods.onSnapshot(col,snap=>{
        if(snap.empty){this.scheduleSync();return;}
        const arr=[];snap.forEach(d=>arr.push({...d.data(),id:d.data().id||d.id}));
        this.applyingRemote=true;state[key]=arr;this.lastHashes[key]=JSON.stringify(arr);persistLocalV3();renderAll();this.applyingRemote=false;
      },err=>console.warn(`Realtime listener ${key} failed`,err));
      this.listeners.push(unsub);
    });
  },
  scheduleSync(){if(!this.ready||this.applyingRemote)return;clearTimeout(this.syncTimer);this.syncTimer=setTimeout(()=>this.syncAll(),800);},
  async syncAll(){
    if(!this.ready||this.applyingRemote)return;
    try{
      for(const key of ENTERPRISE_STATE_KEYS){
        const arr=Array.isArray(state[key])?state[key]:[];
        const hash=JSON.stringify(arr);if(hash===this.lastHashes[key])continue;
        let batch=this.mods.writeBatch(this.db),count=0;
        for(const raw of arr){
          const rec={...raw,id:raw.id||newId(key.slice(0,3).toUpperCase())};
          batch.set(this.mods.doc(this.db,this.collectionName(key),String(rec.id)),rec,{merge:true});count++;
          if(count>=450){await batch.commit();batch=this.mods.writeBatch(this.db);count=0;}
        }
        if(count)await batch.commit();
        this.lastHashes[key]=hash;
      }
    }catch(err){console.warn('Shared state sync failed',err);this.status='error';}
  },
  async upload(file,pathPrefix='evidence'){
    if(!file)return null;
    if(this.ready&&this.storage){
      const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
      const path=`${pathPrefix}/${Date.now()}-${safe}`;
      const r=this.mods.ref(this.storage,path);await this.mods.uploadBytes(r,file,{contentType:file.type||'application/octet-stream'});
      return await this.mods.getDownloadURL(r);
    }
    return await compressImageToDataUrl(file,1280,.72);
  }
};

function persistLocalV3(){
  try{localStorage.setItem(ENTERPRISE_STORAGE_KEY,JSON.stringify(Object.fromEntries(ENTERPRISE_STATE_KEYS.map(k=>[k,state[k]]))));}catch(e){console.warn('Enterprise local persistence failed',e);}
}
const legacyPersistState = persistState;
persistState = function(){
  try{legacyPersistState();}catch(_){/* legacy cache is optional */}
  persistLocalV3();EnterpriseBackend.scheduleSync();
};

async function compressImageToDataUrl(file,maxSize=1280,quality=.75){
  if(!file)return null;
  if(!file.type?.startsWith('image/'))return `file://${file.name}`;
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{
      const img=new Image();img.onerror=reject;img.onload=()=>{
        let w=img.width,h=img.height;const scale=Math.min(1,maxSize/Math.max(w,h));w=Math.round(w*scale);h=Math.round(h*scale);
        const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };img.src=reader.result;
    };reader.readAsDataURL(file);
  });
}
async function analyzeCargoColorFile(file){
  if(!file)return {colorStatus:'NOT_CHECKED',qualityStatus:'BAGUS',rgb:null,score:null};
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{
      const img=new Image();img.onerror=reject;img.onload=()=>{
        const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,32,32);
        const d=x.getImageData(0,0,32,32).data;let r=0,g=0,b=0,n=0;
        for(let i=0;i<d.length;i+=16){r+=d[i];g+=d[i+1];b+=d[i+2];n++;}
        r=Math.round(r/n);g=Math.round(g/n);b=Math.round(b/n);const luminance=.2126*r+.7152*g+.0722*b;const spread=Math.max(r,g,b)-Math.min(r,g,b);
        const good=luminance>=75&&luminance<=235&&spread<=145;
        resolve({colorStatus:good?'BAIK':'KURANG_BAGUS',qualityStatus:'BAGUS',rgb:[r,g,b],score:Math.round(luminance)});
      };img.src=reader.result;
    };reader.readAsDataURL(file);
  });
}

// ---------- Optional visitor telemetry ----------
const VisitorTelemetry = {
  anonymousId(){let id=localStorage.getItem('fuelPortalVisitorId');if(!id){id=crypto.randomUUID?.()||newId('VIS');localStorage.setItem('fuelPortalVisitorId',id);}return id;},
  async track(){
    if(!APP_CONFIG.visitorLogEndpoint)return;
    try{
      const nav=navigator.userAgentData;
      await fetch(APP_CONFIG.visitorLogEndpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
        anonymousId:this.anonymousId(),path:location.pathname+location.search,referrer:document.referrer||'',role:state.role,
        device:{userAgent:navigator.userAgent,platform:nav?.platform||navigator.platform||'',mobile:nav?.mobile??/Mobi/i.test(navigator.userAgent),screen:`${screen.width}x${screen.height}`,language:navigator.language},
        clientTimestamp:isoNow()
      }),keepalive:true});
    }catch(err){console.warn('Visitor telemetry unavailable',err);}
  }
};

function enterpriseHero(title,desc,site='Enterprise',actions=''){
  return `${backendBanner()}<div class="role-hero"><div><h2>${title}</h2><p>${desc}</p></div><div class="role-hero-meta">${siteBadge(site)}<span class="role-chip live"><span class="live-dot"></span>LIVE WORKFLOW</span>${actions}</div></div>`;
}
function moduleCard(kicker,title,value,sub,action='',glass=true){return `<div class="module-card ${glass?'glass':''}"><div><div class="mc-kicker">${kicker}</div><div class="mc-title">${title}</div><div class="mc-value">${value}</div><div class="mc-sub">${sub}</div></div>${action?`<div class="mc-action">${action}</div>`:''}</div>`;}
function currentSiteCode(){return v3SiteScope();}
function siteActiveOrders(site){return siteOrders(site).filter(o=>!['RECEIVED','COMPLETED','CANCELLED'].includes(o.status));}
function siteReceived(site){return siteShipments(site).filter(s=>s.status==='RECEIVED');}
function siteInTransit(site){return siteShipments(site).filter(s=>['IN_TRANSIT','AWAITING_RECEIVING'].includes(s.status));}
function safePct(n,d){return d?Number(n||0)/Number(d)*100:0;}
function requestStatusCounts(site){
  const o=siteOrders(site);return {total:o.length,open:o.filter(x=>!x.locked).length,locked:o.filter(x=>x.locked).length,dispatched:o.filter(x=>x.status==='DISPATCHED').length};
}
function requestTableV3(rows,{showSite=true,actions=false}={}){
  if(!rows.length)return '<div class="empty-note">Belum ada request.</div>';
  return `<div class="tbl-wrap"><table><thead><tr><th>Request</th>${showSite?'<th>Site</th>':''}<th>Date / Time</th><th>Operator</th><th>Truck / Plate</th><th>Area</th><th>Volume</th><th>PO / PR</th><th>Status</th>${actions?'<th>Action</th>':''}</tr></thead><tbody>${rows.map(o=>`<tr><td class="mono">${o.id}<div class="cell-sub">${o.version?`v${o.version}`:''}</div></td>${showSite?`<td>${siteBadge(o.requesterSite)}</td>`:''}<td class="mono">${o.loadingDate||o.entryDate||'—'}<div class="cell-sub">${o.entryTime||String(o.createdAt||'').split(', ').pop()||'—'}</div></td><td>${o.operatorName||'—'}</td><td>${o.unitCode||o.requestedTruck||'AUTO'}<div class="cell-sub mono">${o.plate||'TBA'}</div></td><td>${o.areaAllocation||o.location||'TBA'}<div class="cell-sub">${o.address||''}</div></td><td class="mono">${fmt(o.requestLiters||0)} L</td><td class="mono">${o.poPr||'TBA'}</td><td>${badge(o.status)}</td>${actions?`<td>${o.locked?'<span class="text-warn mono">LOCKED</span>':`<button class="btn btn-sm" onclick="editSiteRequest('${o.id}')">Edit</button>`}</td>`:''}</tr>`).join('')}</tbody></table></div>`;
}
function shipmentMiniTable(rows,siteOnly=false){
  if(!rows.length)return '<div class="empty-note">Belum ada delivery data dari Fuel Blending.</div>';
  return `<div class="tbl-wrap"><table><thead><tr><th>Shipment</th>${siteOnly?'':'<th>Destination</th>'}<th>Unit</th><th>Actual Loading</th><th>Seal</th><th>Status</th><th>Timestamp</th></tr></thead><tbody>${rows.map(s=>`<tr><td class="mono">${s.id}<div class="cell-sub">${s.orderId||'—'}</div></td>${siteOnly?'':`<td>${siteBadge(s.dest)}</td>`}<td>${s.unitCode||'—'}<div class="cell-sub mono">${s.plate||'—'}</div></td><td class="mono">${s.total!=null?fmt(s.total)+' L':'Pending CR'}</td><td class="mono">${(s.seals||[]).filter(Boolean).join(' · ')||'Pending'}</td><td>${badge(s.status)}</td><td class="mono">${s.dispatchAt||s.afterInspectionAt||s.fieldLoadingAt||'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function dashboardTimeline(site){
  const events=[];
  state.orders.filter(o=>!site||o.requesterSite===site).slice(0,6).forEach(o=>events.push({time:o.updatedAt||o.createdAt,title:`${o.id} · ${o.status}`,detail:`${o.plate||'AUTO'} · ${fmt(o.requestLiters)} L · ${o.areaAllocation||'TBA'}`}));
  state.shipments.filter(s=>!site||s.dest===site).slice(0,6).forEach(s=>events.push({time:s.dispatchAt||s.afterInspectionAt||s.fieldLoadingAt,title:`${s.id} · ${s.status}`,detail:`${s.plate} · ${s.total?fmt(s.total)+' L':'loading in progress'}`}));
  events.sort((a,b)=>String(b.time).localeCompare(String(a.time)));
  return events.slice(0,8).map(e=>`<div class="timeline-item"><div class="timeline-time">${e.time||'—'}</div><div class="timeline-dot"></div><div><div class="timeline-title">${e.title}</div><div class="timeline-detail">${e.detail}</div></div></div>`).join('')||'<div class="empty-note">Belum ada activity.</div>';
}
function inventoryCards(){return state.inventory.map(t=>{const stock=Number(t.soundingStock||t.bookStock||0);const p=t.capacity?safePct(stock,t.capacity):0;const vari=Number(t.soundingStock||0)-Number(t.bookStock||0);return `<div class="inventory-card"><div class="tank-name">${t.tank}</div><div class="tank-product">${t.product}</div><div class="tank-stock">${fmt(stock)} L</div><div class="stock-track"><span style="width:${Math.max(0,Math.min(100,p))}%"></span></div><div class="inventory-meta"><span>Book ${fmt(t.bookStock)} L</span><span class="${Math.abs(vari)>0?'text-warn':'text-good'}">Var ${fmt(vari)} L</span></div><div class="inventory-meta"><span>${p.toFixed(1)}% capacity</span><span>${t.updatedAt||'—'}</span></div></div>`;}).join('');}
function bulletinCards(audienceRole=state.role){
  const rows=state.bulletins.filter(b=>!b.audience?.length||b.audience.includes(audienceRole)||state.role==='fuel_spv'||state.role==='it_admin').slice(0,8);
  if(!rows.length)return '<div class="empty-note">Belum ada safety news atau operational notice.</div>';
  return `<div class="module-grid">${rows.map(b=>`<div class="news-card"><div class="news-type">${b.type}</div><h4>${b.title}</h4><p>${b.body}</p><div class="news-meta">${b.date} ${b.time||''} · ${b.author||'Fuel SPV'}</div></div>`).join('')}</div>`;
}

function enterpriseDashboard(){
  const open=state.orders.filter(o=>!o.locked).length,ships=state.shipments.length,received=state.shipments.filter(s=>s.status==='RECEIVED').length,holds=state.shipments.filter(s=>s.status==='HOLD').length;
  return `${enterpriseHero('Enterprise Operations Dashboard','Cross-role view untuk request, fleet, Fuel Blending, Control Room, inventory, customer receiving dan SPV planning.','FB')}
  <div class="module-grid">${moduleCard('NETWORK','Open Requests',open,'Request yang belum inspection lock')}${moduleCard('CUSTODY','Shipments',ships,'Seluruh unit custody chain')}${moduleCard('RECEIVING','Completed',received,'Receiving final completed')}${moduleCard('EXCEPTION','Hold / Investigation',holds,'Anomaly membutuhkan review')}</div>
  <div class="inventory-grid">${inventoryCards()}</div>
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Latest Cross-Site Requests</div><div class="panel-sub">RF, Maintank dan Mill</div></div></div><div class="panel-body flush">${requestTableV3(state.orders.slice(0,10))}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Live Operational Timeline</div><div class="panel-sub">Latest workflow events</div></div></div><div class="panel-body">${dashboardTimeline(null)}</div></div></div>`;
}

function maintankDashboard(){
  const site='MAINTANK',c=requestStatusCounts(site),incoming=siteInTransit(site),received=siteReceived(site),empty=state.emptyUnitRecords.filter(x=>x.site==='MAINTANK').length;
  return `${enterpriseHero('Maintank Live Dashboard','Hanya menampilkan alur data Fuel Blending ↔ Maintank: truck request, loading result, receiving dan empty-unit sealing.','MAINTANK','<button class="btn btn-primary" onclick="goPage(\'maintank_requests\')">New Truck Request</button>')}
  <div class="dashboard-strip"><div class="strip-title">VISIBLE SCOPE</div><span class="strip-item">Fuel Blending</span><span class="strip-item">Maintank</span><span class="strip-item">No RF / Mill status</span></div>
  <div class="module-grid">${moduleCard('REQUEST','Open Request',c.open,'Editable until FB inspection PASS')}${moduleCard('DELIVERY','Inbound Unit',incoming.length,'Delivery data from Fuel Blending')}${moduleCard('RECEIVING','Completed',received.length,'Actual receiving reconciled')}${moduleCard('EMPTY UNIT','Sealed',empty,'Empty-unit seal records')}</div>
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Fuel Blending Delivery to Maintank</div><div class="panel-sub">Only shipments matching Maintank requests</div></div></div><div class="panel-body flush">${shipmentMiniTable(siteShipments(site),true)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Maintank Activity</div><div class="panel-sub">Request to receiving timeline</div></div></div><div class="panel-body">${dashboardTimeline(site)}</div></div></div>`;
}
function rfDashboardV2(){
  const site='RF',c=requestStatusCounts(site),incoming=siteInTransit(site),received=siteReceived(site),alerts=siteShipments(site).filter(s=>s.status==='HOLD').length;
  return `${enterpriseHero('Riau Fiber Live Dashboard','Request unit ke Fuel Blending, live loading status dan actual receiving. Empty unit dikembalikan ke Maintank untuk sealing.','RF','<button class="btn btn-primary" onclick="goPage(\'rf_requests_v2\')">New RF Request</button>')}
  <div class="module-grid">${moduleCard('REQUEST','Open',c.open,'Duplicate active unit automatically blocked')}${moduleCard('DELIVERY','Inbound',incoming.length,'Dispatched by Control Room')}${moduleCard('RECEIVING','Completed',received.length,'Including unloading area/operator')}${moduleCard('SECURITY','Exceptions',alerts,'Seal, identity or volume mismatch')}</div>
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">RF Request & Loading Status</div><div class="panel-sub">Live request chain</div></div></div><div class="panel-body flush">${requestTableV3(siteOrders(site).slice(0,12),{showSite:false,actions:true})}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">RF Delivery Stream</div><div class="panel-sub">Latest Fuel Blending dispatch</div></div></div><div class="panel-body flush">${shipmentMiniTable(siteShipments(site).slice(0,10),true)}</div></div></div>`;
}
function millDashboard(){
  const site='MILL',c=requestStatusCounts(site),incoming=siteInTransit(site),received=siteReceived(site),q=state.qualityChecks.filter(x=>x.site==='MILL').slice(0,1)[0];
  return `${enterpriseHero('Mill Live Dashboard','Request order, surat jalan validation, sample check dan cargo color evidence pada custody receiving.','MILL','<button class="btn btn-primary" onclick="goPage(\'mill_requests\')">New Mill Order</button>')}
  <div class="module-grid">${moduleCard('ORDER','Open',c.open,'Mill request orders')}${moduleCard('DELIVERY','Inbound',incoming.length,'From Fuel Blending')}${moduleCard('RECEIVING','Completed',received.length,'Final volume reconciliation')}${moduleCard('CARGO COLOR',q?.colorStatus||'NOT CHECKED','Quality status remains GOOD; color is visual screening only')}</div>
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Mill Order Queue</div><div class="panel-sub">Surat jalan and sample requirements</div></div></div><div class="panel-body flush">${requestTableV3(siteOrders(site),{showSite:false,actions:true})}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Latest Mill Quality Check</div><div class="panel-sub">Visual color screening is not a laboratory quality test</div></div></div><div class="panel-body">${q?qualityResultView(q):'<div class="empty-note">Belum ada cargo sample check.</div>'}</div></div></div>`;
}
function transportDashboard(){
  const counts={available:0,ready:0,workshop:0,allocated:0};state.transportUnits.forEach(u=>{const k=String(u.status||'').toLowerCase().replaceAll(' ','_');if(k==='available')counts.available++;else if(k==='ready')counts.ready++;else if(k.includes('workshop')||k==='not_ready')counts.workshop++;else if(k==='allocated')counts.allocated++;});
  return `${enterpriseHero('Transport Live Dashboard','Fleet readiness untuk mendukung request dari Maintank, Riau Fiber dan Mill.','FB','<button class="btn btn-primary" onclick="goPage(\'transport_fleet\')">Manage Fleet</button>')}
  <div class="module-grid">${moduleCard('FLEET','Available',counts.available,'Unit can be requested')}${moduleCard('FLEET','Ready',counts.ready,'Checked and ready for allocation')}${moduleCard('FLEET','Allocated',counts.allocated,'Assigned to active request')}${moduleCard('WORKSHOP','Not Ready',counts.workshop,'Maintenance / repair required')}</div>${fleetTable()}`;
}
function fuelOpsDashboard(){
  const requests=state.orders.filter(o=>!o.locked),pre=state.inspections.filter(i=>i.result==='PASS').length,loading=state.shipments.filter(s=>['AWAITING_AFTER','AWAITING_CR'].includes(s.status)),alerts=state.shipments.filter(s=>s.status==='HOLD');
  return `${enterpriseHero('Fuel Blending Live Dashboard','Semua request customer masuk ke satu inbox. Operator menjalankan before inspection → loading → finish loading inspection.','FB','<button class="btn btn-primary" onclick="goPage(\'request_inbox\')">Open Request Inbox</button>')}
  <div class="module-grid">${moduleCard('REQUEST INBOX','Waiting',requests.length,'RF + Maintank + Mill')}${moduleCard('INSPECTION','PASS',pre,'Locked order records')}${moduleCard('LOADING','In Process',loading.length,'Field or finish loading')}${moduleCard('ALERT','Hold',alerts.length,'Condition / seal exception')}</div>
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Incoming Customer Requests</div><div class="panel-sub">Sorted by request timestamp</div></div></div><div class="panel-body flush">${requestTableV3(state.orders.filter(o=>!o.locked).slice(0,12))}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Superior & Safety Bulletin</div><div class="panel-sub">Maintenance, project and safety notifications</div></div></div><div class="panel-body">${bulletinCards('fuel_field')}</div></div></div>`;
}
function crDashboardV2(){
  const q=state.shipments.filter(s=>s.status==='AWAITING_CR'),transit=state.shipments.filter(s=>s.status==='IN_TRANSIT'),stock=state.inventory.reduce((a,t)=>a+Number(t.soundingStock||0),0),varSum=state.inventory.reduce((a,t)=>a+Math.abs(Number(t.soundingStock||0)-Number(t.bookStock||0)),0);
  return `${enterpriseHero('Control Room Dashboard','Final loading verification, dispatch control dan stock inventory monitoring.','FB','<button class="btn btn-primary" onclick="goPage(\'cr_loading_v2\')">Open CR Queue</button>')}
  <div class="module-grid">${moduleCard('CR QUEUE','Waiting',q.length,'After-loading packet ready')}${moduleCard('DISPATCH','In Transit',transit.length,'Verified and released')}${moduleCard('INVENTORY','Total Sounding',fmt(stock)+' L','Across configured tanks')}${moduleCard('INVENTORY VAR','Absolute',fmt(varSum)+' L','Book vs sounding')}</div>
  <div class="inventory-grid">${inventoryCards()}</div><div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">CR Verification Queue</div><div class="panel-sub">All customer sites</div></div></div><div class="panel-body flush">${shipmentMiniTable(q)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Operations Bulletin</div><div class="panel-sub">SPV maintenance, projects and safety news</div></div></div><div class="panel-body">${bulletinCards('cr_operator')}</div></div></div>`;
}
function spvDashboardV2(){
  const complaints=state.complaints.filter(c=>c.status!=='CLOSED'),schedules=state.shipmentSchedules.filter(x=>x.status!=='COMPLETED'),maint=state.maintenance.filter(x=>x.status!=='COMPLETED'),projects=state.projects.filter(x=>x.status!=='COMPLETED');
  return `${enterpriseHero('Fuel SPV Dashboard','Supervision hub untuk inventory-driven shipment planning, customer complaints, preventive maintenance, project, safety/news serta port custody tools.','FB')}
  <div class="module-grid">${moduleCard('CUSTOMER CARE','Open Complaints',complaints.length,'Awaiting superior feedback')}${moduleCard('SHIPMENT','Schedules',schedules.length,'Planned against CR inventory')}${moduleCard('MAINTENANCE','Open PM',maint.length,'Preventive work schedule')}${moduleCard('PROJECT','Active',projects.length,'Operational improvement projects')}</div>
  <div class="inventory-grid">${inventoryCards()}</div><div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Open Complaints</div><div class="panel-sub">Customer feedback requiring action</div></div></div><div class="panel-body">${complaintList(false,6)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Current Shipment Plans</div><div class="panel-sub">Stock-aware scheduling</div></div></div><div class="panel-body">${scheduleList(6)}</div></div></div>`;
}

function fleetStatusMarkup(status){const s=String(status||'AVAILABLE').toUpperCase();const cls=s==='AVAILABLE'?'available':s==='READY'?'ready':s==='ALLOCATED'?'allocated':'workshop';return `<span class="fleet-status ${cls}"><span class="fleet-dot"></span>${s}</span>`;}
function fleetTable(){
  if(!state.transportUnits.length)return '<div class="empty-note">Belum ada unit transport.</div>';
  return `<div class="tbl-wrap"><table><thead><tr><th>Unit</th><th>Plate</th><th>Type</th><th>Capacity</th><th>Transporter</th><th>Status</th><th>Remarks</th><th>Updated</th></tr></thead><tbody>${state.transportUnits.map(u=>`<tr><td class="mono">${u.unitCode||u.id}</td><td class="mono">${u.plate}</td><td>${u.type}</td><td class="mono">${fmt(u.capacityKL)} KL</td><td>${u.transporter||'—'}</td><td>${fleetStatusMarkup(u.status)}</td><td class="wrap">${u.remarks||'—'}</td><td class="mono">${u.updatedAt||'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function qualityResultView(q){
  const rgb=q.rgb||[120,120,120];return `<div class="quality-result"><div class="color-swatch" style="background:rgb(${rgb.join(',')})"></div><div class="quality-copy"><b>${q.colorStatus==='BAIK'?'Color condition: Baik':'Color condition: Kurang bagus / review'}</b><span>Sample: ${q.sampleCheck||'—'} · Cargo quality status: <b class="text-good">BAGUS</b></span><div style="margin-top:6px">${qualityStatusBadge(q)}</div></div></div>`;
}

function availableFleetOptions(selected=''){
  const units=state.transportUnits.filter(u=>['AVAILABLE','READY'].includes(String(u.status).toUpperCase())||u.plate===selected);
  return `<option value="">AUTO / TBA</option>${units.map(u=>`<option value="${u.plate}" ${u.plate===selected?'selected':''}>${u.unitCode} · ${u.plate} · ${u.capacityKL||0} KL · ${u.status}</option>`).join('')}`;
}
function siteRequestForm(site,mode='create',order=null){
  const isRF=site==='RF',isMT=site==='MAINTANK',isMill=site==='MILL';
  const o=order||{};
  return `<form id="siteRequestFormV3" data-site="${site}">
    <input type="hidden" name="orderId" value="${o.id||''}">
    <div class="ops-form-grid">
      ${operatorField(o.operatorName||'')}
      ${timestampFields(o.id?'Update':'Request')}
      <div class="field"><label>Request / Loading Date <span class="required-dot">*</span></label><input name="loadingDate" type="date" value="${normalizeDateInput(o.loadingDate)||new Date().toISOString().slice(0,10)}" required></div>
      <div class="field"><label>Requested Truck</label><select name="plate">${availableFleetOptions(o.plate||'')}</select></div>
      <div class="field"><label>Unit Type</label><input name="unitType" value="${o.unitType||'Tank Truck'}" placeholder="Tank Truck"></div>
      <div class="field"><label>Requested Volume (KL) <span class="required-dot">*</span></label><input name="capacityKL" type="number" step="0.001" value="${o.capacityKL||''}" required></div>
      <div class="field"><label>Allocation Area <span class="required-dot">*</span></label><input name="areaAllocation" value="${o.areaAllocation||o.location||''}" placeholder="Area / site allocation" required></div>
      ${isRF?`<div class="field"><label>Driver Name</label><input name="driver" value="${o.driver||''}" placeholder="Optional until assigned"></div><div class="field"><label>Transport / Allocation Group</label><input name="allocation" value="${o.allocation||''}" placeholder="AB / SRA / PAI / transporter"></div>`:''}
      ${isMill?`<div class="field"><label>Surat Jalan / Delivery Note</label><input name="deliveryNoteNo" value="${o.deliveryNoteNo||'TBA'}" placeholder="TBA if not issued"></div>`:''}
      <div class="field"><label>PO / PR</label><input name="poPr" value="${o.poPr||'TBA'}" placeholder="TBA if unavailable"></div>
      <div class="field span-2"><label>Destination / Address</label><input name="address" value="${o.address||''}" placeholder="Alamat tujuan"></div>
      ${isMT?`<div class="field"><label>Request Purpose</label><select name="requestPurpose"><option ${o.requestPurpose==='Delivery'?'selected':''}>Delivery</option><option ${o.requestPurpose==='Stock Transfer'?'selected':''}>Stock Transfer</option><option ${o.requestPurpose==='Return Empty Unit'?'selected':''}>Return Empty Unit</option></select></div>`:''}
      ${isMill?`<div class="field"><label>Sample Requirement</label><select name="sampleRequirement"><option>Required</option><option>Not Required</option></select></div><div class="field span-2"><label>Reference Cargo Color Image</label><input type="file" name="cargoColorImage" accept="image/*" capture="environment"></div>`:''}
      <div class="field span-4"><label>Request Remarks</label><textarea name="remarks" placeholder="Operational notes, priority or special instruction">${o.remarks||''}</textarea></div>
    </div>
    <div class="form-note ${o.locked?'warning':''}" style="margin-top:12px">${o.locked?'This request is locked because Fuel Blending inspection has passed. It cannot be edited.':'Request remains editable and live-updated until Fuel Blending inspection status is PASS. Duplicate active plate requests are blocked.'}</div>
    <div class="form-actions"><button class="btn btn-primary" ${o.locked?'disabled':''}>${o.id?'Update Request':'Submit Request'}</button>${o.id?'<button type="button" class="btn" onclick="cancelRequestEdit()">Cancel Edit</button>':''}</div>
  </form>`;
}
function normalizeDateInput(v){
  if(!v)return '';
  if(/^\d{4}-\d{2}-\d{2}$/.test(v))return v;
  const m=String(v).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:'';
}
function siteRequestPage(site,title,desc){
  const editing=state.requestEditingV3?requestById(state.requestEditingV3):null;
  const rows=siteOrders(site);
  const millWidget=site==='MILL'?`<div class="panel" style="margin-top:14px"><div class="panel-head"><div><div class="panel-title">Mill Sample & Cargo Color Rule</div><div class="panel-sub">Visual color screening is recorded with every Mill operational record.</div></div></div><div class="panel-body"><div class="form-note">Cargo color image can be analyzed visually by the browser as a screening aid. The system keeps <b>Cargo Quality: BAGUS</b> as a separate operational status; laboratory quality is not inferred from an image.</div></div></div>`:'';
  return `${enterpriseHero(title,desc,site)}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">${editing?'Edit Request':'Create Request'}</div><div class="panel-sub">Date and time are mandatory on every submission</div></div></div><div class="panel-body">${siteRequestForm(site,editing?'edit':'create',editing)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Request Status</div><div class="panel-sub">Editable until inspection PASS</div></div><span class="badge info">${rows.length} RECORDS</span></div><div class="panel-body flush">${requestTableV3(rows,{showSite:false,actions:true})}</div></div></div>${millWidget}`;
}
function maintankRequestsPage(){return siteRequestPage('MAINTANK','Maintank Truck Request','Maintank operator inputs operator name, truck request, allocation area, required volume, date and time.');}
function rfRequestsV2Page(){return siteRequestPage('RF','Riau Fiber Request','RF can submit truck/unit data to Fuel Blending. Active duplicate plates are blocked to prevent overlapping empty/loaded unit records.');}
function millRequestsPage(){return siteRequestPage('MILL','Mill Request Order','Mill order request includes delivery-note control and sample/color evidence requirement.');}
window.editSiteRequest=id=>{const o=requestById(id);if(!o||o.locked){toast('Request locked and cannot be edited');return;}state.requestEditingV3=id;state.page=o.requesterSite==='RF'?'rf_requests_v2':o.requesterSite==='MAINTANK'?'maintank_requests':'mill_requests';renderAll();};
window.cancelRequestEdit=()=>{state.requestEditingV3=null;renderAll();};

function requestInboxPage(){
  const open=state.orders.filter(o=>!o.locked&&o.status==='REQUESTED');
  return `${enterpriseHero('Fuel Blending Request Inbox','All customer requests arrive here before unit inspection. Fuel Blending sees RF, Maintank and Mill requests without changing customer-specific dashboards.','FB')}
  <div class="dashboard-strip"><div class="strip-title">REQUEST FLOW</div><span class="strip-item">Customer Request</span><span class="strip-item">Transport Ready</span><span class="strip-item">Before Inspection</span><span class="strip-item">Loading</span><span class="strip-item">Finish Loading</span><span class="strip-item">CR Dispatch</span></div>
  ${requestTableV3(open,{showSite:true,actions:false})}`;
}
function orderControlV2Page(){
  return `${enterpriseHero('Order Control','Cross-site request monitoring. Locked orders remain traceable but cannot be edited after Fuel Blending inspection PASS.','FB')}${requestTableV3(state.orders,{showSite:true,actions:false})}`;
}

function orderPacketV3(o){
  if(!o)return '<div class="empty-note">Select a request.</div>';
  return `<div class="packet-grid"><div class="packet-cell"><div class="packet-label">Request</div><div class="packet-value mono">${o.id}<br>${badge(o.status)}</div></div><div class="packet-cell"><div class="packet-label">Requester</div><div class="packet-value">${siteBadge(o.requesterSite)}<br>${o.operatorName||'—'}</div></div><div class="packet-cell"><div class="packet-label">Unit</div><div class="packet-value">${o.unitType||'Tank Truck'}<br><span class="mono">${o.plate||'TBA'}</span></div></div><div class="packet-cell"><div class="packet-label">Volume</div><div class="packet-value mono">${fmt(o.requestLiters||0)} L</div></div><div class="packet-cell"><div class="packet-label">Allocation Area</div><div class="packet-value">${o.areaAllocation||'TBA'}<br><span class="cell-sub">${o.address||''}</span></div></div><div class="packet-cell"><div class="packet-label">PO / PR</div><div class="packet-value mono">${o.poPr||'TBA'}</div></div><div class="packet-cell"><div class="packet-label">Date / Time</div><div class="packet-value mono">${o.loadingDate||'—'}<br>${o.entryTime||o.createdAt||'—'}</div></div><div class="packet-cell"><div class="packet-label">Special Control</div><div class="packet-value">${o.requesterSite==='MILL'?'Sample + cargo color required':'Standard custody workflow'}</div></div></div>`;
}

function preInspectionV2(){
  const requests=state.orders.filter(o=>!o.locked&&['REQUESTED','TRANSPORT_READY'].includes(o.status));const first=requests[0];
  return `${enterpriseHero('Before Loading Inspection','Fuel Blending checks truck identity, tank condition, empty-unit seal status and damage before loading. PASS locks the customer request.','FB')}
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Inspection Input</div><div class="panel-sub">All entries include date and time</div></div><span class="badge info">${requests.length} REQUESTS</span></div><div class="panel-body">${requests.length?`<form id="preFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Request</label><select name="orderId" id="preOrderSelectV3">${requests.map(o=>`<option value="${o.id}">${requestDisplay(o)}</option>`).join('')}</select></div>${timestampFields('Inspection')}${operatorField('Fuel Blending Operator')}<div class="field"><label>Unit Code</label><input name="unitCode" placeholder="TT-001" required></div><div class="field"><label>Plate Number</label><input name="plate" value="${first?.plate||''}" required></div><div class="field"><label>Driver Name</label><input name="driver" value="${first?.driver||''}" required></div><div class="field"><label>Transporter</label><input name="transporter" value="${first?.allocation||''}" required></div><div class="field"><label>Tank Condition</label><select name="tankCondition"><option>SAFE</option><option>MINOR DEFECT</option><option>UNSAFE / REJECT</option></select></div><div class="field"><label>Empty Unit Seal Status</label><select name="emptySealStatus"><option>Intact / Match</option><option>No Seal</option><option>Damaged</option><option>Mismatch</option></select></div><div class="field"><label>Visible Damage</label><select name="damage"><option>None</option><option>Minor</option><option>Major</option></select></div><div class="field"><label>Inspection Result</label><select name="result"><option>PASS</option><option>REJECT</option></select></div><div class="field span-4"><label>Inspection Remarks</label><textarea name="remarks" placeholder="Tank, valve, manhole, chassis and seal observations"></textarea></div></div><div style="height:12px"></div><div id="preOrderPacketV3">${orderPacketV3(first)}</div><div class="form-actions"><button class="btn btn-primary">Submit Before Inspection</button></div></form>`:'<div class="empty-note">No open requests waiting for inspection.</div>'}</div></div>`;
}
function loadingV2(){
  const ready=state.inspections.filter(i=>i.result==='PASS'&&!state.shipments.some(s=>s.preId===i.id));const first=ready[0],o=first?requestById(first.orderId):null;
  return `${enterpriseHero('Loading Process','Field operator records loading start/end and cargo sounding. Final flowmeter remains controlled by Control Room.','FB')}
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Field Loading Data</div><div class="panel-sub">Request packet remains locked</div></div><span class="badge info">${ready.length} READY</span></div><div class="panel-body">${ready.length?`<form id="loadingFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Inspection / Request</label><select name="preId" id="loadingPreSelectV3">${ready.map(i=>{const r=requestById(i.orderId);return `<option value="${i.id}">${i.id} · ${r?.id||''} · ${r?.plate||i.plate}</option>`}).join('')}</select></div>${timestampFields('Loading')}${operatorField('Fuel Blending Operator')}<div class="field"><label>Loading Start</label><input name="loadingStart" type="time" required></div><div class="field"><label>Loading Finish</label><input name="loadingEnd" type="time" required></div><div class="field"><label>Sounding Before</label><input name="soundingBefore" type="number" step="0.001" required></div><div class="field"><label>Sounding After</label><input name="soundingAfter" type="number" step="0.001" required></div><div class="field span-4"><label>Field Remarks</label><textarea name="remarks"></textarea></div></div><div style="height:12px"></div><div id="loadingOrderPacketV3">${orderPacketV3(o)}</div><div class="form-actions"><button class="btn btn-primary">Finish Field Loading Data</button></div></form>`:'<div class="empty-note">No PASS inspection awaiting loading.</div>'}</div></div>`;
}
function afterInspectionV2(){
  const rows=state.shipments.filter(s=>s.status==='AWAITING_AFTER');const first=rows[0],o=first?requestById(first.orderId):null;const mill=o?.requesterSite==='MILL';
  return `${enterpriseHero('Finish Loading Inspection','Final unit condition, loaded seals and optional Mill sample/color evidence before packet is sent to Control Room.','FB')}
  <div class="panel"><div class="panel-head"><div><div class="panel-title">After Loading Inspection</div><div class="panel-sub">Seal and condition data are locked into the CR packet</div></div><span class="badge warn">${rows.length} WAITING</span></div><div class="panel-body">${rows.length?`<form id="afterFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Shipment</label><select name="shipmentId" id="afterShipmentSelectV3">${rows.map(s=>{const r=requestById(s.orderId);return `<option value="${s.id}">${s.id} · ${r?.id||''} · ${s.plate}</option>`}).join('')}</select></div>${timestampFields('Final Inspection')}${operatorField('Fuel Blending Operator')}<div class="field"><label>Seal 1</label><input name="seal1" required></div><div class="field"><label>Seal 2</label><input name="seal2" required></div><div class="field"><label>Seal 3</label><input name="seal3" required></div><div class="field"><label>Seal 4</label><input name="seal4" required></div><div class="field"><label>Loaded Unit Condition</label><select name="condition"><option>GOOD</option><option>MINOR DEFECT</option><option>REJECT</option></select></div><div class="field"><label>Seal Condition</label><select name="sealCondition"><option>GOOD</option><option>DAMAGED</option><option>REJECT</option></select></div><div id="millAfterFieldsV3" class="span-4">${mill?millSampleFields():'<div class="form-note">Mill sample/color control will appear automatically when a Mill shipment is selected.</div>'}</div><div class="field span-4"><label>Final Inspection Remarks</label><textarea name="remarks"></textarea></div></div><div style="height:12px"></div><div id="afterOrderPacketV3">${orderPacketV3(o)}</div><div class="form-actions"><button class="btn btn-primary">Submit Final Inspection</button></div></form>`:'<div class="empty-note">No shipment awaiting final inspection.</div>'}</div></div>`;
}
function millSampleFields(){return `<div class="ops-form-grid"><div class="field"><label>Sample Check</label><select name="sampleCheck"><option>PASS</option><option>REVIEW</option></select></div><div class="field span-2"><label>Cargo Color Image</label><input name="cargoColorImage" type="file" accept="image/*" capture="environment" required></div><div class="field"><label>Cargo Quality Status</label><input value="BAGUS" readonly></div></div>`;}

function crPacketV3(s){
  if(!s)return '<div class="empty-note">Select shipment.</div>';const o=requestById(s.orderId);
  return `<div class="packet-grid"><div class="packet-cell"><div class="packet-label">Shipment / Request</div><div class="packet-value mono">${s.id}<br>${o?.id||'—'}</div></div><div class="packet-cell"><div class="packet-label">Destination</div><div class="packet-value">${siteBadge(s.dest)}<br>${o?.areaAllocation||'TBA'}</div></div><div class="packet-cell"><div class="packet-label">Unit</div><div class="packet-value">${s.unitCode}<br><span class="mono">${s.plate}</span></div></div><div class="packet-cell"><div class="packet-label">Driver / Transporter</div><div class="packet-value">${s.driver}<br>${s.transporter}</div></div><div class="packet-cell"><div class="packet-label">Requested Volume</div><div class="packet-value mono">${fmt(s.request||o?.requestLiters||0)} L</div></div><div class="packet-cell"><div class="packet-label">Field Sounding</div><div class="packet-value mono">${fmt(s.soundingBefore)} → ${fmt(s.soundingAfter)}</div></div><div class="packet-cell"><div class="packet-label">Final Seals</div><div class="packet-value mono">${(s.seals||[]).join(' · ')}</div></div><div class="packet-cell"><div class="packet-label">PO / PR</div><div class="packet-value mono">${o?.poPr||'TBA'}</div></div></div>`;
}
function crLoadingV2(){
  const rows=state.shipments.filter(s=>s.status==='AWAITING_CR');const first=rows[0];
  return `${enterpriseHero('CR Loading Verification','Control Room validates field sounding, final seals and after-loading condition, then enters flowmeter start/end and dispatches the unit.','FB')}
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Final Loading Control</div><div class="panel-sub">Total volume = final flowmeter − initial flowmeter</div></div><span class="badge warn">${rows.length} QUEUE</span></div><div class="panel-body">${rows.length?`<form id="crLoadingFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Shipment</label><select name="shipmentId" id="crShipmentSelectV3">${rows.map(s=>`<option value="${s.id}">${s.id} · ${s.plate} · ${siteName(s.dest)}</option>`).join('')}</select></div>${timestampFields('CR Verification')}${operatorField('Control Room Operator')}<div class="field"><label>Flowmeter Initial</label><input name="flowStart" type="number" step="0.001" required></div><div class="field"><label>Flowmeter Final</label><input name="flowEnd" type="number" step="0.001" required></div><div class="field"><label>Total Volume</label><input id="crCalcFlowV3" readonly></div><div class="field"><label>Inventory Source Tank</label><select name="inventoryTank"><option value="">No inventory deduction</option>${state.inventory.map(t=>`<option value="${t.id}">${t.tank} · ${t.product} · ${fmt(t.soundingStock)} L</option>`).join('')}</select></div><div class="field"><label>Sounding Validation</label><select name="soundingValidation"><option>MATCH / VERIFIED</option><option>REVIEW / DIFFERENCE</option></select></div><div class="field"><label>Seal Validation</label><select name="sealValidation"><option>MATCH / VERIFIED</option><option>MISMATCH / HOLD</option></select></div><div class="field"><label>Condition Validation</label><select name="conditionValidation"><option>GOOD / VERIFIED</option><option>REVIEW</option><option>HOLD</option></select></div><div class="field span-4"><label>CR Remarks</label><textarea name="remarks"></textarea></div></div><div style="height:12px"></div><div id="crPacketV3">${crPacketV3(first)}</div><div class="form-actions"><button class="btn btn-primary">Verify & Dispatch Unit</button></div></form>`:'<div class="empty-note">No after-loading packet waiting for CR.</div>'}</div></div>`;
}

function receivingPacketV3(s){
  if(!s)return '<div class="empty-note">No inbound unit selected.</div>';const o=requestById(s.orderId);
  return `<div class="packet-grid"><div class="packet-cell"><div class="packet-label">Shipment</div><div class="packet-value mono">${s.id}<br>${o?.id||'—'}</div></div><div class="packet-cell"><div class="packet-label">Fuel Blending Loading</div><div class="packet-value mono">${s.total!=null?fmt(s.total)+' L':'Pending'}</div></div><div class="packet-cell"><div class="packet-label">Vehicle</div><div class="packet-value">${o?.unitType||'Tank Truck'}<br><span class="mono">${s.plate}</span></div></div><div class="packet-cell"><div class="packet-label">Destination</div><div class="packet-value">${o?.areaAllocation||'TBA'}<br>${o?.address||''}</div></div><div class="packet-cell"><div class="packet-label">Field Sounding</div><div class="packet-value mono">${fmt(s.soundingBefore)} → ${fmt(s.soundingAfter)}</div></div><div class="packet-cell"><div class="packet-label">Final Loaded Seals</div><div class="packet-value mono">${(s.seals||[]).join(' · ')}</div></div><div class="packet-cell"><div class="packet-label">PO / PR</div><div class="packet-value mono">${o?.poPr||'TBA'}</div></div><div class="packet-cell"><div class="packet-label">CR Dispatch</div><div class="packet-value mono">${s.dispatchAt||'—'}</div></div></div>`;
}
function siteReceivingV2(){
  const site=v3SiteScope()||'RF';
  const rows=state.shipments.filter(s=>s.dest===site&&['IN_TRANSIT','AWAITING_RECEIVING'].includes(s.status));const first=rows[0],o=first?requestById(first.orderId):null;
  const title=site==='MAINTANK'?'Maintank Cargo Receiving':site==='MILL'?'Mill Cargo Receiving':'Riau Fiber Cargo Receiving';
  const extra=site==='RF'?`<div class="field"><label>Unloading Area</label><input name="unloadingArea" value="${o?.areaAllocation||''}" required></div><div class="field"><label>Unloading Operator</label><input name="unloadingOperator" required></div>`:site==='MILL'?`<div class="field"><label>Surat Jalan Check</label><select name="deliveryNoteCheck"><option>MATCH / VERIFIED</option><option>MISMATCH / HOLD</option></select></div>${millSampleFields()}`:'';
  return `${enterpriseHero(title,'Receiving validates loaded seals, vehicle identity, sounding, actual flowmeter volume and image evidence against the locked Fuel Blending/CR packet.',site)}
  <div class="panel"><div class="panel-head"><div><div class="panel-title">Physical & Volume Receiving</div><div class="panel-sub">Every submission records date and time</div></div><span class="badge info">${rows.length} INBOUND</span></div><div class="panel-body">${rows.length?`<form id="siteReceivingFormV3" data-site="${site}"><div class="ops-form-grid"><div class="field span-2"><label>Inbound Shipment</label><select name="shipmentId" id="siteReceivingShipmentV3">${rows.map(s=>`<option value="${s.id}">${s.id} · ${s.plate} · ${fmt(s.total||0)} L</option>`).join('')}</select></div>${timestampFields('Receiving')}${operatorField('')}<div class="field"><label>Receiving Location</label><input name="location" value="${o?.areaAllocation||''}" required></div><div class="field"><label>Vehicle Type</label><input name="unitType" value="${o?.unitType||'Tank Truck'}" required></div><div class="field"><label>Actual Plate</label><input name="plate" value="${first?.plate||''}" required></div><div class="field"><label>Loaded Seal Condition</label><select name="sealCondition"><option>INTACT / GOOD</option><option>DAMAGED</option><option>BROKEN / MISSING</option></select></div><div class="field"><label>Seal Match</label><select name="sealMatch"><option>MATCH</option><option>MISMATCH</option></select></div><div class="field"><label>Receiving Sounding Before</label><input name="soundBefore" type="number" step="0.001" required></div><div class="field"><label>Receiving Sounding After</label><input name="soundAfter" type="number" step="0.001" required></div><div class="field"><label>Receiving Flowmeter Initial</label><input name="flowStart" type="number" step="0.001" required></div><div class="field"><label>Receiving Flowmeter Final</label><input name="flowEnd" type="number" step="0.001" required></div><div class="field"><label>Total Receiving Volume</label><input id="receivingTotalV3" readonly></div>${extra}<div class="field span-2"><label>Receiving Image Evidence</label><input name="receivingImage" type="file" accept="image/*" capture="environment" required></div><div class="field span-4"><label>Receiving Remarks</label><textarea name="remarks" placeholder="Seal damage, sounding difference, physical condition or operational notes"></textarea></div></div><div style="height:12px"></div><div id="receivingPacketV3">${receivingPacketV3(first)}</div><div class="form-actions"><button class="btn btn-primary">Submit Receiving & Reconcile</button></div></form>`:'<div class="empty-note">No inbound shipment available for this site.</div>'}</div></div>`;
}
function receivingResultsSite(){
  const site=v3SiteScope();const rows=state.shipments.filter(s=>(!site||s.dest===site)&&s.receivingV3);
  if(!rows.length)return `${enterpriseHero('Receiving Results','No final receiving results have been submitted yet.',site||'FB')}<div class="empty-note">No records.</div>`;
  return `${enterpriseHero('Receiving Results','Actual Fuel Blending loading is compared with actual site receiving, sounding difference and custody/security checks.',site||'FB')}<div class="tbl-wrap"><table><thead><tr><th>Shipment</th><th>Site</th><th>Unit</th><th>Loading</th><th>Receiving</th><th>Variance</th><th>Sounding Δ</th><th>Seal</th><th>Status</th><th>Time</th></tr></thead><tbody>${rows.map(s=>{const r=s.receivingV3;return `<tr><td class="mono">${s.id}</td><td>${siteBadge(s.dest)}</td><td>${s.unitCode}<div class="cell-sub mono">${s.plate}</div></td><td class="mono">${fmt(s.total)} L</td><td class="mono">${fmt(r.totalReceived)} L</td><td class="mono ${Math.abs(r.volumePct)>0.01?'text-bad':'text-good'}">${fmt(r.volumeDiff)} L<br>${r.volumePct.toFixed(4)}%</td><td class="mono">${fmt(r.receivingSoundingDelta)}<div class="cell-sub">Field Δ ${fmt(r.fieldSoundingDelta)}</div></td><td>${r.sealPass?'<span class="badge good">MATCH</span>':'<span class="badge bad">ALERT</span>'}</td><td>${badge(s.status)}</td><td class="mono">${r.timestamp}</td></tr>`}).join('')}</tbody></table></div>`;
}
function emptyUnitsPage(){
  const eligible=state.shipments.filter(s=>s.dest==='RF'&&s.status==='RECEIVED'&&!state.emptyUnitRecords.some(e=>e.shipmentId===s.id)).concat(state.shipments.filter(s=>s.dest==='MAINTANK'&&s.status==='RECEIVED'&&!state.emptyUnitRecords.some(e=>e.shipmentId===s.id)));
  return `${enterpriseHero('Empty Unit Sealing','Maintank records seals and image evidence for empty units, including units returning empty from Riau Fiber.','MAINTANK')}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">New Empty Unit Record</div><div class="panel-sub">Timestamp is mandatory</div></div></div><div class="panel-body">${eligible.length?`<form id="emptyUnitFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Returned Empty Unit</label><select name="shipmentId">${eligible.map(s=>`<option value="${s.id}">${s.id} · ${s.plate} · from ${siteName(s.dest)}</option>`).join('')}</select></div>${timestampFields('Empty Unit')}${operatorField('Maintank Operator')}<div class="field"><label>Empty Seal 1</label><input name="seal1" required></div><div class="field"><label>Empty Seal 2</label><input name="seal2" required></div><div class="field"><label>Empty Seal 3</label><input name="seal3" required></div><div class="field"><label>Empty Seal 4</label><input name="seal4" required></div><div class="field span-2"><label>Empty Unit Image</label><input name="image" type="file" accept="image/*" capture="environment" required></div><div class="field span-2"><label>Remarks</label><input name="remarks"></div></div><div class="form-actions"><button class="btn btn-primary">Save Empty Unit Seal Record</button></div></form>`:'<div class="empty-note">No received unit waiting for empty sealing.</div>'}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Empty Unit History</div><div class="panel-sub">Maintank seal custody</div></div></div><div class="panel-body flush">${emptyUnitHistory()}</div></div></div>`;
}
function emptyUnitHistory(){
  if(!state.emptyUnitRecords.length)return '<div class="empty-note">No empty-unit records.</div>';
  return `<div class="tbl-wrap"><table><thead><tr><th>Record</th><th>Shipment</th><th>Plate</th><th>Seals</th><th>Operator</th><th>Timestamp</th></tr></thead><tbody>${state.emptyUnitRecords.map(e=>`<tr><td class="mono">${e.id}</td><td class="mono">${e.shipmentId}</td><td class="mono">${e.plate}</td><td class="mono">${e.seals.join(' · ')}</td><td>${e.operatorName}</td><td class="mono">${e.timestamp}</td></tr>`).join('')}</tbody></table></div>`;
}

function inventoryControlPage(){
  return `${enterpriseHero('Stock & Inventory Control','Control Room maintains book stock and physical sounding stock. SPV uses this inventory for shipment planning.','FB')}
  <div class="inventory-grid">${inventoryCards()}</div><div class="panel"><div class="panel-head"><div><div class="panel-title">Update Inventory</div><div class="panel-sub">Every stock update stores operator, date and time</div></div></div><div class="panel-body"><form id="inventoryFormV3"><div class="ops-form-grid"><div class="field"><label>Tank</label><select name="tankId">${state.inventory.map(t=>`<option value="${t.id}">${t.tank} · ${t.product}</option>`).join('')}</select></div>${operatorField('Control Room Operator')}${timestampFields('Stock')}<div class="field"><label>Book Stock (L)</label><input name="bookStock" type="number" step="0.001" required></div><div class="field"><label>Physical Sounding Stock (L)</label><input name="soundingStock" type="number" step="0.001" required></div><div class="field"><label>Tank Capacity (L)</label><input name="capacity" type="number" step="0.001"></div><div class="field span-2"><label>Stock Remarks</label><input name="remarks"></div></div><div class="form-actions"><button class="btn btn-primary">Update Inventory</button></div></form></div></div>`;
}

function transportFleetPage(){
  return `${enterpriseHero('Fleet Availability','Transport operator updates truck readiness and workshop status. Active-request plates cannot be silently reused.','FB')}
  <div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Update Fleet Status</div><div class="panel-sub">Available · Ready · Allocated · Not Ready / Workshop</div></div></div><div class="panel-body"><form id="fleetFormV3"><div class="ops-form-grid"><div class="field"><label>Unit</label><select name="unitId">${state.transportUnits.map(u=>`<option value="${u.id}">${u.unitCode} · ${u.plate}</option>`).join('')}</select></div>${operatorField('Transport Operator')}${timestampFields('Fleet')}<div class="field"><label>Status</label><select name="status"><option>AVAILABLE</option><option>READY</option><option>ALLOCATED</option><option>NOT READY / WORKSHOP</option></select></div><div class="field span-2"><label>Status Remarks</label><input name="remarks" placeholder="Workshop issue, inspection note or readiness detail"></div></div><div class="form-actions"><button class="btn btn-primary">Update Unit Status</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Fleet Summary</div><div class="panel-sub">Live operational availability</div></div></div><div class="panel-body">${fleetTable()}</div></div></div>`;
}

function complaintList(customerOnly=false,limit=999){
  let rows=state.complaints;
  if(customerOnly){const site=v3SiteScope();rows=rows.filter(c=>c.site===site);}
  rows=rows.slice(0,limit);
  if(!rows.length)return '<div class="empty-note">No complaints.</div>';
  return rows.map(c=>`<div class="complaint-card"><div class="complaint-top"><div><div class="complaint-title">${c.subject}</div><div class="complaint-meta">${c.id} · ${siteName(c.site)} · ${c.timestamp}</div></div>${badge(c.status||'REQUESTED')}</div><div class="complaint-body">${c.message}</div>${c.feedback?`<div class="complaint-reply"><b>Fuel Blending Superior Feedback</b><br>${c.feedback}<div class="complaint-meta">${c.feedbackAt||''}</div></div>`:''}</div>`).join('');
}
function customerComplaintsPage(){
  const site=v3SiteScope()||'RF';
  return `${enterpriseHero('Customer Complaints','Customer can submit operational complaints and receive feedback from Fuel Blending superior.',site)}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">New Complaint</div><div class="panel-sub">Sent to Fuel SPV</div></div></div><div class="panel-body"><form id="complaintFormV3" data-site="${site}"><div class="ops-form-grid">${operatorField('')}${timestampFields('Complaint')}<div class="field span-2"><label>Subject</label><input name="subject" required></div><div class="field"><label>Related Shipment</label><select name="shipmentId"><option value="">General / no shipment</option>${siteShipments(site).map(s=>`<option value="${s.id}">${s.id} · ${s.plate}</option>`).join('')}</select></div><div class="field"><label>Priority</label><select name="priority"><option>Normal</option><option>High</option><option>Critical</option></select></div><div class="field span-4"><label>Complaint Detail</label><textarea name="message" required></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Submit Complaint</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Complaint History</div><div class="panel-sub">Live feedback status</div></div></div><div class="panel-body">${complaintList(true)}</div></div></div>`;
}
function spvComplaintsPage(){
  const open=state.complaints.filter(c=>c.status!=='CLOSED'),first=open[0];
  return `${enterpriseHero('Complaint Handling','Fuel Blending superior reviews customer complaints and returns feedback without exposing other customers’ data.','FB')}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Open Complaints</div><div class="panel-sub">Customer issues requiring superior response</div></div></div><div class="panel-body">${complaintList(false)}</div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Provide Feedback</div><div class="panel-sub">Response is visible to the originating customer role</div></div></div><div class="panel-body">${open.length?`<form id="complaintFeedbackFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Complaint</label><select name="complaintId">${open.map(c=>`<option value="${c.id}">${c.id} · ${siteName(c.site)} · ${c.subject}</option>`).join('')}</select></div>${operatorField('Fuel SPV Operator')}${timestampFields('Feedback')}<div class="field"><label>Status</label><select name="status"><option>IN_PROGRESS</option><option>RESOLVED</option><option>CLOSED</option></select></div><div class="field span-4"><label>Feedback / Corrective Action</label><textarea name="feedback" required>${first?.feedback||''}</textarea></div></div><div class="form-actions"><button class="btn btn-primary">Send Feedback</button></div></form>`:'<div class="empty-note">No open complaints.</div>'}</div></div></div>`;
}

function scheduleList(limit=999){
  const rows=state.shipmentSchedules.slice(0,limit);if(!rows.length)return '<div class="empty-note">No shipment schedule.</div>';
  return rows.map(s=>`<div class="complaint-card"><div class="complaint-top"><div><div class="complaint-title">${s.date} · ${siteName(s.site)} · ${fmt(s.volume)} L</div><div class="complaint-meta">${s.id} · ${s.tankId} · ${s.product}</div></div>${badge(s.status)}</div><div class="complaint-body">Stock at planning: ${fmt(s.stockAtPlan)} L · Remaining after plan: ${fmt(s.stockAfterPlan)} L · ${s.notes||''}</div></div>`).join('');
}
function shipmentSchedulePage(){
  const first=state.inventory[0];
  return `${enterpriseHero('Shipment Schedule','SPV plans shipment based on CR inventory. The app calculates remaining stock after planned allocation before schedule submission.','FB')}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Create Shipment Plan</div><div class="panel-sub">Inventory-aware planning</div></div></div><div class="panel-body"><form id="shipmentScheduleFormV3"><div class="ops-form-grid"><div class="field"><label>Schedule Date</label><input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required></div><div class="field"><label>Customer Site</label><select name="site"><option value="RF">Riau Fiber</option><option value="MAINTANK">Maintank</option><option value="MILL">Mill</option></select></div><div class="field"><label>Source Tank</label><select name="tankId" id="scheduleTankV3">${state.inventory.map(t=>`<option value="${t.id}">${t.tank} · ${t.product}</option>`).join('')}</select></div><div class="field"><label>Planned Volume (L)</label><input name="volume" id="scheduleVolumeV3" type="number" required></div>${operatorField('Fuel SPV Operator')}${timestampFields('Planning')}<div class="field"><label>Current Sounding Stock</label><input id="scheduleStockV3" value="${fmt(first?.soundingStock||0)} L" readonly></div><div class="field"><label>Projected Balance</label><input id="scheduleBalanceV3" value="${fmt(first?.soundingStock||0)} L" readonly></div><div class="field span-4"><label>Plan Notes</label><textarea name="notes"></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Create Shipment Schedule</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Shipment Plans</div><div class="panel-sub">Linked to CR inventory snapshot</div></div></div><div class="panel-body">${scheduleList()}</div></div></div>`;
}

function workList(rows,type){
  if(!rows.length)return '<div class="empty-note">No records.</div>';
  return `<div class="tbl-wrap"><table><thead><tr><th>ID</th><th>Title</th><th>Schedule</th><th>Owner</th><th>Status</th><th>Priority</th><th>Details</th></tr></thead><tbody>${rows.map(x=>`<tr><td class="mono">${x.id}</td><td>${x.title}</td><td class="mono">${x.date} ${x.time||''}</td><td>${x.owner||'Fuel SPV'}</td><td>${badge(x.status)}</td><td>${x.priority||'Normal'}</td><td class="wrap">${x.details||x.notes||'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function maintenanceSchedulePage(){
  return `${enterpriseHero('Preventive Maintenance','SPV creates preventive maintenance schedules and sends live notifications to Fuel Blending operators and Control Room.','FB')}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">New Preventive Maintenance</div></div></div><div class="panel-body"><form id="maintenanceFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Maintenance Title</label><input name="title" required></div><div class="field"><label>Date</label><input name="date" type="date" required></div><div class="field"><label>Time</label><input name="time" type="time" required></div><div class="field"><label>Asset / Area</label><input name="asset" required></div><div class="field"><label>Priority</label><select name="priority"><option>Normal</option><option>High</option><option>Critical</option></select></div><div class="field"><label>Owner / PIC</label><input name="owner" value="Fuel SPV"></div><div class="field"><label>Status</label><select name="status"><option>PLANNED</option><option>IN_PROGRESS</option><option>COMPLETED</option></select></div><div class="field span-4"><label>Maintenance Details</label><textarea name="details"></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Publish Maintenance Schedule</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Maintenance Plan</div></div></div><div class="panel-body flush">${workList(state.maintenance,'maintenance')}</div></div></div>`;
}
function projectsPage(){
  return `${enterpriseHero('Project Control','SPV manages operational improvement projects and shares relevant notices with Fuel Blending and Control Room.','FB')}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">New Project</div></div></div><div class="panel-body"><form id="projectFormV3"><div class="ops-form-grid"><div class="field span-2"><label>Project Title</label><input name="title" required></div><div class="field"><label>Start Date</label><input name="date" type="date" required></div><div class="field"><label>Target Date</label><input name="targetDate" type="date"></div><div class="field"><label>Owner / PIC</label><input name="owner" value="Fuel SPV"></div><div class="field"><label>Priority</label><select name="priority"><option>Normal</option><option>High</option><option>Critical</option></select></div><div class="field"><label>Status</label><select name="status"><option>PLANNED</option><option>IN_PROGRESS</option><option>COMPLETED</option></select></div><div class="field span-4"><label>Project Details</label><textarea name="details"></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Create Project</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Project Portfolio</div></div></div><div class="panel-body flush">${workList(state.projects,'project')}</div></div></div>`;
}
function newsManagerPage(){
  return `${enterpriseHero('Safety & Operations News','SPV publishes safety news, superior messages, maintenance notices and project updates to Fuel Blending and Control Room.','FB')}<div class="layout-2"><div class="panel"><div class="panel-head"><div><div class="panel-title">Publish Bulletin</div></div></div><div class="panel-body"><form id="bulletinFormV3"><div class="ops-form-grid"><div class="field"><label>Type</label><select name="type"><option>SAFETY NEWS</option><option>SUPERIOR MESSAGE</option><option>MAINTENANCE</option><option>PROJECT</option><option>OPERATIONS NEWS</option></select></div><div class="field"><label>Audience</label><select name="audience"><option value="both">Fuel Blending + CR</option><option value="fuel_field">Fuel Blending Operator</option><option value="cr_operator">Control Room</option></select></div><div class="field span-2"><label>Title</label><input name="title" required></div>${operatorField('Fuel SPV Operator')}${timestampFields('Publish')}<div class="field span-4"><label>Message</label><textarea name="body" required></textarea></div></div><div class="form-actions"><button class="btn btn-primary">Publish & Notify</button></div></form></div></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Published News</div></div></div><div class="panel-body">${bulletinCards()}</div></div></div>`;
}
function opsBulletinPage(){return `${enterpriseHero('Operations Bulletin','Read-only stream of SPV safety news, maintenance, project and superior notifications.','FB')}${bulletinCards(state.role)}`;}

const coreBindFormsV2 = bindForms;
bindForms = function(){
  coreBindFormsV2();
  bindEnterpriseForms();
};

function formDataObj(form){return Object.fromEntries(new FormData(form));}
function stampFromForm(f){return `${f.entryDate||new Date().toISOString().slice(0,10)} ${f.entryTime||new Date().toTimeString().slice(0,5)}`;}
function audienceForSite(site){const r=roleAudienceForSite(site);return [r,'fuel_field','cr_operator','fuel_spv','it_admin'].filter(Boolean);}

function bindEnterpriseForms(){
  const req=$('#siteRequestFormV3');
  if(req)req.onsubmit=async e=>{
    e.preventDefault();const f=formDataObj(req),site=req.dataset.site,existing=f.orderId?requestById(f.orderId):null;
    if(existing?.locked){toast('Request already locked by Fuel Blending inspection');return;}
    const plate=String(f.plate||'').trim().toUpperCase();const dup=plate?duplicateUnitRequest(plate,existing?.id):null;
    if(dup){toast(`Duplicate active unit: ${plate} is already used by ${dup.id}`);return;}
    let qualityRef=null;
    if(site==='MILL'&&req.elements.cargoColorImage?.files?.[0]){
      const file=req.elements.cargoColorImage.files[0],analysis=await analyzeCargoColorFile(file),imageUrl=await EnterpriseBackend.upload(file,'mill-request-color');
      qualityRef={id:newId('QCK'),site:'MILL',stage:'REQUEST',sampleCheck:f.sampleRequirement||'Required',imageUrl,...analysis,timestamp:stampFromForm(f)};state.qualityChecks.unshift(qualityRef);
    }
    const fleet=plate?fleetUnitByPlate(plate):null;
    const payload={
      requesterSite:site,requesterRole:state.role,operatorName:f.operatorName.trim(),loadingDate:f.loadingDate,
      entryDate:f.entryDate,entryTime:f.entryTime,createdAt:existing?.createdAt||stampFromForm(f),updatedAt:stampFromForm(f),
      plate,requestedTruck:plate||'AUTO / TBA',unitType:f.unitType||'Tank Truck',capacityKL:Number(f.capacityKL||0),requestLiters:Number(f.capacityKL||0)*1000,
      areaAllocation:f.areaAllocation.trim(),location:f.areaAllocation.trim(),address:(f.address||'TBA').trim()||'TBA',driver:(f.driver||'').trim(),allocation:(f.allocation||fleet?.transporter||'').trim(),
      customer:siteName(site),poPr:(f.poPr||'TBA').trim()||'TBA',deliveryNoteNo:(f.deliveryNoteNo||'TBA').trim()||'TBA',sampleRequirement:f.sampleRequirement||null,requestPurpose:f.requestPurpose||'Delivery',
      remarks:f.remarks||'',qualityCheckId:qualityRef?.id||existing?.qualityCheckId||null
    };
    if(existing){Object.assign(existing,payload,{version:(existing.version||1)+1});audit('UPDATE CUSTOMER REQUEST',`${existing.id} · ${site} · ${plate||'AUTO'}`);notify('ORDER_UPDATED',`${siteName(site)} request updated · ${existing.id}`,`${plate||'AUTO'} · ${fmt(payload.requestLiters)} L · ${payload.areaAllocation}`,audienceForSite(site));toast('Request updated and live notification created');}
    else{
      const id=`${site}-REQ-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${String(state.orders.filter(o=>o.requesterSite===site).length+1).padStart(3,'0')}`;
      state.orders.unshift({...payload,id,status:fleet&&['AVAILABLE','READY'].includes(fleet.status)?'TRANSPORT_READY':'REQUESTED',locked:false,inspectionId:null,shipmentId:null,version:1});
      if(fleet){fleet.status='ALLOCATED';fleet.remarks=`Allocated to ${id}`;fleet.updatedAt=stampFromForm(f);}
      audit('CREATE CUSTOMER REQUEST',`${id} · ${site} · ${plate||'AUTO'}`);notify('ORDER_CREATED',`${siteName(site)} request created · ${id}`,`${plate||'AUTO'} · ${fmt(payload.requestLiters)} L · ${payload.areaAllocation}`,audienceForSite(site));toast('Request submitted to Fuel Blending, CR and SPV');
    }
    state.requestEditingV3=null;renderAll();
  };

  const pre=$('#preFormV3');
  if(pre){
    const sel=$('#preOrderSelectV3');const refresh=()=>{const o=requestById(sel.value);$('#preOrderPacketV3').innerHTML=orderPacketV3(o);if(o){pre.elements.plate.value=o.plate||'';pre.elements.driver.value=o.driver||'';pre.elements.transporter.value=o.allocation||fleetUnitByPlate(o.plate)?.transporter||'';}};sel.onchange=refresh;refresh();
    pre.onsubmit=e=>{
      e.preventDefault();const f=formDataObj(pre),o=requestById(f.orderId);if(!o||o.locked){toast('Request unavailable or already locked');return;}
      const pass=f.result==='PASS'&&f.tankCondition!=='UNSAFE / REJECT'&&f.damage!=='Major';const id=newId('PRE');
      const rec={id,orderId:o.id,time:stampFromForm(f),entryDate:f.entryDate,entryTime:f.entryTime,operatorName:f.operatorName,unitCode:f.unitCode.trim(),plate:f.plate.trim().toUpperCase(),driver:f.driver.trim(),transporter:f.transporter.trim(),tankCondition:f.tankCondition,emptySealStatus:f.emptySealStatus,damage:f.damage,result:pass?'PASS':'REJECT',remarks:f.remarks||'',destination:o.requesterSite,source:'Fuel Blending'};
      state.inspections.unshift(rec);
      if(pass){o.locked=true;o.status='INSPECTION_LOCKED';o.inspectionId=id;o.plate=rec.plate;o.driver=rec.driver;o.allocation=rec.transporter;o.updatedAt=rec.time;const fleet=fleetUnitByPlate(rec.plate);if(fleet){fleet.status='ALLOCATED';fleet.updatedAt=rec.time;fleet.remarks=`Inspection PASS · ${o.id}`;}audit('REQUEST LOCKED BY FB INSPECTION',`${o.id} · ${id}`);notify('ORDER_LOCKED',`Fuel Blending inspection PASS · ${o.id}`,`${rec.unitCode} · ${rec.plate} · request locked`,audienceForSite(o.requesterSite));toast('Inspection PASS — request locked');state.page='loading_v2';}
      else{audit('FB INSPECTION REJECT',`${o.id} · ${id}`);notify('INSPECTION_REJECT',`Fuel Blending inspection REJECT · ${o.id}`,`${rec.plate} · ${f.tankCondition} · ${f.damage}`,audienceForSite(o.requesterSite));toast('Inspection rejected — request remains editable');}
      renderAll();
    };
  }

  const loading=$('#loadingFormV3');
  if(loading){
    const sel=$('#loadingPreSelectV3');const refresh=()=>{const i=state.inspections.find(x=>x.id===sel.value);$('#loadingOrderPacketV3').innerHTML=orderPacketV3(i?requestById(i.orderId):null);};sel.onchange=refresh;refresh();
    loading.onsubmit=e=>{
      e.preventDefault();const f=formDataObj(loading),ins=state.inspections.find(i=>i.id===f.preId);if(!ins){toast('Inspection not found');return;}const o=requestById(ins.orderId);if(!o)return;
      const id=newId('SHP');state.shipments.unshift({id,orderId:o.id,preId:ins.id,dest:o.requesterSite,sourceSite:'FB',unitCode:ins.unitCode,plate:ins.plate,driver:ins.driver,transporter:ins.transporter,request:Number(o.requestLiters||0),flowStart:null,flowEnd:null,total:null,soundingBefore:Number(f.soundingBefore),soundingAfter:Number(f.soundingAfter),loadingStart:f.loadingStart,loadingEnd:f.loadingEnd,fieldRemarks:f.remarks||'',fieldLoadingAt:stampFromForm(f),fieldOperator:f.operatorName,seals:[],status:'AWAITING_AFTER',dispatchAt:null,afterCondition:null,arrivalCheck:null,validation:null});
      o.status='AWAITING_AFTER';o.shipmentId=id;o.updatedAt=stampFromForm(f);audit('FIELD LOADING COMPLETED',`${id} · ${o.id}`);notify('FIELD_LOADING_DONE',`Loading field data completed · ${o.id}`,`${ins.plate} · sounding ${f.soundingBefore} → ${f.soundingAfter}`,audienceForSite(o.requesterSite));toast('Loading data saved — proceed to finish loading inspection');state.page='after_inspection_v2';renderAll();
    };
  }

  const after=$('#afterFormV3');
  if(after){
    const sel=$('#afterShipmentSelectV3');const refresh=()=>{const s=state.shipments.find(x=>x.id===sel.value),o=s?requestById(s.orderId):null;$('#afterOrderPacketV3').innerHTML=orderPacketV3(o);$('#millAfterFieldsV3').innerHTML=o?.requesterSite==='MILL'?millSampleFields():'<div class="form-note">Standard final inspection. Mill-specific sample/color control is not required for this destination.</div>';};sel.onchange=refresh;refresh();
    after.onsubmit=async e=>{
      e.preventDefault();const f=formDataObj(after),s=state.shipments.find(x=>x.id===f.shipmentId);if(!s)return;const o=requestById(s.orderId),mill=o?.requesterSite==='MILL';
      s.seals=[f.seal1,f.seal2,f.seal3,f.seal4].map(x=>String(x||'').trim());s.afterCondition=f.condition;s.sealCondition=f.sealCondition;s.afterRemarks=f.remarks||'';s.afterInspectionAt=stampFromForm(f);s.afterOperator=f.operatorName;
      if(mill){const file=after.elements.cargoColorImage?.files?.[0];if(!file){toast('Mill shipment requires cargo color image');return;}const analysis=await analyzeCargoColorFile(file),url=await EnterpriseBackend.upload(file,'mill-after-loading-color');const q={id:newId('QCK'),site:'MILL',stage:'AFTER_LOADING',shipmentId:s.id,sampleCheck:f.sampleCheck,imageUrl:url,...analysis,timestamp:stampFromForm(f)};state.qualityChecks.unshift(q);s.qualityCheckId=q.id;}
      const hold=f.condition==='REJECT'||f.sealCondition==='REJECT'||f.sealCondition==='DAMAGED';s.status=hold?'HOLD':'AWAITING_CR';o.status=s.status;o.updatedAt=s.afterInspectionAt;
      audit('FINISH LOADING INSPECTION',`${s.id} · ${s.status}`);notify(hold?'SECURITY_ALERT':'READY_FOR_CR',hold?`Final inspection HOLD · ${s.plate}`:`Unit ready for CR · ${s.plate}`,`${o.id} · ${siteName(o.requesterSite)} · 4 seals recorded`,audienceForSite(o.requesterSite));toast(hold?'Shipment HOLD after final inspection':'Final inspection complete — packet sent to Control Room');state.page='shipment_monitor';renderAll();
    };
  }

  const cr=$('#crLoadingFormV3');
  if(cr){
    const sel=$('#crShipmentSelectV3');const refresh=()=>{$('#crPacketV3').innerHTML=crPacketV3(state.shipments.find(x=>x.id===sel.value));};const calc=()=>{const a=Number(cr.elements.flowStart.value||0),b=Number(cr.elements.flowEnd.value||0);$('#crCalcFlowV3').value=`${fmt(b-a)} L`;};sel.onchange=refresh;cr.addEventListener('input',calc);refresh();calc();
    cr.onsubmit=e=>{
      e.preventDefault();const f=formDataObj(cr),s=state.shipments.find(x=>x.id===f.shipmentId);if(!s)return;const o=requestById(s.orderId),start=Number(f.flowStart),end=Number(f.flowEnd),total=end-start;if(total<=0){toast('Flowmeter final must be greater than initial');return;}
      const verified=f.soundingValidation.startsWith('MATCH')&&f.sealValidation.startsWith('MATCH')&&f.conditionValidation.startsWith('GOOD');s.flowStart=start;s.flowEnd=end;s.total=total;s.crValidation={sounding:f.soundingValidation,seal:f.sealValidation,condition:f.conditionValidation,remarks:f.remarks||'',verifiedBy:f.operatorName,time:stampFromForm(f),inventoryTank:f.inventoryTank||null};s.status=verified?'IN_TRANSIT':'HOLD';s.dispatchAt=verified?stampFromForm(f):null;o.status=verified?'DISPATCHED':'HOLD';o.updatedAt=stampFromForm(f);
      if(verified&&f.inventoryTank){const t=state.inventory.find(x=>x.id===f.inventoryTank);if(t){t.bookStock=Math.max(0,Number(t.bookStock||0)-total);t.soundingStock=Math.max(0,Number(t.soundingStock||0)-total);t.updatedAt=stampFromForm(f);t.remarks=`Auto deduction from ${s.id}`;}}
      audit('CR FINAL LOADING VERIFICATION',`${s.id} · ${fmt(total)} L · ${s.status}`);notify(verified?'UNIT_LOADED':'SECURITY_ALERT',verified?`Unit successfully loaded · ${s.plate}`:`CR HOLD · ${s.plate}`,`${o.id} · ${siteName(o.requesterSite)} · actual loading ${fmt(total)} L`,audienceForSite(o.requesterSite));toast(verified?'Unit dispatched; customer, CR and SPV notified':'CR mismatch detected — shipment HOLD');state.page='cr_dashboard_v2';renderAll();
    };
  }

  const recv=$('#siteReceivingFormV3');
  if(recv){
    const sel=$('#siteReceivingShipmentV3');const refresh=()=>{const s=state.shipments.find(x=>x.id===sel.value),o=s?requestById(s.orderId):null;$('#receivingPacketV3').innerHTML=receivingPacketV3(s);if(s){recv.elements.plate.value=s.plate||'';recv.elements.location.value=o?.areaAllocation||'';recv.elements.unitType.value=o?.unitType||'Tank Truck';}};const calc=()=>{const a=Number(recv.elements.flowStart.value||0),b=Number(recv.elements.flowEnd.value||0);$('#receivingTotalV3').value=`${fmt(b-a)} L`;};sel.onchange=refresh;recv.addEventListener('input',calc);refresh();calc();
    recv.onsubmit=async e=>{
      e.preventDefault();const f=formDataObj(recv),site=recv.dataset.site,s=state.shipments.find(x=>x.id===f.shipmentId);if(!s||!s.total){toast('Shipment loading volume is not available');return;}const o=requestById(s.orderId);
      const start=Number(f.flowStart),end=Number(f.flowEnd),received=end-start;if(received<=0){toast('Receiving flowmeter final must be greater than initial');return;}
      const soundBefore=Number(f.soundBefore),soundAfter=Number(f.soundAfter),receivingDelta=soundAfter-soundBefore,fieldDelta=Number(s.soundingAfter||0)-Number(s.soundingBefore||0),soundingDiff=receivingDelta-fieldDelta;
      const volumeDiff=received-Number(s.total),volumePct=Number(s.total)?volumeDiff/Number(s.total)*100:0,volumeTolerance=Number(s.total)*TOLERANCE_RATE;
      const platePass=String(f.plate||'').trim().toUpperCase()===String(s.plate||'').trim().toUpperCase();const sealPass=f.sealCondition==='INTACT / GOOD'&&f.sealMatch==='MATCH';
      let deliveryNotePass=true,quality=null;
      if(site==='MILL'){
        deliveryNotePass=f.deliveryNoteCheck==='MATCH / VERIFIED';const file=recv.elements.cargoColorImage?.files?.[0];if(!file){toast('Mill receiving requires cargo color image');return;}const analysis=await analyzeCargoColorFile(file),url=await EnterpriseBackend.upload(file,'mill-receiving-color');quality={id:newId('QCK'),site:'MILL',stage:'RECEIVING',shipmentId:s.id,sampleCheck:f.sampleCheck,imageUrl:url,...analysis,timestamp:stampFromForm(f)};state.qualityChecks.unshift(quality);
      }
      const imageFile=recv.elements.receivingImage?.files?.[0];const imageUrl=await EnterpriseBackend.upload(imageFile,`${site.toLowerCase()}-receiving`);
      const volumePass=Math.abs(volumeDiff)<=volumeTolerance,identityPass=platePass,pass=volumePass&&sealPass&&identityPass&&deliveryNotePass;
      s.receivingV3={id:newId('RCV'),site,operatorName:f.operatorName,timestamp:stampFromForm(f),location:f.location,unitType:f.unitType,plate:f.plate,sealCondition:f.sealCondition,sealMatch:f.sealMatch,sealPass,identityPass,soundBefore,soundAfter,receivingSoundingDelta:receivingDelta,fieldSoundingDelta:fieldDelta,soundingDiff,flowStart:start,flowEnd:end,totalReceived:received,volumeDiff,volumePct,volumeTolerance,volumePass,unloadingArea:f.unloadingArea||null,unloadingOperator:f.unloadingOperator||null,deliveryNoteCheck:f.deliveryNoteCheck||null,deliveryNotePass,qualityCheckId:quality?.id||null,imageUrl,remarks:f.remarks||''};
      s.validation={received,diff:volumeDiff,pct:volumePct,tolerance:volumeTolerance,volumePass,sealPass,identityPass,risk:pass?'LOW':'HIGH',time:stampFromForm(f),soundBefore,soundAfter,notes:f.remarks||''};s.status=pass?'RECEIVED':'HOLD';o.status=s.status;o.updatedAt=stampFromForm(f);
      const issues=[!volumePass?'volume variance':'',!sealPass?'seal issue':'',!identityPass?'plate mismatch':'',!deliveryNotePass?'surat jalan mismatch':''].filter(Boolean);
      audit('SITE CARGO RECEIVING',`${s.id} · ${site} · ${fmt(received)} L · ${s.status}`);notify(pass?'RECEIVING_COMPLETED':'RECEIVING_VARIANCE_ALERT',pass?`Receiving completed · ${s.plate}`:`Receiving alert · ${s.plate}`,`${siteName(site)} · loading ${fmt(s.total)} L vs receiving ${fmt(received)} L · ${volumePct.toFixed(4)}%${issues.length?' · '+issues.join(', '):''}`,audienceForSite(site));toast(pass?'Receiving completed and reconciled':'Receiving mismatch detected — shipment HOLD');state.page='receiving_results_site';renderAll();
    };
  }

  const empty=$('#emptyUnitFormV3');
  if(empty)empty.onsubmit=async e=>{
    e.preventDefault();const f=formDataObj(empty),s=state.shipments.find(x=>x.id===f.shipmentId);if(!s)return;const file=empty.elements.image?.files?.[0],imageUrl=await EnterpriseBackend.upload(file,'maintank-empty-unit');const rec={id:newId('EMP'),shipmentId:s.id,site:'MAINTANK',plate:s.plate,seals:[f.seal1,f.seal2,f.seal3,f.seal4],operatorName:f.operatorName,timestamp:stampFromForm(f),imageUrl,remarks:f.remarks||''};state.emptyUnitRecords.unshift(rec);const fleet=fleetUnitByPlate(s.plate);if(fleet){fleet.status='AVAILABLE';fleet.remarks=`Empty unit sealed at Maintank · ${rec.id}`;fleet.updatedAt=rec.timestamp;}audit('EMPTY UNIT SEALED',`${s.plate} · ${rec.id}`);notify('EMPTY_UNIT_SEALED',`Empty unit sealed · ${s.plate}`,`Maintank · ${rec.seals.join(' · ')}`,['maintank_operator','transport_operator','fuel_spv','it_admin']);toast('Empty-unit seal record saved');renderAll();
  };

  const inv=$('#inventoryFormV3');
  if(inv)inv.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(inv),t=state.inventory.find(x=>x.id===f.tankId);if(!t)return;t.bookStock=Number(f.bookStock);t.soundingStock=Number(f.soundingStock);if(Number(f.capacity)>0)t.capacity=Number(f.capacity);t.operatorName=f.operatorName;t.updatedAt=stampFromForm(f);t.remarks=f.remarks||'';audit('INVENTORY UPDATED',`${t.tank} · book ${fmt(t.bookStock)} · sounding ${fmt(t.soundingStock)}`);notify('INVENTORY_UPDATED',`Inventory updated · ${t.tank}`,`${t.product} · sounding ${fmt(t.soundingStock)} L · variance ${fmt(t.soundingStock-t.bookStock)} L`,['cr_operator','fuel_spv','it_admin']);toast('Inventory updated');renderAll();
  };

  const fleet=$('#fleetFormV3');
  if(fleet)fleet.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(fleet),u=state.transportUnits.find(x=>x.id===f.unitId);if(!u)return;const busy=unitBusy(u.plate);if(busy&&f.status==='AVAILABLE'){toast(`Unit is still allocated to active request ${duplicateUnitRequest(u.plate)?.id}`);return;}u.status=f.status;u.remarks=f.remarks||'';u.updatedAt=stampFromForm(f);u.operatorName=f.operatorName;audit('FLEET STATUS UPDATED',`${u.plate} · ${u.status}`);notify('FLEET_STATUS',`Fleet status · ${u.plate}`,`${u.status} · ${u.remarks||'No remarks'}`,['transport_operator','fuel_field','fuel_spv','it_admin']);toast('Fleet status updated');renderAll();
  };

  const complaint=$('#complaintFormV3');
  if(complaint)complaint.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(complaint),site=complaint.dataset.site,id=newId('CMP');state.complaints.unshift({id,site,operatorName:f.operatorName,shipmentId:f.shipmentId||null,subject:f.subject,priority:f.priority,message:f.message,status:'REQUESTED',timestamp:stampFromForm(f),feedback:null,feedbackAt:null});audit('CUSTOMER COMPLAINT CREATED',`${id} · ${site}`);notify('CUSTOMER_COMPLAINT',`New complaint from ${siteName(site)}`,`${f.subject} · ${f.priority}`,['fuel_spv','it_admin',roleAudienceForSite(site)]);toast('Complaint sent to Fuel Blending superior');renderAll();
  };

  const feedback=$('#complaintFeedbackFormV3');
  if(feedback)feedback.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(feedback),c=state.complaints.find(x=>x.id===f.complaintId);if(!c)return;c.feedback=f.feedback;c.feedbackAt=stampFromForm(f);c.status=f.status;c.feedbackBy=f.operatorName;audit('COMPLAINT FEEDBACK',`${c.id} · ${c.status}`);notify('COMPLAINT_FEEDBACK',`Fuel Blending feedback · ${c.subject}`,f.feedback,[roleAudienceForSite(c.site),'fuel_spv','it_admin'].filter(Boolean));toast('Feedback sent to customer');renderAll();
  };

  const schedule=$('#shipmentScheduleFormV3');
  if(schedule){
    const tank=$('#scheduleTankV3'),vol=$('#scheduleVolumeV3');const calc=()=>{const t=state.inventory.find(x=>x.id===tank.value),v=Number(vol.value||0),stock=Number(t?.soundingStock||0);$('#scheduleStockV3').value=`${fmt(stock)} L`;$('#scheduleBalanceV3').value=`${fmt(stock-v)} L`;};tank.onchange=calc;vol.oninput=calc;calc();
    schedule.onsubmit=e=>{
      e.preventDefault();const f=formDataObj(schedule),t=state.inventory.find(x=>x.id===f.tankId),v=Number(f.volume),stock=Number(t?.soundingStock||0);if(v<=0){toast('Planned volume must be greater than zero');return;}const feasible=stock>=v;const rec={id:newId('SCH'),date:f.date,site:f.site,tankId:f.tankId,product:t?.product||'',volume:v,stockAtPlan:stock,stockAfterPlan:stock-v,operatorName:f.operatorName,timestamp:stampFromForm(f),notes:f.notes||'',status:feasible?'PLANNED':'HOLD'};state.shipmentSchedules.unshift(rec);audit('SHIPMENT SCHEDULE CREATED',`${rec.id} · ${rec.site} · ${fmt(v)} L`);notify(feasible?'SHIPMENT_SCHEDULE':'LOW_STOCK_ALERT',feasible?`Shipment scheduled · ${siteName(rec.site)}`:`Shipment plan HOLD · insufficient stock`,`${rec.date} · ${t?.tank} · ${fmt(v)} L · balance ${fmt(rec.stockAfterPlan)} L`,['fuel_spv','cr_operator','fuel_field','it_admin',roleAudienceForSite(rec.site)].filter(Boolean));toast(feasible?'Shipment plan created':'Plan created as HOLD because stock is insufficient');renderAll();
    };
  }

  const maintenance=$('#maintenanceFormV3');
  if(maintenance)maintenance.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(maintenance),rec={id:newId('PM'),title:f.title,date:f.date,time:f.time,asset:f.asset,priority:f.priority,owner:f.owner,status:f.status,details:f.details||'',timestamp:nowText()};state.maintenance.unshift(rec);audit('PREVENTIVE MAINTENANCE CREATED',rec.id);notify('MAINTENANCE_NOTICE',`Preventive maintenance · ${rec.title}`,`${rec.date} ${rec.time} · ${rec.asset} · ${rec.priority}`,['fuel_field','cr_operator','fuel_spv','it_admin']);toast('Maintenance schedule published');renderAll();
  };

  const project=$('#projectFormV3');
  if(project)project.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(project),rec={id:newId('PRJ'),title:f.title,date:f.date,targetDate:f.targetDate||'',priority:f.priority,owner:f.owner,status:f.status,details:f.details||'',timestamp:nowText()};state.projects.unshift(rec);audit('PROJECT CREATED',rec.id);notify('PROJECT_NOTICE',`Project update · ${rec.title}`,`${rec.date} → ${rec.targetDate||'TBA'} · ${rec.status}`,['fuel_field','cr_operator','fuel_spv','it_admin']);toast('Project created');renderAll();
  };

  const bulletin=$('#bulletinFormV3');
  if(bulletin)bulletin.onsubmit=e=>{
    e.preventDefault();const f=formDataObj(bulletin),aud=f.audience==='both'?['fuel_field','cr_operator']: [f.audience],rec={id:newId('NEWS'),type:f.type,title:f.title,body:f.body,audience:aud,author:f.operatorName,date:f.entryDate,time:f.entryTime};state.bulletins.unshift(rec);audit('BULLETIN PUBLISHED',rec.id);notify('BULLETIN',`${rec.type} · ${rec.title}`,rec.body,[...aud,'fuel_spv','it_admin']);toast('Bulletin published and notifications sent');renderAll();
  };
}

function adminPageV3(){
  return `${adminPage()}<div style="height:14px"></div><div class="panel"><div class="panel-head"><div><div class="panel-title">Shared Data & Visitor Telemetry Configuration</div><div class="panel-sub">Configuration values stay in app.js; Firestore rules and telemetry endpoint must be deployed separately.</div></div></div><div class="panel-body"><div class="check-list"><div class="check-row"><span class="check-name">Firebase shared persistence</span><span>${EnterpriseBackend.status==='online'?'<span class="badge good">ONLINE</span>':'<span class="badge warn">NOT CONFIGURED / OFFLINE</span>'}</span></div><div class="check-row"><span class="check-name">Cross-device image storage</span><span>${EnterpriseBackend.ready?'<span class="badge good">FIREBASE STORAGE</span>':'<span class="badge neutral">LOCAL FALLBACK</span>'}</span></div><div class="check-row"><span class="check-name">Visitor telemetry endpoint</span><span>${APP_CONFIG.visitorLogEndpoint?'<span class="badge good">CONFIGURED</span>':'<span class="badge neutral">DISABLED</span>'}</span></div></div><div class="privacy-note" style="margin-top:12px">A browser-generated anonymous ID is not a verified human identity. For reliable user identification, connect Firebase Authentication and store the authenticated UID in operational audit records. IP and approximate location should be collected server-side only when you have a valid operational/privacy basis and have informed users appropriately.</div></div></div>`;
}

renderPage = function(){
  const pages={
    enterprise_dashboard:enterpriseDashboard,
    maintank_dashboard:maintankDashboard,rf_dashboard_v2:rfDashboardV2,mill_dashboard:millDashboard,transport_dashboard:transportDashboard,
    fuel_ops_dashboard:fuelOpsDashboard,cr_dashboard_v2:crDashboardV2,spv_dashboard_v2:spvDashboardV2,
    maintank_requests:maintankRequestsPage,rf_requests_v2:rfRequestsV2Page,mill_requests:millRequestsPage,
    request_inbox:requestInboxPage,order_control_v2:orderControlV2Page,transport_fleet:transportFleetPage,
    pre_inspection_v2:preInspectionV2,loading_v2:loadingV2,after_inspection_v2:afterInspectionV2,
    cr_loading_v2:crLoadingV2,inventory_control:inventoryControlPage,site_receiving_v2:siteReceivingV2,empty_units:emptyUnitsPage,
    receiving_results_site:receivingResultsSite,customer_complaints:customerComplaintsPage,spv_complaints:spvComplaintsPage,
    shipment_schedule:shipmentSchedulePage,maintenance_schedule:maintenanceSchedulePage,projects:projectsPage,news_manager:newsManagerPage,ops_bulletin:opsBulletinPage,
    // Preserved legacy modules
    dashboard,spv_dashboard:spvDashboard,cr_dashboard:crDashboard,rf_dashboard:rfDashboard,rf_orders:rfOrdersPage,order_control:orderControlPage,cr_loading:crLoadingPage,
    receiving_results:receivingResultsPage,notifications:notificationsPage,pre_inspection:preInspection,loading:loadingPage,after_inspection:afterInspection,
    shipment_monitor:shipmentMonitor,receiving:receivingPage,site_history:siteHistory,validation:validationPage,bl_analysis:blAnalysisPage,
    custody_transfer:custodyTransferPage,cargo_calculator:cargoCalculatorPage,discharge:()=>dischargePage('discharge'),marine_loading:()=>dischargePage('marine_loading'),admin:adminPageV3
  };
  if(!role().modules.includes(state.page))state.page=defaultPageForRole();
  $('#content').innerHTML=(pages[state.page]||pages[defaultPageForRole()]||enterpriseDashboard)();
  $('#crumb').textContent=NAV.flatMap(x=>x.items).find(x=>x[0]===state.page)?.[2]||'Dashboard';
  bindForms();
};

// Reinitialize role selector and UI with the extended role matrix.
setupRoles();
state.page=defaultPageForRole();
renderAll();
EnterpriseBackend.init();
VisitorTelemetry.track();
