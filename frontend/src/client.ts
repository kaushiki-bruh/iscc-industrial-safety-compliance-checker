import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import * as mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

GlobalWorkerOptions.workerSrc = pdfWorker;

export type Finding={rule_id:string;title:string;severity:'CRITICAL'|'MAJOR'|'MINOR';reference:string;description:string;evidence:string;remediation:string};
export type Audit={id:string;name:string;created_at:string;score:number;summary:string;counts:Record<string,number>;findings:Finding[];chars:number;pages:number};
export type Rule={id:string;title:string;severity:string;description:string;action:string;reference:string};

type InternalRule=Rule&{terms:string[]};
export const RULES:InternalRule[]=[
 {id:'loto',title:'Energy isolation / lockout-tagout',severity:'CRITICAL',terms:['lockout','tagout','loto','energy isolation'],description:'No energy isolation or lockout-tagout topic was detected in the extracted text.',action:'Document equipment-specific energy sources, isolation points, lock/tag steps, and verification before servicing.',reference:'Internal demo rule'},
 {id:'ppe',title:'Personal protective equipment',severity:'MAJOR',terms:['personal protective equipment','ppe','safety glasses','protective gloves'],description:'No personal protective equipment requirements were detected.',action:'Specify task hazards, required protective equipment, selection, use, and replacement requirements.',reference:'Internal demo rule'},
 {id:'emergency',title:'Emergency response and evacuation',severity:'CRITICAL',terms:['emergency response','evacuation','emergency procedure','assembly point'],description:'No emergency response or evacuation information was detected.',action:'Add emergency contacts, alarm/evacuation steps, routes, assembly points, and accountability procedures.',reference:'Internal demo rule'},
 {id:'hazcom',title:'Hazard communication / safety data sheets',severity:'MAJOR',terms:['safety data sheet','sds','hazard communication','chemical hazard'],description:'No hazard communication or Safety Data Sheet reference was detected.',action:'Identify hazardous substances, ensure accessible current Safety Data Sheets, and explain safe handling and labeling.',reference:'Internal demo rule'},
 {id:'training',title:'Safety training',severity:'MAJOR',terms:['safety training','trained personnel','training records','operator training'],description:'No safety training or competency requirement was detected.',action:'Specify required training, competency checks, refresher timing, and how completion is recorded.',reference:'Internal demo rule'},
 {id:'inspection',title:'Inspection and maintenance records',severity:'MINOR',terms:['inspection','maintenance records','inspection log','preventive maintenance'],description:'No inspection or maintenance record topic was detected.',action:'Define inspection frequency, responsible roles, defect escalation, and record retention.',reference:'Internal demo rule'},
 {id:'revision',title:'Document version and review control',severity:'MINOR',terms:['revision','review date','version','approved by'],description:'No document revision or review control was detected.',action:'Add document owner, version, approval, revision history, and next review date.',reference:'Internal demo rule'}
];

const HISTORY_KEY='iscc-audit-history-v1';
export function loadHistory():Audit[]{try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}catch{return []}}
export function saveHistory(items:Audit[]){localStorage.setItem(HISTORY_KEY,JSON.stringify(items))}

export async function analyzeDocument(file:File):Promise<Audit>{
 const bytes=await file.arrayBuffer(); let text=''; let pages=0;
 if(file.name.toLowerCase().endsWith('.pdf')){
  const pdf=await getDocument({data:new Uint8Array(bytes)}).promise; pages=pdf.numPages; const extracted:string[]=[];
  for(let i=1;i<=pages;i++){const page=await pdf.getPage(i);const content=await page.getTextContent();extracted.push(content.items.map(item=>'str' in item?item.str:'').join(' '));}
  text=extracted.join('\n');
 }else if(file.name.toLowerCase().endsWith('.docx')){
  text=(await mammoth.extractRawText({arrayBuffer:bytes})).value;
 }else throw new Error('Choose a PDF or DOCX document.');
 if(!text.trim())throw new Error('No extractable text was found. Scanned PDFs need OCR, which this demo does not include.');
 const normalized=text.toLowerCase().replace(/\s+/g,' ');
 const findings:Finding[]=RULES.flatMap(rule=>{
  const terms=rule.terms;
  if(terms.some(term=>normalized.includes(term)))return [];
  return [{rule_id:rule.id,title:rule.title,severity:rule.severity as Finding['severity'],reference:rule.reference,description:rule.description,evidence:'No matching topic phrase found in the extracted document text.',remediation:rule.action}];
 });
 const score=Math.round((RULES.length-findings.length)*100/RULES.length);
 const counts=Object.fromEntries(['CRITICAL','MAJOR','MINOR'].map(s=>[s,findings.filter(f=>f.severity===s).length]));
 return {id:crypto.randomUUID(),name:file.name,created_at:new Date().toISOString(),score,summary:`Screened ${RULES.length} demo checks; detected ${RULES.length-findings.length} covered topics and ${findings.length} potential gaps. Human review is required.`,counts,findings,chars:text.length,pages};
}

export function downloadReport(audit:Audit){
 const pdf=new jsPDF(); let y=18; const width=180;
 const add=(value:string,size=10,bold=false)=>{pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);const lines=pdf.splitTextToSize(value,width);if(y+lines.length*(size*.5+2)>278){pdf.addPage();y=18;}pdf.text(lines,15,y);y+=lines.length*(size*.5+2)+3;};
 add('ISCC — Industrial Safety Compliance Checker',16,true);add('Educational demo screening report',12,true);add(`Document: ${audit.name}`);add(`Analyzed: ${new Date(audit.created_at).toLocaleString()}`);add(`Demo score: ${audit.score}% (${RULES.length-audit.findings.length} of ${RULES.length} demo checks matched)`);add(audit.summary);y+=3;
 for(const severity of ['CRITICAL','MAJOR','MINOR'] as const)for(const f of audit.findings.filter(x=>x.severity===severity)){add(`${severity} — ${f.title}`,12,true);add(f.description);add(`Evidence: ${f.evidence}`);add(`Suggested action: ${f.remediation}`);y+=3;}
 add('Disclaimer: This educational screening uses simple phrase matching. It is not AI, legal advice, comprehensive regulatory validation, or official certification. Results may be incomplete or incorrect and require qualified human review.',9);
 pdf.save(`ISCC_${audit.id.slice(0,8)}_report.pdf`);
}
