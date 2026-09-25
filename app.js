const state = JSON.parse(localStorage.getItem("zeshanHub") || '{"checks":{},"grammar":{},"theme":"light"}');

const process = [
["01","Customer & BP master data","Business Partner, customer roles, sales-area data, partner functions and relevant master-data checks.","BP","Start with the business relationship. In S/4HANA, Business Partner is the central master-data object. Confirm the customer roles needed for the sales process, sales-area data, addresses, payment terms, tax information and partner functions. A clean master-data foundation prevents downstream order, delivery and billing errors.","BP","Check: sales organization, distribution channel, division, partner functions, payment terms, incoterms, shipping conditions, tax classification and account assignment data.","Customer/BP → Sales Area → Partner Functions → Order"],
["02","Material master","Sales views, units, tax/classification data, availability and delivery-relevant settings.","MM03 / Fiori","Validate the material before using it in a sales document. Confirm the sales views, plant data, base and sales units, delivering plant, availability-relevant information, item-category relevance and tax classification. The material master provides data that is copied or proposed into later documents.","MM03","Check: material status, sales organisation/distribution channel views, plant, units, tax classification, delivering plant and availability.","Material → Sales View → Plant Data → ATP / Delivery"],
["03","Inquiry / quotation","Capture demand, create quotation, apply validity and commercial conditions, then convert if accepted.","VA11 / VA21","Presales documents capture customer demand before the binding order. An inquiry can record a request; a quotation adds commercial terms and validity. If accepted, the quotation can be referenced when creating the sales order so relevant information can flow forward.","VA11 / VA21 / VA22 / VA23","Check: validity dates, customer/material, requested quantity, pricing, partner data, quotation status and follow-on document flow.","Inquiry → Quotation → Customer PO → Sales Order"],
["04","Sales order","Enter customer/material/quantity, determine pricing, partners, shipping data, schedule lines and credit checks.","VA01","Create the commercial demand document. Validate customer, material, quantity, requested delivery date, pricing, partner determination, shipping data, schedule lines, incompletion and credit status. A sales order can trigger the subsequent delivery and billing process.","VA01 / VA02 / VA03","Exam focus: explain how master data and configuration drive pricing, partners, shipping point, route, schedule lines, item category and document flow.","Customer + Material → Sales Order → ATP / Pricing / Scheduling → Confirmation"],
["05","Availability & scheduling","Check confirmed quantity and dates; resolve ATP/scheduling issues before execution.","CO09 / MD04 / aATP","Availability checking determines what can be confirmed and when. If the requested date or quantity cannot be met, analyse available stock and receipts, requirements, plant, scheduling and replenishment options. In S/4HANA, aATP functionality may be used depending on scope.","CO09 / MD04 / aATP apps","Check: requested vs confirmed quantity/date, plant, stock/requirements, receipts, replenishment and scheduling results.","Requirement → ATP Check → Confirmation → Delivery Schedule"],
["06","Outbound delivery","Create delivery, run picking/packing, check route/shipping point and delivery blocks.","VL01N / Fiori","Create the shipping execution document from due sales orders. Validate shipping point, route, delivery date, delivery block, quantities and warehouse-relevant information. The outbound delivery becomes the central document for the shipping execution stage.","VL01N / VL10A / VL03N","Check: due list, shipping point, route, delivery block, picking status, quantities and warehouse integration.","Sales Order → Delivery Due → Outbound Delivery → Warehouse"],
["07","Picking & packing","Confirm warehouse execution, handling units where relevant, quantities and batch/serial data.","VL02N / Fiori","Execute the physical warehouse steps required by the process. Confirm picked quantity, storage/warehouse status, batches or serial numbers where relevant, handling units and packing. The exact execution depends on whether warehouse management/EWM is in scope.","VL02N / Manage Outbound Deliveries","Check: picking status, quantity, batch/serial data, packing/HUs and warehouse task status where applicable.","Outbound Delivery → Picking → Packing → Staging"],
["08","Post Goods Issue","Reduce stock and trigger logistics/accounting impact as configured.","VL02N / VL09","Post goods issue only when the delivery is ready for shipment. The goods movement records the issue of stock and updates document/status information. Validate the material document and resulting stock/logistics impact. If required, a controlled reversal can be performed.","VL02N / VL09","Check: picked quantity, batch/serial data, PGI status, material document, stock impact and reversal requirements.","Picking Complete → PGI → Material Document → Stock Updated"],
["09","Billing","Create invoice/credit/debit document, copy relevant delivery/order data and run output.","VF01 / VF04","Billing converts the completed sales/shipping transaction into a receivable. Depending on the scenario, billing can reference a delivery or sales order. Check billing relevance, blocks, copy-control/data flow, pricing, tax, payment terms and output.","VF01 / VF04 / VF03 / VF11","Check: billing due list, billing block, billing type, copy control/data flow, pricing, tax, output and document flow.","Delivery / Order → Billing Due → Invoice → Output"],
["10","FI integration","Billing creates the accounting interface; validate document flow, receivables and tax.","VF03 / FB03 / FBL5N","Validate the hand-off from SD to Financial Accounting. The billing document provides the basis for the accounting document, including customer receivables and revenue/tax postings according to configuration. Use document flow to trace the relationship.","VF03 / FB03 / FBL5N","Check: accounting document, customer line item, revenue, tax, account determination and posting status.","Billing → Accounting Document → A/R + Revenue + Tax → Customer Payment"],
["11","Returns / complaints","Process returns, credit memos, replacements and reason codes according to the scenario.","VA01 / VL01N / VF01","Choose the return or complaint process based on the business requirement. Reference the original transaction where appropriate, record the reason, receive/inspect goods where required, then complete replacement, credit or refund steps according to the configured process.","VA01 / VL01N / VF01","Check: reference document, return reason, inspection/receipt, follow-on delivery, credit memo relevance and FI impact.","Customer Complaint → Return Order → Return Delivery → Inspection → Credit / Replacement"],
["12","Analytics & support","Use document flow, status, logs and Fiori apps to analyse issues and report KPIs.","VA03 / VL03N / VF03 / SLG1","Troubleshoot from the business symptom to the affected document, master data or configuration. Use document flow, status, incompletion logs, application logs and monitoring tools. Reproduce the issue, isolate the cause, apply an approved fix, retest and document.","VA03 / VL03N / VF03 / SLG1","Support pattern: reproduce → inspect document flow/status → check master data/configuration → fix → regression test → document.","Business Symptom → Evidence → Root Cause → Fix → Retest → Close"]
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

function flowSvg(flow){
 const parts=flow.split(" → ");
 const w=Math.max(720, parts.length*170);
 const boxes=parts.map((p,i)=>{
   const x=20+i*((w-40)/(parts.length));
   const bw=Math.min(145,(w-60)/parts.length);
   const label=p.length>22?p.slice(0,21)+"…":p;
   let arrow="";
   if(i<parts.length-1){
     const lineEnd=x+bw+Math.max(12,(w-40)/parts.length-10);
     const head=x+bw+Math.max(5,(w-40)/parts.length-17);
     arrow=`<line x1="${x+bw+5}" y1="59" x2="${lineEnd}" y2="59" stroke="#087f73" stroke-width="2"/><polygon points="${lineEnd},59 ${head},54 ${head},64" fill="#087f73"/>`;
   }
   const fill=i%3===0?'#e5f4f1':i%3===1?'#fff2d9':'#eef0ff';
   return `<g><rect x="${x}" y="28" width="${bw}" height="62" rx="12" fill="${fill}" stroke="#cbded9"/><text x="${x+bw/2}" y="54" text-anchor="middle" font-size="11" font-weight="700" fill="#17302b">${label}</text>${arrow}</g>`;
 }).join("");
 return `<div class="flow-diagram"><div class="diagram-title">Process flow</div><svg viewBox="0 0 ${w} 115" role="img" aria-label="${flow}">${boxes}</svg></div>`;
}
document.getElementById("process").innerHTML=process.map((x,i)=>`<article class="process-card expandable"><button class="process-main" aria-expanded="false"><div class="step-no">${x[0]}</div><div class="process-copy"><h3>${x[1]}</h3><p>${x[2]}</p></div><code>${x[3]}</code><span class="expand-icon">+</span></button><div class="process-detail"><div class="lesson-intro"><b>Detailed explanation</b><p>${x[4]}</p></div>${flowSvg(x[7])}<div class="lesson-grid"><div><b>Key transaction / app</b><p><code>${x[5]}</code></p></div><div><b>Checks & exam focus</b><p>${x[6]}</p></div></div></div></article>`).join("");
document.querySelectorAll(".process-main").forEach(btn=>btn.addEventListener("click",()=>{const card=btn.closest(".process-card");const open=card.classList.toggle("open");btn.setAttribute("aria-expanded",open);card.querySelector(".expand-icon").textContent=open?"−":"+";}));

document.getElementById("scenarioGrid").innerHTML=scenarios.map(x=>`<article class="scenario-card"><span class="tag">${x[1]}</span><h3>${x[0]}</h3><p>${x[2]}</p><details><summary>Model approach</summary><p>${x[3]}</p></details></article>`).join("");

function renderTcodes(filter=""){document.getElementById("tcodeBody").innerHTML=tcodes.filter(x=>x.join(" ").toLowerCase().includes(filter.toLowerCase())).map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join("");}
renderTcodes();document.getElementById("tcodeFilter").addEventListener("input",e=>renderTcodes(e.target.value));

document.getElementById("qaList").innerHTML=qa.map((x,i)=>`<article class="qa-item"><h3>${i+1}. ${x[0]}</h3><div class="answer">${x[1]}</div></article>`).join("");
document.getElementById("randomQuestion").onclick=()=>{const i=Math.floor(Math.random()*qa.length);document.querySelectorAll(".qa-item")[i].scrollIntoView({behavior:"smooth",block:"center"});document.querySelectorAll(".qa-item")[i].style.outline="2px solid #6d63ff";setTimeout(()=>document.querySelectorAll(".qa-item")[i].style.outline="",1400);};

document.getElementById("grammarList").innerHTML=grammar.map((x,i)=>`<label class="grammar-row"><input type="checkbox" data-grammar="${i}" ${state.grammar[i]?"checked":""}><span>${x}</span></label>`).join("");
document.querySelectorAll("[data-grammar]").forEach(x=>x.addEventListener("change",()=>{state.grammar[x.dataset.grammar]=x.checked;save();}));

const dtzLessons={
 lesen:{title:"Lesen · 5 Aufgabenbereiche",html:`<div class="lesson-grid"><div><b>Was du übst</b><ul><li>Lesen 1: passende Information in Verzeichnissen/Angeboten finden.</li><li>Lesen 2: Anzeigen und kurze Informationen gezielt vergleichen.</li><li>Lesen 3: Presse- oder formelle Mitteilungen verstehen.</li><li>Lesen 4: Informationen aus Broschüren und Alltagstexten entnehmen.</li><li>Lesen 5: einen formellen Brief gezielt lesen und Kernaussagen finden.</li></ul></div><div><b>Strategie</b><ol><li>Aufgabe zuerst lesen.</li><li>Schlüsselwörter markieren.</li><li>Synonyme im Text suchen.</li><li>Nur die verlangte Information beantworten.</li><li>Bei Unsicherheit Textbeleg prüfen.</li></ol></div></div><div class="practice-box"><b>Mini-Übung</b><p><strong>Anzeige:</strong> „Deutschkurs am Abend, Dienstag und Donnerstag, 18:00–20:00 Uhr. Anmeldung bis 5. Oktober.“</p><p><strong>Frage:</strong> Wann findet der Kurs statt?</p><button class="answer-btn" data-answer="Dienstag und Donnerstag von 18:00 bis 20:00 Uhr.">Antwort anzeigen</button><p class="answer-reveal" hidden>Dienstag und Donnerstag von 18:00 bis 20:00 Uhr.</p></div><a class="source-link" target="_blank" rel="noreferrer" href="https://www.goethe.de/de/spr/mig/deu/le1.html">Offizielle Goethe-Übung: Lesen 1 ↗</a>`},
 hoeren:{title:"Hören · 4 Aufgabenbereiche",html:`<div class="lesson-grid"><div><b>Was du übst</b><ul><li>Hören 1: kurze Telefon- oder Lautsprecheransagen.</li><li>Hören 2: Radioinformationen.</li><li>Hören 3: Gespräche.</li><li>Hören 4: einzelne Meinungsäußerungen zu einem Thema.</li></ul></div><div><b>Hörstrategie</b><ol><li>Fragen vor dem Audio lesen.</li><li>Auf Zahlen, Zeiten, Orte und Negationen achten.</li><li>Nicht jedes Wort verstehen müssen.</li><li>Beim ersten Hören die Kernaussage sichern.</li><li>Antwort sofort markieren.</li></ol></div></div><div class="practice-box"><b>Mini-Übung ohne Audio</b><p><strong>Ansage:</strong> „Der Termin am Montag um 10 Uhr fällt aus. Neuer Termin ist Mittwoch um 14 Uhr.“</p><p><strong>Frage:</strong> Wann ist der neue Termin?</p><button class="answer-btn" data-answer="Mittwoch um 14 Uhr.">Antwort anzeigen</button><p class="answer-reveal" hidden>Mittwoch um 14 Uhr.</p></div><a class="source-link" target="_blank" rel="noreferrer" href="https://www.goethe.de/de/spr/mig/deu/hoe.html">Offizielle Goethe-Übung: Hören 1–4 ↗</a>`},
 schreiben:{title:"Schreiben · Kurzmitteilung / formeller Brief",html:`<div class="lesson-grid"><div><b>Aufgabe systematisch lösen</b><ol><li>Anrede passend zur Person wählen.</li><li>Grund des Schreibens klar nennen.</li><li>Alle vorgegebenen Punkte abdecken.</li><li>Eine konkrete Frage oder Bitte formulieren.</li><li>Grußformel und Namen ergänzen.</li></ol></div><div><b>B1-Redemittel</b><ul><li>„Sehr geehrte Frau …,“</li><li>„Leider kann ich … nicht …“</li><li>„Deshalb möchte ich Sie bitten, …“</li><li>„Könnten Sie mir bitte …?“</li><li>„Vielen Dank für Ihr Verständnis.“</li><li>„Mit freundlichen Grüßen“</li></ul></div></div><div class="practice-box"><b>Übungsaufgabe</b><p>Du besuchst einen Deutschkurs und kannst diese Woche nicht kommen. Schreibe an die Lehrerin. Nenne: Grund, Entschuldigung, Hausaufgaben und Rückkehr in den Kurs.</p><p><strong>Checkliste:</strong> 4/4 Punkte abgedeckt · verständliche Sätze · passende Anrede/Schluss · Konnektoren · Verbposition.</p></div><a class="source-link" target="_blank" rel="noreferrer" href="https://www.goethe.de/de/spr/mig/deu/sch.html">Offizielle Goethe-Übung: Schreiben ↗</a>`},
 sprechen:{title:"Sprechen · 3 Bereiche",html:`<div class="lesson-grid"><div><b>Teil 1 · Sich vorstellen</b><p>Sprich über dich, zum Beispiel Name, Herkunft, Wohnort, Arbeit, Familie, Sprachen oder Alltag. Antworte auf Rückfragen möglichst ausführlich.</p><b>Teil 2 · Informationen geben</b><p>Beschreibe ein Bild bzw. eine Situation und nenne relevante Details.</p><b>Teil 3 · Gemeinsam etwas planen</b><p>Mach Vorschläge, reagiere auf den Partner, begründe deine Meinung und finde eine gemeinsame Lösung.</p></div><div><b>Redemittel</b><ul><li>„Auf dem Bild sehe ich …“</li><li>„Ich denke, dass …“</li><li>„Meiner Meinung nach …“</li><li>„Was hältst du davon, wenn …?“</li><li>„Das ist eine gute Idee, aber …“</li><li>„Dann könnten wir uns darauf einigen, dass …“</li></ul></div></div><div class="practice-box"><b>1-Minuten-Sprechübung</b><p>Thema: „Einen Ausflug am Wochenende planen.“</p><p>Formuliere: einen Vorschlag → einen Grund → eine Alternative → eine Rückfrage → eine Einigung.</p><button class="answer-btn" data-answer="Beispiel: Wir könnten am Samstag nach Potsdam fahren, weil das Wetter gut sein soll. Was hältst du davon? Wenn du lieber Sonntag möchtest, können wir Sonntag fahren. Dann treffen wir uns um 9 Uhr am Bahnhof.">Beispiel anzeigen</button><p class="answer-reveal" hidden>Beispiel: Wir könnten am Samstag nach Potsdam fahren, weil das Wetter gut sein soll. Was hältst du davon? Wenn du lieber Sonntag möchtest, können wir Sonntag fahren. Dann treffen wir uns um 9 Uhr am Bahnhof.</p></div><a class="source-link" target="_blank" rel="noreferrer" href="https://www.goethe.de/de/spr/mig/deu/sp1.html">Offizielle Goethe-Übung: Sprechen 1 ↗</a>`},
 wortschatz:{title:"Wortschatz · Alltag und Beruf",html:`<div class="vocab-grid"><div><b>Ämter</b><span>Antrag · Termin · Formular · Bescheid · Frist</span></div><div><b>Arbeit</b><span>Bewerbung · Lebenslauf · Vorstellungsgespräch · Vertrag · Arbeitszeit</span></div><div><b>Wohnen</b><span>Miete · Nebenkosten · Vermieter · Wohnung · Umzug</span></div><div><b>Gesundheit</b><span>Termin · Rezept · Untersuchung · Apotheke · Krankmeldung</span></div><div><b>Mobilität</b><span>Fahrkarte · Verspätung · Umsteigen · Haltestelle · Verbindung</span></div><div><b>Bank & Versicherung</b><span>Konto · Überweisung · Beitrag · Versicherung · Schaden</span></div></div><div class="practice-box"><b>Aktiv lernen</b><p>Schreibe zu fünf Wörtern je einen eigenen B1-Satz. Danach sprich die Sätze laut und ersetze jeweils ein Verb oder Adjektiv durch ein Synonym.</p></div><a class="source-link" target="_blank" rel="noreferrer" href="https://www.goethe.de/de/spr/mig/deu.html">Offizielle DTZ-Wortliste und Modellsatz ↗</a>`},
 grammatik:{title:"Grammatik · B1-Kernstrukturen",html:`<div class="grammar-detail"><div><b>Nebensätze</b><p>„Ich bleibe zu Hause, <strong>weil</strong> ich krank bin.“ Verb am Ende.</p></div><div><b>Konjunktiv II</b><p>„<strong>Könnten</strong> Sie mir bitte helfen?“ · „Ich <strong>würde</strong> gern …“</p></div><div><b>Perfekt / Präteritum</b><p>„Ich <strong>habe gearbeitet</strong>.“ · „Ich <strong>war</strong> gestern krank.“</p></div><div><b>Dativ / Akkusativ</b><p>„Ich gebe <strong>dem Mann</strong> den Schlüssel.“</p></div><div><b>Relativsatz</b><p>„Das ist die Kollegin, <strong>die</strong> mir geholfen hat.“</p></div><div><b>Passiv</b><p>„Der Antrag <strong>wird geprüft</strong>.“</p></div><div><b>Konnektoren</b><p>deshalb · trotzdem · außerdem · obwohl · nachdem · bevor</p></div><div><b>zu + Infinitiv</b><p>„Ich versuche, jeden Tag <strong>zu lernen</strong>.“</p></div></div><div class="practice-box"><b>Mini-Grammatiktest</b><p>1. Ich bleibe zu Hause, ___ ich krank bin. <strong>weil</strong></p><p>2. Könnten Sie mir bitte ___? <strong>helfen</strong></p><p>3. Der Antrag ___ morgen geprüft. <strong>wird</strong></p></div><a class="source-link" target="_blank" rel="noreferrer" href="https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick">g.a.s.t. · DTZ Aufbau, Anforderungen und Bewertung ↗</a>`}
};

function openDtz(key){
 const lesson=dtzLessons[key];
 if(!lesson)return;
 const panel=document.getElementById("dtzPractice");
 document.getElementById("dtzPracticeTitle").textContent=lesson.title;
 document.getElementById("dtzPracticeBody").innerHTML=lesson.html;
 panel.hidden=false;
 panel.scrollIntoView({behavior:"smooth",block:"start"});
 document.querySelectorAll(".answer-btn").forEach(btn=>btn.addEventListener("click",()=>{const r=btn.nextElementSibling;r.hidden=!r.hidden;btn.textContent=r.hidden?"Antwort anzeigen":"Antwort ausblenden";}));
}
document.querySelectorAll("[data-dtz]").forEach(btn=>btn.addEventListener("click",()=>openDtz(btn.dataset.dtz)));
document.getElementById("closeDtzPractice").addEventListener("click",()=>{document.getElementById("dtzPractice").hidden=true;});

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
