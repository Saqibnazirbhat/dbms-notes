<script>
function renderWeek4() {
  return chead('week-4') + `<article>

<section>
<h2>1. Why There Is an Algebra Underneath SQL</h2>
<p>Chapter 1 followed a query through the engine, and it passed through a stage labelled
"relational algebra expression". This chapter is that stage, and then the design method that
produces the tables in the first place.</p>
<p>The difference between SQL and the algebra is the difference between two ways of asking for
something.</p>
${teach('Declarative language', 'say what you want', [
  'A language where you state the <b>result</b> you want and say nothing about how to obtain it.',
  'Because people are good at describing what they want and bad at choosing the fastest route through a million rows.',
  'Telling a taxi driver an address. You name the destination; they choose the roads.',
  '<b>SQL is declarative.</b> You write "the names of students older than 25" and never say whether to scan or use an index.',
  'The optimizer picks the route, which is exactly why it needs statistics and choices.',
  'A language specifying the properties of the desired result rather than a procedure for computing it.',
])}
${teach('Procedural language', 'say how to do it', [
  'A language where you give the <b>steps</b>, in order, and the result is whatever they produce.',
  'Because you cannot compare the cost of two routes until both are written down as concrete steps.',
  'Giving the taxi driver turn-by-turn directions. Left here, then straight on, then right.',
  '<b>Relational algebra is procedural.</b> An expression is a recipe: first select these rows, then keep these columns.',
  'Each operator takes relations in and returns a relation out, so operators can be chained.',
  'A language specifying a sequence of operations that compute the desired result.',
])}
<p>So the engine translates your declarative SQL into a procedural expression, because a recipe is
something it can cost, rearrange and compare.</p>
<p>One property makes the whole algebra work: <b>every operator takes relations and produces a
relation</b>. Because the output is the same kind of thing as the input, operators nest freely, and
it is also why a subquery can appear anywhere a table can.</p>
<p>There is a third language, <b>relational calculus</b>, which is <i>non-procedural</i>: it
describes the answer without giving any steps at all. Sections 6 and 7 cover it. All three have
exactly the same expressive power.</p>
</section>

<section>
<h2>2. Cutting Rows and Cutting Columns</h2>
<p>Two operators do most of the work, and between them they are <code>WHERE</code> and the
<code>SELECT</code> list.</p>
${teach('Selection', 'the sigma operator, &sigma;', [
  'Keeps the <b>rows</b> that satisfy a condition, and discards the rest. Every column survives.',
  'Because most questions are about a subset of the rows, not all of them.',
  'Going through a stack of forms and keeping only the ones marked "urgent". Each kept form is complete and unaltered.',
  '&sigma;<sub>age &gt; 23</sub>(student) is the same as <code>WHERE age &gt; 23</code>.',
  'Each row is tested independently. Conditions combine with &and; (and), &or; (or) and &not; (not).',
  '&sigma;<sub>P</sub>(R) = { <i>t</i> &isin; R : P(<i>t</i>) is true }',
])}
${teach('Projection', 'the pi operator, &pi;', [
  'Keeps the named <b>columns</b> and discards the rest. Every row survives.',
  'Because you often want only two facts out of a fifteen-column table, and dragging the rest around is wasteful and noisy.',
  'Photocopying only the "name" and "phone" columns of a register, with a sheet of paper covering the others.',
  '&pi;<sub>name, dept</sub>(student) is the same as <code>SELECT name, dept</code>.',
  'The named columns are extracted from each row, and <b>then duplicate rows are removed</b>.',
  '&pi;<sub>A</sub>(R) = the set of tuples of R restricted to the attributes in A',
])}
<p>That last detail is the one place the algebra and SQL genuinely disagree. <b>Projection removes
duplicates automatically.</b> Project five students onto <code>dept</code> alone and the algebra
returns the <i>set</i> of departments, so three students in Biology contribute one row. The
equivalent SQL returns three rows unless you add <code>DISTINCT</code>.</p>
<p>The reason is that an algebra result is a <b>set</b>, and a set has no duplicates by definition.
So <code>SELECT DISTINCT</code> is projection, and plain <code>SELECT</code> is not.</p>
${fig('f-ra',
`<div class="panel">
  <div class="phead"><span class="m" id="ra-expr"></span><span class="m" id="ra-cnt"></span></div>
  <div class="cols">
    <div><div class="tname">student</div><table class="dt" id="ra-src"></table></div>
    <div><div class="tname">result</div><table class="dt" id="ra-out"></table></div>
  </div>
  <div class="msg" id="ra-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 4.1, Selection cuts rows, projection cuts columns, and composing them applies the inner operator first.',
`<span class="lab">expression:</span>${pills('ra', [['none', 'R'], ['sel', '&sigma;'], ['proj', '&pi;'], ['both', '&pi;(&sigma;(R))'], ['dup', '&pi; on dept only']], 0)}
 ${slider('ra-t', 19, 33, 1, 23, 'age &gt;')}`,
'every operator takes relations and returns a relation, which is why they nest')}
<p>When they are composed, read <b>inside out</b>. In
&pi;<sub>name</sub>(&sigma;<sub>age &gt; 23</sub>(student)) the selection runs first, cutting rows,
and the projection then cuts columns from what is left.</p>
</section>

<section>
<h2>3. The Rest of the Basic Operators</h2>
<p>Four more, and with the two above they make six. Everything else in the algebra is built from
these.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Operator</th><th>Written</th><th>What it does</th><th>In SQL</th></tr></thead>
<tbody>
<tr><td><b>Union</b></td><td>R &cup; S</td><td>Rows appearing in either relation</td><td><code>UNION</code></td></tr>
<tr><td><b>Set difference</b></td><td>R &minus; S</td><td>Rows of R that are not in S</td><td><code>EXCEPT</code></td></tr>
<tr><td><b>Cartesian product</b></td><td>R &times; S</td><td>Every pairing of a row of R with a row of S</td><td>naming two tables in <code>FROM</code></td></tr>
<tr><td><b>Rename</b></td><td>&rho;<sub>x</sub>(R)</td><td>Gives a relation or its attributes new names</td><td><code>AS</code></td></tr>
</tbody></table></div>
<p>Union and set difference both need the two relations to be <b>union compatible</b>: the same
number of attributes, of compatible types, in the same order.</p>
<p><b>Intersection</b> is often listed too, and it is genuinely a convenience rather than a basic
operator, because R &cap; S = R &minus; (R &minus; S).</p>
${teach('Rename', 'the rho operator, &rho;', [
  'Gives a relation, or its attributes, a different name for the rest of the expression.',
  'Because sometimes you must compare a table <b>with itself</b>, and without two different names there is no way to say which copy you mean.',
  'Two people with the same name in a room. You cannot discuss them until you call one "Priya A" and the other "Priya B".',
  'To find instructors earning more than some colleague you need two copies of the instructor table, and SQL writes this as <code>instructor AS t, instructor AS s</code>.',
  'It changes only the labels used in the expression. No data moves and no rows change.',
  '&rho;<sub>x</sub>(R) returns the relation R under the name <i>x</i>.',
])}
<p>One conversion worth being able to do in both directions, because it is asked as a
multiple-choice question. A condition joined by <b>and</b> becomes an <b>intersection</b> of two
selections, and a condition joined by <b>or</b> becomes a <b>union</b>:</p>
<div class="eq">&sigma;<sub>A=50 &and; B=90</sub>(r) &nbsp;=&nbsp; &sigma;<sub>A=50</sub>(r) &cap; &sigma;<sub>B=90</sub>(r)
<span class="eqn">and &sigma;<sub>A=50 &or; B=90</sub>(r) = &sigma;<sub>A=50</sub>(r) &cup; &sigma;<sub>B=90</sub>(r)</span></div>
<p>Check it by reading both sides aloud. The left keeps rows satisfying <b>both</b> conditions; the
right keeps rows in <b>both</b> result sets, which is the same thing. Set difference is <i>not</i>
symmetric with this, so &sigma;<sub>A=50</sub>(r) &minus; &sigma;<sub>B=90</sub>(r) means "A is 50
and B is not 90", which is a different question.</p>
</section>

<section>
<h2>4. Joins, Taken Apart</h2>
<p>The natural join is not really a new operator. It is three of the basic ones bolted together,
and seeing that makes its odd behaviour obvious.</p>
<div class="eq"><span class="v">R</span> &#8904; <span class="v">S</span> &nbsp;=&nbsp; &pi;<sub>each attribute once</sub>( &sigma;<sub>R.a = S.a</sub>( <span class="v">R</span> &times; <span class="v">S</span> ) )
<span class="eqn">product, then selection on the shared attributes, then projection to remove the duplicated column</span></div>
${fig('f-rajoin',
`<div class="panel">
  <div class="phead"><span class="m" id="rj-lbl"></span><span class="m" id="rj-cnt"></span></div>
  <table class="dt" id="rj-tbl"></table>
  <div class="msg" id="rj-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 4.2, A natural join taken apart into the three operators it actually stands for.',
`<button class="btn" id="rj-step">Step</button><button class="btn" id="rj-back">Back</button>
 <button class="btn" id="rj-reset">Reset</button>`,
'product first, then selection, then projection')}
<p>Now the trap from Chapter 3 explains itself. If the two tables share <b>no</b> attribute name,
the selection step has no condition to apply, so nothing is filtered and you are left with the bare
Cartesian product.</p>
<p>A <b>theta join</b>, written R &#8904;<sub>&theta;</sub> S, is the same thing with a condition
<i>you</i> supply instead of one inferred from column names. That is
<code>INNER JOIN ... ON</code>.</p>
<p>Writing algebra expressions correctly means getting the <b>grouping of the predicate</b> right,
which is a favourite trap. To find patients operated on by Dr Nath or Dr Joseph:</p>
<div class="eq">&sigma;<sub>(name = &lsquo;Nath&rsquo; &or; name = &lsquo;Joseph&rsquo;) &and; (doctor.doc_id = roster.doc_id)</sub>(doctor &times; roster)
<span class="eqn">the join condition is ANDed with the whole OR, never made a third alternative</span></div>
<p>Writing <code>name = Nath &or; name = Joseph &or; doctor.doc_id = roster.doc_id</code> is
<b>wrong</b>: it keeps every row where the ids happen to match regardless of doctor, and every row
for those doctors regardless of whether the ids match. Using a natural join instead of a product
removes the need for the join condition entirely, which is why the natural-join form is usually
cleaner.</p>
</section>

<section>
<h2>5. Division</h2>
<p>The last operator answers a question none of the others can, and it is the one people find
hardest, so it is worth building slowly.</p>
${teach('Division', 'the &divide; operator', [
  'Given a relation R of pairs and a relation S of values, it returns the values that appear in R paired with <b>every single</b> row of S.',
  'Because "related to <b>all</b> of these" is a genuinely common question and nothing else in the algebra expresses it.',
  'A shopping checklist. You have six items you must buy, and a basket. Division asks: does the basket contain <b>every</b> item on the list?',
  'Divide <code>enrolment(roll_no, course_id)</code> by a list of course ids and you get the roll numbers of students who took <b>all</b> of them.',
  'For each candidate value, gather everything it is paired with, and check whether that set covers all of S. <b>Extra pairings are ignored.</b>',
  'R &divide; S = { <i>x</i> : for every <i>s</i> &isin; S, the pair (<i>x</i>, <i>s</i>) &isin; R }',
])}
<p>The shapes must line up, and this decides what the answer looks like:</p>
<div class="eq">R has the attributes of S <span class="op">plus</span> some extra ones <span class="op">&middot;</span> the result has <span class="v">only those extra ones</span>
<span class="eqn">so CAR &divide; COSTING returns just the attributes of CAR that COSTING does not have</span></div>
${wex('The lecture&rsquo;s worked example',
'<p style="margin:0 0 8px">R has attributes (A, B, C) and S has (A1, B1). Look for values of ' +
'(A, B, C) that appear alongside <b>every</b> row of S.</p>' +
mini(['R : (A, B, C, A1, B1)', 'S : (A1, B1)'],
  [['alpha a gamma paired with both S rows', 'row 1'],
   ['gamma a gamma paired with both S rows', 'row 2'],
   ['beta alpha gamma paired with only one', '']]) +
'<p style="margin:8px 0 0">So the answer is <b>{alpha a gamma, gamma a gamma}</b>. ' +
'<i>beta alpha gamma</i> fails because it is paired with only one of the two required rows: it ' +
'needs <b>all</b> of them, not some.</p>')}
${fig('f-div4',
`<div class="panel">
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">R : enrolled(sid, cid)</div><table class="dt" id="d4-r"></table></div>
    <div><div class="tname">S : required(cid)</div><table class="dt" id="d4-s"></table></div>
    <div><div class="tname">R &divide; S</div><table class="dt" id="d4-o"></table></div>
  </div>
  <div class="msg" id="d4-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 4.3, Division, checked one student at a time. Tick courses in and out of the requirement and watch the answer move.',
`<span class="lab">required set:</span><span id="d4-boxes"></span>
 <button class="btn" id="d4-step">Check next student</button><button class="btn" id="d4-reset">Reset</button>`,
'a student qualifies only if their courses cover the whole requirement')}
<p>Two things fall out of the definition and are worth noticing. <b>Extra pairings do no harm</b>:
a student who took an unrelated course still qualifies, because nothing is being counted, only
covered. And if S is <b>empty</b>, everybody qualifies trivially, because there is nothing they
could have missed.</p>
<p>This is the same idea as the <code>NOT EXISTS (required EXCEPT taken)</code> pattern from
Chapter 3. The algebra gives it one symbol; SQL has no division keyword, so it is spelled out with
a double negative.</p>
</section>

<section>
<h2>6. Tuple Relational Calculus</h2>
<p>The algebra says <b>how</b> to compute the answer. The calculus says <b>what the answer is</b>
and stays completely silent about how to get it. It is the formal counterpart of SQL&rsquo;s
declarative style.</p>
${teach('Tuple relational calculus', 'TRC', [
  'A notation describing the answer as "the set of all rows <i>t</i> such that some condition about <i>t</i> is true".',
  'Because it separates the description of a correct answer from any method of producing one, which is what makes optimisation possible in the first place.',
  'A wanted poster. It describes the person precisely without saying anything about how to find them.',
  '{ <i>t</i> | &exist; <i>s</i> &isin; student ( <i>s</i>.age = 21 &and; <i>t</i>.name = <i>s</i>.name ) }',
  '<b><i>t</i> stands for a row of the result</b>, not a table. It may end up representing many rows, but each one is a tuple.',
  '{ <i>t</i> | P(<i>t</i>) }: the set of tuples <i>t</i> for which the predicate P holds.',
])}
<p>Two symbols appear inside the predicate and both are worth reading aloud:</p>
<ul>
  <li><b>&exist;</b> means "there exists", so at least one.</li>
  <li><b>&forall;</b> means "for all", so every one.</li>
</ul>
${fig('f-trc',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 96" id="trc-svg"></svg>
  <div class="msg" id="trc-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 4.4, The five parts of a TRC expression. Each has a direct counterpart in SQL.',
`<span class="lab">explain:</span>${pills('tr', [['res', 'result variable'], ['quant', 'quantifier'], ['rel', 'the range'], ['cond', 'condition'], ['proj', 'projection']], -1)}`,
'a TRC expression states what is true of the answer, never how to find it')}
<p>The last clause is doing the job of projection, and the rule is worth stating on its own:
<b>whatever you equate to <i>t</i> is what comes out.</b> Add <i>t</i>.age = <i>s</i>.age and the
answer gains a column; leave it out and it does not appear. Note also that <b>the order of the
conditions does not matter</b>, only that all of them hold.</p>
${wex('Worked: the names of employees who work in the Manufacturing department',
'<div class="eq" style="margin:0 0 8px">{ <span class="v">m</span> | &exist; <span class="v">e</span> &isin; employee &exist; <span class="v">d</span> &isin; department ' +
'( <span class="v">e</span>.dept_id = <span class="v">d</span>.dept_id &and; <span class="v">d</span>.name = &lsquo;Manufacturing&rsquo; &and; ' +
'<span class="v">m</span>.name = <span class="v">e</span>.name ) }</div>' +
'<p style="margin:0">Four parts. <b>&exist;e, &exist;d</b> name the two tables. ' +
'<b>e.dept_id = d.dept_id</b> is the <b>joining condition</b>, and leaving it out gives a cross ' +
'join. <b>d.name = Manufacturing</b> is the filter. <b>m.name = e.name</b> is the projection. ' +
'To show the department too, add <b>m.dname = d.name</b>.</p>')}
<p>One more piece of vocabulary. The result variable <i>t</i> must be <b>free</b>, never captured
by a quantifier, since it is the thing the braces are collecting.</p>
</section>

<section>
<h2>7. Domain Relational Calculus</h2>
${teach('Domain relational calculus', 'DRC', [
  'The same idea as TRC, but with one variable per <b>column</b> instead of one per row.',
  'Because sometimes it is more natural to talk about individual values than about whole rows.',
  'Describing a person by listing the fields of their form separately, rather than pointing at the whole form.',
  '{ &lang;<i>a</i>&rang; | &exist;<i>b</i>, <i>c</i> ( &lang;<i>a</i>, <i>b</i>, <i>c</i>&rang; &isin; student &and; <i>b</i> = 21 ) }',
  'If student has three attributes then <i>a</i>, <i>b</i>, <i>c</i> stand for those three <b>in order</b>. Every attribute must appear, even ones you do not want, and those get quantified away with &exist;.',
  '{ &lang;<i>x</i><sub>1</sub>, &hellip;, <i>x</i><sub>n</sub>&rang; | P(<i>x</i><sub>1</sub>, &hellip;, <i>x</i><sub>n</sub>) }',
])}
<p>The three languages are <b>equivalent in expressive power</b>. Anything you can write in one can
be written in the others; they differ only in style. That is worth remembering as a fact in its own
right, because it is stated as one.</p>
<div class="eq"><span class="v">relational algebra</span> &nbsp;&equiv;&nbsp; <span class="v">tuple relational calculus</span> &nbsp;&equiv;&nbsp; <span class="v">domain relational calculus</span>
<span class="eqn">procedural &middot; non-procedural &middot; non-procedural</span></div>
</section>

<section>
<h2>8. Designing a Schema: the ER Model</h2>
<p>Everything so far assumed the tables already existed. Now the other half of the chapter: where do
the tables come from?</p>
<p>Picture a bank hiring a software company. The engineers know how to build databases but not how
the bank works. The bank knows its own rules but not how to build a database. What has to pass
between them is a <b>diagram</b>.</p>
<div class="eq">business rules <span class="op">&rarr;</span> ER diagram <span class="op">&rarr;</span> tables
<span class="eqn">the hard thinking happens while the design is still a picture and cheap to change</span></div>
<p>It is worth being clear about <b>why the diagram carries information the tables do not</b>. Given
a database with no documentation, you can follow the foreign keys and work out which tables connect
to which. What you <i>cannot</i> see is whether <b>every</b> row on one side must take part, or how
many rows may pair with how many, not without reading all the data, which is impossible at real
scale. The ER diagram states those rules explicitly.</p>
${teach('Entity set', 'a kind of thing', [
  'A collection of similar things the database needs to remember: employees, projects, students.',
  'Because a design starts by asking "what kinds of thing exist here?" before anything else.',
  'The nouns in a description of the business. "Employees work on projects" has two of them.',
  'Each entity set becomes a <b>table</b>, and each individual thing becomes a row.',
  'Drawn as a <b>rectangle</b>. In the notation this course uses, the attributes are listed <b>inside</b> the rectangle.',
  'A set of entities of the same type sharing the same attributes.',
])}
</section>

<section>
<h2>9. Attributes: Five Kinds</h2>
<p>An attribute is a property associated with an entity, which is to say a column. There are five
kinds and each is drawn differently.</p>
<dl class="tight">
  <dt>Simple attribute</dt>
  <dd>Cannot usefully be broken into parts. <code>id</code>, <code>salary</code>.</dd>
  <dt>Composite attribute</dt>
  <dd>Made of parts you actually <b>store separately</b>. <code>name</code> split into first, middle
  and last; <code>address</code> split into street, district, state, country and pin code.</dd>
  <dt>Single-valued attribute</dt>
  <dd>One value per entity. A person has one date of birth.</dd>
  <dt>Multivalued attribute</dt>
  <dd>Several values per entity. One person can have several <b>phone numbers</b>. Drawn with
  <b>curly braces</b> or a double oval.</dd>
  <dt>Derived attribute</dt>
  <dd>Computable from something else by a fixed rule, so it need not be stored. <b>Age</b> from date
  of birth; the day of the week from a date. Drawn with <b>round brackets</b> or a dashed oval.</dd>
</dl>
<p>The lecture makes one distinction very sharply, and it is easy to get wrong. <b>Date of birth is
single-valued, not composite.</b> You could argue it has a day, a month and a year, but you
<i>store it as one value</i> and <b>derive</b> the parts when you need them. It would only be
composite if you actually kept three separate columns. Composite means split and stored; derived
means stored once and computed from.</p>
${fig('f-attr',
`<div class="panel">
  <div class="phead"><span class="m" id="at-hd"></span><span class="m" id="at-tag"></span></div>
  <table class="dt" id="at-tbl"></table>
  <div class="msg" id="at-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 4.5, The five kinds, how each is drawn, and what each becomes in a table.',
`<span class="lab">attribute type:</span>${pills('at', [['sim', 'simple'], ['comp', 'composite'], ['sing', 'single-valued'], ['multi', 'multivalued'], ['der', 'derived']], 0)}`,
'the shape of the attribute tells you how it is stored')}
<p>The multivalued case is the first place the diagram and the table genuinely diverge, so it is
worth the reasoning in full.</p>
<p>An employee with three phone numbers cannot have three values in one cell, because no relational
table allows that (Chapter 6 calls that rule <b>first normal form</b>). You also cannot repeat the
employee row three times, because the employee id is the primary key and must be unique.</p>
<p>So the only resolution is a <b>separate table</b>, holding the employee id and one phone number
per row, with both together as its key. <b>One multivalued attribute becomes one extra table.</b></p>
</section>

<section>
<h2>10. ER Notation: The Symbols</h2>
<p>Reading a diagram is mostly recognising shapes. This is the whole vocabulary, and questions ask
about it directly.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Symbol</th><th>Means</th></tr></thead>
<tbody>
<tr><td><b>Rectangle</b></td><td>Entity set, with attributes listed inside</td></tr>
<tr><td><b>Double rectangle</b></td><td><b>Weak</b> entity set</td></tr>
<tr><td><b>Diamond</b></td><td>Relationship set</td></tr>
<tr><td><b>Double diamond</b></td><td><b>Identifying</b> relationship, for a weak entity</td></tr>
<tr><td><b>Underline</b></td><td>Primary key</td></tr>
<tr><td><b>Dashed underline</b></td><td><b>Partial key</b>, also called the discriminator</td></tr>
<tr><td><b>Single line</b></td><td><b>Partial</b> participation</td></tr>
<tr><td><b>Double line</b></td><td><b>Total</b> participation</td></tr>
<tr><td><b>Arrowhead</b></td><td>"one" on that side</td></tr>
<tr><td><b>Plain line end</b></td><td>"many" on that side</td></tr>
<tr><td><b>Curly braces { }</b></td><td>Multivalued attribute</td></tr>
<tr><td><b>Round brackets ( )</b></td><td>Derived attribute</td></tr>
<tr><td><b>Triangle</b></td><td>Generalization or specialization</td></tr>
</tbody></table></div>
<p>Three of those are worth separating because they are confused with each other in questions:
a <b>double line</b> is total participation, a <b>double diamond</b> is an identifying relationship,
and a <b>single line</b> is partial participation.</p>
<p>And one thing that is <b>not</b> shown: <b>foreign keys do not appear in an ER diagram.</b> They
appear when the diagram is turned into tables, and not before.</p>
</section>

<section>
<h2>11. Relationships and Cardinality</h2>
${teach('Relationship set', 'how two kinds of thing connect', [
  'An association between entity sets: employees <i>work on</i> projects, students <i>enrol in</i> courses.',
  'Because entities alone are just isolated lists. The value is in the connections between them.',
  'The verbs in a description of the business. "Employees <b>work on</b> projects" has one.',
  'Usually realised by a foreign key, and sometimes by a whole extra table.',
  'Drawn as a <b>diamond</b> between the rectangles it connects.',
  'A set of associations among entities from two or more entity sets.',
])}
<p>What makes the diagram valuable is that it also records <b>how many</b> rows on each side may
take part. That is <b>cardinality</b>, and it is drawn with arrows.</p>
<p>The reading rule is short: <b>an arrowhead means "one", a plain line means "many"</b>.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Rule</th><th>Drawn as</th><th>Reads as</th></tr></thead>
<tbody>
<tr><td><b>One to one</b></td><td>arrow on both sides</td><td>Each instructor advises <b>at most one</b> student, and each student has at most one instructor</td></tr>
<tr><td><b>One to many</b></td><td>arrow on the "one" side only</td><td>One instructor, many students</td></tr>
<tr><td><b>Many to one</b></td><td>the mirror image</td><td>The <b>same relationship</b>, read from the other end</td></tr>
<tr><td><b>Many to many</b></td><td>no arrows at all</td><td>Many students, many instructors</td></tr>
</tbody></table></div>
<p>Two clarifications the lecture is careful about.</p>
<p><b>One-to-many and many-to-one are not different relationships.</b> They are the same diagram read
from opposite ends. Instructor to student is one to many; student to instructor is many to one.</p>
<p><b>"At most one" allows zero.</b> An arrowhead constrains the maximum, not the minimum, so a
one-to-one relationship permits an instructor with no student at all. Forcing participation is a
separate notation, which is the next section.</p>
${fig('f-card',
`<div class="panel">
  <div class="phead"><span class="m" id="cd-rule"></span><span class="m" id="cd-name"></span></div>
  <svg class="d" viewBox="0 0 520 92" id="cd-svg"></svg>
  <div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px">
    <div class="cols" id="cd-tables"></div>
  </div>
  <div class="msg" id="cd-note" style="margin-top:10px"></div>
</div>`,
'Fig 4.6, One relationship under three rules, with the table design each one forces.',
`<span class="lab">business rule:</span>${pills('cd', [['11', 'one to one'], ['1n', 'one to many'], ['nm', 'many to many']], 1)}
 <span class="lab">participation:</span>${pills('pt', [['partial', 'partial'], ['total', 'total']], 0)}`,
'arrowhead means one, plain line means many')}
</section>

<section>
<h2>12. Participation</h2>
<p>Cardinality says how many partners a row <i>may</i> have. Participation is a separate question:
whether a row <b>must</b> have one at all. It can be asked of any cardinality.</p>
<dl class="tight">
  <dt>Partial participation, a <b>single</b> line</dt>
  <dd>Some rows take part and some do not. A project with nobody assigned to it is allowed.</dd>
  <dt>Total participation, a <b>double</b> line</dt>
  <dd>Every row on that side <b>must</b> take part. <b>A student cannot exist without an
  instructor.</b></dd>
</dl>
<p>The critical point, and it is asked as a trick: <b>participation is declared per side.</b> A
double line on the student side says every student must have an instructor. It says nothing about
instructors, so an instructor with no students is perfectly legal and does <i>not</i> violate the
constraint. Total participation on <b>both</b> sides requires a double line on both.</p>
<p>In tables, total participation on the side holding the foreign key is enforced by declaring that
column <code>NOT NULL</code>: a row cannot exist without a partner if it cannot leave the reference
empty. On the <i>other</i> side there is no simple column-level way to enforce it, which is a real
limitation rather than an oversight.</p>
</section>

<section>
<h2>13. Attributes That Belong to the Relationship</h2>
<p>Some facts belong to neither entity. Consider the <b>date an employee joined a project</b>.</p>
<p>Put it on the employee and it breaks the moment one employee joins two projects on different
dates: which date would the column hold? Put it on the project and it breaks the moment one project
has several employees. The fact belongs to the <b>pairing</b>, not to either side.</p>
<p>In the diagram it hangs off the <b>diamond</b>. Where it lands in the tables depends on the
cardinality, and it follows exactly the same logic as the foreign key:</p>
<ul>
  <li><b>Many to many:</b> easy, because the relationship already has its own table. The attribute
  becomes an ordinary column of it, beside the two foreign keys.</li>
  <li><b>One to many:</b> it goes on the <b>many</b> side, in the same table as the foreign key,
  that being the only side where one row means one pairing.</li>
  <li><b>One to one:</b> it goes wherever the foreign key went, and since either side is legal,
  <b>there are two equally correct mappings</b>.</li>
</ul>
${cyu('An ER diagram shows employee and project in a many-to-many relationship called works_on, with an attribute hours on the diamond. How many tables, and where does hours live?',
'<b>Three tables</b>: employee, project, and works_on. The many-to-many rule forces works_on into a table of its own whose primary key is the pair {emp_id, proj_id}, and <b>hours</b> becomes an ordinary column of it. It cannot live on either entity, because neither one identifies a single pairing.')}
</section>

<section>
<h2>14. Weak Entity Sets</h2>
<p>Every entity so far had a key of its own. Some genuinely do not.</p>
${teach('Weak entity set', 'no key of its own', [
  'An entity set that cannot identify its own rows using only its own attributes.',
  'Because some things only exist <i>in relation to</i> something else, and are only distinguishable within that context.',
  'Seat 14B. There is a 14B on every aircraft, so the seat number only identifies a seat once you say which flight.',
  '<b>section</b> is a weak entity of <b>course</b>. Section 1 of the Spring 2010 term means nothing until you say <i>which course</i>.',
  'It <b>cannot be designed independently</b>: it is always dependent on a strong entity set. Drawn as a <b>double rectangle</b>.',
  'An entity set with no proper subset of its attributes forming a key.',
])}
${teach('Partial key', 'also called the discriminator', [
  'The attribute or attributes that tell a weak entity&rsquo;s rows apart <b>within one owner</b>.',
  'Because you need something to distinguish two sections of the same course, even though it cannot distinguish them globally.',
  'The seat number 14B. Useless on its own; perfectly precise once you have fixed the flight.',
  'For <code>section</code>, the partial key is (sec_id, semester, year).',
  'Drawn with a <b>dashed underline</b>, and a partial key appears <b>only</b> in weak entity sets.',
  'An attribute set uniquely identifying the entities of a weak entity set within a single owner.',
])}
<div class="eq">primary key of a weak entity = <span class="v">partial key</span> + <span class="v">primary key of the strong entity</span>
<span class="eqn">so section is keyed by (course_id, sec_id, semester, year)</span></div>
<p>Two notations follow, and one constraint is <b>forced</b>.</p>
<p>The weak entity is a <b>double rectangle</b>, and the relationship joining it to its owner is a
<b>double diamond</b>, called an <b>identifying relationship</b>. A weak entity is always joined by
an identifying relationship, because an ordinary relationship is not what supplies the identity.</p>
<p>And a weak entity <b>must have total participation</b> in its identifying relationship, drawn as
a double line. A section with no course cannot exist, because its primary key would be half missing.
So the foreign key column is <code>NOT NULL</code>, always.</p>
${fig('f-weak',
`<div class="panel">
  <div class="phead"><span>section, a weak entity of course</span><span class="m" id="wk-verd"></span></div>
  <table class="dt" id="wk-tbl"></table>
  <div class="msg" id="wk-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 4.7, Why the section table cannot identify its own rows until it borrows a key.',
`<span class="lab">stage:</span>${pills('wk', [['a', 'partial key alone'], ['b', 'add course_id'], ['c', 'the composite key'], ['d', 'try a duplicate']], 0)}`,
'a weak entity has no key among its own attributes')}
</section>

<section>
<h2>15. Self-Reference, Ternary Relationships and Aggregation</h2>

<h3>A table that points at itself</h3>
<p>A manager is also an employee, so there is no separate manager table. The relationship runs from
the employee entity back to the <b>same</b> entity: a diamond with both lines going to one rectangle.
This is a <b>self-referencing</b> or recursive relationship.</p>
<pre><code><span class="kw">CREATE TABLE</span> employee (
    emp_id     <span class="kw">INT</span> <span class="kw">PRIMARY KEY</span>,
    name       <span class="kw">VARCHAR</span>(40),
    manager_id <span class="kw">INT</span>,
    <span class="kw">FOREIGN KEY</span> (manager_id) <span class="kw">REFERENCES</span> employee(emp_id)
);</code></pre>
<p>Reading the diagram takes one extra habit, because both lines land on the same box. <b>Read the
relationship name as an English sentence, left to right.</b> If the diamond says <i>manages</i>, then
whatever sits on the left is the manager, so the arrow marking "one" goes on the left. Rename it
<i>managed by</i> and the sentence reverses, so the notation must too.</p>

<h3>Ternary relationships</h3>
<p>A diamond may connect <b>three</b> entity sets rather than two, and in real designs this happens
often. A project guided by a teacher for a student is the standard example.</p>
<p>Conceptually there is nothing new. The mapping rule is the natural extension of the many-to-many
rule: <b>create a new table holding the primary key of every participating entity, and make all of
them together the composite primary key.</b> Any attribute on the diamond becomes an ordinary column
of that table.</p>
<div class="eq">R(<span class="v">a_id</span>, <span class="v">b_id</span>, <span class="v">c_id</span>, descriptive attributes) &nbsp; with PK { <span class="v">a_id</span>, <span class="v">b_id</span>, <span class="v">c_id</span> }</div>
<p>So a <code>prescribes</code> relationship among Doctor, Patient and Medicine, carrying a
<code>dated_on</code> attribute, maps to
<code>prescribes(<u>doc_num</u>, <u>patient_num</u>, <u>medicine_id</u>, dated_on)</code>. Without
all three keys you could not link back to all three entities, and that is the whole reason they must
be there.</p>

<h3>Aggregation</h3>
${teach('Aggregation', 'a relationship treated as an entity', [
  'Treating a whole relationship set as though it were an entity, so that <b>another</b> relationship can connect to it.',
  'Because sometimes a fact is about a <i>pairing</i>, not about any single entity. Without it you cannot express "an examiner evaluates this particular teacher-student-project arrangement".',
  'A contract between two companies being itself signed by a witness. The witness is not attached to either company: they are attached to the contract.',
  'A ternary <code>project_guide</code> relationship among teacher, student and project, which is then connected by an <code>evaluate</code> relationship to an examiner entity.',
  'The new relationship&rsquo;s table must hold the primary keys of <b>everything it links</b>, including all the keys of the aggregated relationship.',
  'An abstraction in which a relationship set is treated as a higher-level entity set.',
])}
<p>So <code>evaluate</code> maps to a table holding teacher_num, student_num, project_num and
examiner_num, plus any attributes of its own. The first three come as a block, because that block is
what identifies the arrangement being evaluated.</p>
</section>

<section>
<h2>16. Generalization and Specialization</h2>
<p>The last piece of ER notation describes inheritance. A <b>person</b> may be specialised into an
<b>employee</b> and a <b>student</b>. Going the other way, employee and student are generalised into
person. It is drawn as a <b>triangle</b> between the parent and its children.</p>
<p>Two <b>independent</b> labels can appear on it, and questions ask for both at once.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Question</th><th>Answer</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td rowspan="2">Can an entity be in <b>more than one</b> child?</td><td><b>Disjoint</b></td><td>No. A part is either manufactured or purchased, never both</td></tr>
<tr><td><b>Overlapping</b></td><td>Yes. Somebody can be both an employee and a student</td></tr>
<tr><td rowspan="2">Must <b>every</b> parent be in some child?</td><td><b>Total</b></td><td>Yes. Every person must be one of the children</td></tr>
<tr><td><b>Partial</b></td><td>No. Some person may be neither</td></tr>
</tbody></table></div>
${wex('Worked: a bank with Person, Employee and AccountHolder',
'<p style="margin:0 0 8px">The rules given: some Person entities are <b>neither</b> an Employee ' +
'nor an AccountHolder, such as a visitor. And some Person entities are <b>both</b>.</p>' +
'<p style="margin:0">Take the two questions separately. Can somebody be in two children at once? ' +
'<b>Yes</b>, so it is <b>overlapping</b>. Must everybody be in some child? <b>No</b>, because a ' +
'visitor is neither, so it is <b>partial</b>. The answer is <b>overlapping and partial</b>. ' +
'Answering these one question at a time is the reliable method, because the two labels are ' +
'independent and any of the four combinations is possible.</p>')}
<p>Worth keeping in proportion: relational databases have <b>no inheritance between tables</b>, so
there is no single mechanical mapping the way there is for everything else in this chapter.
Different systems handle it differently. Recognise the triangle and the two labels.</p>
</section>

<section>
<h2>17. Turning the Diagram Into Tables</h2>
<p>Collecting the whole procedure in one place. Run these in order and a correct diagram produces a
correct schema mechanically.</p>
<dl class="tight">
  <dt>Each entity set becomes a table</dt>
  <dd>Its attributes become columns; its key attribute becomes the primary key.</dd>
  <dt>Composite attributes flatten</dt>
  <dd>Only the leaves become columns. The parent name disappears.</dd>
  <dt>Multivalued attributes become their own table</dt>
  <dd>Holding the owner&rsquo;s key plus the value, with both together as the primary key.</dd>
  <dt>Derived attributes are usually not stored</dt>
  <dd>They are computed when asked for.</dd>
  <dt>One-to-one: foreign key on <b>either</b> side, plus UNIQUE</dt>
  <dd><b>Both mappings are correct</b>, and any descriptive attribute of the relationship travels
  with the foreign key. Choosing the side with total participation avoids nulls.</dd>
  <dt>One-to-many: foreign key on the many side</dt>
  <dd>No new table needed. Descriptive attributes go on the many side too.</dd>
  <dt>Many-to-many: a new table</dt>
  <dd>Primary key is the pair of foreign keys. Relationship attributes become its columns.</dd>
  <dt>Ternary and above: a new table too</dt>
  <dd>Holding the key of every participating entity, all of them together as the primary key.</dd>
  <dt>Weak entity: borrow a key</dt>
  <dd>Owner&rsquo;s key as a foreign key, and {owner key, partial key} as the primary key. The
  foreign key is <code>NOT NULL</code>, because total participation is forced.</dd>
  <dt>Self-referencing: a foreign key to the same table</dt>
  <dd>No new table. The column references its own table&rsquo;s primary key.</dd>
  <dt>Total participation becomes NOT NULL</dt>
  <dd>On the foreign key column, where the design allows it.</dd>
</dl>
${fig('f-map',
`<div class="panel">
  <div class="phead"><span class="m" id="mp-hd"></span><span class="m" id="mp-n"></span></div>
  <div id="mp-body"></div>
  <div class="msg" id="mp-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 4.8, Five diagram shapes and the exact tables each produces. Underlined columns form the primary key.',
`<span class="lab">shape:</span>${pills('mp', [['o1', 'one to one'], ['on', 'one to many'], ['nm', 'many to many'], ['tern', 'ternary'], ['weak', 'weak entity'], ['mv', 'multivalued attribute']], 0)}`,
'the cardinality decides whether the relationship needs a table of its own')}
${cyu('An ER diagram shows Course and Assignment. Assignment is a weak entity with total participation, related to Course by a many-to-one identifying relationship. Assignment has assignment_num, open_date and close_date. What is its schema?',
'<b>Assignment(<u>course_id</u>, <u>assignment_num</u>, open_date, close_date).</b> Because Assignment is weak, the primary key of the owning entity, <code>course_id</code>, is added and <b>becomes part of the primary key</b>, alongside the partial key <code>assignment_num</code>. It cannot be null, because total participation is forced. Note that <code>Assignment(<u>assignment_num</u>, course_id, ...)</code> with only assignment_num underlined is <b>wrong</b>: assignment number 1 could exist for many courses, so it does not identify a row on its own.')}
</section>

</article>` + cfoot('week-4');
}

function initWeek4() {
  /* ---- Fig 4.1 RA playground ---- */
  (function () {
    const C = ['sid', 'name', 'dept', 'age'];
    const R = [['1', 'Asha', 'Biology', 22], ['2', 'Ravi', 'Comp. Sci.', 27],
      ['3', 'Meera', 'Biology', 24], ['4', 'Vikram', 'Physics', 31], ['5', 'Nita', 'Biology', 20]];
    const EXPR = t => ({
      none: ['student', C, R, 'The base relation, untouched.'],
      sel: ['&sigma;<sub>age &gt; ' + t + '</sub>(student)', C, R.filter(r => r[3] > t),
        'Selection keeps <b>rows</b>. Every column survives; only the row count falls.'],
      proj: ['&pi;<sub>name, dept</sub>(student)', ['name', 'dept'], R.map(r => [r[1], r[2]]),
        'Projection keeps <b>columns</b>. Every row survives here, because these name values happen to be distinct. The threshold does nothing, since projection never looks at rows.'],
      both: ['&pi;<sub>name</sub>(&sigma;<sub>age &gt; ' + t + '</sub>(student))', ['name'],
        R.filter(r => r[3] > t).map(r => [r[1]]),
        'The <b>inner</b> operator runs first: rows are cut by selection, then columns by projection. Reading algebra means reading inside out.'],
      dup: ['&pi;<sub>dept</sub>(student)', ['dept'], [...new Set(R.map(r => r[2]))].map(d => [d]),
        'Three students are in Biology, yet Biology appears <b>once</b>. An algebra result is a set, so projection removes duplicates automatically. The SQL equivalent would need DISTINCT.'],
    });
    let cur = 'none';
    function draw(k) {
      cur = k || cur;
      const t = +$('#ra-t').value;
      $('#ra-t-v').textContent = t;
      const [expr, cols, rows, note] = EXPR(t)[cur];
      $('#ra-expr').innerHTML = expr;
      $('#ra-src').innerHTML = '<thead><tr>' + C.map(c => `<th>${c}</th>`).join('') +
        '</tr></thead><tbody>' + R.map(r => {
        const kept = (cur === 'sel' || cur === 'both') ? r[3] > t : true;
        return `<tr class="${kept ? '' : 'out'}">` + r.map(v => `<td>${v}</td>`).join('') + '</tr>';
      }).join('') + '</tbody>';
      $('#ra-out').innerHTML = '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') +
        '</tr></thead><tbody>' + rows.map(r => '<tr class="hi">' +
          r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      $('#ra-cnt').textContent = rows.length + ' rows, ' + cols.length + ' cols';
      $('#ra-note').innerHTML = note;
    }
    setPills($('#f-ra'), 'ra', draw);
    $('#ra-t').oninput = () => draw();
    draw('none');
  })();

  /* ---- Fig 4.2 join decomposed ---- */
  (function () {
    const A = [['1', 'Asha', 'BIO'], ['2', 'Ravi', 'CS']];
    const B = [['BIO', 'Watson'], ['CS', 'Taylor'], ['PH', 'Bohr']];
    const ST = [
      ['the two source relations', 'Two tables, side by side, before anything happens.'],
      ['student &times; dept', 'The <b>Cartesian product</b>: every pairing, 2 &times; 3 = 6 rows. Most are nonsense, such as Asha paired with a department she is not in.'],
      ['&sigma;<sub>student.dept = dept.dept</sub>( … )', 'The <b>selection</b> keeps only the pairs whose shared attribute agrees. Four rows fall away.'],
      ['&pi;<sub>each attribute once</sub>( … )', 'The <b>projection</b> drops the now-duplicated dept column. What is left is exactly the natural join.'],
    ];
    let k = 0;
    function draw() {
      let cols, rows;
      if (k === 0) {
        cols = ['sid', 'name', 'dept', '', 'dept', 'building'];
        rows = [];
        for (let i = 0; i < Math.max(A.length, B.length); i++)
          rows.push([A[i] ? A[i][0] : '', A[i] ? A[i][1] : '', A[i] ? A[i][2] : '', '',
            B[i] ? B[i][0] : '', B[i] ? B[i][1] : '', '']);
      } else {
        cols = k === 3 ? ['sid', 'name', 'dept', 'building']
          : ['sid', 'name', 's.dept', 'd.dept', 'building'];
        rows = [];
        A.forEach(a => B.forEach(b => {
          const match = a[2] === b[0];
          if (k >= 2 && !match) { if (k === 2) rows.push([a[0], a[1], a[2], b[0], b[1], 'out']); return; }
          rows.push(k === 3 ? [a[0], a[1], a[2], b[1], 'hi']
            : [a[0], a[1], a[2], b[0], b[1], k === 2 ? 'hi' : '']);
        }));
      }
      $('#rj-tbl').innerHTML = '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') +
        '</tr></thead><tbody>' + rows.map(r => {
        const cls = r[r.length - 1];
        const cells = r.slice(0, -1);
        return `<tr class="${cls === 'hi' || cls === 'out' ? cls : ''}">` +
          cells.map(v => `<td>${v}</td>`).join('') + '</tr>';
      }).join('') + '</tbody>';
      $('#rj-lbl').innerHTML = ST[k][0];
      $('#rj-cnt').textContent = 'stage ' + (k + 1) + ' of 4';
      $('#rj-note').innerHTML = ST[k][1];
      $('#rj-step').disabled = k >= 3;
      $('#rj-back').disabled = k <= 0;
    }
    $('#rj-step').onclick = () => { if (k < 3) k++; draw(); };
    $('#rj-back').onclick = () => { if (k > 0) k--; draw(); };
    $('#rj-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 4.3 division ---- */
  (function () {
    const ALL = ['BIO-101', 'BIO-102', 'BIO-301'];
    const EN = { '1': ['BIO-101', 'BIO-102', 'BIO-301', 'CS-319'], '2': ['BIO-101', 'BIO-102'],
      '3': ['BIO-301', 'BIO-102', 'BIO-101'], '4': ['CS-319'] };
    const NM = { '1': 'Asha', '2': 'Ravi', '3': 'Meera', '4': 'Vikram' };
    let req = new Set(ALL), cur = -1;
    $('#d4-boxes').innerHTML = ALL.map(c => `<button class="pill on" data-rq="${c}">${c}</button>`).join(' ');
    function draw() {
      const S = ALL.filter(c => req.has(c));
      const pairs = [];
      Object.keys(EN).forEach(s => EN[s].forEach(c => pairs.push([s, c])));
      const curSid = cur >= 0 ? Object.keys(EN)[cur] : null;
      $('#d4-r').innerHTML = '<thead><tr><th>sid</th><th>cid</th></tr></thead><tbody>' +
        pairs.map(p => `<tr class="${p[0] === curSid ? 'cu' : ''}"><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('') +
        '</tbody>';
      $('#d4-s').innerHTML = '<thead><tr><th>cid</th></tr></thead><tbody>' +
        (S.length ? S.map(c => `<tr class="hi"><td>${c}</td></tr>`).join('')
          : '<tr><td class="nul">empty</td></tr>') + '</tbody>';
      const win = Object.keys(EN).filter(s => S.every(c => EN[s].includes(c)));
      $('#d4-o').innerHTML = '<thead><tr><th>sid</th></tr></thead><tbody>' +
        (win.length ? win.map(s => `<tr class="hi"><td>${s}</td></tr>`).join('')
          : '<tr><td class="nul">empty</td></tr>') + '</tbody>';
      if (curSid) {
        const miss = S.filter(c => !EN[curSid].includes(c));
        $('#d4-note').innerHTML = miss.length
          ? '<b>' + NM[curSid] + '</b> is missing ' + miss.join(', ') + ', so sid ' + curSid + ' is not in the answer.'
          : '<b>' + NM[curSid] + '</b> covers the whole requirement, so sid ' + curSid + ' <b>is</b> in the answer.';
      } else {
        $('#d4-note').textContent = 'Press "Check next student" to walk through them one at a time.';
      }
      $('#f-div4-msg').textContent = S.length === 0
        ? 'With an empty requirement every student qualifies trivially, because there is nothing they could have missed.'
        : 'A student appears in R / S only if their rows cover every row of S. Extra courses outside the requirement make no difference.';
    }
    $$('[data-rq]').forEach(b => b.onclick = () => {
      const c = b.dataset.rq;
      req.has(c) ? req.delete(c) : req.add(c);
      b.classList.toggle('on', req.has(c));
      draw();
    });
    $('#d4-step').onclick = () => { cur = (cur + 1) % Object.keys(EN).length; draw(); };
    $('#d4-reset').onclick = () => {
      req = new Set(ALL); cur = -1; $$('[data-rq]').forEach(b => b.classList.add('on')); draw();
    };
    draw();
  })();

  /* ---- Fig 4.4 TRC anatomy ---- */
  (function () {
    const P = [
      ['res', 22, 46, '{  t  |',
        'The <b>result variable</b>. <i>t</i> stands for one tuple of the answer, and it must be <b>free</b>, never captured by a quantifier. It is what the braces are collecting. It represents rows, not a table.'],
      ['quant', 84, 46, '&#8707; s',
        'The <b>existential quantifier</b>, read "there exists". It says there is at least one row <i>s</i> for which everything that follows holds.'],
      ['rel', 142, 82, '&#8712; student',
        'The <b>range</b>. It says <i>s</i> is drawn from the student relation, which is the job <code>FROM</code> does in SQL.'],
      ['cond', 236, 108, '( s.age = 21 &#8743;',
        'The <b>condition</b> the row must satisfy, which is the job <code>WHERE</code> does in SQL. With two tables, the joining condition goes here too, and leaving it out gives a cross join.'],
      ['proj', 356, 132, 't.name = s.name )',
        'The <b>projection</b>. It says which parts of <i>s</i> appear in <i>t</i>, which is the job of the <code>SELECT</code> list. Add <i>t</i>.age = <i>s</i>.age and the answer gains a column.'],
    ];
    function draw(k) {
      let s = '';
      P.forEach(p => {
        const on = p[0] === k;
        if (on) s += `<rect x="${p[1] - 7}" y="30" width="${p[2]}" height="30" rx="4" ` +
          `fill="var(--indigo-tint)" stroke="var(--indigo)"/>`;
        s += DG.txt(p[1], 50, p[3], { cls: 'm', size: 12.5 });
      });
      s += DG.txt(DG.PAD, 82, 'read: the set of tuples t such that there exists a student s with…',
        { cls: 'm mu' });
      $('#trc-svg').innerHTML = s;
      const hit = P.find(p => p[0] === k);
      $('#trc-note').innerHTML = hit ? hit[4]
        : 'Pick a part of the expression to see what it does and which SQL clause it corresponds to.';
    }
    setPills($('#f-trc'), 'tr', draw);
    draw(null);
  })();

  /* ---- Fig 4.5 attribute kinds ---- */
  (function () {
    const A = {
      sim: ['Simple', 'drawn as a plain oval',
        [['example', 'emp_id, salary'], ['can it be split?', 'no'],
          ['how many values?', 'one'], ['in the table', 'one ordinary column']],
        'A <b>simple attribute</b> has no internal structure worth separating. It becomes one column, unchanged.'],
      comp: ['Composite', 'drawn with child ovals hanging off it',
        [['example', 'name into first, middle, last'], ['can it be split?', '<b>yes, and you do store the parts</b>'],
          ['how many values?', 'one, made of parts'], ['in the table', '<b>only the leaves</b> become columns']],
        'A <b>composite attribute</b> is split and the parts are stored separately. Address into street, district, state, country and pin code is the other standard example. In the table the parent name <b>disappears entirely</b>.'],
      sing: ['Single-valued', 'drawn as a plain oval',
        [['example', 'date_of_birth'], ['can it be split?', 'not as stored'],
          ['how many values?', '<b>exactly one</b>'], ['in the table', 'one ordinary column']],
        '<b>Date of birth is the classic trap.</b> It looks composite because it has a day, month and year, but you store it as <b>one value</b> and <b>derive</b> the parts. It would only be composite if you actually kept three columns.'],
      multi: ['Multivalued', 'double oval, or curly braces { }',
        [['example', 'phone_number'], ['can it be split?', 'not the point'],
          ['how many values?', '<b>several</b>'], ['in the table', '<b>a whole extra table</b>']],
        'One person can have three phone numbers. A cell cannot hold three values (first normal form forbids it) and the row cannot repeat (the key must be unique), so this becomes a <b>separate table</b> of (owner key, value) with both together as its key.'],
      der: ['Derived', 'dashed oval, or round brackets ( )',
        [['example', 'age, from date_of_birth'], ['can it be split?', 'not the point'],
          ['how many values?', 'one, computed'], ['in the table', '<b>usually not stored at all</b>']],
        'A <b>derived attribute</b> is computable from something else by a fixed rule, so storing it would be redundant and would go stale. Age from date of birth; the day of the week from a date.'],
    };
    function draw(k) {
      const [name, how, rows, note] = A[k];
      $('#at-tbl').innerHTML = '<thead><tr><th>question</th><th>answer</th></tr></thead><tbody>' +
        rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
      $('#at-hd').innerHTML = '<b>' + name + '</b>';
      $('#at-tag').textContent = how;
      $('#at-note').innerHTML = note;
      $('#f-attr-msg').textContent = k === 'sing'
        ? 'Composite means split and stored. Derived means stored once and computed from. Date of birth is the second, not the first.'
        : 'the shape of the attribute tells you how it is stored';
    }
    setPills($('#f-attr'), 'at', draw);
    draw('sim');
  })();

  /* ---- Fig 4.6 cardinality ---- */
  (function () {
    let card = '1n', part = 'partial';
    const RULE = {
      '11': 'Each employee runs at most one project, and each project has at most one employee.',
      '1n': 'One employee works on many projects, and each project has just one employee.',
      'nm': 'An employee works on many projects, and a project has many employees.',
    };
    const NOTE = {
      '11': 'Arrowheads on <b>both</b> sides. The foreign key may go on <b>either</b> table, but it must be marked <code>UNIQUE</code>, otherwise it could repeat and one project would end up with two employees. Both mappings are equally correct, which is why questions about 1:1 often have two right answers.',
      '1n': 'One arrowhead, on the <b>employee</b> side, because that is the "one" side. The foreign key must sit on the <b>many</b> side, project, because a single employee row could not hold several project ids at once.',
      'nm': 'No arrowheads at all. Neither table can hold the key, for that same reason in both directions, so the relationship becomes a <b>table of its own</b> with the pair of foreign keys as its primary key.',
    };
    function draw() {
      const arrowL = card === '11' || card === '1n', arrowR = card === '11';
      const dbl = part === 'total';
      let s = DG.box(24, 26, 108, 36, 'employee', null, { r: 4 }) +
        `<path d="M228 44 l30 -19 l30 19 l-30 19 Z" fill="var(--card)" stroke="var(--border)"/>` +
        DG.txt(258, 47, 'works_on', { anchor: 'middle', cls: 'm' }) +
        DG.box(388, 26, 108, 36, 'project', null, { r: 4 });
      s += DG.line(132, 44, 228, 44, { stroke: 'var(--foreground)' });
      if (dbl) s += DG.line(132, 49, 228, 49, { stroke: 'var(--foreground)' });
      s += DG.line(288, 44, 388, 44, { stroke: 'var(--foreground)' });
      if (arrowL) s += `<path d="M148 38 L136 44 L148 50" fill="none" stroke="var(--indigo)" stroke-width="1.7" stroke-linecap="round"/>`;
      if (arrowR) s += `<path d="M372 38 L384 44 L372 50" fill="none" stroke="var(--indigo)" stroke-width="1.7" stroke-linecap="round"/>`;
      s += DG.txt(78, 78, dbl ? 'total participation' : 'partial participation',
        { anchor: 'middle', cls: 'm mu' });
      $('#cd-svg').innerHTML = s;
      $('#cd-rule').textContent = RULE[card];
      $('#cd-name').textContent = { '11': '1 : 1', '1n': '1 : N', 'nm': 'M : N' }[card];
      const nn = dbl ? ' NOT NULL' : '';
      const T = {
        '11': [['employee', 'emp_id PK, name'], ['project', 'proj_id PK, title,<br>emp_id FK UNIQUE' + nn]],
        '1n': [['employee', 'emp_id PK, name'], ['project', 'proj_id PK, title,<br>emp_id FK' + nn]],
        'nm': [['employee', 'emp_id PK, name'], ['project', 'proj_id PK, title'],
          ['works_on', 'emp_id FK, proj_id FK,<br>PK (emp_id, proj_id)']],
      };
      $('#cd-tables').innerHTML = T[card].map(t =>
        `<div><div class="tname">${t[0]}</div><div style="font-family:var(--mono);font-size:11px;` +
        `line-height:1.75;color:var(--muted)">${t[1]}</div></div>`).join('');
      $('#cd-note').innerHTML = NOTE[card] +
        (dbl ? ' The double line on the employee side makes the foreign key column <code>NOT NULL</code>, so no employee may sit unpaired. It says <b>nothing</b> about projects: an unassigned project is still legal.' : '');
    }
    setPills($('#f-card'), 'cd', v => { card = v; draw(); });
    setPills($('#f-card'), 'pt', v => { part = v; draw(); });
    draw();
  })();

  /* ---- Fig 4.7 weak entity ---- */
  (function () {
    const BASE = [['CS-101', '1', 'Fall', '2009'], ['CS-101', '2', 'Fall', '2009'],
      ['BIO-301', '1', 'Fall', '2009'], ['CS-101', '1', 'Spring', '2010']];
    const S = {
      a: [['sec_id', 'semester', 'year'], BASE.map(r => r.slice(1)), [0, 2], 'no key at all',
        'Two rows both read <b>1, Fall, 2009</b>. Nothing among these attributes separates them, so there is no key here. That is exactly what makes <code>section</code> a <b>weak entity</b>: section 1 of Fall 2009 means nothing until you say <i>which course</i>.'],
      b: [['course_id', 'sec_id', 'semester', 'year'], BASE.map(r => r.slice()), [], 'still not unique on the partial key',
        'The owner&rsquo;s key is borrowed in. The two rows are now distinguishable, but <b>only because course_id differs</b>, so the partial key alone is still not a key.'],
      c: [['course_id', 'sec_id', 'semester', 'year'], BASE.map(r => r.slice()), [], 'PK { course_id, sec_id, semester, year }',
        'All four together form the primary key: <code>course_id</code> is <b>borrowed</b> from the strong entity, and (sec_id, semester, year) is the <b>partial key</b>, drawn with a dashed underline. It may repeat across courses, but never within one.'],
      d: [['course_id', 'sec_id', 'semester', 'year'], BASE.concat([['CS-101', '1', 'Fall', '2009']]), [0, 4], 'rejected',
        'A second CS-101 section 1 in Fall 2009 is attempted. The whole four-column combination already exists, so the composite key rejects it, which is precisely the rule we wanted.'],
    };
    function draw(k) {
      const [cols, rows, hl, verd, note] = S[k];
      const keyCols = (k === 'c' || k === 'd') ? [0, 1, 2, 3] : [];
      $('#wk-tbl').innerHTML = '<thead><tr>' + cols.map((c, i) =>
        `<th style="color:${keyCols.includes(i) ? 'var(--indigo)' : 'var(--muted)'}">${c}` +
        (keyCols.includes(i) ? (i === 0 ? ' (fk)' : '') : '') + '</th>').join('') +
        '</tr></thead><tbody>' + rows.map((r, j) =>
          `<tr class="${hl.includes(j) ? (k === 'd' && j === 4 ? 'lo' : 'cu') : ''}">` +
          r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      $('#wk-verd').textContent = verd;
      $('#wk-note').innerHTML = note;
      $('#f-weak-msg').textContent = k === 'd'
        ? 'The partial key must be unique once the owning course is fixed, and that is all it ever has to be.'
        : 'a weak entity has no key among its own attributes';
    }
    setPills($('#f-weak'), 'wk', draw);
    draw('a');
  })();

  /* ---- Fig 4.8 ER to tables ---- */
  (function () {
    const M = {
      o1: ['one to one', '2 tables',
        [['Manager', '<u>mgr_num</u>, mgr_name'],
          ['Department', '<u>dept_num</u>, dept_name, <b>mgr_num</b>, since']],
        'The foreign key may go on <b>either</b> side, and the descriptive attribute <code>since</code> travels with it. So <b>Manager(<u>mgr_num</u>, dept_num, mgr_name, since)</b> with a plain Department is <b>equally correct</b>. Questions on 1:1 mappings often have two right options for exactly this reason. Whichever side takes it should be marked UNIQUE.'],
      on: ['one to many', '2 tables',
        [['Instructor', '<u>id</u>, name'],
          ['Student', '<u>s_id</u>, name, <b>advisor_id</b>, since']],
        'The foreign key must sit on the <b>many</b> side, because a single instructor row could not hold several student ids at once. Any descriptive attribute goes with it, on the many side.'],
      nm: ['many to many', '3 tables',
        [['Student', '<u>s_id</u>, name'], ['Course', '<u>course_id</u>, title'],
          ['enrolls', '<u>course_id</u>, <u>s_id</u>, join_date, completion_status']],
        'Neither entity can hold the link, so the relationship needs a <b>table of its own</b>. Its primary key is <b>both</b> foreign keys together, and the descriptive attributes become ordinary columns. Underlining only one of the two keys is wrong.'],
      tern: ['ternary', '4 tables',
        [['Doctor', '<u>doc_num</u>, name'], ['Patient', '<u>patient_num</u>, name'],
          ['Medicine', '<u>medicine_id</u>, name'],
          ['prescribes', '<u>doc_num</u>, <u>patient_num</u>, <u>medicine_id</u>, dated_on']],
        'The extension of the many-to-many rule: the relationship table holds the primary key of <b>every</b> participating entity, and all of them together form the primary key. Without all three you could not link back to all three entities.'],
      weak: ['weak entity', '2 tables',
        [['Course', '<u>course_id</u>, title'],
          ['Assignment', '<u>course_id</u>, <u>assignment_num</u>, open_date, close_date']],
        'The owner&rsquo;s key is added to the weak entity and <b>becomes part of its primary key</b>, alongside the partial key. It is <code>NOT NULL</code>, because total participation is forced. <b>Assignment(<u>assignment_num</u>, course_id, …)</b>, underlining only the partial key, is wrong: assignment 1 exists for many courses.'],
      mv: ['multivalued attribute', '2 tables',
        [['Employee', '<u>emp_id</u>, name'],
          ['Employee_phone', '<u>emp_id</u>, <u>phone_number</u>']],
        'A multivalued attribute cannot be a column: a cell holds one value and the key cannot repeat. So it becomes its own table of (owner key, value), with <b>both together</b> as the primary key. One multivalued attribute, one extra table.'],
    };
    function draw(k) {
      const [name, n, tables, note] = M[k];
      $('#mp-body').innerHTML = '<table class="dt"><thead><tr><th>table</th><th>columns</th></tr></thead><tbody>' +
        tables.map(t => `<tr><td><b>${t[0]}</b></td><td style="font-family:var(--mono);font-size:11.5px">${t[1]}</td></tr>`).join('') +
        '</tbody></table>';
      $('#mp-hd').textContent = name;
      $('#mp-n').textContent = n;
      $('#mp-note').innerHTML = note;
      $('#f-map-msg').textContent = 'the cardinality decides whether the relationship needs a table of its own';
    }
    setPills($('#f-map'), 'mp', draw);
    draw('o1');
  })();
}
</script>
