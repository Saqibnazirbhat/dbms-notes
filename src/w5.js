<script>
function renderWeek5() {
  return chead('week-5') + `<article>

<section>
<h2>1. What Goes Wrong in a Badly Designed Table</h2>
<p>Chapter 4 turned a diagram into tables. This chapter asks a different question: given a table,
<b>is it any good?</b> And it answers it without needing a diagram at all.</p>
<p>Start with a table that looks perfectly reasonable. One row per enrolment, holding everything
anyone might want to know.</p>
${fig('f-anom',
`<div class="panel">
  <div class="phead"><span>enrolment</span><span class="m" id="an-cnt"></span></div>
  <table class="dt" id="an-tbl"></table>
  <div class="msg" id="an-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.1, The same table under three ordinary operations. Each one causes damage that has nothing to do with the operation itself.',
`<span class="lab">try:</span>${pills('an', [['none', 'as stored'], ['ins', 'insert a new course'], ['del', 'delete a student'], ['upd', 'change a room']], 0)}`,
'the trouble is redundancy: one fact stored in many places')}
<p>Look at what the table repeats. The room for DBMS is written on <b>every</b> row that mentions
DBMS. That single duplicated fact causes three distinct kinds of trouble, and they have names.</p>
${teach('Insertion anomaly', 'cannot record a fact', [
  'Being unable to store a fact you know, because the table demands other facts you do not have yet.',
  'It is a symptom: it tells you two <b>unrelated</b> things have been forced into one table.',
  'A form that refuses to save your address until you also enter a car registration number. The two have nothing to do with each other.',
  'A new course exists and has a room, but nobody has enrolled yet. There is no row to put it on, because <code>sid</code> is part of the key and cannot be empty.',
  'The primary key forbids the null, so the row is rejected and the fact is simply lost.',
  'A tuple cannot be inserted without supplying values for attributes unrelated to the fact being recorded.',
])}
${teach('Deletion anomaly', 'lose a fact by accident', [
  'Deleting one fact silently destroys a different, unrelated fact that was riding along in the same row.',
  'Same diagnosis: two facts sharing a row means you cannot remove one without removing the other.',
  'Tearing a page out of a notebook to remove a shopping list, and losing the phone number that happened to be on the back.',
  'The last student enrolled in PDSA withdraws. Removing that row also removes the only record of <b>where PDSA is taught</b>.',
  'The room fact had no home of its own. It only ever existed as a passenger on enrolment rows.',
  'Deleting a tuple causes loss of information about an entity other than the one being deleted.',
])}
${teach('Update anomaly', 'change it here, forget it there', [
  'One change has to be made in many places at once, and missing one leaves the database contradicting itself.',
  'Because a fact stored <i>n</i> times has to be corrected <i>n</i> times, and sooner or later somebody updates fewer than all of them.',
  'Your address written in six address books. Move house, update five, and one book is now quietly wrong, with nothing to indicate which.',
  'DBMS moves to a new room. Every enrolment row for DBMS must change. Update three of four and the database now claims DBMS is in two rooms.',
  'Nothing prevents the inconsistency, because as far as the table is concerned each row is independent.',
  'A change to a single fact requires modifying multiple tuples, risking inconsistency.',
])}
<p>All three share <b>one</b> root cause: <b>redundancy</b>, the same fact stored more than once.
The cure is to split the table so every fact lives in exactly one place, and the rest of this
chapter is about doing that <b>reliably</b>, rather than by intuition.</p>
</section>

<section>
<h2>2. Functional Dependencies</h2>
<p>To split a table correctly you first need a precise way to say "this fact determines that fact".
That is a functional dependency, and it is the tool the whole chapter is built on.</p>
${teach('Functional dependency', 'written A &rarr; B', [
  'A rule saying: if two rows agree on A, they <b>must</b> agree on B. Fix A, and B is fixed too.',
  'Because the anomalies above came from storing a fact many times, and this is the notation that lets you <b>spot</b> which fact that is, mechanically, without guessing.',
  'A postcode determines a town. Tell me the postcode and I can tell you the town, and any two letters with the same postcode had better name the same town.',
  '<code>course_id &rarr; room</code>: once you know the course, the room is settled.',
  'Read A &rarr; B as "A determines B". A is the <b>determinant</b>, B is the <b>dependent</b>.',
  'For all tuples <i>t</i><sub>1</sub>, <i>t</i><sub>2</sub> of R: if <i>t</i><sub>1</sub>[A] = <i>t</i><sub>2</sub>[A] then <i>t</i><sub>1</sub>[B] = <i>t</i><sub>2</sub>[B].',
])}
<p>Two cautions that matter more than they look.</p>
<p><b>A dependency is a rule about the world, not an observation about today&rsquo;s rows.</b> If
every row in the table happens to have a different name, that does not make
<code>name &rarr; id</code> true. Tomorrow&rsquo;s row could break it. Data can <b>disprove</b> a
dependency but it can never <b>prove</b> one.</p>
<p><b>The arrow does not run both ways.</b> <code>course_id &rarr; room</code> does not give you
<code>room &rarr; course_id</code>, since one room hosts many courses.</p>
${fig('f-fd',
`<div class="panel">
  <div class="phead"><span class="m" id="fd-claim"></span><span class="m" id="fd-verd"></span></div>
  <table class="dt" id="fd-tbl"></table>
  <div class="msg" id="fd-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.2, Testing a claimed dependency the only way you can: look for two rows that agree on the left and disagree on the right.',
`<span class="lab">claim:</span>${pills('fd', [['a', 'course_id &rarr; room'], ['b', 'room &rarr; course_id'], ['c', 'sid &rarr; sname'], ['d', 'sname &rarr; sid'], ['e', 'sid, course_id &rarr; marks']], 0)}`,
'one counterexample is enough to kill a dependency')}

<h3>Trivial dependencies</h3>
<p>A dependency is <b>trivial</b> when the right side is <b>contained in</b> the left.</p>
<div class="eq"><span class="v">&alpha; &rarr; &beta;</span> is trivial &nbsp;&hArr;&nbsp; <span class="v">&beta; &sube; &alpha;</span>
<span class="eqn">so AB &rarr; B is trivial, and AB &rarr; BC is not</span></div>
<p>Trivial dependencies are always true, in every table, and tell you nothing. They cannot be false:
two rows agreeing on both A and B obviously agree on B. Watch the direction carefully, since the
common wrong answer states it as <b>&alpha; &sube; &beta;</b>, which is backwards.</p>

<h3>Full and partial dependencies</h3>
<p>Given key {sid, course_id}, the dependency <code>{sid, course_id} &rarr; marks</code> is
<b>full</b>, because dropping either half breaks it. But
<code>{sid, course_id} &rarr; sname</code> is <b>partial</b>, because <code>sid</code> alone already
determines the name. Partial dependency on a key is precisely what second normal form forbids, and
precisely where the repeated names in Fig 5.1 came from.</p>
</section>

<section>
<h2>3. Armstrong&rsquo;s Axioms</h2>
<p>Given a few dependencies you are told, others follow automatically. Six rules let you derive
every one of them, and they are <b>sound</b> (they never produce a false dependency) and
<b>complete</b> (they can produce every true one).</p>
<div class="tw"><table class="pt">
<thead><tr><th>Rule</th><th>If you have</th><th>You may conclude</th><th>Why it is true</th></tr></thead>
<tbody>
<tr><td><b>Reflexivity</b></td><td>&beta; &sube; &alpha;</td><td>&alpha; &rarr; &beta;</td><td>Rows agreeing on all of &alpha; agree on any part of it. This is the trivial case</td></tr>
<tr><td><b>Augmentation</b></td><td>&alpha; &rarr; &beta;</td><td>&gamma;&alpha; &rarr; &gamma;&beta;</td><td>Extra columns on both sides cannot break a rule; agreeing on more is a stronger condition</td></tr>
<tr><td><b>Transitivity</b></td><td>&alpha; &rarr; &beta;, &beta; &rarr; &gamma;</td><td>&alpha; &rarr; &gamma;</td><td>&alpha; pins down &beta;, and &beta; pins down &gamma;. This is the one that does real work</td></tr>
<tr><td><b>Union</b></td><td>&alpha; &rarr; &beta;, &alpha; &rarr; &gamma;</td><td>&alpha; &rarr; &beta;&gamma;</td><td>If &alpha; settles each separately it settles both together</td></tr>
<tr><td><b>Decomposition</b></td><td>&alpha; &rarr; &beta;&gamma;</td><td>&alpha; &rarr; &beta;, &alpha; &rarr; &gamma;</td><td>The reverse. This is why the right side can always be split to one attribute</td></tr>
<tr><td><b>Pseudo&#8209;transitivity</b></td><td>&alpha; &rarr; &beta;, &beta;&gamma; &rarr; &delta;</td><td>&alpha;&gamma; &rarr; &delta;</td><td>&alpha;&gamma; gives &beta; by the first rule, and &beta; with &gamma; gives &delta; by the second</td></tr>
</tbody></table></div>
<p>The first three are the <b>axioms</b> proper; the last three are shortcuts derivable from them.
In practice the union and decomposition rules are the ones you use without noticing: they are why
<code>A &rarr; BC</code> and the pair <code>A &rarr; B</code>, <code>A &rarr; C</code> are
interchangeable.</p>
<p>Questions about these usually ask you to <b>name the steps</b> in order, so it is worth
practising saying them aloud.</p>
${wex('Worked: show that PA &rarr; C follows from F = { P &rarr; Q, P &rarr; R, RA &rarr; B, RA &rarr; C, Q &rarr; B }',
'<p style="margin:0 0 8px">Look for the target on some right-hand side. <code>C</code> appears in ' +
'<code>RA &rarr; C</code>, so you need to reach <code>RA</code> from <code>PA</code>.</p>' +
mini(['step', 'rule', 'gives'],
  [['start from P &rarr; R', 'given', 'P &rarr; R'],
   ['add A to both sides', '<b>augmentation</b>', 'PA &rarr; RA'],
   ['chain with RA &rarr; C', '<b>transitivity</b>', '<b>PA &rarr; C</b>']]) +
'<p style="margin:8px 0 0">So the correct phrasing is: <b>augment P &rarr; R with A to get ' +
'PA &rarr; RA, then transitivity with RA &rarr; C</b>. Options naming <i>reflexivity</i> at the ' +
'first step are wrong, since reflexivity produces trivial dependencies and nothing was trivial ' +
'here.</p>')}
${fig('f-arm',
`<div class="panel">
  <div class="phead"><span class="m" id="ar-goal"></span><span class="m" id="ar-step"></span></div>
  <table class="dt" id="ar-tbl"></table>
  <div class="msg" id="ar-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.3, A derivation, one axiom at a time. Given three dependencies, reach a fourth that was never stated.',
`<button class="btn" id="ar-step-b">Apply next rule</button><button class="btn" id="ar-reset">Reset</button>`,
'given dependencies imply others, and the axioms are how you find them')}
${teach('Closure of a dependency set', 'written F&#8314;', [
  'Every dependency that follows from the ones you were given, including the ones you were given.',
  'Because two designers may write down different-looking rule sets that mean exactly the same thing, and the only way to compare them is to compare what they <b>imply</b>.',
  'The full set of conclusions derivable from a few facts. You were told three things, but a hundred follow.',
  'From <code>A &rarr; B</code> and <code>B &rarr; C</code>, F&#8314; contains <code>A &rarr; C</code>, <code>A &rarr; BC</code>, <code>AB &rarr; C</code> and many more.',
  'Apply the six rules over and over until nothing new appears. It is finite, but it grows explosively.',
  'F&#8314; is the smallest set containing F and closed under Armstrong&rsquo;s axioms.',
])}
<p>Computing all of F&#8314; is almost never practical or necessary, which is exactly why the next
section exists.</p>
</section>

<section>
<h2>4. Closure of an Attribute Set</h2>
<p>Instead of asking "what does this whole rule set imply?", ask the far cheaper question:
<b>starting from these attributes, what else can I reach?</b></p>
${teach('Attribute closure', 'written X&#8314;', [
  'The complete set of attributes that X determines: everything you can work out once you know X.',
  'Because almost every question in this chapter reduces to it. Is X a key? Does A &rarr; B hold? Is this attribute redundant? All of them are one closure computation.',
  'Standing in a city and asking which places you can reach on foot. You keep walking to newly reachable places, and each one may open up more.',
  'Given <code>A &rarr; B</code> and <code>B &rarr; C</code>, the closure A&#8314; is {A, B, C}.',
  'Start with X itself, since <b>every attribute determines itself</b>. Then scan the dependencies: whenever a left side is <b>fully inside</b> your set, add its right side. Repeat until a whole pass adds nothing.',
  'X&#8314; = { A : X &rarr; A is in F&#8314; }',
])}
<p>Two details decide whether you get the right answer.</p>
<ul>
  <li><b>The left side must be <i>entirely</i> contained in your set.</b> With
  <code>AB &rarr; D</code>, having A alone is not enough; you need B as well.</li>
  <li><b>You must keep sweeping.</b> A dependency that did not fire on the first pass may fire on
  the third, once earlier ones have added its missing attribute. Stop only when a complete pass adds
  nothing new.</li>
</ul>
${wex('Worked: find {P, R}&#8314; under F = { P &rarr; Q, QR &rarr; ST, PTU &rarr; V }',
mini(['step', 'why', 'the set so far'],
  [['start', 'every attribute determines itself', 'P, R'],
   ['P &rarr; Q fires', 'P is in the set', 'P, R, Q'],
   ['QR &rarr; ST fires', 'both Q and R are now in the set', '<b>P, R, Q, S, T</b>'],
   ['PTU &rarr; V does not fire', '<b>U is missing</b>, and the whole left side is required', 'unchanged']]) +
'<p style="margin:8px 0 0">So {P, R}&#8314; = <b>{P, Q, R, S, T}</b>. The third dependency is the ' +
'test: it has P and T but not U, and a partial match counts for nothing.</p>')}
${fig('f-clo',
`<div class="panel">
  <div class="phead"><span class="m" id="cl-set"></span><span class="m" id="cl-pass"></span></div>
  <table class="dt" id="cl-tbl"></table>
  <div class="msg" id="cl-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.4, Closure computed step by step. Note the dependency that only becomes usable after an earlier one has fired.',
`<span class="lab">start from:</span>${pills('cl', [['A', 'A'], ['B', 'B'], ['C', 'C'], ['AB', 'A, B'], ['CD', 'C, D']], 0)}
 <button class="btn" id="cl-step">Step</button><button class="btn" id="cl-all">Run to completion</button>
 <button class="btn" id="cl-reset">Reset</button>`,
'a dependency fires only when its whole left side is already in the set')}
<p>Once you have closure, testing a dependency becomes instant:</p>
<div class="eq">to test whether <span class="v">X &rarr; Y</span> holds: compute <span class="v">X&#8314;</span> and check whether <span class="v">Y &sube; X&#8314;</span>
<span class="eqn">no need to build F&#8314; at all</span></div>
</section>

<section>
<h2>5. Finding Every Candidate Key</h2>
<p>Chapter 2 defined superkey and candidate key in words. Closure turns both into a calculation.</p>
<div class="eq"><span class="v">X</span> is a superkey &nbsp;&hArr;&nbsp; <span class="v">X&#8314;</span> = all attributes
<span class="eqn">and X is a candidate key if, additionally, no proper subset of X has that property</span></div>
<p>The naive method is to test all 2<sup>n</sup> subsets, which is hopeless. There is a much better
route, and it starts by looking at <b>where each attribute appears</b> across the dependency set.</p>
<dl class="tight">
  <dt>An attribute appearing <b>only on left sides</b>, or in no dependency at all</dt>
  <dd><b>No incoming arrow.</b> Nothing can determine it, so it <b>must</b> be in every candidate
  key. Start here.</dd>
  <dt>An attribute appearing <b>only on right sides</b></dt>
  <dd>Something else determines it, so it is <b>never</b> in a candidate key. Ignore it.</dd>
  <dt>An attribute appearing on <b>both</b> sides</dt>
  <dd>Undecided. Add these to the essential set, one combination at a time, until the closure covers
  everything.</dd>
</dl>
<p>That "no incoming arrow" test is the single most useful shortcut in this chapter. If <b>A</b>
never appears on a right-hand side, then <b>every</b> candidate key contains A, and you can ignore
every subset that does not.</p>
${wex('Worked: R(A, B, C, X, Y, Z) with F = { AB &rarr; C, C &rarr; X, X &rarr; Y, Y &rarr; Z, Z &rarr; B }',
'<p style="margin:0 0 8px"><b>Step 1.</b> A never appears on a right-hand side, so <b>A is in ' +
'every candidate key</b>. Also, no single attribute&rsquo;s closure covers R, so no attribute is a ' +
'candidate key on its own.</p>' +
'<p style="margin:0 0 8px"><b>Step 2.</b> Pair A with each of the others and compute closures.</p>' +
mini(['set', 'closure, step by step', 'covers R?'],
  [['AB&#8314;', 'AB, +C, +X, +Y, +Z', ['yes', 'hi']],
   ['AC&#8314;', 'AC, +X, +Y, +Z, +B', ['yes', 'hi']],
   ['AY&#8314;', 'AY, +Z, +B, +C, +X', ['yes', 'hi']],
   ['AZ&#8314;', 'AZ, +B, +C, +X, +Y', ['yes', 'hi']],
   ['AX&#8314;', 'AX, +Y, +Z, +B, +C', ['yes', 'hi']]]) +
'<p style="margin:8px 0 0">So <b>AB, AC, AX, AY and AZ are all candidate keys</b>. Each is minimal, ' +
'because A alone and the partner alone both fail. The cycle C &rarr; X &rarr; Y &rarr; Z &rarr; B ' +
'&rarr; C is what makes every one of them work: enter the cycle anywhere and you go all the way ' +
'round.</p>')}
${fig('f-key5',
`<div class="panel">
  <div class="phead"><span class="m" id="k5-hd"></span><span class="m" id="k5-verd"></span></div>
  <table class="dt" id="k5-tbl"></table>
  <div class="msg" id="k5-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.5, The method in four stages, on a different dependency set.',
`<span class="lab">stage:</span>${pills('k5', [['s', 'classify attributes'], ['e', 'the essential set'], ['t', 'test candidates'], ['r', 'candidate keys']], 0)}`,
'an attribute that appears only on the right can never be part of a key')}
</section>

<section>
<h2>6. Prime and Non-Prime Attributes</h2>
<p>Once you have <b>every</b> candidate key, two more labels fall out, and Chapter 6 uses them
constantly.</p>
${teach('Prime attribute', 'part of some candidate key', [
  'An attribute belonging to <b>at least one</b> candidate key.',
  'Because the normal forms in Chapter 6 are stated in terms of prime and non-prime, so you cannot check them until you know which is which.',
  'Being on <i>any</i> of the shortlists. You do not have to be on all of them.',
  'If the candidate keys are {AB} and {DE}, then A, B, D and E are prime, and everything else is not.',
  'The word is <b>some</b>, not <b>the</b>. An attribute in one candidate key is prime even if it is absent from all the others.',
  'A &isin; some candidate key of R.',
])}
${teach('Non-prime attribute', 'in no candidate key at all', [
  'An attribute belonging to <b>no</b> candidate key.',
  'Because these are the attributes the normal forms protect: partial and transitive dependencies are defined on them.',
  'Being on none of the shortlists.',
  'With candidate keys {AB} and {DE} in R(A,B,C,D,E), only <b>C</b> is non-prime.',
  'You must find <b>all</b> candidate keys first. Missing one turns a prime attribute into a non-prime one and every later answer goes wrong.',
  'A &notin; any candidate key of R.',
])}
${wex('Worked: R(P, Q, C, A, B) with F = { P &rarr; QC, CA &rarr; B, Q &rarr; A, B &rarr; P }',
'<p style="margin:0 0 8px">Compute the closure of each single attribute first.</p>' +
mini(['closure', 'result', 'covers R?'],
  [['P&#8314;', 'P, +QC, +A (Q&rarr;A), +B (CA&rarr;B) = PQCAB', ['yes', 'hi']],
   ['Q&#8314;', 'Q, +A = QA', ['no', 'out']],
   ['C&#8314;', 'C', ['no', 'out']],
   ['A&#8314;', 'A', ['no', 'out']],
   ['B&#8314;', 'B, +P, +QC, +A = BPQCA', ['yes', 'hi']]]) +
'<p style="margin:8px 0 0"><b>P and B are candidate keys.</b> Now try combinations of the ' +
'undecided ones.</p>' +
mini(['closure', 'result', 'covers R?'],
  [['QC&#8314;', 'QC, +A, +B, +P = QCABP', ['yes', 'hi']],
   ['CA&#8314;', 'CA, +B, +P, +Q = CABPQ', ['yes', 'hi']]]) +
'<p style="margin:8px 0 0">So the candidate keys are <b>P, B, QC and CA</b>. Between them they ' +
'contain P, B, Q, C and A, which is <b>every attribute</b>. Therefore <b>all five attributes are ' +
'prime</b> and there are no non-prime attributes at all. Stopping after finding P and B would have ' +
'given the wrong answer, which is why you must find them all.</p>')}
</section>

<section>
<h2>7. Counting Superkeys</h2>
<p>A superkey is any set <b>containing</b> a candidate key. So fix the candidate key as present, and
every other attribute is independently free.</p>
<div class="eq">with <span class="v">n</span> attributes and one candidate key of size <span class="v">k</span>: &nbsp; <span class="v">2<sup>n&minus;k</sup></span> superkeys</div>
<p>The commonest case is a single-attribute key, giving <b>2<sup>n&minus;1</sup></b>. For a relation
with 4 attributes and a single-attribute primary key, that is 2<sup>3</sup> = <b>8</b>.</p>
<p>Two situations need more care.</p>
<dl class="tight">
  <dt>Several candidate keys</dt>
  <dd>Do <b>not</b> just add the counts, since sets containing two keys would be counted twice. Add,
  then subtract the overlap.</dd>
  <dt>The relation came from a join</dt>
  <dd>Work out the attributes of the joined relation first. R = studinfo(studId, name, state)
  &#8904; enroll(studId, courseId) has <b>4</b> attributes, and studId is still the key, so
  2<sup>3</sup> = <b>8</b> superkeys.</dd>
</dl>
</section>

<section>
<h2>8. Extraneous Attributes and the Canonical Cover</h2>
<p>A dependency set may carry parts that do no work. Removing them leaves a smaller set meaning
exactly the same thing, which matters because every constraint the database enforces costs time on
every update.</p>
${teach('Extraneous attribute', 'a part that does nothing', [
  'An attribute in a dependency that can be deleted without changing what the whole set implies.',
  'Because the database enforces every dependency on every update, so a rule with dead weight in it is a permanent tax on writes.',
  'A recipe saying "bake at 180C in an oven". Removing "in an oven" changes nothing: it was already implied.',
  'In {A &rarr; C, AB &rarr; C}, the B in the second rule is extraneous, because A alone already gives C.',
  'Test it by removing the attribute and asking whether the reduced set still implies everything the original did.',
  'An attribute whose removal from a dependency leaves an equivalent set F.',
])}
<p>The test differs depending on which side the attribute is on, and the difference is worth holding
onto.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Side</th><th>Question</th><th>Compute the closure using</th><th>Why</th></tr></thead>
<tbody>
<tr><td><b>Left</b>, in &alpha;&beta; &rarr; &gamma;</td><td>Is &beta; extraneous?</td><td><b>all of F</b>, then check &gamma; &sube; &alpha;&#8314;</td><td>Dropping a left attribute makes the rule <b>stronger</b>, so you must confirm the stronger rule is still justified</td></tr>
<tr><td><b>Right</b>, in &alpha; &rarr; &beta;&gamma;</td><td>Is &gamma; extraneous?</td><td><b>F with &gamma; already removed</b>, then check &gamma; &isin; &alpha;&#8314;</td><td>Dropping a right attribute makes the rule <b>weaker</b>, so the question is whether anything was lost</td></tr>
</tbody></table></div>
${wex('Worked: which attribute is extraneous in F = { A &rarr; B, A &rarr; D, D &rarr; C, AB &rarr; C, B &rarr; E }?',
'<p style="margin:0 0 8px">Look for a rule whose left side has more than it needs. The only ' +
'candidate is <code>AB &rarr; C</code>, so ask whether <b>B</b> is extraneous there.</p>' +
'<p style="margin:0 0 8px">Test it by computing <b>A&#8314;</b> using all of F: start with A, then ' +
'<code>A &rarr; B</code> adds B, <code>A &rarr; D</code> adds D, <code>D &rarr; C</code> adds <b>C</b>, ' +
'and <code>B &rarr; E</code> adds E. So A&#8314; = {A, B, C, D, E}.</p>' +
'<p style="margin:0">Since <b>C is in A&#8314;</b>, the rule <code>A &rarr; C</code> already ' +
'follows from the rest, which means the B in <code>AB &rarr; C</code> is doing nothing. ' +
'<b>B is extraneous.</b> Put more simply: A &rarr; D and D &rarr; C give A &rarr; C by transitivity, ' +
'so AB &rarr; C carries dead weight.</p>')}
${teach('Canonical cover', 'written F_c', [
  'A minimal dependency set that implies exactly the same things as the original.',
  'Because fewer and simpler constraints mean less checking work on every insert and update, with no loss of meaning.',
  'Trimming a list of instructions down to the shortest version that still produces the same result.',
  '{A &rarr; BC, B &rarr; C, AB &rarr; C} reduces to {A &rarr; B, B &rarr; C}.',
  'Repeatedly: merge rules with the same left side using the union rule, then remove extraneous attributes, <b>rechecking from the start</b> after each removal, since one removal can make another possible.',
  'F_c is equivalent to F, no dependency contains an extraneous attribute, and no two dependencies share a left side.',
])}
<p>The re-checking is not optional. Removing one attribute changes the set, which can make an
attribute that was previously essential become extraneous. Stop only when a full pass changes
nothing.</p>
</section>

<section>
<h2>9. When Are Two Dependency Sets Equivalent?</h2>
<p>Two designers hand you different rule sets for the same table. Do they mean the same thing?</p>
<p>You do not compare them rule by rule, since that fails immediately: <code>A &rarr; BC</code> and
the pair <code>A &rarr; B</code>, <code>A &rarr; C</code> look different and mean the same. Instead
check <b>coverage in both directions</b>.</p>
<div class="eq"><span class="v">F</span> &equiv; <span class="v">G</span> &nbsp;&hArr;&nbsp; F covers G &nbsp;and&nbsp; G covers F</div>
<p>"F covers G" means every dependency in G can be derived from F. Checking it needs nothing but
attribute closure:</p>
<ol>
  <li>Take each dependency <code>X &rarr; Y</code> in G, one at a time.</li>
  <li>Compute X&#8314; <b>using F</b>.</li>
  <li>If Y &sube; X&#8314;, that one is covered. If any is not, F does not cover G.</li>
</ol>
<p>Then repeat the whole thing the other way round. Three outcomes are possible: both directions
hold and the sets are equivalent; only one holds and that set is strictly stronger; neither holds
and they are simply different.</p>
${cyu('F = {A &rarr; B, B &rarr; C} and G = {A &rarr; B, A &rarr; C, B &rarr; C}. Equivalent?',
'<b>Yes.</b> Check G from F: A&#8314; under F is {A, B, C}, which covers both A &rarr; B and A &rarr; C; and B &rarr; C is in F already. Now check F from G: both of its rules are literally in G. Both directions hold, so the sets are equivalent. G merely writes out <code>A &rarr; C</code>, which F leaves implicit by transitivity.')}
</section>

<section>
<h2>10. Lossless Join Decomposition</h2>
<p>The cure for the anomalies in section 1 was to split the table. But splitting can go wrong in a
way that is easy to miss, because the damage only shows when you put the pieces back together.</p>
${teach('Lossless join decomposition', 'a split you can undo', [
  'A split into two tables such that joining them back gives you <b>exactly</b> the original rows, no more and no fewer.',
  'Because a split that cannot be undone has destroyed information, and the failure is silent: both fragments look perfectly healthy on their own.',
  'Cutting a photo into two pieces you can line back up, rather than shredding it. Both leave you with pieces; only one is reversible.',
  'Splitting enrolment into (sid, course_id) and (course_id, room) is lossless. Splitting on the wrong column invents rows that were never there.',
  'The join must not <b>gain</b> rows either. Extra rows are just as wrong as missing ones: they are facts the database is now asserting that were never true.',
  'R<sub>1</sub> &#8904; R<sub>2</sub> = R for every legal instance of R.',
])}
<p>The condition is short and mechanical. First the shape must be right, then the key test:</p>
<div class="eq"><span class="v">R<sub>1</sub></span> &cup; <span class="v">R<sub>2</sub></span> = R &nbsp;&middot;&nbsp; <span class="v">R<sub>1</sub></span> &cap; <span class="v">R<sub>2</sub></span> &ne; &empty;
<span class="eqn">and then: ( R<sub>1</sub> &cap; R<sub>2</sub> ) &rarr; R<sub>1</sub> &nbsp;or&nbsp; ( R<sub>1</sub> &cap; R<sub>2</sub> ) &rarr; R<sub>2</sub></span></div>
<p>In words: <b>the columns the two tables have in common must be a key of at least one of them.</b>
If they are, that side has one row per shared value and the join can only line each row up one way.
If they are not, several rows on each side share the value, the join pairs them all together, and
rows appear that never existed.</p>
${fig('f-loss',
`<div class="panel">
  <div class="phead"><span class="m" id="ls-hd"></span><span class="m" id="ls-verd"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname" id="ls-l1"></div><table class="dt" id="ls-t1"></table></div>
    <div><div class="tname" id="ls-l2"></div><table class="dt" id="ls-t2"></table></div>
  </div>
  <div style="margin-top:12px"><div class="tname">rejoined</div><table class="dt" id="ls-res"></table></div>
  <div class="msg" id="ls-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.6, The same table split two ways. One rejoins perfectly; the other invents rows that were never in the original.',
`<span class="lab">split on:</span>${pills('ls', [['good', 'shared: course_id'], ['bad', 'shared: room']], 0)}`,
'the shared columns must be a key of at least one piece')}
<p>Notice the failure mode. The lossy split does not lose rows: it <b>gains</b> them. Every original
row is still there, buried among fabrications, and no query can tell which is which. That is why
this must be checked before decomposing, not after.</p>

<h3>Which dependency was holding it together?</h3>
<p>A sharper version of the question, and a good test of whether you really have the rule. Given a
lossless decomposition, <b>which dependency, if removed, would make it lossy?</b></p>
${wex('Worked: R(A,B,C,D,E) with F = { A &rarr; BCD, C &rarr; E, B &rarr; D, C &rarr; D, E &rarr; B }, split into R1(A,B,C) and R2(A,D,E)',
'<p style="margin:0 0 8px">Shape first: R1 &cup; R2 = R, and R1 &cap; R2 = <b>{A}</b>, which is not ' +
'empty. Good.</p>' +
'<p style="margin:0 0 8px">Now the key test. <b>A&#8314; under F</b> = A, +BCD, then C &rarr; E adds ' +
'E, giving ABCDE. So A is a candidate key of R, it certainly determines R1, and the decomposition ' +
'is <b>lossless</b>.</p>' +
'<p style="margin:0 0 8px">Now remove each dependency in turn and recompute A&#8314;.</p>' +
mini(['remove', 'A&#8314; becomes', 'still lossless?'],
  [['A &rarr; C', '<b>ABD</b> (A&rarr;B, A&rarr;D only)', ['no', 'lo']],
   ['B &rarr; D', 'ABCDE', ['yes', 'hi']],
   ['A &rarr; B', 'ACDE, then E&rarr;B adds B', ['yes', 'hi']],
   ['E &rarr; B', 'ABCDE', ['yes', 'hi']]]) +
'<p style="margin:8px 0 0">Only removing <b>A &rarr; C</b> breaks it. Without it, A&#8314; = {A,B,D}, ' +
'which contains neither R1 nor R2 in full, so the shared attribute A no longer determines either ' +
'piece and the split becomes <b>lossy</b>. Note that <code>A &rarr; BCD</code> is being read as ' +
'the three separate rules A &rarr; B, A &rarr; C, A &rarr; D, using the decomposition axiom.</p>')}
</section>

<section>
<h2>11. Dependency Preservation</h2>
<p>Losslessness is not the only thing a split can break. A decomposition can be perfectly lossless
and still leave the database unable to <b>enforce</b> one of its own rules.</p>
${teach('Dependency preservation', 'every rule still checkable in one table', [
  'A split where every original dependency can still be enforced by looking at a <b>single</b> table.',
  'Because a rule whose two sides end up in different tables can only be checked by joining them, and no database performs a join on every insert.',
  'A rule saying "the name on the form must match the name on the ID". Keep them in one folder and it is checkable at a glance. File them in separate rooms and nobody ever checks.',
  'If <code>course_id &rarr; room</code> ends up with course_id in one table and room in another, nothing stops two contradictory rows being inserted.',
  'For each dependency, ask whether <b>all</b> its attributes appear together in one fragment. If they do, that fragment enforces it locally. A dependency <b>implied</b> by the preserved ones counts as preserved too.',
  '(F<sub>1</sub> &cup; &hellip; &cup; F<sub>n</sub>)&#8314; = F&#8314;, where F<sub>i</sub> is the restriction of F to R<sub>i</sub>.',
])}
${fig('f-dep',
`<div class="panel">
  <div class="phead"><span class="m" id="dp-hd"></span><span class="m" id="dp-verd"></span></div>
  <table class="dt" id="dp-tbl"></table>
  <div class="msg" id="dp-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 5.7, Three splits of one relation, each checked against every dependency. Only the first keeps every rule enforceable.',
`<span class="lab">decomposition:</span>${pills('dp', [['x', 'AB | BC'], ['y', 'AC | BC'], ['z', 'AB | AC']], 0)}`,
'a dependency survives only if all its attributes stay in one table')}
<p>So a decomposition is judged on two <b>independent</b> tests, and you want both:</p>
<div class="tw"><table class="pt">
<thead><tr><th>Property</th><th>The question it answers</th><th>What breaks without it</th></tr></thead>
<tbody>
<tr><td><b>Lossless join</b></td><td>Can the original be reconstructed exactly?</td><td>Queries return rows that were never true. <b>Non-negotiable.</b></td></tr>
<tr><td><b>Dependency preserving</b></td><td>Can every rule still be checked in one table?</td><td>Bad data can be inserted without any single table noticing. Highly desirable, and occasionally impossible.</td></tr>
</tbody></table></div>
<p>Independent means exactly that: passing one says nothing about the other, and Fig 5.7 shows a
split that is lossless and still loses a rule.</p>
<p>Losslessness can always be achieved. Dependency preservation sometimes cannot, and the next
chapter meets a normal form where you must choose between preserving dependencies and removing all
redundancy, and cannot have both.</p>
</section>

</article>` + cfoot('week-5');
}

function initWeek5() {
  /* ---- Fig 5.1 anomalies ---- */
  (function () {
    const BASE = [['s1', 'Asha', 'DBMS', 'LH-1', 78], ['s2', 'Ravi', 'DBMS', 'LH-1', 91],
      ['s1', 'Asha', 'PDSA', 'LH-3', 66], ['s3', 'Meera', 'PDSA', 'LH-3', 71],
      ['s4', 'Vikram', 'DBMS', 'LH-1', 55]];
    const H = ['sid', 'sname', 'course_id', 'room', 'marks'];
    function draw(k) {
      let rows = BASE.map(r => [...r, '']);
      let note = '', cnt = rows.length + ' rows', msg = 'the trouble is redundancy: one fact stored in many places', cls = '';
      if (k === 'none') {
        note = 'Look at the <b>room</b> column. LH-1 is written three times and LH-3 twice, ' +
          'yet each is a single fact about a single course. That repetition is the disease; the ' +
          'three anomalies are its symptoms.';
      } else if (k === 'ins') {
        rows.push([null, null, 'ML', 'LH-7', null, 'lo']);
        note = 'A new course <b>ML</b> exists and is taught in LH-7, but nobody has enrolled. ' +
          '<code>sid</code> is part of the primary key and cannot be NULL, so this row is <b>rejected</b> ' +
          'and the room fact cannot be recorded at all.';
        cnt = 'insert rejected'; cls = 'bad';
        msg = 'Insertion anomaly: a fact about a course cannot be stored until a student enrols in it.';
      } else if (k === 'del') {
        rows = rows.map((r, i) => (i === 2 || i === 3) ? [...r.slice(0, 5), 'out'] : r);
        note = 'Both PDSA students leave. The rows go, correctly, but they took the only record ' +
          'of <b>PDSA being taught in LH-3</b> with them. That fact had no home of its own.';
        cnt = '2 rows deleted'; cls = 'bad';
        msg = 'Deletion anomaly: removing the last enrolment destroys an unrelated fact about the course.';
      } else {
        rows = rows.map((r, i) => i === 0 || i === 1
          ? [r[0], r[1], r[2], 'LH-9', r[4], 'hi']
          : (i === 4 ? [...r.slice(0, 5), 'lo'] : r));
        note = 'DBMS moves to LH-9. Two rows are updated and the third is missed. The table now ' +
          'claims DBMS is in <b>two rooms at once</b>, and nothing in the database can say which is right.';
        cnt = 'inconsistent'; cls = 'bad';
        msg = 'Update anomaly: one fact stored three times must be changed three times, or the table contradicts itself.';
      }
      $('#an-tbl').innerHTML = '<thead><tr>' + H.map(h =>
        `<th${h === 'room' ? ' style="color:var(--terra)"' : ''}>${h}</th>`).join('') +
        '</tr></thead><tbody>' + rows.map(r => `<tr class="${r[5]}">` +
          r.slice(0, 5).map(v => v === null
            ? '<td class="nul">NULL</td>' : `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      $('#an-cnt').textContent = cnt;
      $('#an-note').innerHTML = note;
      const m = $('#f-anom-msg');
      m.className = 'msg ' + cls;
      m.textContent = msg;
    }
    setPills($('#f-anom'), 'an', draw);
    draw('none');
  })();

  /* ---- Fig 5.2 testing an FD ---- */
  (function () {
    const H = ['sid', 'sname', 'course_id', 'room', 'marks'];
    const R = [['s1', 'Asha', 'DBMS', 'LH-1', 78], ['s2', 'Ravi', 'DBMS', 'LH-1', 91],
      ['s1', 'Asha', 'PDSA', 'LH-3', 66], ['s3', 'Asha', 'PDSA', 'LH-3', 71],
      ['s4', 'Vikram', 'DBMS', 'LH-1', 55]];
    const C = {
      a: [[2], [3], 'course_id &rarr; room',
        'Every row with course_id DBMS shows LH-1, and every PDSA row shows LH-3. No two rows agree on the left and disagree on the right, so <b>nothing contradicts it</b>. This is the dependency the table should have been built around.'],
      b: [[3], [2], 'room &rarr; course_id',
        'It happens to hold in this data, but only by accident. One room hosting two courses would break it instantly, and it almost certainly will. A dependency must be a rule about the world, not about today&rsquo;s rows.'],
      c: [[0], [1], 'sid &rarr; sname',
        'Both rows with sid <b>s1</b> say Asha. Consistent, and it is also a real rule: a student has one name.'],
      d: [[1], [0], 'sname &rarr; sid',
        'Rows 3 and 4 both say <b>Asha</b> but carry sid s1 and s3: two different students who share a name. One counterexample is enough, so this dependency is <b>false</b>.'],
      e: [[0, 2], [4], 'sid, course_id &rarr; marks',
        'The left side is the pair. No two rows share both, so nothing can contradict it, and this is the dependency that makes {sid, course_id} the key.'],
    };
    function draw(k) {
      const [L, Rt, claim, note] = C[k];
      const key = r => L.map(i => r[i]).join('|');
      const seen = {}; let bad = [];
      R.forEach((r, j) => {
        const kk = key(r), v = Rt.map(i => r[i]).join('|');
        if (seen[kk] !== undefined && seen[kk][0] !== v) bad = [seen[kk][1], j];
        else if (seen[kk] === undefined) seen[kk] = [v, j];
      });
      const ok = bad.length === 0;
      $('#fd-tbl').innerHTML = '<thead><tr>' + H.map((h, i) =>
        `<th style="color:${L.includes(i) ? 'var(--indigo)' : Rt.includes(i) ? 'var(--terra)' : 'var(--muted)'}">` +
        h + (L.includes(i) ? ' (left)' : Rt.includes(i) ? ' (right)' : '') + '</th>').join('') +
        '</tr></thead><tbody>' + R.map((r, j) =>
          `<tr class="${bad.includes(j) ? 'lo' : ''}">` + r.map((v, i) =>
            `<td${L.includes(i) || Rt.includes(i) ? ' class="hl"' : ''}>${v}</td>`).join('') +
          '</tr>').join('') + '</tbody>';
      $('#fd-claim').innerHTML = claim;
      $('#fd-verd').textContent = ok ? 'no counterexample in this data' : 'counterexample found';
      $('#fd-note').innerHTML = note;
      const m = $('#f-fd-msg');
      m.className = 'msg ' + (ok ? 'good' : 'bad');
      m.textContent = ok
        ? 'No two rows agree on the left and disagree on the right. Data can never prove a dependency, only fail to disprove it.'
        : 'Two highlighted rows agree on the left and disagree on the right. That is a counterexample, and one is enough.';
    }
    setPills($('#f-fd'), 'fd', draw);
    draw('a');
  })();

  /* ---- Fig 5.3 Armstrong derivation ---- */
  (function () {
    const STEPS = [
      ['P &rarr; Q', 'given', ''],
      ['P &rarr; R', 'given', ''],
      ['RA &rarr; C', 'given', ''],
      ['PA &rarr; RA', '<b>augmentation</b> of P &rarr; R with A',
        'Adding the same attribute to both sides is always safe: agreeing on <i>more</i> is a stronger condition, so the rule still holds. This is the step people misname as reflexivity.'],
      ['PA &rarr; C', '<b>transitivity</b> with RA &rarr; C',
        'PA gives RA, and RA gives C. Therefore PA gives C, a dependency that appears nowhere in the given set yet must be true.'],
    ];
    let k = 3;
    function draw() {
      $('#ar-tbl').innerHTML = '<thead><tr><th>dependency</th><th>justification</th></tr></thead><tbody>' +
        STEPS.slice(0, k).map((s, i) => `<tr class="${i === k - 1 && k > 3 ? 'hi' : i < 3 ? '' : 'cu'}">` +
          `<td>${s[0]}</td><td>${s[1]}</td></tr>`).join('') + '</tbody>';
      $('#ar-goal').innerHTML = 'goal: show that PA &rarr; C follows from the given rules';
      $('#ar-step').textContent = k <= 3 ? 'given rules only' : 'step ' + (k - 3) + ' of 2';
      $('#ar-note').innerHTML = k <= 3
        ? 'Three of the given dependencies. Nothing has been derived yet. Press the button to apply one axiom at a time.'
        : STEPS[k - 1][2];
      $('#ar-step-b').disabled = k >= STEPS.length;
      $('#f-arm-msg').textContent = k >= STEPS.length
        ? 'PA → C was never stated, yet it is forced by the rules that were. Naming the steps in order is what these questions ask for.'
        : 'given dependencies imply others, and the axioms are how you find them';
    }
    $('#ar-step-b').onclick = () => { if (k < STEPS.length) k++; draw(); };
    $('#ar-reset').onclick = () => { k = 3; draw(); };
    draw();
  })();

  /* ---- Fig 5.4 attribute closure ---- */
  (function () {
    const F = [[['A'], ['B']], [['B'], ['C']], [['C', 'D'], ['E']], [['A', 'B'], ['D']]];
    const fdTxt = f => f[0].join('') + ' &rarr; ' + f[1].join('');
    let start = ['A'], cur = new Set(['A']), log = [], pass = 0, done = false;
    function reset(s) {
      start = s.split(''); cur = new Set(start); log = []; pass = 0; done = false;
    }
    function step() {
      if (done) return;
      pass++;
      let added = false;
      F.forEach(f => {
        if (f[0].every(a => cur.has(a)) && !f[1].every(a => cur.has(a))) {
          f[1].forEach(a => cur.add(a));
          log.push([pass, fdTxt(f), 'fires, adds ' + f[1].join(', ')]);
          added = true;
        }
      });
      if (!added) { log.push([pass, '&ndash;', 'a full pass added nothing, so the closure is complete']); done = true; }
    }
    function draw() {
      $('#cl-tbl').innerHTML = '<thead><tr><th>pass</th><th>dependency</th><th>effect</th></tr></thead><tbody>' +
        (log.length ? log.map((l, i) => `<tr class="${i === log.length - 1 ? 'hi' : ''}">` +
          `<td>${l[0]}</td><td>${l[1]}</td><td>${l[2]}</td></tr>`).join('')
          : '<tr><td class="nul">nothing yet</td><td class="nul">&ndash;</td><td class="nul">press Step</td></tr>') +
        '</tbody>';
      $('#cl-set').innerHTML = '{' + start.join(', ') + '}<sup>+</sup> = { ' +
        [...cur].sort().join(', ') + ' }';
      $('#cl-pass').textContent = done ? 'complete, ' + cur.size + ' attributes' : 'pass ' + pass;
      $('#cl-note').innerHTML = done
        ? (cur.size === 5
          ? 'The closure covers <b>every attribute</b>, so {' + start.join(', ') + '} is a <b>superkey</b>.'
          : 'The closure stops at ' + cur.size + ' of 5 attributes, so {' + start.join(', ') +
            '} is <b>not</b> a superkey: it cannot determine ' +
            ['A', 'B', 'C', 'D', 'E'].filter(a => !cur.has(a)).join(', ') + '.')
        : 'F = { A &rarr; B, B &rarr; C, CD &rarr; E, AB &rarr; D }. A dependency fires only when its <b>whole</b> left side is already in the set.';
      $('#cl-step').disabled = done;
      $('#cl-all').disabled = done;
      $('#f-clo-msg').textContent = start.join('') === 'A' && done
        ? 'Starting from A: CD → E could not fire until AB → D had supplied D. That is exactly why you must keep sweeping until a pass changes nothing.'
        : 'a dependency fires only when its whole left side is already in the set';
    }
    setPills($('#f-clo'), 'cl', v => { reset(v); draw(); });
    $('#cl-step').onclick = () => { step(); draw(); };
    $('#cl-all').onclick = () => { let n = 0; while (!done && n++ < 12) step(); draw(); };
    $('#cl-reset').onclick = () => { reset(start.join('')); draw(); };
    draw();
  })();

  /* ---- Fig 5.5 finding keys ---- */
  (function () {
    const N = {
      s: 'F = { A &rarr; B, B &rarr; C, CD &rarr; E, AB &rarr; D }. Sort every attribute by where it appears. <b>E</b> appears only on right sides, so something else determines it and it can <b>never</b> be part of a key. <b>A</b> has no incoming arrow, so it must be in <b>every</b> key.',
      e: '<b>A</b> appears only on left sides, so nothing determines it and every candidate key must contain it. Compute A&#8314;: A, then +B, then +C, then +D (from AB &rarr; D), then +E (from CD &rarr; E). That is <b>everything</b>, so A on its own is already a superkey.',
      t: 'Since A alone reaches everything, no superset of A needs testing: any set containing A is a superkey, but none of them is <b>minimal</b>. Only sets <i>not</i> containing A remain, and none of them can work, because nothing determines A.',
      r: '<b>A is the only candidate key.</b> Every other superkey contains it and is therefore not minimal. Note that B, C and D appear on left sides too, yet none of them is enough on its own: appearing on a left side is necessary for being in a key, not sufficient.',
    };
    function draw(k) {
      let head = '', verd = '';
      if (k === 's') {
        const rows = [['A', 'left only', 'must be in every key', 'hi'],
          ['B', 'both sides', 'undecided', ''], ['C', 'both sides', 'undecided', ''],
          ['D', 'both sides', 'undecided', ''], ['E', 'right only', 'can never be in a key', 'out']];
        head = 'where does each attribute appear?'; verd = '5 attributes';
        $('#k5-tbl').innerHTML = '<thead><tr><th>attribute</th><th>appears</th><th>conclusion</th></tr></thead><tbody>' +
          rows.map(r => `<tr class="${r[3]}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') +
          '</tbody>';
      } else {
        const T = {
          e: [['A', '{A, B, C, D, E}', 'yes', 'hi']],
          t: [['A', '{A, B, C, D, E}', 'yes', 'hi'], ['B', '{B, C}', 'no', 'out'],
            ['C', '{C}', 'no', 'out'], ['D', '{D}', 'no', 'out'],
            ['BD', '{B, C, D, E}', 'no', 'out'], ['CD', '{C, D, E}', 'no', 'out']],
          r: [['A', '{A, B, C, D, E}', 'yes', 'hi']],
        }[k];
        head = k === 'e' ? 'the essential attribute' : k === 't' ? 'testing candidate sets' : 'candidate keys';
        verd = k === 'r' ? '1 candidate key' : T.length + ' tested';
        $('#k5-tbl').innerHTML = '<thead><tr><th>set X</th><th>X&#8314;</th><th>superkey?</th></tr></thead><tbody>' +
          T.map(r => `<tr class="${r[3]}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') +
          '</tbody>';
      }
      $('#k5-hd').textContent = head;
      $('#k5-verd').textContent = verd;
      $('#k5-note').innerHTML = N[k];
      $('#f-key5-msg').textContent = 'an attribute that appears only on the right can never be part of a key';
    }
    setPills($('#f-key5'), 'k5', draw);
    draw('s');
  })();

  /* ---- Fig 5.6 lossless join ---- */
  (function () {
    const R = [['s1', 'DBMS', 'LH-1'], ['s2', 'DBMS', 'LH-1'], ['s3', 'PDSA', 'LH-3'],
      ['s4', 'ML', 'LH-1']];
    function draw(k) {
      const good = k === 'good';
      let t1, t2, c1, c2, res;
      if (good) {
        c1 = ['sid', 'course_id']; c2 = ['course_id', 'room'];
        t1 = R.map(r => [r[0], r[1]]);
        t2 = [...new Map(R.map(r => [r[1], [r[1], r[2]]])).values()];
        res = t1.map(a => [a[0], a[1], t2.find(b => b[0] === a[1])[1]]);
      } else {
        c1 = ['sid', 'room']; c2 = ['room', 'course_id'];
        t1 = R.map(r => [r[0], r[2]]);
        t2 = [...new Map(R.map(r => [r[2] + r[1], [r[2], r[1]]])).values()];
        res = [];
        t1.forEach(a => t2.forEach(b => { if (a[1] === b[0]) res.push([a[0], b[1], a[1]]); }));
      }
      const orig = new Set(R.map(r => r.join('|')));
      const tb = (id, cols, rows) => $(id).innerHTML = '<thead><tr>' +
        cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr>' + r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      tb('#ls-t1', c1, t1); tb('#ls-t2', c2, t2);
      $('#ls-l1').textContent = 'R1(' + c1.join(', ') + ')';
      $('#ls-l2').textContent = 'R2(' + c2.join(', ') + ')';
      $('#ls-res').innerHTML = '<thead><tr><th>sid</th><th>course_id</th><th>room</th></tr></thead><tbody>' +
        res.map(r => {
          const real = orig.has(r.join('|'));
          return `<tr class="${real ? '' : 'lo'}">` + r.map(v => `<td>${v}</td>`).join('') + '</tr>';
        }).join('') + '</tbody>';
      const spur = res.filter(r => !orig.has(r.join('|'))).length;
      $('#ls-hd').innerHTML = good
        ? 'shared attribute <b>course_id</b>: is it a key of R2?'
        : 'shared attribute <b>room</b>: is it a key of either piece?';
      $('#ls-verd').textContent = spur ? spur + ' fabricated rows' : 'exact reconstruction';
      $('#ls-note').innerHTML = good
        ? '<code>course_id</code> is a key of R2 (one room per course), so each R1 row lines up with exactly one R2 row. The join returns the original four rows and nothing else.'
        : '<code>room</code> is a key of <b>neither</b> piece: LH-1 appears three times on the left and twice on the right. The join pairs them all, producing ' +
          spur + ' rows that were never in the original, and no query can tell them from the real ones.';
      const m = $('#f-loss-msg');
      m.className = 'msg ' + (spur ? 'bad' : 'good');
      m.textContent = spur
        ? 'Lossy. Notice it did not lose rows: it gained them. All four originals are still there, buried among fabrications.'
        : 'Lossless. The shared column is a key of R2, so the join can only line each row up one way.';
    }
    setPills($('#f-loss'), 'ls', draw);
    draw('good');
  })();

  /* ---- Fig 5.7 dependency preservation ---- */
  (function () {
    const F = [['A', 'B'], ['B', 'C'], ['A', 'C']];
    const D = { x: [['A', 'B'], ['B', 'C']], y: [['A', 'C'], ['B', 'C']], z: [['A', 'B'], ['A', 'C']] };
    function draw(k) {
      const parts = D[k];
      const rows = F.map(f => {
        const home = parts.findIndex(p => p.includes(f[0]) && p.includes(f[1]));
        return [f[0] + ' &rarr; ' + f[1],
          home >= 0 ? 'R' + (home + 1) + '(' + parts[home].join('') + ')' : 'no single table',
          home >= 0];
      });
      if (k === 'x') rows[2] = ['A &rarr; C', 'implied by R1 and R2', true];
      const lost = rows.filter(r => !r[2]).length;
      $('#dp-tbl').innerHTML = '<thead><tr><th>dependency</th><th>enforceable in</th><th>preserved?</th></tr></thead><tbody>' +
        rows.map(r => `<tr class="${r[2] ? 'hi' : 'lo'}"><td>${r[0]}</td><td>${r[1]}</td>` +
          `<td>${r[2] ? 'yes' : 'no'}</td></tr>`).join('') + '</tbody>';
      $('#dp-hd').innerHTML = 'R(A, B, C) split into ' +
        parts.map((p, i) => 'R' + (i + 1) + '(' + p.join(', ') + ')').join(' and ') +
        ' &middot; F = { A &rarr; B, B &rarr; C, A &rarr; C }';
      $('#dp-verd').textContent = lost ? lost + ' dependency lost' : 'all preserved';
      $('#dp-note').innerHTML = {
        x: 'Both stated rules sit inside a table, and <code>A &rarr; C</code> needs no table of its own: it follows from the other two by transitivity, so enforcing them enforces it. <b>Fully preserving</b>, and lossless too, since B is a key of R2.',
        y: '<code>A &rarr; B</code> is lost: A is in R1 and B is in R2, so no single table can check it. Two rows could be inserted giving the same A different Bs and neither table would object. This split also fails the <b>lossless</b> test, since the shared attribute C is a key of neither piece, so it is bad on both counts.',
        z: '<code>B &rarr; C</code> is lost: B is in R1 and C is in R2, and nothing left implies it. But this split <b>is</b> lossless, since the shared attribute A determines everything and is therefore a key of both pieces. That is the point of this figure: <b>lossless and dependency-preserving are independent tests</b>, and passing one says nothing about the other.',
      }[k];
      const m = $('#f-dep-msg');
      m.className = 'msg ' + (lost ? 'bad' : 'good');
      m.textContent = lost
        ? 'A rule whose two attributes land in different tables can only be checked by joining them, so in practice it is never checked at all.'
        : 'Every dependency can be enforced by looking at one table, so bad data is caught on insert.';
    }
    setPills($('#f-dep'), 'dp', draw);
    draw('x');
  })();
}
</script>
