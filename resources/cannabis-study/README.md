# Cannabis and mental health: research working kit
Updated October 21, 2026. Proposal, not accepted/submitted research.

## Start here
1. Read the website resource page and its source links.
2. Download the official 2024 NSDUH TSV ZIP, codebook and Data Users' Guide.
3. Extract `NSDUH_2024_Tab.txt` outside your public website/repository. Do not commit microdata.
4. Review the exact variable mapping below against the current codebook.
5. Obtain adviser review of novelty, ethics determination and the estimand before modeling.
6. Install R and `survey` using their official documentation. Run:
   `Rscript analysis.R /absolute/path/NSDUH_2024_Tab.txt /absolute/path/private-output`
7. Review outputs; write the abstract only after verified results exist.

## What has actually been checked
The official 2024 TSV archive and codebook were downloaded. A Python streaming check
verified the required column names and recorded unweighted feasibility counts and a
SHA-256 digest in data-audit.json. These are file checks, not weighted findings.
The R script has NOT been executed in this environment because R is unavailable.
It is analysis starter code for scientific and software review, not validated results.
No respondent-level microdata or copyrighted journal PDFs are mirrored here.

## Exact mapping (2024 PUF)
- CATAGE=2: age 18-25; AGE3=4/5/6: 18-20/21-23/24-25.
- MRJYR=1: cannabis use in the past year.
- IRPYUD5MRJ=0/1: imputation-revised past-year marijuana use disorder.
- IRAMDEYR=0/1: imputation-revised adult past-year major depressive episode.
- ANALWT2_C: final person weight; VESTR_C: public stratum; VEREP: public PSU.
- IRSEX (1/2), NEWRACE2 (1-7), EDUHIGHCAT (1-4), POVERTY3 (1-3),
  IRINSUR4 (1/2): proposed adjustment fields, retaining original survey meanings.
- CIGYR=0/1 is cigarette use, NOT all nicotine use; ALCYR=0/1 is alcohol use.
- IRMJFY=1-365: past-year frequency. 991/993 are nonuse codes, not days.
- POVERTY3 has structural missingness among certain college-dorm residents.
- The official CUD screening can exclude reported use on <=5 days; preserve the
  derived indicator and discuss this measurement limitation.

## Remaining methodological work
The original PDF proposes logistic regression plus survey-standardized prevalence
differences and ratios. This starter fits logistic regression and, optionally,
modified Poisson PRs. These are different estimands: the optional PR is not the
original marginal PR. The script does NOT yet implement design-aware standardized
margins or extended-adjustment sensitivity; these require review and implementation
before declaring the protocol complete. Do not label an OR as a PR.

Use domain estimation after full-sample design creation. Keep official imputation;
inspect residual missingness, sparse cells, weighting, model rank and sensitivity.
The guide uses 50 df for national/nongeographic proportions; regression coefficient
inference here uses model residual design df. Review the exact inference procedure.

## Reporting and symposium
Abstracts: <=500 words excluding title/authors/affiliations; 11-point Arial,
1-inch margins, centered bold title, corresponding author's name/email.
Clinical/research data and authors' results are required; proposal alone is insufficient.
Submit Nov 16, 2026-Jan 8, 2027; notification by Feb 5; symposium Feb 26.
If accepted, register and attend; standard poster is 36 inches high by 48 wide.
Recheck the official call before submission. No journal publication is promised.

## Suggested outputs
- Table 1: unweighted N, weighted demographics and missingness.
- Table 2: weighted CUD prevalence by MDE with 95% CI.
- Figure: adjusted contrasts only after the chosen estimand is approved.
- Sensitivity appendix: co-use adjustment, missingness and influential weights.
- Discussion: bidirectionality, selection into cannabis use, self-report,
  structural exclusions, limited U.S.-to-Bangladesh transportability.

This evidence may guide screening and prevention priorities. It does not estimate
the consequences of decriminalization, medical access or commercial legalization.
The early PDF remains a dated proposal; the current resource page and this mapping
supersede its pending-variable and unknown-format statements.
