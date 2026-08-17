<script>
function renderWeek6() {
  return chead('week-6') + `<article>

<section>
<h2>1. Every Fact Exactly Once</h2>
<p>Chapter 5 diagnosed the disease: redundancy, and the three anomalies that follow from it. This
chapter is the cure.</p>
${teach('Normalization', 'splitting tables to kill redundancy', [
  'The process of splitting a table into smaller ones so that <b>every fact is stored exactly once, at the place where it naturally belongs</b>.',
  'Because a fact stored twice will eventually be stored inconsistently, and no amount of careful application code prevents that reliably.',
  'Organising a wardrobe. Nothing is thrown away and nothing new is added; everything is just put where it belongs so it can be found.',
  'A food-delivery database repeating "restaurant R11 is Burger Hub" on every single order. That is one fact, written a thousand times.',
  'Each <b>normal form</b> is a condition on the table. Meet it, and one class of redundancy is gone.',
  'A stepwise decomposition guided by functional dependencies, preserving losslessness.',
])}
<p>That one sentence is the whole subject. If you forget every rule in this chapter, keep
<b>"store every fact exactly once, at the place where it naturally belongs"</b> and you can
re-derive most of the rest.</p>

<h3>When repetition is perfectly fine</h3>
<p>An important distinction, and it is the one people over-apply.</p>
<p><b>A repeated <i>value</i> is not redundancy. A repeated <i>fact</i> is.</b></p>
<p>In an orders table, "Margherita" appearing on fifty rows is <b>not</b> a problem. Each of those
is a <b>separate fact</b>: somebody ordered a Margherita, and somebody else ordered another one.
They happen to share a value. Change one and the others are unaffected, so there is nothing to keep
in sync.</p>
<p>But "restaurant R11 is Burger Hub" appearing on fifty rows <b>is</b> a problem. That is
<b>one fact</b>, copied fifty times. Change it in one place and the copies now disagree.</p>
<div class="eq">the test: <span class="v">if I change this in one row, must I change it in others too?</span>
<span class="eqn">if yes, it is redundancy; if no, it is just a repeated value</span></div>

<h3>The ladder, and why it is a ladder</h3>
<p>The forms are <b>sequential</b> and increasingly strict. To be in a higher form you must first be
in every lower one.</p>
<div class="eq"><span class="v">1NF</span> <span class="op">&rarr;</span> <span class="v">2NF</span> <span class="op">&rarr;</span> <span class="v">3NF</span> <span class="op">&rarr;</span> <span class="v">BCNF</span> <span class="op">&rarr;</span> <span class="v">4NF</span>
<span class="eqn">each rung removes one specific kind of repetition, and this course goes as far as BCNF</span></div>
<p>Higher is not automatically better in practice, and the lecture is explicit about the trade-off.
Every step up <b>increases the number of tables</b>, which costs storage, joins and complexity. If a
design in 3NF shows no anomalies for the data you actually have, 3NF may be the right stopping
point. Removing all other constraints, higher is better; in a real system it is a judgement.</p>
${fig('f-flat',
`<div class="panel">
  <div class="phead"><span class="m" id="fl-hd"></span><span class="m" id="fl-verd"></span></div>
  <div id="fl-body"></div>
  <div class="msg" id="fl-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 6.1, One badly designed table, walked up the ladder. Watch the redundancy leave in stages, and the table count rise.',
`<span class="lab">normal form:</span>${pills('fl', [['u', 'unnormalised'], ['1', '1NF'], ['2', '2NF'], ['3', '3NF']], 0)}`,
'each normal form removes one specific kind of repetition')}
</section>

<section>
<h2>2. First Normal Form</h2>
${teach('First normal form', '1NF', [
  'Every cell holds a <b>single, indivisible (atomic) value</b>. No lists, no nested tables, no repeating groups of columns.',
  'Because SQL has no way to look inside a cell. If a cell holds "Maths, Physics", no <code>WHERE</code>, index or join can address the two subjects separately.',
  'A form with one box for "phone number". Writing three numbers into that box means no machine can read them apart.',
  'A <code>subjects</code> column containing <code>Maths, Physics</code> violates 1NF. So do columns named <code>phone1</code>, <code>phone2</code>, <code>phone3</code>.',
  'Fix it by putting each value on its <b>own row</b>, in a separate table, with the owner key repeated.',
  'A relation is in 1NF if the domain of every attribute contains only atomic values.',
])}
<p>The columns-numbered-1-2-3 version is worth naming separately, because it looks like it obeys the
rule and does not. It is a <b>repeating group</b>: several columns of the same kind, which fails the
moment somebody has one more, and forces every query to mention them all by name.</p>
<p>Relational databases require 1NF as a starting point; it is not optional the way the higher forms
are debatable. And note the shortcut this gives you in questions: if a problem says <b>"the domains
of all attributes include only atomic values"</b>, it has just told you the relation is already in
1NF, and you can start checking at 2NF.</p>
${fig('f-1nf',
`<div class="panel">
  <div class="phead"><span class="m" id="n1-hd"></span><span class="m" id="n1-verd"></span></div>
  <table class="dt" id="n1-tbl"></table>
  <div class="msg" id="n1-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 6.2, Three ways to hold an employee&rsquo;s phone numbers. Only one of them can be queried.',
`<span class="lab">design:</span>${pills('n1', [['a', 'list in a cell'], ['b', 'phone1, phone2, phone3'], ['c', 'a row per number']], 0)}`,
'a cell must hold one value, or SQL cannot address it')}
</section>

<section>
<h2>3. Prime and Non-Prime, Recalled</h2>
<p>Everything from here on is stated in terms of two words from Chapter 5, so here they are again in
place. You <b>cannot</b> check any normal form until you have them.</p>
<dl class="tight">
  <dt>Prime attribute</dt>
  <dd>An attribute that is part of <b>some</b> candidate key. Not necessarily the one you would have
  picked as primary: any candidate key counts.</dd>
  <dt>Non-prime attribute</dt>
  <dd>An attribute in <b>no</b> candidate key at all.</dd>
</dl>
<p>So the first move on any normalization question is always the same, and skipping it is the
commonest source of wrong answers:</p>
<div class="eq"><span class="v">1.</span> find every candidate key &nbsp;<span class="op">&rarr;</span>&nbsp; <span class="v">2.</span> mark prime and non-prime &nbsp;<span class="op">&rarr;</span>&nbsp; <span class="v">3.</span> test each dependency
<span class="eqn">missing one candidate key turns a prime attribute into a non-prime one and every later answer changes</span></div>
</section>

<section>
<h2>4. Second Normal Form</h2>
<p>1NF fixed the shape of the cells. 2NF is about a table whose key is made of <b>several</b>
attributes.</p>
${teach('Partial dependency', 'the thing 2NF forbids', [
  'A <b>non-prime</b> attribute determined by only <b>part</b> of a candidate key, rather than the whole of it.',
  'Because an attribute determined by half the key gets repeated once for every value of the other half.',
  'A form keyed by (student, subject). The student&rsquo;s <b>name</b> depends only on the student, so it gets rewritten on every subject line for that student.',
  'In enrolment(<u>sid</u>, <u>course_id</u>, sname, marks), <code>sname</code> depends on <code>sid</code> alone. Take three courses and your name is stored three times.',
  'Both halves matter: the dependent must be <b>non-prime</b>, and the determinant must be a <b>proper part</b> of a candidate key.',
  'X &rarr; A where X is a proper subset of some candidate key and A is non-prime.',
])}
${teach('Second normal form', '2NF', [
  'In 1NF, and with <b>no partial dependencies</b>.',
  'Because the repetition a partial dependency causes is pure waste, and removing it is almost always free.',
  'Splitting the form into a student list and a marks list. The name is written once.',
  'Move each partially dependent attribute into a table keyed by the part it actually depends on.',
  'Every non-prime attribute is <b>fully</b> functionally dependent on <b>every</b> candidate key.',
  'A relation in 1NF with no partial functional dependency on any candidate key.',
])}
<p>One consequence saves a great deal of work: <b>if every candidate key is a single attribute, the
table is automatically in 2NF.</b> There is no "part of the key" to depend on, so no partial
dependency can exist. Check the key sizes first and you can often skip this test entirely.</p>
${fig('f-2nf',
`<div class="panel">
  <div class="phead"><span class="m" id="n2-hd"></span><span class="m" id="n2-verd"></span></div>
  <div id="n2-body"></div>
  <div class="msg" id="n2-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 6.3, A composite key with three dependents. Each is tested against the key and lands in a different table.',
`<span class="lab">attribute:</span>${pills('n2', [['m', 'marks'], ['s', 'sname'], ['c', 'cname'], ['x', 'after the split']], 0)}`,
'an attribute must depend on the whole key, not part of it')}

<h3>An attribute that resists the obvious split</h3>
<p>A real example from the lecture, and it is here because the first answer given was <b>wrong</b>,
which is instructive.</p>
<p>An order table keyed by {order_id, food_id} holds <code>unit_price</code>. The instinct: price
depends on the food, so it is a partial dependency, so move it to the food table.</p>
<p>But that is only right if the price never varies. If the restaurant runs a discount, or the price
changes between orders, then the price on <b>this</b> order is not the current price of the food. It
genuinely depends on the pair.</p>
<ul>
  <li><b>Price fixed for all time:</b> partial dependency. Move <code>unit_price</code> to the food
  table.</li>
  <li><b>Price may vary per order:</b> full dependency on {order_id, food_id}. It stays where it is,
  and moving it would <b>destroy information</b>: you could no longer say what an old order cost.</li>
</ul>
<p>This is the general lesson of normalization. <b>The dependencies are statements about the
business, and you cannot read them off the data.</b></p>
</section>

<section>
<h2>5. Third Normal Form</h2>
<p>2NF removed dependencies on part of a key. 3NF removes dependencies that route through a
<b>non-key</b> attribute.</p>
${teach('Transitive dependency', 'the thing 3NF forbids', [
  'A non-prime attribute determined by another <b>non-prime</b> attribute, rather than directly by a key.',
  'Because the middle attribute repeats, and everything hanging off it repeats with it.',
  'A staff list holding department and the department&rsquo;s building. Twenty people in one department means the building is written twenty times.',
  'employee(<u>emp_id</u>, dept, building) with <code>emp_id &rarr; dept</code> and <code>dept &rarr; building</code>. So emp_id &rarr; building, but only <i>via</i> dept.',
  'The chain key &rarr; middle &rarr; dependent is the signature. Break it by moving the second link into its own table.',
  'X &rarr; A where X is not a superkey and A is non-prime.',
])}
${teach('Third normal form', '3NF', [
  'In 2NF, and with <b>no transitive dependencies</b>.',
  'Because the transitive chain is the last common source of ordinary redundancy, and removing it is almost always free.',
  'Splitting the staff list into people-with-departments and departments-with-buildings. The building is written once.',
  'employee(<u>emp_id</u>, dept) and dept(<u>dept</u>, building). Twenty people, one building row.',
  'For each non-trivial X &rarr; A, check that <b>either</b> X is a superkey <b>or</b> A is prime.',
  'For every non-trivial X &rarr; A in F: X is a superkey, or A is a prime attribute.',
])}
<p>That second escape clause, <b>"or A is prime"</b>, is what makes 3NF weaker than the next form,
and it is not an accident. It exists precisely so that certain tables can stay in one piece, as
section 8 shows.</p>
<p>Same consequence as before, and worth checking early: <b>if every candidate key is a single
attribute and there is no chain through a non-prime attribute, the table is in both 2NF and
3NF.</b> A relation whose every attribute is a candidate key on its own has no non-prime attributes
at all, so neither a partial nor a transitive dependency is possible.</p>
</section>

<section>
<h2>6. Boyce-Codd Normal Form</h2>
${teach('Boyce-Codd normal form', 'BCNF', [
  'For <b>every</b> non-trivial dependency X &rarr; A, the left side X must be a superkey. No exceptions.',
  'Because 3NF&rsquo;s "or A is prime" clause lets a little redundancy survive when the prime attributes overlap in an awkward way.',
  'The same rule as 3NF with the escape hatch removed: if something determines something else, it had better be able to identify the row.',
  'A table with two overlapping candidate keys can satisfy 3NF and still repeat a fact. BCNF catches it.',
  'Compute the closure of every left side. If any is not a superkey and the dependency is non-trivial, the table is not in BCNF.',
  'For every non-trivial X &rarr; A in F&#8314;: X is a superkey of R.',
])}
<div class="eq"><span class="v">3NF</span>: X is a superkey <b>or</b> A is prime <span class="op">&middot;</span> <span class="v">BCNF</span>: X is a superkey
<span class="eqn">the only difference is one escape clause</span></div>
<p>So <b>every BCNF relation is automatically in 3NF</b>, and the reverse does not hold. That
containment answers a question people find slippery.</p>
${cyu('Two decompositions, one in BCNF and one in 3NF, but you do not know which is which. What is the minimal test?',
'<b>Test just one of them for BCNF.</b> Because BCNF is contained in 3NF, the answer classifies both: if it <i>is</i> in BCNF, the other must be the 3NF one; if it is <i>not</i>, then it must be the 3NF one and the other is BCNF. Testing both for BCNF works but is not minimal. Testing for <b>3NF</b> settles nothing either way, because anything in BCNF also passes a 3NF test, so a "yes" is uninformative.')}
</section>

<section>
<h2>7. Deciding Which Form a Relation Is In</h2>
<p>This is the question asked most often, so here is the procedure as a routine you can run without
thinking, followed by three worked examples.</p>
<dl class="tight">
  <dt>1. Find <b>every</b> candidate key</dt>
  <dd>By attribute closure. Do not stop at the first one.</dd>
  <dt>2. Mark prime and non-prime</dt>
  <dd>Prime = in some candidate key.</dd>
  <dt>3. 1NF</dt>
  <dd>Usually given. Atomic values only.</dd>
  <dt>4. 2NF</dt>
  <dd>Only relevant if some candidate key has more than one attribute. Look for a non-prime
  attribute determined by <b>part</b> of a key.</dd>
  <dt>5. 3NF</dt>
  <dd>For each non-trivial X &rarr; A: is X a superkey, <b>or</b> is A prime? If neither, 3NF
  fails.</dd>
  <dt>6. BCNF</dt>
  <dd>Same test without the escape clause: is X a superkey?</dd>
</dl>
<p>The answer to "what is the <b>highest</b> normal form?" is the last rung that passes. Stop at the
first failure.</p>
${wex('Worked 1: A(P, Q, R, S, T) with PQ &rarr; RT, T &rarr; PQ, R &rarr; S',
'<p style="margin:0 0 8px"><b>Keys.</b> (PQ)&#8314; = PQ, +RT, +S = everything. (T)&#8314; = T, +PQ, ' +
'+RT, +S = everything. So the candidate keys are <b>PQ</b> and <b>T</b>.</p>' +
'<p style="margin:0 0 8px"><b>Prime:</b> P, Q, T. <b>Non-prime:</b> R, S.</p>' +
mini(['dependency', 'left a superkey?', 'right prime?', '3NF', 'BCNF'],
  [['PQ &rarr; RT', 'yes', '', ['ok', 'hi'], ['ok', 'hi']],
   ['T &rarr; PQ', 'yes', '', ['ok', 'hi'], ['ok', 'hi']],
   ['R &rarr; S', ['<b>no</b>', 'lo'], ['<b>no</b>', 'lo'], ['<b>fails</b>', 'lo'], ['fails', 'lo']]]) +
'<p style="margin:8px 0 0"><b>2NF holds:</b> no non-prime attribute depends on part of PQ, and T is ' +
'a single attribute so it has no proper parts. <b>3NF fails</b> on R &rarr; S, since R is not a ' +
'superkey and S is not prime. So the highest normal form is <b>2NF</b>.</p>')}
${wex('Worked 2: R(A, B, C, D, E, F) with AB &rarr; CDE, ABC &rarr; EF, E &rarr; F',
'<p style="margin:0 0 8px"><b>Keys.</b> (AB)&#8314; = AB, +CDE, +F = everything, so <b>AB</b> is the ' +
'only candidate key. <b>Prime:</b> A, B. <b>Non-prime:</b> C, D, E, F.</p>' +
'<p style="margin:0 0 8px"><b>2NF:</b> the key is AB. Is any non-prime attribute determined by A ' +
'alone or B alone? No dependency has A or B alone on the left, so there is <b>no partial ' +
'dependency</b> and 2NF holds.</p>' +
'<p style="margin:0"><b>3NF:</b> test <code>E &rarr; F</code>. It is not trivial, E is <b>not</b> a ' +
'superkey (E&#8314; = EF), and F is <b>not</b> prime. All three conditions for a violation are met, ' +
'so <b>3NF fails</b>. The highest normal form is <b>2NF</b>. Note that <code>ABC &rarr; EF</code> ' +
'is fine, since ABC contains the key and is therefore a superkey.</p>')}
${wex('Worked 3: R(A, B, C, D, E) with AB &rarr; CDE, D &rarr; A, E &rarr; B',
'<p style="margin:0 0 8px"><b>Keys.</b> (AB)&#8314; = everything. And (DE)&#8314; = DE, +A (D&rarr;A), ' +
'+B (E&rarr;B), then AB gives CDE, so DE is a key too. Candidate keys: <b>AB</b> and <b>DE</b>.</p>' +
'<p style="margin:0 0 8px"><b>Prime:</b> A, B, D, E. <b>Non-prime:</b> C only.</p>' +
mini(['dependency', 'left a superkey?', 'right prime?', '3NF', 'BCNF'],
  [['AB &rarr; CDE', 'yes', '', ['ok', 'hi'], ['ok', 'hi']],
   ['D &rarr; A', ['no', 'lo'], ['<b>yes</b>', 'hi'], ['<b>ok</b>', 'hi'], ['<b>fails</b>', 'lo']],
   ['E &rarr; B', ['no', 'lo'], ['<b>yes</b>', 'hi'], ['<b>ok</b>', 'hi'], ['<b>fails</b>', 'lo']]]) +
'<p style="margin:8px 0 0"><b>This is the shape to recognise.</b> D &rarr; A and E &rarr; B have ' +
'non-superkeys on the left, so BCNF fails. But their right sides are <b>prime</b>, so 3NF&rsquo;s ' +
'escape clause saves them. The relation is <b>in 3NF but not in BCNF</b>, which is exactly what ' +
'that question asks you to identify.</p>')}
${fig('f-nf',
`<div class="panel">
  <div class="phead"><span class="m" id="nf-hd"></span><span class="m" id="nf-verd"></span></div>
  <table class="dt" id="nf-tbl"></table>
  <div class="msg" id="nf-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 6.4, Every dependency tested against both rules at once. The column that differs is where 3NF and BCNF part company.',
`<span class="lab">relation:</span>${pills('nf', [['a', 'AB &rarr; CDE'], ['b', 'AB &rarr; CD, B &rarr; E'], ['c', 'AB &rarr; CD, C &rarr; D, D &rarr; E'], ['d', 'AB &rarr; CDE, D &rarr; A, E &rarr; B'], ['e', 'IPL: Sixes &rarr; TeamName']], 0)}`,
'BCNF is 3NF without the "or A is prime" escape clause')}
<h3>Decomposing a schema into BCNF</h3>
<p>The other shape this question takes gives you a schema and several proposed decompositions, and
asks which are in BCNF. The method is the same test applied to <b>each fragment separately</b>.</p>
${wex('Worked: department(dept_num, dept_name, mgr_num, mgr_name, building_num, employee_count, space_requirement)',
'<p style="margin:0 0 8px">The dependencies:</p>' +
mini(['dependency', 'reading'],
  [['dept_num &rarr; mgr_num, dept_name', 'a department has one manager and one name'],
   ['mgr_num &rarr; mgr_name', 'a manager has one name'],
   ['dept_num, building_num &rarr; employee_count', 'how many staff of that dept are in that building'],
   ['employee_count &rarr; space_requirement', 'headcount determines the space needed'],
   ['space_requirement &rarr; building_num', 'space needed determines which building']]) +
'<p style="margin:8px 0 0">The whole relation is nowhere near BCNF: <code>mgr_num &rarr; mgr_name</code> ' +
'alone breaks it, since mgr_num determines nothing else and is no superkey. So it must be split.</p>' +
'<p style="margin:8px 0 0"><b>The test on a fragment:</b> take only the dependencies whose attributes ' +
'all appear in that fragment, and check that each has a superkey <i>of that fragment</i> on the left. ' +
'A dependency whose attributes are split across fragments simply does not apply to either.</p>' +
mini(['fragment', 'dependency inside it', 'left side a key here?'],
  [['(mgr_num, mgr_name)', 'mgr_num &rarr; mgr_name', ['yes, mgr_num is the key', 'hi']],
   ['(dept_num, mgr_num, dept_name)', 'dept_num &rarr; mgr_num, dept_name', ['yes', 'hi']],
   ['(employee_count, space_requirement)', 'employee_count &rarr; space_requirement', ['yes', 'hi']],
   ['(dept_num, building_num, employee_count)', 'dept_num, building_num &rarr; employee_count', ['yes', 'hi']]]) +
'<p style="margin:8px 0 0">Every fragment passes, so <b>that decomposition is in BCNF</b>. Note what ' +
'makes it work: each fragment holds exactly one dependency, with its determinant as that ' +
'fragment&rsquo;s key. That is the shape to look for.</p>' +
'<p style="margin:8px 0 0"><b>Why the others fail.</b> A fragment such as ' +
'(dept_num, employee_count, space_requirement, building_num) keeps ' +
'<code>employee_count &rarr; space_requirement</code> <i>and</i> ' +
'<code>space_requirement &rarr; building_num</code> together, and neither left side is a key of that ' +
'fragment, so BCNF fails there. The quick scan is: <b>look for any fragment holding two or more ' +
'dependencies, and check whether the smaller determinant is a key.</b> Usually it is not.</p>')}
<p>Two general claims worth settling here, since both are asked as true or false:</p>
<dl class="tight">
  <dt>"2NF is considered adequate for relational database design."</dt>
  <dd><b>False.</b> 2NF still permits transitive dependencies, so it leaves real redundancy behind.
  3NF is the usual practical target.</dd>
  <dt>"A relation produced from an E-R model will always be in BCNF."</dt>
  <dd><b>False.</b> The mapping rules of Chapter 4 produce sensible tables, but nothing about them
  guarantees BCNF. You still have to check the dependencies afterwards.</dd>
</dl>
</section>

<section>
<h2>8. Why Anyone Stops at 3NF</h2>
<p>If BCNF is stricter, why is 3NF the form most real schemas target? Because BCNF asks for
something that cannot always be delivered.</p>
<div class="eq">a <span class="v">3NF</span> decomposition that is lossless <b>and</b> dependency-preserving <b>always</b> exists
<span class="eqn">a BCNF one sometimes does not</span></div>
<p>The standard example. A table records which teacher teaches which subject to which student, with
two rules from the institution:</p>
<ul>
  <li><code>{sid, subject} &rarr; teacher</code>: a student takes a subject from exactly one
  teacher.</li>
  <li><code>teacher &rarr; subject</code>: each teacher teaches exactly one subject.</li>
</ul>
<p>The candidate keys are {sid, subject} and {sid, teacher}, so <b>every</b> attribute is prime.
Check <code>teacher &rarr; subject</code>: the left side is not a superkey, so <b>BCNF fails</b>. But
the right side is prime, so <b>3NF holds</b>. The table sits exactly in the gap.</p>
${fig('f-bcnf',
`<div class="panel">
  <div class="phead"><span class="m" id="bc-hd"></span><span class="m" id="bc-verd"></span></div>
  <div id="bc-body"></div>
  <div class="msg" id="bc-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 6.5, The classic table that is in 3NF but not BCNF, and the price of forcing it into BCNF anyway.',
`<span class="lab">view:</span>${pills('bc', [['t', 'the table'], ['k', 'keys and rules'], ['d', 'forced into BCNF'], ['p', 'what it costs']], 0)}`,
'reaching BCNF here means losing a rule the database can no longer enforce')}
<p>Force it into BCNF by splitting into (teacher, subject) and (sid, teacher). The split is
<b>lossless</b>, since teacher is a key of the first piece. But
<code>{sid, subject} &rarr; teacher</code> is now <b>unenforceable</b>, because <code>sid</code> and
<code>subject</code> never appear in the same table again. Nothing stops a student being assigned two
teachers for one subject.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Target</th><th>Lossless?</th><th>Dependency preserving?</th><th>All redundancy gone?</th></tr></thead>
<tbody>
<tr><td><b>3NF</b></td><td>always achievable</td><td>always achievable</td><td>not quite</td></tr>
<tr><td><b>BCNF</b></td><td>always achievable</td><td><b>sometimes impossible</b></td><td>yes</td></tr>
</tbody></table></div>
<p>Faced with that trade, most designers keep the enforceable rule and accept the small redundancy.
That is the entire reason 3NF is the practical standard.</p>
${cyu('A relation R(A, B, C) has A &rarr; B and B &rarr; C, with A as the only candidate key. Which forms does it satisfy?',
'<b>1NF and 2NF, but not 3NF.</b> The key A is a single attribute, so no partial dependency is possible and 2NF holds automatically. But <code>B &rarr; C</code> has a non-superkey on the left and a non-prime attribute on the right, which is a transitive dependency, so 3NF fails, and BCNF fails for the same reason. The fix is to split into R1(A, B) and R2(B, C), which is lossless because B is a key of R2, and preserves both dependencies.')}
</section>

<section>
<h2>9. Fourth Normal Form</h2>
<p>One more form, for a kind of redundancy that functional dependencies cannot describe at all.</p>
${teach('Multivalued dependency', 'written A &#8608; B', [
  'A determines a <b>set</b> of B values, and that set is completely independent of every other attribute in the table.',
  'Because when two independent lists share a table, the rows multiply: every combination has to be stored, and none of it is a functional dependency.',
  'A person&rsquo;s hobbies and their languages. Both belong to the person; neither has anything to do with the other.',
  'student(sid, hobby, language). Two hobbies and three languages force <b>six</b> rows, and adding one language forces two more.',
  'The giveaway is that adding one value to either list forces you to add several rows, one for each value of the unrelated list.',
  'A &#8608; B holds if the set of B values matching a given A is independent of the remaining attributes.',
])}
${teach('Fourth normal form', '4NF', [
  'In BCNF, and every non-trivial multivalued dependency has a superkey on its left.',
  'Because the cross-product blow-up above is genuine redundancy, and no functional dependency exists to detect it.',
  'Keeping the hobbies list and the languages list on two separate pages instead of one grid of every combination.',
  'Split into student_hobby(sid, hobby) and student_language(sid, language). Two rows plus three rows instead of six.',
  'Two independent multivalued attributes must never share a table. The moment they do, you store their cross product.',
  'For every non-trivial A &#8608; B, A is a superkey.',
])}
<p>The saving is not marginal. Two lists of <i>m</i> and <i>n</i> values need <i>m</i> &times;
<i>n</i> rows together and only <i>m</i> + <i>n</i> apart, and every insert into either list means
touching many rows rather than one.</p>
</section>

<section>
<h2>10. Temporal Relations</h2>
<p>A short section on a different idea, which appears in the Week 6 material. A <b>temporal
relation</b> is one that records <i>when</i> a fact was true, rather than only what is true now.</p>
<p>Two different kinds of time are recorded, and the whole point is that they are not the same.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Kind of time</th><th>Records</th><th>Provides</th></tr></thead>
<tbody>
<tr><td><b>Valid time</b></td><td>when the fact was true <b>in the real world</b></td><td><b>historical</b> information</td></tr>
<tr><td><b>Transaction time</b></td><td>when the fact was <b>recorded in the database</b></td><td><b>rollback</b> information</td></tr>
</tbody></table></div>
<p>The distinction with an example. Somebody&rsquo;s salary rose on 1 April, but the clerk only
entered it on 12 April. The <b>valid time</b> starts on 1 April, because that is when the raise
really took effect. The <b>transaction time</b> starts on 12 April, because that is when the
database learned about it.</p>
<p>So each answers a different question. Valid time answers "what was true then?", which is
<b>history</b>. Transaction time answers "what did the database believe then?", which is what lets
you <b>roll back</b> to an earlier state of the database itself.</p>
<p>The pairing to remember: <b>valid time is historical, transaction time is rollback.</b> Swapping
those two is exactly the wrong answer these questions offer.</p>
</section>

<section>
<h2>11. The Whole Procedure</h2>
<p>Given a table and its dependencies, this is the sequence. Every step is mechanical once the
dependencies are written down.</p>
<dl class="tight">
  <dt>1. Find every candidate key</dt>
  <dd>Use attribute closure (Chapter 5). Everything below depends on knowing these, so do not skip
  it or guess.</dd>
  <dt>2. Mark prime and non-prime attributes</dt>
  <dd>Prime means part of <b>some</b> candidate key, not necessarily the one you would have
  picked.</dd>
  <dt>3. Check 1NF</dt>
  <dd>Any cell holding a list, or any repeating group of numbered columns, must be split into rows in
  a separate table.</dd>
  <dt>4. Check 2NF</dt>
  <dd>Only relevant with a composite key. Look for a non-prime attribute determined by part of a key,
  and move it to a table keyed by that part.</dd>
  <dt>5. Check 3NF</dt>
  <dd>For each dependency X &rarr; A, confirm X is a superkey <b>or</b> A is prime. A chain
  key &rarr; middle &rarr; dependent is the pattern to look for.</dd>
  <dt>6. Check BCNF</dt>
  <dd>Same test without the escape clause. If the fix would lose a dependency, stopping at 3NF is a
  legitimate and common choice.</dd>
  <dt>7. Check 4NF if two independent lists share a table</dt>
  <dd>The symptom is rows multiplying as a cross product.</dd>
  <dt>8. Verify the decomposition</dt>
  <dd>Lossless join is non-negotiable: the shared attributes must be a key of at least one piece.
  Dependency preservation is highly desirable. Check both, every time.</dd>
</dl>
</section>

</article>` + cfoot('week-6');
}

function initWeek6() {
  /* ---- Fig 6.1 the ladder ---- */
  (function () {
    const S = {
      u: ['unnormalised', '1 table, repeating group in a cell',
        'Two courses crammed into one cell, with their rooms in another. No query can ask "who takes PDSA", because SQL cannot look inside a cell.'],
      '1': ['1NF', '1 table, atomic but redundant',
        'Every cell is atomic now, and the key is {sid, course_id}. But <b>Asha</b> is written twice and <b>LH-1</b> is written twice. Both are partial dependencies: sname depends on sid alone, and room on course_id alone.'],
      '2': ['2NF and 3NF', '3 tables, no partial dependencies',
        'Each attribute now sits in a table keyed by what it actually depends on. <b>Asha appears once</b> and <b>LH-1 appears once</b>. There is no transitive chain in this example, so 3NF holds too. Note the cost: <b>one table became three</b>.'],
      '3': ['3NF', '2 tables, no transitive dependency',
        'A different table, to show what 3NF alone removes. <code>emp_id &rarr; dept</code> and <code>dept &rarr; building</code>, so the building travels through dept. Splitting writes each building <b>once</b> instead of once per employee.'],
    };
    const tbl = (cols, rows) => '<table class="dt"><thead><tr>' +
      cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
      rows.map(r => '<tr>' + r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
    const pair = parts => '<div class="cols" style="align-items:flex-start">' +
      parts.map(p => `<div><div class="tname">${p[0]}</div>` + tbl(p[1], p[2]) + '</div>').join('') + '</div>';
    function draw(k) {
      const s = S[k];
      let body;
      if (k === 'u') {
        body = tbl(['sid', 'sname', 'courses', 'rooms'],
          [['s1', 'Asha', 'DBMS, PDSA', 'LH-1, LH-3'], ['s2', 'Ravi', 'DBMS', 'LH-1'],
            ['s3', 'Meera', 'PDSA', 'LH-3']]);
      } else if (k === '1') {
        body = tbl(['sid', 'sname', 'course_id', 'room'],
          [['s1', 'Asha', 'DBMS', 'LH-1'], ['s1', 'Asha', 'PDSA', 'LH-3'],
            ['s2', 'Ravi', 'DBMS', 'LH-1'], ['s3', 'Meera', 'PDSA', 'LH-3']]);
      } else if (k === '2') {
        body = pair([
          ['student', ['sid', 'sname'], [['s1', 'Asha'], ['s2', 'Ravi'], ['s3', 'Meera']]],
          ['course', ['course_id', 'room'], [['DBMS', 'LH-1'], ['PDSA', 'LH-3']]],
          ['enrolment', ['sid', 'course_id'], [['s1', 'DBMS'], ['s1', 'PDSA'], ['s2', 'DBMS'], ['s3', 'PDSA']]],
        ]);
      } else {
        body = '<div style="margin-bottom:12px"><div class="tname">before: employee(emp_id, dept, building)</div>' +
          tbl(['emp_id', 'dept', 'building'],
            [['e1', 'Biology', 'Watson'], ['e2', 'Biology', 'Watson'],
              ['e3', 'Physics', 'Bohr'], ['e4', 'Biology', 'Watson']]) + '</div>' +
          pair([
            ['employee', ['emp_id', 'dept'], [['e1', 'Biology'], ['e2', 'Biology'], ['e3', 'Physics'], ['e4', 'Biology']]],
            ['department', ['dept', 'building'], [['Biology', 'Watson'], ['Physics', 'Bohr']]],
          ]);
      }
      $('#fl-body').innerHTML = body;
      $('#fl-hd').textContent = s[0];
      $('#fl-verd').textContent = s[1];
      $('#fl-note').innerHTML = s[2];
      const m = $('#f-flat-msg');
      m.className = 'msg ' + (k === 'u' ? 'bad' : k === '1' ? '' : 'good');
      m.textContent = k === 'u' ? 'Not even a legal relational table: a cell must hold one value.'
        : k === '1' ? 'Legal now, and still redundant. Atomic cells are the floor, not the goal.'
          : 'Every fact appears exactly once. Changing it means changing one row.';
    }
    setPills($('#f-flat'), 'fl', draw);
    draw('u');
  })();

  /* ---- Fig 6.2 1NF designs ---- */
  (function () {
    const S = {
      a: [['emp_id', 'name', 'phone'],
        [['e1', 'Asha', '9810, 9820'], ['e2', 'Ravi', '9835'], ['e3', 'Meera', '9840, 9850, 9860']],
        false, 'a list in one cell',
        'The phone column holds a comma-separated list. <b>No query can find employee 9820</b>: SQL sees one string, not two numbers. Sorting, indexing and joining on it are all impossible.'],
      b: [['emp_id', 'name', 'phone1', 'phone2', 'phone3'],
        [['e1', 'Asha', '9810', '9820', ''], ['e2', 'Ravi', '9835', '', ''],
          ['e3', 'Meera', '9840', '9850', '9860']],
        false, 'a repeating group',
        'Every cell is atomic, so this <i>looks</i> legal, but it is a <b>repeating group</b>. Searching for a number means naming all three columns; a fourth phone means altering the table; and most cells sit empty.'],
      c: [['emp_id', 'phone'],
        [['e1', '9810'], ['e1', '9820'], ['e2', '9835'], ['e3', '9840'], ['e3', '9850'], ['e3', '9860']],
        true, 'a row per value',
        'One value per cell, one row per phone, with {emp_id, phone} as the key. Now <code>WHERE phone = &rsquo;9820&rsquo;</code> works, any number of phones is fine, and no cell is wasted. The name lives in the employee table.'],
    };
    function draw(k) {
      const [cols, rows, ok, hd, note] = S[k];
      $('#n1-tbl').innerHTML = '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') +
        '</tr></thead><tbody>' + rows.map(r => `<tr class="${ok ? 'hi' : ''}">` +
          r.map(v => v === '' ? '<td class="nul">&ndash;</td>' : `<td>${v}</td>`).join('') +
          '</tr>').join('') + '</tbody>';
      $('#n1-hd').textContent = hd;
      $('#n1-verd').textContent = ok ? 'in 1NF' : 'violates 1NF';
      $('#n1-note').innerHTML = note;
      const m = $('#f-1nf-msg');
      m.className = 'msg ' + (ok ? 'good' : 'bad');
      m.textContent = ok ? 'This is the only one of the three that SQL can actually query.'
        : 'a cell must hold one value, or SQL cannot address it';
    }
    setPills($('#f-1nf'), 'n1', draw);
    draw('a');
  })();

  /* ---- Fig 6.3 2NF ---- */
  (function () {
    const R = [['s1', 'DBMS', 'Asha', 'Databases', 78], ['s1', 'PDSA', 'Asha', 'Algorithms', 66],
      ['s2', 'DBMS', 'Ravi', 'Databases', 91], ['s3', 'PDSA', 'Meera', 'Algorithms', 71]];
    const H = ['sid', 'course_id', 'sname', 'cname', 'marks'];
    const S = {
      m: [4, '{sid, course_id} &rarr; marks', 'full dependency',
        'Drop either half and the rule breaks: <code>sid</code> alone does not fix a mark, and neither does <code>course_id</code>. So marks depends on the <b>whole</b> key and belongs right where it is.'],
      s: [2, 'sid &rarr; sname', 'partial dependency',
        'The name depends on <code>sid</code> alone, which is only <b>half</b> the key. So Asha is stored once per course she takes. This is a 2NF violation and the name must move out.'],
      c: [3, 'course_id &rarr; cname', 'partial dependency',
        'The same problem on the other half: the course title depends on <code>course_id</code> alone, so "Databases" is stored once per enrolled student.'],
    };
    function draw(k) {
      if (k === 'x') {
        $('#n2-body').innerHTML = '<div class="cols" style="align-items:flex-start">' +
          [['student', ['sid', 'sname'], [['s1', 'Asha'], ['s2', 'Ravi'], ['s3', 'Meera']]],
            ['course', ['course_id', 'cname'], [['DBMS', 'Databases'], ['PDSA', 'Algorithms']]],
            ['enrolment', ['sid', 'course_id', 'marks'],
              [['s1', 'DBMS', 78], ['s1', 'PDSA', 66], ['s2', 'DBMS', 91], ['s3', 'PDSA', 71]]]]
            .map(p => `<div><div class="tname">${p[0]}</div><table class="dt"><thead><tr>` +
              p[1].map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
              p[2].map(r => '<tr class="hi">' + r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') +
              '</tbody></table></div>').join('') + '</div>';
        $('#n2-hd').textContent = 'three tables, in 2NF';
        $('#n2-verd').textContent = 'no partial dependencies remain';
        $('#n2-note').innerHTML = 'Each attribute now lives in a table keyed by exactly what determines it. <b>Asha</b> appears once and <b>Databases</b> appears once. The join key is still {sid, course_id}, so nothing has been lost.';
        const m = $('#f-2nf-msg');
        m.className = 'msg good';
        m.textContent = 'Each fact is now stored exactly once, and the original table can be rebuilt by joining the three.';
        return;
      }
      const [col, dep, verd, note] = S[k];
      $('#n2-body').innerHTML = '<table class="dt"><thead><tr>' + H.map((h, i) =>
        `<th style="color:${i < 2 ? 'var(--indigo)' : i === col ? 'var(--terra)' : 'var(--muted)'}">` +
        h + (i < 2 ? ' (key)' : '') + '</th>').join('') + '</tr></thead><tbody>' +
        R.map(r => '<tr>' + r.map((v, i) =>
          `<td${i === col ? ' class="hl"' : ''}>${v}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>';
      $('#n2-hd').innerHTML = dep;
      $('#n2-verd').textContent = verd;
      $('#n2-note').innerHTML = note;
      const m = $('#f-2nf-msg');
      m.className = 'msg ' + (k === 'm' ? 'good' : 'bad');
      m.textContent = k === 'm'
        ? 'Full dependency on the whole key. This attribute is exactly where it belongs.'
        : 'Partial dependency: the value repeats once for every value of the other half of the key.';
    }
    setPills($('#f-2nf'), 'n2', draw);
    draw('m');
  })();

  /* ---- Fig 6.4 3NF vs BCNF test ---- */
  (function () {
    const T = {
      a: ['R(A,B,C,D,E), F = { AB &rarr; CDE }', ['A', 'B'], '{AB}',
        [['AB &rarr; CDE', true, false]],
        'The only candidate key is AB. Every non-prime attribute depends on the whole key, so 2NF holds, and the single dependency has a superkey on the left, so <b>3NF and BCNF both hold</b>.'],
      b: ['R(A,B,C,D,E), F = { AB &rarr; CD, B &rarr; E }', ['A', 'B'], '{AB}',
        [['AB &rarr; CD', true, false], ['B &rarr; E', false, false]],
        '<code>B &rarr; E</code> is a <b>partial dependency</b>: B is half the key AB, and E is non-prime. So this fails at <b>2NF</b>, before 3NF is even reached. It is in 1NF only.'],
      c: ['R(A,B,C,D,E), F = { AB &rarr; CD, C &rarr; D, D &rarr; E }', ['A', 'B'], '{AB}',
        [['AB &rarr; CD', true, false], ['C &rarr; D', false, false], ['D &rarr; E', false, false]],
        'No partial dependency, so 2NF holds. But <code>C &rarr; D</code> and <code>D &rarr; E</code> both have non-superkeys on the left and non-prime attributes on the right, so <b>3NF fails</b>. Highest form: <b>2NF</b>.'],
      d: ['R(A,B,C,D,E), F = { AB &rarr; CDE, D &rarr; A, E &rarr; B }', ['A', 'B', 'D', 'E'], '{AB} and {DE}',
        [['AB &rarr; CDE', true, false], ['D &rarr; A', false, true], ['E &rarr; B', false, true]],
        '<b>The gap case.</b> Two candidate keys make A, B, D and E all prime. <code>D &rarr; A</code> and <code>E &rarr; B</code> have non-superkeys on the left, so BCNF fails, but their right sides are <b>prime</b>, so 3NF&rsquo;s escape clause saves them. <b>In 3NF, not in BCNF.</b>'],
      e: ['IPL(TeamID, TeamName, Fours, Sixes)', ['TeamID', 'TeamName', 'Fours', 'Sixes'], '{TeamID} and {TeamName, Fours}',
        [['TeamID &rarr; rest', true, false], ['TeamName, Fours &rarr; rest', true, false],
          ['Sixes &rarr; TeamName', false, true]],
        'Every attribute is prime here. <code>Sixes &rarr; TeamName</code> has a non-superkey on the left, so it <b>violates BCNF</b>, but TeamName is prime so 3NF holds. So "the relation is in 3NF" is true, "Sixes &rarr; TeamName violates BCNF" is true, and <b>"the relation is in BCNF" is false</b>.'],
    };
    function draw(k) {
      const [name, prime, keys, deps, note] = T[k];
      const rows = deps.map(d => {
        const sup = d[1], primeRight = d[2];
        return [d[0], sup ? 'yes' : 'no', primeRight ? 'yes' : 'no',
          (sup || primeRight) ? 'ok' : 'fails', sup ? 'ok' : 'fails'];
      });
      $('#nf-tbl').innerHTML = '<thead><tr><th>dependency</th><th>left is superkey?</th>' +
        '<th>right is prime?</th><th>3NF</th><th>BCNF</th></tr></thead><tbody>' +
        rows.map(r => `<tr class="${r[4] === 'ok' ? 'hi' : 'lo'}">` +
          r.map((v, i) => `<td${i >= 3 ? ' class="hl"' : ''}>${v}</td>`).join('') + '</tr>').join('') +
        '</tbody>';
      const in3 = rows.every(r => r[3] === 'ok');
      const inB = rows.every(r => r[4] === 'ok');
      $('#nf-hd').innerHTML = name;
      $('#nf-verd').innerHTML = 'keys ' + keys + ' &middot; prime: ' + prime.join(', ');
      $('#nf-note').innerHTML = note;
      const m = $('#f-nf-msg');
      m.className = 'msg ' + (inB ? 'good' : in3 ? '' : 'bad');
      m.textContent = in3 && !inB
        ? 'In 3NF but not BCNF: the gap between the two forms, caused entirely by the "or A is prime" clause.'
        : inB ? 'Every dependency has a superkey on the left, so this is in BCNF and therefore also in 3NF.'
          : 'BCNF is 3NF without the "or A is prime" escape clause.';
    }
    setPills($('#f-nf'), 'nf', draw);
    draw('a');
  })();

  /* ---- Fig 6.5 the 3NF/BCNF trade-off ---- */
  (function () {
    const R = [['s1', 'Maths', 'Rao'], ['s1', 'Physics', 'Iyer'], ['s2', 'Maths', 'Rao'],
      ['s3', 'Maths', 'Nair'], ['s3', 'Physics', 'Iyer']];
    const tbl = (cols, rows, cls) => '<table class="dt"><thead><tr>' +
      cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
      rows.map(r => `<tr class="${cls || ''}">` + r.map(v => `<td>${v}</td>`).join('') +
        '</tr>').join('') + '</tbody></table>';
    const S = {
      t: () => ['class(sid, subject, teacher)', '5 rows',
        tbl(['sid', 'subject', 'teacher'], R),
        'Two teachers, Rao and Nair, both teach Maths, and each student has one teacher per subject. Notice <b>Rao teaches Maths</b> is stored twice: that is the residual redundancy 3NF tolerates.', ''],
      k: () => ['candidate keys and rules', '2 candidate keys',
        '<table class="dt"><thead><tr><th>item</th><th>value</th><th>note</th></tr></thead><tbody>' +
        [['candidate key 1', '{sid, subject}', 'a student takes a subject from one teacher'],
          ['candidate key 2', '{sid, teacher}', 'follows, since teacher determines subject'],
          ['prime attributes', 'sid, subject, teacher', '<b>all three</b>'],
          ['rule 1', 'sid, subject &rarr; teacher', 'left side is a superkey, fine'],
          ['rule 2', 'teacher &rarr; subject', 'left side is <b>not</b> a superkey']]
          .map((r, i) => `<tr class="${i === 4 ? 'lo' : ''}"><td>${r[0]}</td><td>${r[1]}</td>` +
            `<td>${r[2]}</td></tr>`).join('') + '</tbody></table>',
        'Rule 2 breaks BCNF, because <code>teacher</code> is not a superkey. But <code>subject</code> is <b>prime</b>, so 3NF&rsquo;s escape clause lets it through. The table is in 3NF and not in BCNF.', ''],
      d: () => ['forced into BCNF', 'lossless',
        '<div class="cols" style="align-items:flex-start">' +
        '<div><div class="tname">teaches(teacher, subject)</div>' +
        tbl(['teacher', 'subject'], [['Rao', 'Maths'], ['Iyer', 'Physics'], ['Nair', 'Maths']], 'hi') +
        '</div><div><div class="tname">studies(sid, teacher)</div>' +
        tbl(['sid', 'teacher'], [['s1', 'Rao'], ['s1', 'Iyer'], ['s2', 'Rao'], ['s3', 'Nair'], ['s3', 'Iyer']], 'hi') +
        '</div></div>',
        'Splitting on <code>teacher</code> reaches BCNF, and it is <b>lossless</b>: teacher is a key of the left table, so the join reconstructs the original exactly. <b>Rao teaches Maths is now stored once.</b>', 'good'],
      p: () => ['what the split costs', 'a rule is lost',
        '<table class="dt"><thead><tr><th>dependency</th><th>attributes</th><th>enforceable?</th></tr></thead><tbody>' +
        [['teacher &rarr; subject', 'both in teaches', 'yes', 'hi'],
          ['sid, subject &rarr; teacher', 'sid and subject are now in different tables', '<b>no</b>', 'lo']]
          .map(r => `<tr class="${r[3]}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') +
        '</tbody></table>' +
        '<div class="tname" style="margin-top:12px">what can now be inserted</div>' +
        tbl(['sid', 'teacher'], [['s2', 'Rao'], ['s2', 'Nair']], 'lo'),
        'Student s2 is now assigned <b>two Maths teachers</b>, and no single table can object: studies never sees the subject, and teaches never sees the student. Checking the rule would need a join on every insert, which no database does.', 'bad'],
    };
    function draw(k) {
      const [hd, verd, body, note, cls] = S[k]();
      $('#bc-hd').textContent = hd;
      $('#bc-verd').textContent = verd;
      $('#bc-body').innerHTML = body;
      $('#bc-note').innerHTML = note;
      const m = $('#f-bcnf-msg');
      m.className = 'msg ' + cls;
      m.textContent = k === 'p'
        ? 'This is the trade: BCNF removed the last redundancy and took an enforceable rule away with it. Most designers keep the rule and stay at 3NF.'
        : k === 'd' ? 'Lossless and fully in BCNF. The cost is on the next tab.'
          : 'reaching BCNF here means losing a rule the database can no longer enforce';
    }
    setPills($('#f-bcnf'), 'bc', draw);
    draw('t');
  })();
}
</script>
