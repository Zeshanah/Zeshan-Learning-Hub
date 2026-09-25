const state = JSON.parse(localStorage.getItem("zeshanHub") || '{"checks":{},"grammar":{},"theme":"light"}');

const process = [
["01","Customer & BP master data","Business Partner, customer roles, sales area data, partner functions and relevant master-data checks.","BP"],
["02","Material master","Sales views, units, tax/classification data, availability and delivery-relevant settings.","MM03 / Fiori"],
["03","Inquiry / quotation","Capture demand, create quotation, apply validity and commercial conditions, then convert if accepted.","VA11 / VA21"],
["04","Sales order","Enter customer/material/quantity, determine pricing, partners, shipping data, schedule lines and credit checks.","VA01"],
["05","Availability & scheduling","Check confirmed quantity and dates; resolve ATP/scheduling issues before execution.","CO09 / aATP"],
["06","Outbound delivery","Create delivery, run picking/packing, check route/shipping point and delivery blocks.","VL01N"],
["07","Picking & packing","Confirm warehouse execution, handling units where relevant, quantities and batch/serial data.","VL02N"],
["08","Post Goods Issue","Reduce stock and trigger logistics/accounting impact as configured.","VL02N"],
["09","Billing","Create invoice/credit/debit document, copy relevant delivery/order data and run output.","VF01"],
["10","FI integration","Billing creates the accounting interface; validate document flow, receivables and tax.","FB03 / VF03"],
["11","Returns / complaints","Process returns, credit memos, replacements and reason codes according to the scenario.","VA01 / VL01N / VF01"],
["12","Analytics & support","Use document flow, status, logs and Fiori apps to analyse issues and report KPIs.","VA03 / VL03N / VF03"]
];

const scenarios = [
["Pricing discrepancy","Pricing","Customer says the order price differs from the quotation.","Check pricing procedure, condition records, validity, access sequence, currency/UoM and manual conditions; compare document pricing analysis."],
["Delivery date missed","Delivery","Customer order is confirmed later than requested.","Check ATP/confirmation, schedule lines, route/shipping point, delivery blocks, stock and replenishment; document root cause."],
["Invoice not created","Billing","Delivery is complete but no billing document exists.","Check billing relevance, PGI, billing block, copy control, document status and incompletion log."],
["Wrong partner","Master data","Ship-to or payer is incorrect on the order.","Check partner determination, BP/customer master, partner functions and manual overrides; retest document flow."],
["Credit block","Credit","Sales order is blocked by credit management.","Check credit exposure, risk/segment configuration and blocked-document workflow; coordinate with credit team."],
["Intercompany sale","Integration","One company code sells while another delivers.","Explain supplying plant, intercompany billing, customer/vendor relationships and FI integration; validate both billing flows."],
["Return with refund","Returns","Customer returns material and expects a credit.","Use an appropriate returns flow, inspect goods, post receipt, create credit memo as applicable and validate FI impact."],
["UAT defect","Testing","Business reports that a new sales process fails in UAT.","Reproduce, capture evidence, isolate configuration/master-data/process cause, classify severity, fix and regression-test."],
["Output missing","Output","Invoice exists but customer did not receive it.","Check output determination/channel, partner/email/address data, processing status and spool/output logs."],
["Incomplete order","Order entry","Sales order cannot proceed because required data is missing.","Open incompletion log, identify mandatory field, correct source/master/configuration and confirm status changes."],
["EDI order error","Integration","Incoming customer order is rejected or incomplete.","Trace IDoc/message, segment mapping, partner profile, application document creation and error status; coordinate with technical team."],
["Go-live support","Cutover","A new S/4HANA rollout has production issues after cutover.","Triage business impact, use document flow/logs, apply approved fixes/workarounds, communicate status and record knowledge."]
];

const tcodes = [
["VA01","Create sales order","Create / Fiori alternative may be used"],
["VA02","Change sales order","Change"],
["VA03","Display sales order","Display"],
["VA11","Create inquiry","Inquiry"],
["VA12","Change inquiry","Change"],
["VA13","Display inquiry","Display"],
["VA21","Create quotation","Quotation"],
["VA22","Change quotation","Change"],
["VA23","Display quotation","Display"],
["VA05","List sales orders","Sales order list"],
["VA14L","Incomplete sales documents","Useful for follow-up"],
["VL01N","Create outbound delivery","Delivery creation"],
["VL02N","Change outbound delivery / PGI","Common delivery execution"],
["VL03N","Display outbound delivery","Display"],
["VL06O","Outbound delivery monitor","Monitor"],
["VL10A","Due list for sales orders","Delivery due list"],
["VL09","Reverse goods movement","Reverse PGI / goods movement"],
["VF01","Create billing document","Invoice / billing"],
["VF02","Change billing document","Change"],
["VF03","Display billing document","Display"],
["VF04","Billing due list","Billing worklist"],
["VF11","Cancel billing document","Cancellation"],
["BP","Maintain Business Partner","S/4HANA master-data hub"],
["XD03","Display customer (legacy ECC)","Use BP in S/4HANA"],
["MM01","Create material","Material master"],
["MM02","Change material","Change"],
["MM03","Display material","Display"],
["VK11","Create condition record","Pricing condition"],
["VK12","Change condition record","Pricing"],
["VK13","Display condition record","Pricing"],
["VKOA","Account determination","SD-FI configuration"],
["OVKK","Pricing procedure determination","Configuration"],
["OVK1","Tax categories / control","Tax configuration"],
["OVLK","Delivery types","Configuration"],
["VT01N","Create shipment","Classic LE shipment"],
["VT02N","Change shipment","Classic LE shipment"],
["VT03N","Display shipment","Classic LE shipment"],
["CO09","ATP overview","Availability check"],
["MD04","Stock/requirements list","MM/PP planning"],
["MIGO","Goods movement","Inventory movement"],
["MB52","Warehouse stock","Stock overview"],
["FB03","Display accounting document","FI document display"],
["FBL5N","Customer line items","Receivables"],
["SE16N","Table browser","Technical analysis; authorisation dependent"],
["SM37","Background jobs","Job monitoring; authorisation dependent"],
["SLG1","Application log","Troubleshooting; authorisation dependent"],
["WE02","IDoc list","EDI/IDoc monitoring"],
["WE05","IDoc list","Alternative IDoc monitor"],
["BD87","IDoc reprocessing","Reprocess failed IDocs"]
];

const qa = [
["What is the SAP SD Order-to-Cash cycle?","It is the end-to-end flow from customer/master data and sales order through availability, delivery, picking/packing, PGI and billing, with integration to FI and other functions."],
["How does pricing work in an SD sales order?","The pricing procedure determines which condition types are evaluated and in what sequence. The system searches condition records using access sequences and applies validity, scale, currency and other controls."],
["What would you check if the customer gets the wrong price?","Compare quotation/order pricing analysis, check condition records and validity, access sequence, customer/material data, currency/UoM and any manual conditions."],
["What is the difference between a sales order and an outbound delivery?","The sales order records the commercial demand. The outbound delivery controls execution of shipping, including picking, packing and goods issue."],
["What happens at PGI?","The goods movement is posted for the delivery. Stock and relevant logistics/accounting impacts are updated according to the configured process."],
["Why can billing fail after PGI?","Possible causes include billing blocks, copy-control issues, incomplete data, billing relevance/status problems or configuration/master-data issues."],
["What is document flow?","It links preceding and subsequent SD documents so you can trace the lifecycle from inquiry/quotation/order through delivery, PGI and billing."],
["What is a partner function?","It identifies business roles such as sold-to, ship-to, bill-to and payer. Partner determination controls how these roles are proposed."],
["What is an incompletion log?","A diagnostic list showing required or relevant data that is missing or invalid for a document to proceed."],
["How would you approach an SAP SD production incident?","Clarify business impact, reproduce, inspect document status/logs/master data, identify root cause, apply an approved fix/workaround, test and document."],
["What is UAT?","User Acceptance Testing validates that a business process meets agreed requirements and that end users can execute the scenario successfully before release."],
["How does SD integrate with FI?","Billing transfers financial information to accounting, supporting receivables, revenue, tax and related postings according to configuration."],
["How does SD integrate with MM?","Sales and logistics processes use material and stock information; procurement/replenishment may be triggered when supply is insufficient, depending on the process."],
["What is an IDoc?","A structured SAP data container used to exchange business information between systems, commonly for EDI/integration scenarios."],
["How would you explain a rollout project in an interview?","Describe the template, local requirements, fit-gap decisions, master data, configuration, testing, cutover, training and hypercare."],
["What makes a good functional specification?","A clear business requirement, current state, target behaviour, functional logic, field mapping, rules, dependencies, acceptance criteria and test cases."],
["How do you handle a pricing requirement?","Clarify business rules, identify condition types and access sequence, assess standard capability, configure in the right layer, test edge cases and document."],
["What is the role of Fiori in S/4HANA SD?","Fiori provides role-based applications and analytical/transactional experiences that can replace or complement classic SAP GUI transactions."],
["What is credit management in SD?","It controls customer credit exposure and can block or release sales/delivery processes according to defined rules and authorisations."],
["How do you prepare for a Go-Live?","Complete cutover tasks, validate master data, run end-to-end tests, prepare support/monitoring, confirm roles, communications and rollback/contingency plans."]
];

const grammar = [
"Word order: main clause and subordinate clause",
"weil / dass / obwohl / wenn / damit",
"Konjunktiv II for polite requests and hypotheticals",
"Perfekt and Präteritum of common verbs",
"Modal verbs and separable verbs",
"Two-way prepositions: an, auf, in, über, unter...",
"Accusative vs dative articles and pronouns",
"Adjective endings after der/ein/no article",
"Relative clauses with der/die/das",
"Reflexive verbs and pronouns",
"Comparatives and superlatives",
"Prepositions with fixed cases",
"Infinitive with zu",
"Passive voice basics",
"Connectors: deshalb, trotzdem, außerdem, deswegen",
"Formal email phrases and register",
"Opinion phrases and giving reasons",
"Temporal connectors: bevor, nachdem, während",
"Noun-verb combinations",
"Everyday workplace vocabulary"
];

const jobs = [
{c:"DE",country:"Germany",title:"SAP SD Consultant",company:"RED Global / client project",place:"Frankfurt · Hybrid",type:"Contract 6–12 months",date:"24 Sep 2026",fit:"SD/OTC · S/4HANA · English",level:"Mid-level",url:"https://redglobal.de/jobs/job/sap-sd-consultant-frankfurt/wdaiaqM0",note:"Requires 5+ years SAP SD/OTC and S/4HANA implementation experience; German advantageous. No senior title in the posting."},
{c:"AT",country:"Austria",title:"Projektkoordination / SAP Inhouse Consultant",company:"binderholz group",place:"Hallein · Salzburg",type:"Permanent · Full time",date:"25 Sep 2026",fit:"S/4HANA · process analysis · SD/MM/PS/TM/PP",level:"Mid-level",url:"https://jobsinaustria.at/job/projektkoordination-sap-inhouse-consultant-m-w-d-6ab60dea8c540",note:"The listing explicitly identifies the experience level as Mid Level and asks for SAP experience with process analysis/documentation; SAP SD is among the relevant modules."},
{c:"AT",country:"Austria",title:"SAP Inhouse Consultant – SD/MM",company:"TTTech Group",place:"Vienna",type:"Permanent",date:"03 Sep 2026",fit:"SD/MM · S/4HANA transformation · OTC",level:"Mid-level target",url:"https://successfactors.tttech.com/job/Vienna-SAP-Inhouse-Consultant-SDMM-%28mfd%29/1359635555/",note:"In-house SD/MM role supporting an SAP transformation and Order-to-Cash / supply-chain initiatives. Verify current availability on the employer page."},
{c:"CH",country:"Switzerland",title:"SAP SD Consultant — mid-level search",company:"Stolzberger / Swiss market search",place:"Switzerland · multiple locations",type:"Permanent search",date:"25 Sep 2026",fit:"SAP SD · in-house / consulting",level:"Mid-level search",url:"https://www.stolzberger.de/jobs/",note:"Use the live recruiter search and filter for non-senior SAP SD roles. Senior roles are intentionally excluded from this board."},
{c:"UK",country:"United Kingdom",title:"SAP SD/OTC Consultant — mid-level search",company:"RED Global / UK market",place:"UK · hybrid / remote",type:"Contract search",date:"25 Sep 2026",fit:"SD/OTC · S/4HANA · Public Cloud",level:"Mid-level search",url:"https://redglobal.com/jobs",note:"Current UK SD/OTC results include senior roles; this board intentionally does not list those. Use the live recruiter search for consultant roles without senior/lead/manager titles."}
];

const path = [
["sap1","OTC process map"],["sap2","Master data & BP"],["sap3","Pricing & condition technique"],["sap4","Sales order & ATP"],["sap5","Delivery / picking / PGI"],["sap6","Billing & FI integration"],["sap7","Returns / complaints"],["sap8","Scenario practice"],["dtz1","DTZ grammar checklist"],["dtz2","DTZ speaking practice"]
];

function save(){localStorage.setItem("zeshanHub",JSON.stringify(state));document.getElementById("lastSaved").textContent="Saved locally · "+new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});renderProgress();}
function go(tab){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.getElementById(tab).classList.add("active");document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab));window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.tab)));
document.getElementById("mobileMenu").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=state.theme;save();};
if(state.theme==="dark")document.documentElement.dataset.theme="dark";

document.getElementById("learningPath").innerHTML=path.map(([id,label])=>`<label class="check-row"><input type="checkbox" data-check="${id}" ${state.checks[id]?"checked":""}><span>${label}</span></label>`).join("");
document.querySelectorAll("[data-check]").forEach(x=>x.addEventListener("change",()=>{state.checks[x.dataset.check]=x.checked;save();}));

document.getElementById("process").innerHTML=process.map(x=>`<div class="process-card"><div class="step-no">${x[0]}</div><div><h3>${x[1]}</h3><p>${x[2]}</p></div><code>${x[3]}</code></div>`).join("");
document.getElementById("scenarioGrid").innerHTML=scenarios.map(x=>`<article class="scenario-card"><span class="tag">${x[1]}</span><h3>${x[0]}</h3><p>${x[2]}</p><details><summary>Model approach</summary><p>${x[3]}</p></details></article>`).join("");

function renderTcodes(filter=""){document.getElementById("tcodeBody").innerHTML=tcodes.filter(x=>x.join(" ").toLowerCase().includes(filter.toLowerCase())).map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join("");}
renderTcodes();document.getElementById("tcodeFilter").addEventListener("input",e=>renderTcodes(e.target.value));

document.getElementById("qaList").innerHTML=qa.map((x,i)=>`<article class="qa-item"><h3>${i+1}. ${x[0]}</h3><div class="answer">${x[1]}</div></article>`).join("");
document.getElementById("randomQuestion").onclick=()=>{const i=Math.floor(Math.random()*qa.length);document.querySelectorAll(".qa-item")[i].scrollIntoView({behavior:"smooth",block:"center"});document.querySelectorAll(".qa-item")[i].style.outline="2px solid #6d63ff";setTimeout(()=>document.querySelectorAll(".qa-item")[i].style.outline="",1400);};

document.getElementById("grammarList").innerHTML=grammar.map((x,i)=>`<label class="grammar-row"><input type="checkbox" data-grammar="${i}" ${state.grammar[i]?"checked":""}><span>${x}</span></label>`).join("");
document.querySelectorAll("[data-grammar]").forEach(x=>x.addEventListener("change",()=>{state.grammar[x.dataset.grammar]=x.checked;save();}));

function renderJobs(country="all"){document.getElementById("jobsGrid").innerHTML=jobs.filter(j=>(country==="all"||j.c===country)).map(j=>`<article class="job-card"><div class="job-top"><span class="country">${j.country}</span><span class="muted">${j.date}</span></div><h3>${j.title}</h3><div class="company">${j.company}</div><div class="meta"><span>${j.place}</span><span>${j.type}</span><span>${j.level}</span><span>${j.fit}</span></div><p>${j.note}</p><a href="${j.url}" target="_blank" rel="noreferrer">Open posting / verify live status ↗</a></article>`).join("");}
renderJobs();
document.querySelectorAll(".chip").forEach(x=>x.onclick=()=>{document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));x.classList.add("active");renderJobs(x.dataset.country);});
document.getElementById("refreshJobs").onclick=()=>{alert("The job board links are refreshed to their live source pages. A static site cannot safely scrape all job boards; use the source buttons below for the newest postings.");};

document.getElementById("globalSearch").addEventListener("input",e=>{
 const q=e.target.value.trim().toLowerCase(); if(!q)return;
 const targets=[...document.querySelectorAll(".tab")];
 const hit=targets.find(t=>t.innerText.toLowerCase().includes(q));
 if(hit)go(hit.id);
});

document.getElementById("resetProgress").onclick=()=>{if(confirm("Reset local learning progress?")){state.checks={};state.grammar={};save();location.reload();}};
function renderProgress(){
 const total=path.length+grammar.length, done=Object.values(state.checks).filter(Boolean).length+Object.values(state.grammar).filter(Boolean).length;
 const pct=Math.round(done/total*100);document.getElementById("progressPct").textContent=pct+"%";document.querySelector(".progress-ring").style.setProperty("--deg",(pct*3.6)+"deg");
 document.getElementById("progressDetails").innerHTML=`<div class="detail-row"><span>SAP / general learning checklist</span><b>${Object.values(state.checks).filter(Boolean).length} / ${path.length}</b></div><div class="detail-row"><span>Grammar topics</span><b>${Object.values(state.grammar).filter(Boolean).length} / ${grammar.length}</b></div><div class="detail-row"><span>Overall</span><b>${done} / ${total} (${pct}%)</b></div>`;
}
renderProgress();
