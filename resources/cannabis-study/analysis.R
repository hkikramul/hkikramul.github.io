# NSDUH 2024 cannabis/MDE research starter, 2026-10-21.
# Study code for review, not a completed or validated analysis.
# Run: Rscript analysis.R /path/NSDUH_2024_Tab.txt /path/output
# Requires survey. No auto-installation. Do not publish respondent-level data.
args <- commandArgs(trailingOnly=TRUE)
if (length(args) != 2L) stop('Supply the extracted official TSV path and output directory.')
if (!requireNamespace('survey', quietly=TRUE)) stop('Install the R package survey first.')
library(survey)
options(survey.lonely.psu='fail') # Investigate design problems instead of silently changing SEs.
out <- args[2]; dir.create(out, recursive=TRUE, showWarnings=FALSE)
# Memory-conscious reading: retain only documented analytic columns.
keep <- c('CATAGE','AGE3','MRJYR','IRPYUD5MRJ','IRAMDEYR','ANALWT2_C',
          'VESTR_C','VEREP','IRSEX','NEWRACE2','EDUHIGHCAT','POVERTY3',
          'IRINSUR4','CIGYR','ALCYR','IRMJFY')
header <- names(read.delim(args[1], nrows=0, check.names=FALSE))
if (!all(keep %in% header)) stop('Input lacks required 2024 public-use fields.')
classes <- rep('NULL', length(header)); classes[header %in% keep] <- 'numeric'
d <- read.delim(args[1], colClasses=classes, na.strings=c('.',''), check.names=FALSE)
stopifnot(all(is.finite(d$ANALWT2_C)), all(d$ANALWT2_C > 0),
          !anyNA(d$VESTR_C), !anyNA(d$VEREP))
valid <- function(x, allowed) {x[!x %in% allowed] <- NA_real_; x}
d$cud <- valid(d$IRPYUD5MRJ, 0:1)
d$mde <- valid(d$IRAMDEYR, 0:1)
d$age <- factor(valid(d$AGE3,4:6), levels=4:6, labels=c('18-20','21-23','24-25'))
d$sex <- factor(valid(d$IRSEX,1:2), levels=1:2, labels=c('Male','Female'))
d$race <- factor(valid(d$NEWRACE2,1:7))
d$education <- factor(valid(d$EDUHIGHCAT,1:4))
# POVERTY3 is structurally missing for some college-dorm residents.
# This is not a missing-at-random assumption; report exclusions and sensitivity.
d$poverty <- factor(valid(d$POVERTY3,1:3))
d$insurance <- factor(valid(d$IRINSUR4,1:2))
d$cigarette <- valid(d$CIGYR,0:1) # cigarettes only; not all nicotine products
d$alcohol <- valid(d$ALCYR,0:1)
d$frequency <- ifelse(d$IRMJFY %in% 1:365, d$IRMJFY, NA_real_)
d$eligible <- !is.na(d$CATAGE) & d$CATAGE==2 & !is.na(d$MRJYR) & d$MRJYR==1
core <- c('cud','mde','age','sex','race','education','poverty','insurance')
ext <- c(core,'cigarette','alcohol')
d$cc_core <- complete.cases(d[,core]); d$cc_ext <- complete.cases(d[,ext])
flow <- data.frame(stage=c('Full PUF','Age 18-25','Past-year cannabis users age 18-25',
                          'Core complete cases','Extended complete cases'),
                   n=c(nrow(d),sum(d$CATAGE==2,na.rm=TRUE),sum(d$eligible),
                       sum(d$eligible & d$cc_core),sum(d$eligible & d$cc_ext)))
write.csv(flow,file.path(out,'flow_unweighted.csv'),row.names=FALSE)
write.csv(data.frame(variable=core, missing=sapply(d[d$eligible,core],function(x)sum(is.na(x)))),
          file.path(out,'missingness_unweighted.csv'),row.names=FALSE)
# Build design BEFORE domain subsetting; PSU labels are nested within strata.
design <- svydesign(ids=~VEREP,strata=~VESTR_C,weights=~ANALWT2_C,data=d,nest=TRUE)
users <- subset(design,eligible)
writeLines(capture.output(svytable(~cud+mde,users)),file.path(out,'weighted_crosstab.txt'))
writeLines(capture.output(svyciprop(~I(cud==1),users,method='logit',na.rm=TRUE,df=50)),
           file.path(out,'cud_prevalence.txt'))
writeLines(capture.output(svyby(~cud,~mde,users,svymean,na.rm=TRUE,vartype=c('se','ci'),df=50)),
           file.path(out,'prevalence_by_mde.txt'))
# Review cross-tab counts before proceeding. No automatic power claim.
writeLines(capture.output(table(d$cud[d$eligible],d$mde[d$eligible],useNA='always')),
           file.path(out,'cross_counts_unweighted.txt'))
missing_fraction <- 1-sum(d$eligible & d$cc_core)/sum(d$eligible)
if (missing_fraction >= .05) stop('Core exclusions >=5%: review missingness/imputation before modeling. Descriptives saved.')
a <- subset(design,eligible & cc_core)
f <- cud ~ mde + age + sex + race + education + poverty + insurance
logistic <- svyglm(f,design=a,family=quasibinomial())
# Model coefficients are ORs, not risk ratios. Marginal PD/PR not implemented.
writeLines(capture.output(summary(logistic)),file.path(out,'logistic_review.txt'))
# Optional separate estimand: modified Poisson adjusted prevalence ratio.
# This is not the standardized PR specified in the original proposal.
# Adviser must approve this addition/change before interpreting it as primary.
pr <- svyglm(f,design=a,family=quasipoisson(link='log'))
writeLines(capture.output(summary(pr)),file.path(out,'modified_poisson_review.txt'))
if (any(fitted(pr)>1)) warning('Modified Poisson fitted probabilities exceed 1; inspect model adequacy.')
# Conservative model-residual df for coefficient inference; confirm guide/adviser practice.
extract <- function(model,measure) {
 b <- coef(model)['mde']; se <- sqrt(vcov(model)['mde','mde'])
 df <- model$df.residual; if(!is.finite(df)||df<=0) stop('Invalid model residual df.')
 q <- qt(.975,df)
 data.frame(measure=measure,estimate=exp(b),lower=exp(b-q*se),upper=exp(b+q*se),df=df)
}
write.csv(rbind(extract(logistic,'Adjusted odds ratio'),extract(pr,'Adjusted prevalence ratio: optional')),
          file.path(out,'mde_contrasts_review.csv'),row.names=FALSE)
saveRDS(list(logistic=logistic,modified_poisson=pr),file.path(out,'models_LOCAL_ONLY.rds'))
writeLines(capture.output(sessionInfo()),file.path(out,'sessionInfo.txt'))
message('Starter outputs complete. Review sparse cells, diagnostics, missingness and inference before reporting. No causal interpretation.')
