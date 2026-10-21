"""Transparent educational screening rules; no legal or regulatory certification."""
RULES = [
    {"id":"loto","title":"Energy isolation / lockout-tagout","severity":"CRITICAL","terms":["lockout","tagout","loto","energy isolation"],"description":"No energy isolation or lockout-tagout topic was detected in the extracted text.","action":"Document equipment-specific energy sources, isolation points, lock/tag steps, and verification before servicing."},
    {"id":"ppe","title":"Personal protective equipment","severity":"MAJOR","terms":["personal protective equipment","ppe","safety glasses","protective gloves"],"description":"No personal protective equipment requirements were detected.","action":"Specify task hazards, required protective equipment, selection, use, and replacement requirements."},
    {"id":"emergency","title":"Emergency response and evacuation","severity":"CRITICAL","terms":["emergency response","evacuation","emergency procedure","assembly point"],"description":"No emergency response or evacuation information was detected.","action":"Add emergency contacts, alarm/evacuation steps, routes, assembly points, and accountability procedures."},
    {"id":"hazcom","title":"Hazard communication / safety data sheets","severity":"MAJOR","terms":["safety data sheet","sds","hazard communication","chemical hazard"],"description":"No hazard communication or Safety Data Sheet reference was detected.","action":"Identify hazardous substances, ensure accessible current Safety Data Sheets, and explain safe handling and labeling."},
    {"id":"training","title":"Safety training","severity":"MAJOR","terms":["safety training","trained personnel","training records","operator training"],"description":"No safety training or competency requirement was detected.","action":"Specify required training, competency checks, refresher timing, and how completion is recorded."},
    {"id":"inspection","title":"Inspection and maintenance records","severity":"MINOR","terms":["inspection","maintenance records","inspection log","preventive maintenance"],"description":"No inspection or maintenance record topic was detected.","action":"Define inspection frequency, responsible roles, defect escalation, and record retention."},
    {"id":"revision","title":"Document version and review control","severity":"MINOR","terms":["revision","review date","version","approved by"],"description":"No document revision or review control was detected.","action":"Add document owner, version, approval, revision history, and next review date."},
]

def analyze(text: str):
    normalized = " ".join(text.lower().split())
    findings = []
    for rule in RULES:
        matched = next((term for term in rule["terms"] if term in normalized), None)
        if not matched:
            findings.append({"rule_id":rule["id"],"title":rule["title"],"severity":rule["severity"],"reference":"Internal demo rule","description":rule["description"],"evidence":"No matching topic phrase found in extracted document text.","remediation":rule["action"]})
    score = round((len(RULES) - len(findings)) * 100 / len(RULES))
    counts = {s:sum(1 for f in findings if f["severity"] == s) for s in ("CRITICAL","MAJOR","MINOR")}
    summary = f"Screened {len(RULES)} demo checks; detected {len(RULES)-len(findings)} covered topics and {len(findings)} potential gaps. Human review is required."
    return score, findings, counts, summary
