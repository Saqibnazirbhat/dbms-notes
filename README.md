# DBMS Notes

Free, interactive study notes for Database Management Systems, written for
someone starting from zero. Every concept is built up the same way: what it is,
why it is needed, a plain-English intuition, a database example, how it works,
and then the technical definition. Hard ideas come with a figure you can drive:
step a query through the engine the way it actually runs, crash a transaction at
the critical point, test keys against live data, watch a lossy decomposition
invent rows that were never there.

**Read online:** https://Saqibnazirbhat.github.io/dbms-notes/

## What's covered

Eight chapters, one per week.

| # | Chapter | Topics |
|---|---------|--------|
| 1 | Foundations of a Database System | data vs database vs DBMS, why a file is not enough, ACID, the three levels of abstraction, schema and instance, data independence, data models, DDL/DML/DCL, inside the engine |
| 2 | The Relational Model and Basic SQL | relations, attributes, tuples, domain types, superkeys and candidate keys, counting superkeys, foreign keys and referential integrity, cascading deletes, CREATE/ALTER/DROP, INSERT/UPDATE/DELETE, SELECT-FROM-WHERE, NULL and three-valued logic, LIKE, ORDER BY, GROUP BY, set operations |
| 3 | Aggregation, Joins and Subqueries | the university schema, DISTINCT, Cartesian product, aliasing, LIKE, set operations, the five aggregates, GROUP BY and HAVING, the eight-stage order of execution, nested subqueries, SOME/ALL, EXISTS, UNIQUE, subqueries in FROM and SELECT, WITH, views, triggers, joins and the natural-join trap |
| 4 | Relational Algebra and ER Modelling | selection and projection, the six basic operators, joins decomposed, division, tuple and domain relational calculus, entity sets, the five kinds of attribute, ER notation, cardinality and participation, weak entities, ternary relationships, aggregation, specialization, mapping a diagram to tables |
| 5 | Functional Dependencies and Decomposition | anomalies, functional dependencies, Armstrong's axioms, attribute closure, finding every candidate key, prime and non-prime attributes, extraneous attributes, canonical cover, equivalence of dependency sets, lossless join, dependency preservation |
| 6 | Normal Forms | 1NF through BCNF and 4NF, partial and transitive dependencies, deciding which form a relation is in, decomposing into BCNF, why 3NF is the practical target, multivalued dependencies, temporal relations |
| 7 | Applications and Databases | the three layers, MVC, tiers, the three-layer web architecture, web/native/hybrid apps, cookies and sessions, servlets and JSP, caching, hosts and ports, URLs and DNS, psycopg2, cursors, exception handling, COMMIT, embedded SQL, SQL injection |
| 8 | Complexity, Disks and Buffers | counting operations, big-O, analysing loops, linear and binary search, trees, binary search trees, the memory hierarchy, disk geometry and capacity, access time and transfer rate, MTBF and disk arrays, disk arm scheduling, file organization, buffer replacement |

## How to use them

Read the chapters in order; each one builds on the last. Every section is
written to be self-contained, so you should not have to jump elsewhere to
understand a concept.

Don't skip the figures. Press their Step and Run buttons and drag the sliders,
because watching an idea move is how it sticks. Several figures exist
specifically to show a *wrong* answer being produced silently, which is the part
that is hard to learn from prose.

Answer each **Check your understanding** box before opening the answer.

## Building it yourself

`index.html` is generated, and it is a single self-contained file with the fonts
embedded, so it works offline and needs no server.

```
python build.py
```

That concatenates the modules in `src/` into `index.html`, a complete document
you can open straight from disk or serve from GitHub Pages. It also writes
`artifact.html`, the same content as a bare fragment, for hosts that supply
their own `<head>` and `<body>` wrapper.

```
src/head.html    design tokens, shared CSS, and the figure/teaching helpers
src/nav.js       the chapter list, contents page, and routing
src/w1.js ...    one module per chapter
src/tail.js      the router and boot code
fonts/           et-book, embedded as base64 at build time
```

---

Made by **Saqib Nazir Bhat** &middot; MIT licensed &middot; typeface:
[et-book](https://github.com/edwardtufte/et-book) (MIT).
