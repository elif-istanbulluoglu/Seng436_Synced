// ISO Detective — game data
// All ISO/IEC 29119-4 technique definitions + 3 cases.

const TECHNIQUES = {
  // Black-Box
  "equivalence-partitioning": {
    id: "equivalence-partitioning",
    name: "Equivalence Partitioning",
    short: "EP",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.2",
    definition: "Divides the input domain into partitions where all values in a partition are expected to behave equivalently. Tests one representative value from each partition — both valid AND invalid.",
    when: "Input has definable ranges, categories, or groups.",
    mistake: "Testing only valid inputs and ignoring invalid partitions.",
  },
  "boundary-value-analysis": {
    id: "boundary-value-analysis",
    name: "Boundary Value Analysis",
    short: "BVA",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.3",
    definition: "Tests the values at and immediately around the edges of equivalence partitions: min−1, min, min+1, nominal, max−1, max, max+1.",
    when: "Always paired with Equivalence Partitioning.",
    mistake: "Testing the middle of a range but never the edges where defects cluster.",
  },
  "decision-table": {
    id: "decision-table",
    name: "Decision Table Testing",
    short: "DT",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.5",
    definition: "Models complex business logic as combinations of conditions and resulting actions in a tabular format. Each column is a test case.",
    when: "Multiple conditions interact to produce different outcomes.",
    mistake: "Testing conditions individually, not in combination.",
  },
  "state-transition": {
    id: "state-transition",
    name: "State Transition Testing",
    short: "ST",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.6",
    definition: "Tests behavior as the system transitions between defined states based on events. Covers valid, invalid, and impossible transitions.",
    when: "System has distinct states (active, suspended, pending, frozen).",
    mistake: "Testing only the active state; never testing transitions out of edge states.",
  },
  "cause-effect": {
    id: "cause-effect",
    name: "Cause-Effect Graphing",
    short: "CEG",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.7",
    definition: "Identifies cause-effect relationships between inputs and outputs as a boolean graph, then converts them into a decision table.",
    when: "Complex systems with many interacting inputs producing different outputs.",
    mistake: "Listing causes and effects but never modelling their interaction.",
  },
  "pairwise": {
    id: "pairwise",
    name: "Pairwise Testing",
    short: "All-Pairs",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.4",
    definition: "Tests every possible pair of parameter values at least once. Most defects are caused by interactions of at most two parameters.",
    when: "Many input parameters; full combinatorial testing is impractical.",
    mistake: "Testing each parameter individually but never in combination.",
  },
  "classification-tree": {
    id: "classification-tree",
    name: "Classification Tree Method",
    short: "CTM",
    category: "Black-Box",
    iso: "ISO/IEC 29119-4 §5.2.8",
    definition: "Organizes input parameters into a tree of classifications and classes, then systematically combines leaf nodes to generate test cases.",
    when: "Complex input domains with multiple classification dimensions.",
    mistake: "Leaving entire branches unexplored.",
  },

  // White-Box
  "statement-testing": {
    id: "statement-testing",
    name: "Statement Testing",
    short: "STM",
    category: "White-Box",
    iso: "ISO/IEC 29119-4 §5.3.2",
    definition: "Designs tests so every executable statement runs at least once. Measured as statement coverage percent.",
    when: "Minimum coverage requirement for unit testing.",
    mistake: "Accepting low coverage (<60%) as adequate.",
  },
  "branch-testing": {
    id: "branch-testing",
    name: "Branch Testing",
    short: "BT",
    category: "White-Box",
    iso: "ISO/IEC 29119-4 §5.3.3",
    definition: "Designs tests to execute every branch (true and false) from every decision point. Subsumes statement coverage.",
    when: "Code contains if/else, switch, loops.",
    mistake: "Testing only the 'true' path of every condition.",
  },
  "condition-testing": {
    id: "condition-testing",
    name: "Condition Testing",
    short: "CT",
    category: "White-Box",
    iso: "ISO/IEC 29119-4 §5.3.4",
    definition: "Designs tests so each individual condition in a compound boolean expression evaluates to both true and false at least once.",
    when: "Expressions combine multiple operands with &&, ||, !.",
    mistake: "Treating a compound expression as a single condition.",
  },
  "mcdc": {
    id: "mcdc",
    name: "Modified Condition / Decision Coverage",
    short: "MC/DC",
    category: "White-Box",
    iso: "ISO/IEC 29119-4 §5.3.5",
    definition: "Each condition in a decision must independently affect the outcome. Required for safety-critical systems (DO-178C, IEC 61508).",
    when: "Aerospace, medical, automotive safety-critical software.",
    mistake: "Picking combinations that don't isolate individual condition impact.",
  },
  "path-testing": {
    id: "path-testing",
    name: "Path Testing",
    short: "PT",
    category: "White-Box",
    iso: "ISO/IEC 29119-4 §5.3.6",
    definition: "Designs tests to execute every possible path from entry to exit of a code unit. Most stringent structural technique.",
    when: "Critical algorithms where all execution paths must be verified.",
    mistake: "Stopping at branch coverage and assuming paths are covered.",
  },

  // Experience-Based
  "error-guessing": {
    id: "error-guessing",
    name: "Error Guessing",
    short: "EG",
    category: "Experience-Based",
    iso: "ISO/IEC 29119-4 §5.4.2",
    definition: "Uses tester experience and fault taxonomies to predict likely defects and design targeted tests.",
    when: "Supplement to specification-based testing; tester has domain knowledge.",
    mistake: "Dismissing 'rare' scenarios that are classic failure points.",
  },
  "exploratory": {
    id: "exploratory",
    name: "Exploratory Testing",
    short: "ET",
    category: "Experience-Based",
    iso: "ISO/IEC 29119-4 §5.4.3",
    definition: "Simultaneous learning, test design, and execution. Tester works to a charter, time-boxed, with notes. Not unstructured clicking.",
    when: "System poorly understood, scripted tests insufficient, rapid feedback needed.",
    mistake: "Confusing exploratory testing with ad-hoc clicking around.",
  },
  "checklist-based": {
    id: "checklist-based",
    name: "Checklist-Based Testing",
    short: "CBT",
    category: "Experience-Based",
    iso: "ISO/IEC 29119-4 §5.4.4",
    definition: "Uses a pre-defined list of conditions, attributes, or questions to guide testing. Encodes organizational experience.",
    when: "Regression testing, UI consistency, compliance verification.",
    mistake: "Treating a checklist as exhaustive.",
  },
};

const CASES = [
  // ============ CASE 1 ============
  {
    id: "techbank",
    code: "TB-2024",
    title: "The TechBank Transfer Collapse",
    company: "TechBank Payments Ltd.",
    incidentDate: "2024-11-15",
    severity: "CRITICAL",
    affectedUsers: 847,
    sceneStyle: "isometric-office",
    teaching: "Black-Box techniques — how specification-derived tests prevent financial logic errors.",
    summary: "On November 15th at 02:14, the overnight batch began processing transfers. Eight hours later, 847 customers had funds drained from accounts that should have been frozen, locked, or never permitted to transfer. The dev team called it a one-in-a-million race condition. The audit log calls it something else.",
    hook: "The bank's lead tester swears they ran every test on the plan. The plan is the problem.",
    techniques: [
      "equivalence-partitioning", "boundary-value-analysis", "decision-table",
      "state-transition", "branch-testing", "statement-testing",
      "exploratory", "error-guessing"
    ],
    hotspots: [
      {
        id: "TB-1", x: 18, y: 62, label: "Test Plan binder",
        evidence: {
          title: "Test Plan v3.2 — TechBank Transfer Module",
          body: "12 test cases. Inputs: 100 TL, 500 TL, 1,000 TL, 5,000 TL. All within the 1–10,000 TL valid range. No invalid inputs documented. No negatives, no zero, no over-limit. Sign-off date: yesterday.",
          isoRef: TECHNIQUES["equivalence-partitioning"].iso, category: "Black-Box",
        },
        correct: "equivalence-partitioning",
        traps: { "boundary-value-analysis": "Close — but the issue here isn't edge values, it's that entire invalid input partitions (negative, zero, over-limit) were never tested at all.", "exploratory": "An exploratory session might have caught it, but the specification-derived gap is partitioning." },
      },
      {
        id: "TB-2", x: 42, y: 28, label: "Whiteboard with limits",
        evidence: {
          title: "Whiteboard: 'Transfer cap = 10,000 TL'",
          body: "A scrawled limit. Tested values: 5,000 and 8,000. Never 9,999. Never 10,000. Never 10,001. The customer who lost 12,400 TL hit exactly the kind of value nobody bothered with.",
          isoRef: TECHNIQUES["boundary-value-analysis"].iso, category: "Black-Box",
        },
        correct: "boundary-value-analysis",
        traps: { "equivalence-partitioning": "EP would say 'pick a value in the partition' — but the failure is specifically at the edge. That's BVA territory.", "statement-testing": "Coverage matters, but this is about input edges, not code execution." },
      },
      {
        id: "TB-3", x: 64, y: 71, label: "Slack message printout",
        evidence: {
          title: "#qa-team — 14:02",
          body: "@lead: 'Suspended accounts shouldn't be able to initiate transfers, but they're an edge case. Skip for v3.2.' Eight months later, 211 of the 847 affected accounts were SUSPENDED at the time of transfer.",
          isoRef: TECHNIQUES["state-transition"].iso, category: "Black-Box",
        },
        correct: "state-transition",
        traps: { "decision-table": "Close — a decision table involving account state would help, but the missing concept is the transition itself: SUSPENDED → TRANSFER should be invalid.", "error-guessing": "An experienced tester would guess this, but the formal technique that catches it is State Transition." },
      },
      {
        id: "TB-4", x: 78, y: 42, label: "Test case spreadsheet",
        evidence: {
          title: "test_cases_final.xlsx — 12 rows",
          body: "Each row tests ONE condition: 'authenticated user', 'sufficient balance', 'within limit', 'recipient valid'. None test combinations. Authentication + suspended + over-limit + foreign recipient was never a row.",
          isoRef: TECHNIQUES["decision-table"].iso, category: "Black-Box",
        },
        correct: "decision-table",
        traps: { "pairwise": "Pairwise needs many parameters; here the four interlocking business rules call for a decision table.", "equivalence-partitioning": "EP partitions inputs; here the gap is interaction between conditions." },
      },
      {
        id: "TB-5", x: 28, y: 38, label: "Requirements doc — TBD",
        evidence: {
          title: "REQ-417: Currency conversion logic",
          body: "Foreign currency handling: 'TBD'. Code shipped with `if (isForeign) convert();` — but the FALSE branch (the domestic path) was the only one ever exercised in test. The TRUE branch had a sign error.",
          isoRef: TECHNIQUES["branch-testing"].iso, category: "White-Box",
        },
        correct: "branch-testing",
        traps: { "statement-testing": "Statement coverage might hit one branch and call it done — branch testing forces both true and false outcomes.", "condition-testing": "Condition testing splits compound booleans; this is a single boolean with an untested branch." },
      },
      {
        id: "TB-6", x: 8, y: 22, label: "Coverage report",
        evidence: {
          title: "coverage-report.html",
          body: "Statement coverage: 34%. Three modules show zero executed lines: fraud_check.js, audit_trail.js, currency_convert.js. The fraud module never fired in any test.",
          isoRef: TECHNIQUES["statement-testing"].iso, category: "White-Box",
        },
        correct: "statement-testing",
        traps: { "branch-testing": "Branch goes deeper, but the headline failure is that two-thirds of statements never ran at all.", "path-testing": "Path testing presumes statements execute first." },
      },
      {
        id: "TB-7", x: 56, y: 18, label: "Wall calendar",
        evidence: {
          title: "Sprint 14 calendar",
          body: "Two weeks of dailies. Three days of regression. Zero hours allocated to charter-driven exploration. The QA lead's last note: 'No bandwidth for ET this sprint.'",
          isoRef: TECHNIQUES["exploratory"].iso, category: "Experience-Based",
        },
        correct: "exploratory",
        traps: { "checklist-based": "Checklists are useful, but the missing activity here is open-ended charter-driven investigation.", "error-guessing": "Error guessing is targeted; this gap is exploratory time itself." },
      },
      {
        id: "TB-8", x: 88, y: 78, label: "Yellow post-it",
        evidence: {
          title: "Post-it on monitor",
          body: "Handwritten: 'Concurrent transfers are rare, skip.' Any banking tester with a scar knows: concurrency, timezone rollovers, and session overlap are the first three places defects hide.",
          isoRef: TECHNIQUES["error-guessing"].iso, category: "Experience-Based",
        },
        correct: "error-guessing",
        traps: { "exploratory": "ET investigates; error guessing applies a fault taxonomy to known failure patterns like concurrency.", "pairwise": "Pairwise covers parameter combinations, not concurrency hazards." },
      },
    ],
  },

  // ============ CASE 2 ============
  {
    id: "medsoft",
    code: "MS-2025",
    title: "The MedSoft Dosage Disaster",
    company: "MedSoft Clinical Systems",
    incidentDate: "2025-02-08",
    severity: "CRITICAL",
    affectedUsers: 1340,
    sceneStyle: "topdown-hospital",
    teaching: "Advanced Black-Box — combinatorial and structured input techniques.",
    summary: "A pediatric ward calculator approved a 47mg dose of a drug whose ceiling is 5mg. The patient survived. Three others did not — their cases trace back over six weeks of approvals nobody flagged. Hospital legal is on line two.",
    hook: "There's a test matrix on the wall. It looks thorough. It is not.",
    techniques: [
      "equivalence-partitioning", "boundary-value-analysis", "pairwise",
      "classification-tree", "cause-effect", "checklist-based",
      "branch-testing", "state-transition", "exploratory", "error-guessing",
    ],
    hotspots: [
      {
        id: "MS-1", x: 16, y: 30, label: "Dosage input form",
        evidence: {
          title: "Screenshot: dosage entry UI",
          body: "Tested range: 0.5mg–5mg, valid only. Invalid partitions (negative, zero, over-ceiling, non-numeric) were never entered. The 47mg approval came from a paste from a CSV.",
          isoRef: TECHNIQUES["equivalence-partitioning"].iso, category: "Black-Box",
        },
        correct: "equivalence-partitioning",
        traps: { "boundary-value-analysis": "BVA tests edges — here even the invalid PARTITION is missing entirely.", "checklist-based": "A checklist would help, but the formal gap is partitioning." },
      },
      {
        id: "MS-2", x: 38, y: 64, label: "Patient weight field",
        evidence: {
          title: "Field spec: patient_weight_kg",
          body: "Specified range 0.5–250 kg. Test data used 12kg, 60kg, 80kg. Edges (0.5, 0.4, 250.0, 250.1) never tried. A neonate at 0.7kg received an adult-scaled dose.",
          isoRef: TECHNIQUES["boundary-value-analysis"].iso, category: "Black-Box",
        },
        correct: "boundary-value-analysis",
        traps: { "equivalence-partitioning": "Partitions exist — the failure is at the boundary of them.", "classification-tree": "CTM organizes dimensions; the specific failure is a boundary." },
      },
      {
        id: "MS-3", x: 60, y: 22, label: "Test matrix on wall",
        evidence: {
          title: "drug_combo_matrix.xlsx",
          body: "8 drugs × 5 routes × 5 weight bands × not-quite-everything = 200+ combinations. Only 15 tested. Pairwise would have covered all pairs in roughly 25 cases.",
          isoRef: TECHNIQUES["pairwise"].iso, category: "Black-Box",
        },
        correct: "pairwise",
        traps: { "classification-tree": "CTM organizes the parameters; pairwise generates the actual minimal coverage set.", "decision-table": "Decision tables don't reduce combinatorial blowup — pairwise does." },
      },
      {
        id: "MS-4", x: 80, y: 56, label: "Classification chart",
        evidence: {
          title: "Patient classification tree",
          body: "Root: Patient. Branches: Age (Neonate/Pediatric/Adult/Geriatric), Weight, Diagnosis, Allergies. Three leaves of the Allergies branch had no test cases assigned.",
          isoRef: TECHNIQUES["classification-tree"].iso, category: "Black-Box",
        },
        correct: "classification-tree",
        traps: { "pairwise": "Pairwise comes after the tree exists; the failure here is incomplete tree branches.", "decision-table": "DT models conditions; CTM organizes the parameter space itself." },
      },
      {
        id: "MS-5", x: 26, y: 82, label: "Cause-Effect notes",
        evidence: {
          title: "Causes: allergy_flag, dosage_high, route_iv. Effects: warn, block, audit.",
          body: "Causes and effects are listed. The graph relating them — 'allergy AND high-dose IMPLIES block' — was never drawn. The interaction wasn't modelled, so it wasn't tested.",
          isoRef: TECHNIQUES["cause-effect"].iso, category: "Black-Box",
        },
        correct: "cause-effect",
        traps: { "decision-table": "A decision table is the OUTPUT of a cause-effect graph — but the missing step here is the graph itself.", "pairwise": "Pairwise covers parameter pairs, not logical implications." },
      },
      {
        id: "MS-6", x: 50, y: 44, label: "Sign-off email",
        evidence: {
          title: "RE: v4.1 release sign-off",
          body: "'Looks good — ship it.' No checklist attached. No reference to the regulatory-approved release checklist that includes 'verify allergy interlock fired in last 5 builds.' Three of those builds had silent failures.",
          isoRef: TECHNIQUES["checklist-based"].iso, category: "Experience-Based",
        },
        correct: "checklist-based",
        traps: { "exploratory": "Exploratory is open-ended; the missing artefact here is a structured organizational checklist.", "error-guessing": "Error guessing is intuition; checklists encode it." },
      },
      {
        id: "MS-7", x: 72, y: 86, label: "Defect log printout",
        evidence: {
          title: "Defect log — June",
          body: "Forty-one duplicate bugs filed against the same untested allergy-interlock path. Every one closed as 'cannot reproduce.' The path was never executed by any test.",
          isoRef: TECHNIQUES["branch-testing"].iso, category: "White-Box",
        },
        correct: "branch-testing",
        traps: { "statement-testing": "Statements may have run via the surrounding code; the specific BRANCH didn't.", "path-testing": "Path testing is broader; the headline gap is one untaken branch." },
      },
      {
        id: "MS-8", x: 92, y: 32, label: "Nurse complaint",
        evidence: {
          title: "Incident form #IF-2284",
          body: "'System accepted -5mg, calculator returned positive 5.' The negative-input boundary (just below zero) was never on anyone's list.",
          isoRef: TECHNIQUES["boundary-value-analysis"].iso, category: "Black-Box",
        },
        correct: "boundary-value-analysis",
        traps: { "equivalence-partitioning": "The invalid partition wasn't tested either, but the specific defect is at -0.01 / 0 / +0.01 — pure BVA.", "error-guessing": "An experienced tester might guess it; BVA is the formal way to ensure it." },
      },
      {
        id: "MS-9", x: 12, y: 70, label: "Architecture diagram",
        evidence: {
          title: "deployment_diagram.pdf",
          body: "The allergy-check microservice has a 'bypass_in_test' flag. It was true in staging. The test environment never executed the real allergy-check branch, so it was never wrong — until prod.",
          isoRef: TECHNIQUES["state-transition"].iso, category: "Black-Box",
        },
        correct: "state-transition",
        traps: { "branch-testing": "A branch was bypassed, but the systemic issue is the test ENVIRONMENT being in a different state than prod.", "checklist-based": "A checklist could have flagged the flag; ST formalizes the state difference." },
      },
      {
        id: "MS-10", x: 46, y: 12, label: "Post-mortem notes",
        evidence: {
          title: "post-mortem_notes.md",
          body: "'No session-based testing chartered for v4.1. No exploratory window in the schedule. Risks accepted by PM, no signature on file.'",
          isoRef: TECHNIQUES["exploratory"].iso, category: "Experience-Based",
        },
        correct: "exploratory",
        traps: { "error-guessing": "Error guessing is one tactic; the missing PRACTICE is chartered exploratory sessions.", "checklist-based": "Checklists complement exploratory; they don't replace it." },
      },
    ],
  },

  // ============ CASE 3 ============
  {
    id: "aeronav",
    code: "AN-2025",
    title: "The AeroNav GPS Ghost",
    company: "AeroNav Avionics, Inc.",
    incidentDate: "2025-08-22",
    severity: "HIGH",
    affectedUsers: 23,
    sceneStyle: "noir-poster",
    teaching: "White-Box techniques — structural coverage for safety-critical systems.",
    summary: "Twenty-three commercial flights received corrupted geofence data. None crashed. Two diverted. The black-box recordings show the same line of code firing differently across identical conditions. The cert paperwork claims DO-178C compliance. The git history says otherwise.",
    hook: "The avionics binder is thick. The MC/DC matrix inside is empty.",
    techniques: [
      "statement-testing", "branch-testing", "condition-testing",
      "mcdc", "path-testing", "boundary-value-analysis",
      "checklist-based", "error-guessing",
    ],
    hotspots: [
      {
        id: "AN-1", x: 18, y: 28, label: "Code printout — dead block",
        evidence: {
          title: "nav_resolver.c — lines 412–448",
          body: "An entire `else if (gps_mode == BACKUP_INERTIAL)` block has zero hits in the coverage report. It was reached in flight only. The defect lived in those 36 lines.",
          isoRef: TECHNIQUES["statement-testing"].iso, category: "White-Box",
        },
        correct: "statement-testing",
        traps: { "branch-testing": "Branches require statements to exist in the test in the first place — these never executed.", "path-testing": "Path testing is downstream of statement coverage." },
      },
      {
        id: "AN-2", x: 42, y: 56, label: "Flowchart — false branch",
        evidence: {
          title: "logic flowchart, sticky-noted",
          body: "`if (geofence_active)` — the TRUE branch has 11 tests. The FALSE branch has none. The geofence-disabled path was the one that misfired.",
          isoRef: TECHNIQUES["branch-testing"].iso, category: "White-Box",
        },
        correct: "branch-testing",
        traps: { "statement-testing": "Statements ran via the true branch — the false branch was the gap.", "condition-testing": "Single boolean — branch coverage is the right level." },
      },
      {
        id: "AN-3", x: 64, y: 24, label: "Whiteboard: boolean expr",
        evidence: {
          title: "(altitude > 1000 && !warning_active)",
          body: "Tested when both true. Tested when both false. Never tested with altitude=1500 AND warning_active=true. The compound never split.",
          isoRef: TECHNIQUES["condition-testing"].iso, category: "White-Box",
        },
        correct: "condition-testing",
        traps: { "branch-testing": "Branch coverage might pass with two tests — condition coverage demands each operand vary independently.", "mcdc": "MC/DC adds an INDEPENDENCE proof on top; the more basic gap here is condition coverage." },
      },
      {
        id: "AN-4", x: 80, y: 60, label: "Avionics binder — empty matrix",
        evidence: {
          title: "DO-178C MC/DC verification matrix",
          body: "The matrix is printed. Every cell is blank. Each condition in the safety-critical decision must be shown to independently affect the outcome — none were.",
          isoRef: TECHNIQUES["mcdc"].iso, category: "White-Box",
        },
        correct: "mcdc",
        traps: { "condition-testing": "Condition coverage is necessary but not sufficient for safety-critical — DO-178C demands MC/DC.", "branch-testing": "Branch coverage is two tests; MC/DC is the regulator's bar." },
      },
      {
        id: "AN-5", x: 28, y: 80, label: "Git blame screen",
        evidence: {
          title: "git blame: nav_path.c",
          body: "Comment from a contractor: '// only tested on sunny-weather sim path'. There are eleven sequenced operations between entry and exit; only one path through them was exercised end-to-end.",
          isoRef: TECHNIQUES["path-testing"].iso, category: "White-Box",
        },
        correct: "path-testing",
        traps: { "branch-testing": "Each branch may have been hit individually — the SEQUENCE of branches forming a path was not.", "statement-testing": "Statements ran; the combination didn't." },
      },
      {
        id: "AN-6", x: 52, y: 38, label: "Unit test file",
        evidence: {
          title: "test_geofence.spec.js",
          body: "Twelve `it()` blocks. Twelve assertions. All twelve traverse the same execution path through the same nominal inputs. Zero variety.",
          isoRef: TECHNIQUES["path-testing"].iso, category: "White-Box",
        },
        correct: "path-testing",
        traps: { "branch-testing": "Branch coverage might pass — but the SAME branch combination keeps repeating. Path testing forces variety.", "statement-testing": "Statements may show 100%; paths are the deeper measure." },
      },
      {
        id: "AN-7", x: 74, y: 76, label: "DO-178C cert doc",
        evidence: {
          title: "DO-178C §6.4.4.2 — highlighted in red",
          body: "'Modified Condition/Decision Coverage shall be achieved for Level A software.' Underlined twice. The lead engineer initialed it. The matrix above is still empty.",
          isoRef: TECHNIQUES["checklist-based"].iso, category: "Experience-Based",
        },
        correct: "checklist-based",
        traps: { "mcdc": "MC/DC is what was missed; the systemic failure is that the certification CHECKLIST wasn't enforced.", "error-guessing": "This isn't a guess — it's a documented standard step that was skipped." },
      },
      {
        id: "AN-8", x: 90, y: 42, label: "Incident report",
        evidence: {
          title: "INC-2025-08-22 root cause",
          body: "'Geofence boundary triggered unexpectedly at longitude 179.99999°.' The wraparound at ±180° was a known boundary in spec. Nobody tested 179.99, 180.0, -180.0, -179.99.",
          isoRef: TECHNIQUES["boundary-value-analysis"].iso, category: "Black-Box",
        },
        correct: "boundary-value-analysis",
        traps: { "error-guessing": "An aerospace tester would guess longitude wraparound; BVA is the formal way to derive it from spec.", "path-testing": "Paths through the code may all run; the input edge wasn't applied." },
      },
    ],
  },
];

const RANKS = [
  { id: "rookie", min: 0, max: 40, label: "Rookie Detective", glyph: "🔍",
    quote: "Every veteran started where you are. Take the file home tonight." },
  { id: "senior", min: 41, max: 70, label: "Senior Investigator", glyph: "📋",
    quote: "Solid instincts. The standard is starting to feel like an old friend." },
  { id: "chief", min: 71, max: 90, label: "Chief Detective", glyph: "🏆",
    quote: "You see the gaps before they bleed. The captain's office wants a word." },
  { id: "legend", min: 91, max: 100, label: "Legendary Detective", glyph: "⭐",
    quote: "ISO 29119-4 isn't a document to you. It's a way of looking at the world." },
];

window.GAME_DATA = { TECHNIQUES, CASES, RANKS };
