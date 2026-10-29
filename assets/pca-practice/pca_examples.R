# Requires a real counts matrix and matching sample metadata.
# counts: genes x samples; coldata: samples x metadata columns.
# colnames(counts) must equal rownames(coldata).
library(DESeq2)
stopifnot(identical(colnames(counts), rownames(coldata)))
dds <- DESeqDataSetFromMatrix(countData=counts,
    colData=coldata, design=~ batch + condition)
dds <- dds[rowSums(counts(dds)) >= 10, ]
# blind=FALSE uses design-aware dispersion information; select this
# deliberately. For unbiased sample QA, also consider blind=TRUE.
vsd <- vst(dds, blind=FALSE)
plotPCA(vsd, intgroup=c("condition", "batch"))
# This plot uses its own gene-selection default; report ntop.
# Explicit alternative: PCA on a stated number of variable genes.
rv <- apply(assay(vsd), 1, var)
keep <- head(order(rv, decreasing=TRUE), min(500, length(rv)))
p <- prcomp(t(assay(vsd)[keep, ]), center=TRUE, scale.=FALSE)
summary(p)


X <- as.matrix(USArrests)
p <- prcomp(X, center=TRUE, scale.=TRUE)
V <- p$rotation                  # p x p eigenvector coefficients
T <- p$x                         # n x p observation scores
lambda <- p$sdev^2
pve <- lambda / sum(lambda)
k <- which(cumsum(pve) >= 0.90)[1]
Z <- scale(X, center=p$center, scale=p$scale)
Zhat <- T[,1:k,drop=FALSE] %*% t(V[,1:k,drop=FALSE])
stopifnot(max(abs(crossprod(V)-diag(ncol(X)))) < 1e-8)
stopifnot(max(abs(cov(T)-diag(lambda))) < 1e-8)
stopifnot(abs(sum((Z-Zhat)^2) -
    (nrow(X)-1)*sum(lambda[-seq_len(k)])) < 1e-7)
# Correlation loadings, not just eigenvector coefficients:
L <- sweep(V, 2, sqrt(lambda), '*')
print(round(L, 3))
# New observations: reuse the fitted means, SDs, and directions.
new_scores <- predict(p, newdata=X[1:2,,drop=FALSE])
# Above rows merely illustrate the API, not independent validation.
