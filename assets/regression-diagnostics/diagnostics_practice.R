# Reproducible diagnostic lab; run in R. Base R sections need no packages.
# Optional: install.packages(c("lmtest", "sandwich"))
data(stackloss)
help("stackloss")
d <- stackloss
fit <- lm(stack.loss ~ Air.Flow + Water.Temp + Acid.Conc., data=d)
print(summary(fit))
# Standard plot.lm diagnostics: mean, distribution, scale, influence.
pdf("stackloss_diagnostics.pdf", width=9, height=7)
par(mfrow=c(2,2)); plot(fit, which=c(1,2,3,5)); dev.off()
n <- nobs(fit); p <- length(coef(fit))
checks <- data.frame(case=seq_len(n), residual=resid(fit),
  leverage=hatvalues(fit), external=rstudent(fit), cook=cooks.distance(fit))
checks$outlier_screen <- abs(checks$external) > qt(1-.05/(2*n), n-p-1)
print(checks[order(-checks$cook), ])
i <- which.max(checks$cook)
fit_del <- update(fit, data=d[-i, , drop=FALSE])
print(cbind(full=coef(fit), without_case=coef(fit_del)))
print(confint(fit)); print(confint(fit_del))
# Specified curvature: use identical rows in both fits.
fit_curve <- update(fit, . ~ . + I(Air.Flow^2))
print(anova(fit, fit_curve)) # exact classical F requires its assumptions
if (requireNamespace("lmtest", quietly=TRUE)) {
  print(lmtest::bptest(fit)) # studentized Koenker default
  print(lmtest::resettest(fit, power=2:3, type="fitted"))
  # bgtest only if row order has a justified temporal interpretation.
}
if (requireNamespace("lmtest", quietly=TRUE) &&
    requireNamespace("sandwich", quietly=TRUE)) {
  print(lmtest::coeftest(fit, vcov.=sandwich::vcovHC(fit, type="HC3")))
  # HC3 is not a cure for mean misspecification, dependence or confounding.
}
# Fixed-X normal-model calibration of residual Shapiro-Wilk statistic.
set.seed(761); B <- 999
X <- model.matrix(fit); h <- hatvalues(fit)
stopifnot(all(h < 1))
stat <- function(y) {
  e <- lm.fit(X, y)$residuals
  unname(shapiro.test(e/sqrt(1-h))$statistic)
}
Wobs <- stat(model.response(model.frame(fit)))
Wsim <- replicate(B, stat(rnorm(n)))
p_mc <- (1 + sum(Wsim <= Wobs))/(B + 1)
print(c(W_observed=Wobs, calibrated_p=p_mc,
        approximate_MC_SE=sqrt(p_mc*(1-p_mc)/(B+1))))
# Pointwise Q-Q simulation envelope for internally studentized residuals.
# This is NOT a simultaneous 95% band or a global 5% test.
std_res <- function(y) {
  e <- lm.fit(X,y)$residuals
  sort(e/(sqrt(sum(e^2)/(n-p))*sqrt(1-h)))
}
sims <- replicate(B, std_res(rnorm(n)))
band <- apply(sims,1,quantile,probs=c(.025,.975))
z <- qnorm(ppoints(n)); obs <- sort(rstandard(fit))
pdf("stackloss_qq_envelope.pdf")
plot(z,obs,ylim=range(obs,band),xlab="Normal quantile",
     ylab="Ordered internally studentized residual",main="Pointwise reference envelope")
polygon(c(z,rev(z)),c(band[1,],rev(band[2,])),
        col=adjustcolor("skyblue",alpha.f=.35),border=NA)
points(z,obs,pch=19); lines(z,apply(sims,1,median)); dev.off()
# Under this fixed-X Gaussian null, these standardized residual statistics
# are invariant to beta and positive sigma, allowing rnorm(n) simulation.
# Real prediction exercise: fit lm(mpg ~ wt + hp, mtcars), use leave-one-out
# predictions y_i - e_i/(1-h_ii), and compute RMSE. Repeat all model selection
# inside each training fold if you choose predictors or transformations.
print(sessionInfo())
