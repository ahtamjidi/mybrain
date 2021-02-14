From wikipedia:

In [mathematical optimization](https://en.wikipedia.org/wiki/Mathematical_optimization "Mathematical optimization"), a **trust region** is the subset of the region of the [objective function](https://en.wikipedia.org/wiki/Objective_function "Objective function") that is approximated using a model function (often a [quadratic](https://en.wikipedia.org/wiki/Quadratic_function "Quadratic function")). If an adequate model of the objective function is found within the trust region, then the region is expanded; conversely, if the approximation is poor, then the region is contracted.

Trust-region methods are in some sense dual to [line-search](https://en.wikipedia.org/wiki/Line-search "Line-search") methods: trust-region methods first choose a step size (the size of the trust region) and then a step direction, while line-search methods first choose a step direction and then a step size.


### Trust Region Algorithms
The algorithm described here is a simplification of the one used in my thesis (1). So, for more information, see the [thesis](http://www.applied-mathematics.net/mythesis/Thesis.html)