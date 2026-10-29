"""Reproducible educational PCA analysis; not a validated diagnostic tool.
Run: python pca_biomedical.py
Dependencies: numpy, pandas, matplotlib, scikit-learn.
Outputs are written beside this script. Seed: 761.
"""
from pathlib import Path
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss

OUT = Path(__file__).resolve().parent
D = load_breast_cancer()
X, y = D.data, (D.target == 0).astype(int)  # malignant = positive class
A, B, a, b = train_test_split(X, y, test_size=.2, stratify=y, random_state=761)
scaler = StandardScaler().fit(A)
Z = scaler.transform(A)
Ztest = scaler.transform(B)
pca = PCA(svd_solver='full').fit(Z)
evr = pca.explained_variance_ratio_
k = int(np.searchsorted(np.cumsum(evr), .95) + 1)
V = pca.components_.T
T = pca.transform(Z)
# Mathematical identities, independent of the clinical labels.
assert np.allclose(V.T @ V, np.eye(X.shape[1]), atol=1e-10)
assert np.allclose(np.cov(T, rowvar=False), np.diag(pca.explained_variance_), atol=1e-10)
Zhat = T[:, :k] @ V[:, :k].T + pca.mean_
residual_ss = float(np.sum((Z-Zhat)**2))
assert np.allclose(residual_ss, (len(A)-1)*pca.explained_variance_[k:].sum())
# StandardScaler uses ddof=0; sample PCA eigenvalues use n-1.
assert np.allclose(pca.explained_variance_.sum(), X.shape[1]*len(A)/(len(A)-1))
# Derive variable-score correlations directly to avoid loading conventions.
correlations = np.corrcoef(Z.T, T[:, :5].T)[:X.shape[1], X.shape[1]:]
pd.DataFrame(correlations, index=D.feature_names,
             columns=[f'PC{i+1}' for i in range(5)]).to_csv(OUT/'variable_pc_correlations.csv')

fig, ax = plt.subplots(1, 3, figsize=(13, 3.8), layout='constrained')
ax[0].plot(np.arange(1, 31), evr*100, 'o-', ms=3)
ax[0].set(xlabel='Component', ylabel='Training variance (%)', title='Scree plot', xlim=(0,31), ylim=(0,50))
ax[1].plot(np.arange(1,31), np.cumsum(evr)*100, 'o-', ms=3)
ax[1].axhline(95, color='gray', ls='--'); ax[1].axvline(k,color='gray',ls=':')
ax[1].set(xlabel='Number retained', ylabel='Cumulative variance (%)', title=f'95% requires {k} PCs', xlim=(0,31), ylim=(0,102))
for label, name, color in [(0,'Benign','#147d92'),(1,'Malignant','#bd5636')]:
    ax[2].scatter(T[a==label,0], T[a==label,1], s=13, alpha=.65, label=name, color=color)
ax[2].axhline(0,color='gray',lw=.6);ax[2].axvline(0,color='gray',lw=.6)
ax[2].set(xlabel=f'PC1 ({100*evr[0]:.1f}%)', ylabel=f'PC2 ({100*evr[1]:.1f}%)', title='Training scores; labels added after PCA')
ax[2].legend(fontsize=8)
fig.savefig(OUT/'biomedical_pca.pdf');fig.savefig(OUT/'biomedical_pca.png',dpi=160);plt.close(fig)
# Select the representation and regularization ONLY inside training CV.
pipe = Pipeline([('scale',StandardScaler()),('pca',PCA(svd_solver='full')),
                 ('model',LogisticRegression(max_iter=5000))])
grid = [{'pca__n_components':[2,5,10,15,20], 'model__C':[.01,.1,1,10]},
        {'pca':['passthrough'], 'model__C':[.01,.1,1,10]}]
cv = StratifiedKFold(n_splits=5,shuffle=True,random_state=761)
search = GridSearchCV(pipe,grid,scoring='roc_auc',cv=cv,n_jobs=1).fit(A,a)
prob = search.predict_proba(B)[:,1]
report = {'n':len(X),'p':X.shape[1],'train_n':len(A),'test_n':len(B),
          'first_five_variance_ratios':evr[:5].tolist(),'k_for_95_percent':k,
          'selected_parameters':str(search.best_params_),
          'training_cv_auc':float(search.best_score_),
          'test_auc':float(roc_auc_score(b,prob)),
          'test_average_precision':float(average_precision_score(b,prob)),
          'test_brier':float(brier_score_loss(b,prob)),
          'test_standardized_reconstruction_mse':float(np.mean((Ztest-(pca.transform(Ztest)[:,:k]@V[:,:k].T+pca.mean_))**2))}
(OUT/'results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
