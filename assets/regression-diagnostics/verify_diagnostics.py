"""Independent numerical verification of OLS diagnostic identities (synthetic data)."""
import numpy as np
rng = np.random.default_rng(761)
x = np.linspace(-2, 3, 30)
X = np.column_stack([np.ones(len(x)), x])
y = X @ np.array([2., 1.5]) + rng.normal(size=len(x))
beta = np.linalg.lstsq(X, y, rcond=None)[0]
Q, _ = np.linalg.qr(X, mode='reduced')
H = Q @ Q.T
h = np.diag(H)
e = y-X@beta
n,p = X.shape
s2 = e@e/(n-p)
assert np.allclose(H@H,H)
assert np.allclose(X.T@e,0)
assert np.isclose(h.sum(),p)
max_cook_error = max_deleted_error = 0.
for i in range(n):
    keep=np.arange(n)!=i
    deleted=np.linalg.lstsq(X[keep],y[keep],rcond=None)[0]
    actual_cook=np.sum((X@(beta-deleted))**2)/(p*s2)
    formula_cook=e[i]**2/(p*s2)*h[i]/(1-h[i])**2
    actual_deleted=y[i]-X[i]@deleted
    max_cook_error=max(max_cook_error,abs(actual_cook-formula_cook))
    max_deleted_error=max(max_deleted_error,abs(actual_deleted-e[i]/(1-h[i])))
assert max_cook_error < 1e-10
assert max_deleted_error < 1e-10
print('PASS: projection, orthogonality, trace, Cook and deleted-residual identities')
print(f'Maximum absolute Cook discrepancy: {max_cook_error:.3g}')
print(f'Maximum absolute deleted-residual discrepancy: {max_deleted_error:.3g}')
print(f'Condition number of X: {np.linalg.cond(X):.4g}')
