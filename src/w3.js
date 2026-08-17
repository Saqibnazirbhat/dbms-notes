<script>
function renderWeek3() {
  return chead('week-3') + `<article>

<section>
<h2>1. The Database Everything Is Built On</h2>
<p>Every query in this chapter runs against one schema, the <b>university database</b>. Learning it
once now saves re-reading it at every example, and it is the same schema the practice questions
use.</p>
${fig('f-uni',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 176" id="un-svg"></svg>
  <div class="msg" id="un-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 3.1, The university schema. Pick a table to see its columns and how it links to the others.',
`<span class="lab">table:</span>${pills('un', [['classroom', 'classroom'], ['department', 'department'], ['course', 'course'], ['instructor', 'instructor'], ['section', 'section'], ['teaches', 'teaches'], ['student', 'student'], ['takes', 'takes']], -1)}`,
'a query is easy once you know which tables hold the facts it needs')}
<p>Two of these tables carry most of the examples, so here they are in full. Every row below is
used later in the chapter.</p>
${wex('classroom, the whole table', mini(
  ['building', 'room_number', 'capacity'],
  [['Packard', '101', '500'], ['Painter', '514', '10'], ['Taylor', '3128', '70'],
   ['Watson', '100', '30'], ['Watson', '120', '50']]) +
  '<p style="margin:8px 0 0">Notice <b>Watson appears twice</b>, because one building can hold ' +
  'several classrooms. That single fact is what makes the next section necessary.</p>')}
${wex('instructor, the whole table', mini(
  ['ID', 'name', 'dept_name', 'salary'],
  [['10101', 'Srinivasan', 'Comp. Sci.', '65000'], ['12121', 'Wu', 'Finance', '90000'],
   ['15151', 'Mozart', 'Music', '40000'], ['22222', 'Einstein', 'Physics', '95000'],
   ['32343', 'El Said', 'History', '60000'], ['33456', 'Gold', 'Physics', '87000'],
   ['45565', 'Katz', 'Comp. Sci.', '75000'], ['58583', 'Califieri', 'History', '62000'],
   ['76543', 'Singh', 'Finance', '80000'], ['76766', 'Crick', 'Biology', '72000'],
   ['83821', 'Brandt', 'Comp. Sci.', '92000'], ['98345', 'Kim', 'Elec. Eng.', '80000']]))}
</section>

<section>
<h2>2. DISTINCT, and Its Opposite</h2>
<p>The question: <i>find the names of buildings in which every individual classroom has capacity
less than 100.</i></p>
<p>Work it out by hand first. Packard is 500, so it is out. Painter is 10, in. Taylor is 70, in.
Watson has two rooms, 30 and 50, and both are under 100, so Watson is in. But Watson would appear
<b>twice</b> in the answer, once per row, which is not what was asked.</p>
<pre><code><span class="kw">SELECT DISTINCT</span> building
<span class="kw">FROM</span>   classroom
<span class="kw">WHERE</span>  capacity &lt; 100;</code></pre>
${teach('DISTINCT', 'remove duplicate rows from the answer', [
  'A keyword placed after <code>SELECT</code> that deletes duplicate rows from the <b>result</b>.',
  'Because a table may hold the same value on many rows for perfectly good reasons, and the answer to a question about buildings should name each building once.',
  'A class register listing five students from Delhi. Asked "which cities are represented?", you say Delhi once, not five times.',
  'Without it the query above returns Watson twice, once for room 100 and once for room 120.',
  'It compares whole result rows. Two rows are duplicates only if <b>every</b> selected column matches.',
  'It is exactly the <b>projection</b> operator of relational algebra, which by definition returns a set.',
])}
<p>That last line is worth holding on to: <b><code>SELECT DISTINCT</code> is projection.</b> Plain
<code>SELECT</code> is not, because it keeps duplicates. Chapter 4 comes back to this.</p>
<p>The opposite keyword also exists. <code>SELECT ALL</code> explicitly keeps duplicates, and since
that is what SQL does anyway, it is almost never written.</p>
<div class="eq"><span class="v">SELECT</span> = <span class="v">SELECT ALL</span> <span class="op">&middot;</span> duplicate retention is the default
<span class="eqn">you have to ask for de-duplication; you never have to ask for duplicates</span></div>
${fig('f-dist',
`<div class="panel">
  <div class="phead"><span class="m" id="ds-q"></span><span class="m" id="ds-cnt"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">classroom</div><table class="dt" id="ds-src"></table></div>
    <div><div class="tname">result</div><table class="dt" id="ds-out"></table></div>
  </div>
  <div class="msg" id="ds-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.2, The lecture&rsquo;s own query, with and without DISTINCT. Drag the threshold and watch which buildings qualify.',
`<span class="lab">keyword:</span>${pills('ds', [['all', 'SELECT'], ['dist', 'SELECT DISTINCT']], 1)}
 ${slider('ds-c', 10, 500, 10, 100, 'capacity &lt;')}`,
'DISTINCT removes duplicates from the answer, not from the table')}
</section>

<section>
<h2>3. Cartesian Product</h2>
<p>The question: <i>find the names of all students of departments which have a budget less than
0.1 million dollars.</i></p>
<p>The student name is in <code>student</code>; the budget is in <code>department</code>. Two
tables are needed, and the simplest way to name two tables is to put both in the
<code>FROM</code>.</p>
<pre><code><span class="kw">SELECT</span> name, budget
<span class="kw">FROM</span>   student, department
<span class="kw">WHERE</span>  student.dept_name = department.dept_name
  <span class="kw">AND</span>  budget &lt; 100000;</code></pre>
${teach('Cartesian product', 'also called cross product', [
  'Pairing <b>every</b> row of one table with <b>every</b> row of the other.',
  'Because it is the raw material a join is made of. First you form all the pairs, then you throw away the ones that do not match.',
  'Three shirts and two pairs of trousers give six outfits, including the combinations you would never wear.',
  'Writing <code>FROM student, department</code> with a comma between them. No join keyword is used.',
  'If student has 10 rows and department has 5, the product has <b>50</b> rows. The <code>WHERE</code> clause then cuts it back down.',
  'Written <i>R</i> &times; <i>S</i>. Its cardinality is |R| &middot; |S|.',
])}
<p>The step order matters and it is easy to misread. <b><code>FROM</code> runs first</b>, so the
full product is formed and only <i>then</i> does <code>WHERE</code> filter it. The condition
<code>student.dept_name = department.dept_name</code> is doing the join by hand.</p>
<p>Now the counting rule, which is a standard exam question.</p>
<div class="eq">R(<span class="v">A, B, C</span>) &times; S(<span class="v">B, D, E</span>) has <span class="v">6</span> columns <span class="op">&middot;</span> R &#8904; S has <span class="v">5</span>
<span class="eqn">the product keeps every column including the repeated name; the natural join shows the shared one once</span></div>
<p>A cross product <b>preserves every attribute</b>, even ones with the same name or the same
domain. A natural join keeps each shared attribute only once, so it has one fewer column per shared
name. And a natural join can only happen when there is <b>at least one</b> attribute in common.</p>
${fig('f-cart',
`<div class="panel">
  <div class="phead"><span class="m" id="ca-hd"></span><span class="m" id="ca-cnt"></span></div>
  <table class="dt" id="ca-tbl"></table>
  <div class="msg" id="ca-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.3, The product formed, then filtered. Step through and watch 12 pairs become 2 answers.',
`<button class="btn" id="ca-step">Step</button><button class="btn" id="ca-back">Back</button>
 <button class="btn" id="ca-reset">Reset</button><span class="lab" id="ca-lbl"></span>`,
'the product is formed first, and only then is it filtered')}
</section>

<section>
<h2>4. Renaming with AS</h2>
<p>The same query again, with the output columns and the tables given new names.</p>
<pre><code><span class="kw">SELECT</span> s.name <span class="kw">AS</span> student_name, d.budget <span class="kw">AS</span> dept_budget
<span class="kw">FROM</span>   student <span class="kw">AS</span> s, department <span class="kw">AS</span> d
<span class="kw">WHERE</span>  s.dept_name = d.dept_name
  <span class="kw">AND</span>  d.budget &lt; 100000;</code></pre>
<p><code>AS</code> does two different jobs here and it is worth separating them.</p>
<dl class="tight">
  <dt>Renaming a <b>column</b> in the result</dt>
  <dd><code>name AS student_name</code>. The stored column is untouched; only the heading on the
  answer changes.</dd>
  <dt>Renaming a <b>table</b>, called aliasing</dt>
  <dd><code>student AS s</code>. It gives the table a short temporary name for the rest of the
  query. The <code>AS</code> is optional here: <code>FROM student s</code> means the same thing.</dd>
</dl>
<p>Aliasing looks like mere convenience and it is not. Section 13 needs <b>two copies of one
table</b> in the same query, and without two different names there is no way to say which copy you
mean. Chapter 4 meets the same operation in the algebra, written &rho;.</p>
</section>

<section>
<h2>5. AND, OR, and IN</h2>
<p>The question: <i>find the names of all instructors whose department is Finance, or whose
department is in either the Watson or Taylor building.</i></p>
<p>Take it apart before writing anything. The name is in <code>instructor</code>. The department
name is in <code>instructor</code> too, so that half needs no second table. But the
<b>building</b> is in <code>department</code>, so that table must be joined in.</p>
<pre><code><span class="kw">SELECT</span> name
<span class="kw">FROM</span>   instructor i, department d
<span class="kw">WHERE</span>  i.dept_name = d.dept_name
  <span class="kw">AND</span>  ( i.dept_name = <span class="st">'Finance'</span>
    <span class="kw">OR</span>   d.building <span class="kw">IN</span> (<span class="st">'Watson'</span>, <span class="st">'Taylor'</span>) );</code></pre>
${teach('IN', 'is this value one of these?', [
  'A test asking whether a value appears in a given list of values.',
  'Because writing <code>x = &rsquo;a&rsquo; OR x = &rsquo;b&rsquo; OR x = &rsquo;c&rsquo;</code> gets unreadable quickly, and this says the same thing on one line.',
  'A guest list. The doorman is not comparing you against each name in turn out loud; they are checking whether you are on the list.',
  '<code>age IN (15, 16, 17)</code> keeps rows whose age is any of those three.',
  'The list can be as long as you like. Section 12 replaces the literal list with a whole subquery, which is where it becomes powerful.',
  '<code>x IN S</code> is true when x is a member of the set S.',
])}
<p>One point about <code>OR</code> that catches people. A row where the department <b>is</b>
Finance <b>and</b> the building <b>is</b> Watson is still kept, because <code>OR</code> in SQL is
inclusive. The only rows discarded are those where <b>neither</b> side holds.</p>
</section>

<section>
<h2>6. Matching Text with LIKE</h2>
<p>The question: <i>find the titles of all courses whose course_id has three letters indicating the
department.</i></p>
<p>Look at the data. Course ids come as <code>BIO-101</code>, <code>CS-101</code>,
<code>FIN-201</code>, <code>HIS-351</code>, <code>PHY-101</code>. Some department codes are three
letters and some are two, and the query wants only the three-letter ones.</p>
<pre><code><span class="kw">SELECT</span> title
<span class="kw">FROM</span>   course
<span class="kw">WHERE</span>  course_id <span class="kw">LIKE</span> <span class="st">'___-%'</span>;</code></pre>
<p>Read the pattern character by character: three underscores, a hyphen, then a percent. So exactly
three characters, then a literal hyphen, then anything at all.</p>
<dl class="tight">
  <dt><code>_</code> underscore</dt>
  <dd>Matches <b>exactly one</b> character. Not zero, not two.</dd>
  <dt><code>%</code> percent</dt>
  <dd>Matches <b>any run</b> of characters, <b>including none at all</b>. That "including none" is
  the part people forget.</dd>
</dl>
<p><code>CS-101</code> fails because <code>CS</code> is only two characters, so the third underscore
would have to match the hyphen, leaving no hyphen for the literal. The answer is the Biology,
Finance, History and Physics titles.</p>
${fig('f-like',
`<div class="panel">
  <div class="phead"><span class="m" id="lk-p"></span><span class="m" id="lk-cnt"></span></div>
  <table class="dt" id="lk-tbl"></table>
  <div class="msg" id="lk-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.4, The lecture&rsquo;s pattern, and the near misses. Each one fails for a different reason.',
`<span class="lab">pattern:</span>${pills('lk', [['a', "'___-%'"], ['b', "'__-%'"], ['c', "'%-%'"], ['d', "'____%'"], ['e', "'%1%'"]], 0)}`,
'an underscore matches exactly one character; a percent matches any number, including none')}
<p>A useful shape to remember, from the lecture: to find names with <b>at least</b> four letters,
write <code>'____%'</code>. Four underscores force four characters to exist, and the percent allows
any number more.</p>
</section>

<section>
<h2>7. ORDER BY</h2>
<p>The question: <i>list the students in alphabetic order of department, and within each department
in decreasing order of total credits.</i></p>
<pre><code><span class="kw">SELECT</span>   name, dept_name, tot_cred
<span class="kw">FROM</span>     student
<span class="kw">ORDER BY</span> dept_name <span class="kw">ASC</span>, tot_cred <span class="kw">DESC</span>;</code></pre>
<p>The sort happens strictly <b>left to right</b>. Whichever column is named first is sorted first;
the second column only decides the order <i>within</i> a group that already ties on the first.</p>
<p>So Biology comes before Comp. Sci. because B precedes C. Then, inside Comp. Sci., the credits run
102, 58, 54, 32 because <code>DESC</code> was asked for on that column only. Changing the second key
does nothing to the department ordering.</p>
${fig('f-ord',
`<div class="panel">
  <div class="phead"><span class="m" id="or-hd"></span><span class="m" id="or-cnt"></span></div>
  <table class="dt" id="or-tbl"></table>
  <div class="msg" id="or-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.5, The same rows under five sort specifications. Only the tie-breaking changes between the middle two.',
`<span class="lab">ORDER BY:</span>${pills('or', [['n', 'nothing'], ['a', 'dept ASC'], ['b', 'dept ASC, cred DESC'], ['c', 'dept ASC, cred ASC'], ['d', 'cred DESC']], 0)}`,
'the first column decides the order; later columns only break ties')}
<p><code>ASC</code> is the default and may be left out. <code>ORDER BY</code> has nothing to do
with grouping and works perfectly well on an ordinary query.</p>
</section>

<section>
<h2>8. Set Operations</h2>
<p>Two queries can be combined the way two sets are combined in mathematics.</p>
<div class="tw"><table class="pt">
<thead><tr><th>SQL</th><th>Set operation</th><th>Keeps</th><th>Duplicates</th></tr></thead>
<tbody>
<tr><td><code>UNION</code></td><td>A &cup; B</td><td>rows in either</td><td><b>removed</b></td></tr>
<tr><td><code>UNION ALL</code></td><td>A &cup; B, as a bag</td><td>rows in either</td><td>kept</td></tr>
<tr><td><code>INTERSECT</code></td><td>A &cap; B</td><td>rows in both</td><td>removed</td></tr>
<tr><td><code>EXCEPT</code></td><td>A &minus; B</td><td>rows in A but not in B</td><td>removed</td></tr>
</tbody></table></div>
<p>Set operations remove duplicates <b>by default</b>, because a set cannot contain duplicates. That
is the whole difference between <code>UNION</code> and <code>UNION ALL</code>, and there is a second
one worth knowing: <b><code>UNION ALL</code> is faster</b>, because the system never has to check for
duplicates at all.</p>
<p>There is no complement operator. SQL has no <code>NOT</code> as a set operation; the way to
express "everything except these" is <code>EXCEPT</code>.</p>

<h3>UNION, and one question answered two ways</h3>
<p><i>Find the course ids of all courses taught in Fall or Spring of 2018.</i></p>
<pre><code><span class="cm">-- with IN</span>
<span class="kw">SELECT DISTINCT</span> course_id <span class="kw">FROM</span> teaches
<span class="kw">WHERE</span> semester <span class="kw">IN</span> (<span class="st">'Fall'</span>, <span class="st">'Spring'</span>) <span class="kw">AND</span> year = 2018;

<span class="cm">-- with UNION, and no DISTINCT needed</span>
(<span class="kw">SELECT</span> course_id <span class="kw">FROM</span> teaches <span class="kw">WHERE</span> semester = <span class="st">'Fall'</span>   <span class="kw">AND</span> year = 2018)
<span class="kw">UNION</span>
(<span class="kw">SELECT</span> course_id <span class="kw">FROM</span> teaches <span class="kw">WHERE</span> semester = <span class="st">'Spring'</span> <span class="kw">AND</span> year = 2018);</code></pre>
<p>The first needs <code>DISTINCT</code>, since a course taught in both semesters produces two rows.
The second does not, because removing duplicates is what <code>UNION</code> already does.</p>

<h3>Union compatibility</h3>
<p>Before any set operation can happen, the two sides must satisfy three rules.</p>
<ol>
  <li><b>The same number of columns</b> in both. Three against four is refused outright.</li>
  <li><b>Corresponding columns must have the same data type.</b> If the first column on the left is
  an integer, the first on the right must be too. <b>The names may differ</b>; only the types have to
  match.</li>
  <li><b>The order of the columns must match</b>, since "corresponding" is decided by position, not
  by name.</li>
</ol>
<p>The third follows from the second in practice: get the first two right and the third comes free.
And note that <code>(A, B, C)</code> against <code>(D, F, E)</code> is <b>not</b> the same as against
<code>(D, E, F)</code>, because the pairing changes.</p>

<h3>INTERSECT</h3>
<p><i>Find the names of all instructors who teach in either Comp. Sci. or Finance, and whose salary
is less than 80,000.</i></p>
<pre><code>(<span class="kw">SELECT</span> name <span class="kw">FROM</span> instructor
 <span class="kw">WHERE</span> dept_name <span class="kw">IN</span> (<span class="st">'Comp. Sci.'</span>, <span class="st">'Finance'</span>))
<span class="kw">INTERSECT</span>
(<span class="kw">SELECT</span> name <span class="kw">FROM</span> instructor <span class="kw">WHERE</span> salary &lt; 80000);</code></pre>
<p>Both conditions could sit in a single <code>WHERE</code>, and in an exam that is what you should
write, since it is shorter. The two-set version is here because it makes the shape of the operation
visible.</p>

<h3>EXCEPT, and a trick worth learning</h3>
<p><i>Find the names of all instructors in Comp. Sci. or Finance whose salary is either at least
90,000 or at most 70,000.</i></p>
<p>That condition is an <b>outward</b> range: two disjoint pieces at the ends, with a gap in the
middle. Writing it directly is awkward. The trick is to build the gap instead, and subtract it.</p>
<pre><code>(<span class="kw">SELECT</span> name <span class="kw">FROM</span> instructor
 <span class="kw">WHERE</span> dept_name <span class="kw">IN</span> (<span class="st">'Comp. Sci.'</span>, <span class="st">'Finance'</span>))
<span class="kw">EXCEPT</span>
(<span class="kw">SELECT</span> name <span class="kw">FROM</span> instructor
 <span class="kw">WHERE</span> salary &lt; 90000 <span class="kw">AND</span> salary &gt; 70000);</code></pre>
<p>Whoever survives must lie outside 70,000 to 90,000, which is exactly the condition asked for.</p>
${fig('f-set',
`<div class="panel">
  <div class="phead"><span class="m" id="st-hd"></span><span class="m" id="st-cnt"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname" id="st-la">set A</div><table class="dt" id="st-a"></table></div>
    <div><div class="tname" id="st-lb">set B</div><table class="dt" id="st-b"></table></div>
    <div><div class="tname">result</div><table class="dt" id="st-r"></table></div>
  </div>
  <div class="msg" id="st-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.6, The EXCEPT query from the lecture, worked on the real instructor table.',
`<span class="lab">operation:</span>${pills('st', [['u', 'UNION'], ['ua', 'UNION ALL'], ['i', 'INTERSECT'], ['e', 'EXCEPT']], 3)}`,
'subtracting the middle leaves the two ends')}
</section>

<section>
<h2>9. Aggregate Functions</h2>
<p>Every query so far returned rows that already existed. An aggregate reads a whole column and
returns <b>one</b> value.</p>
${teach('Aggregate function', 'many values in, one value out', [
  'A function that reads a whole column of values and returns a single summary value.',
  'Because you often want a fact <i>about</i> the data rather than the data itself. Nobody reads 4,000 salaries; they want the average.',
  'Weighing a bag of apples. You do not care about each apple; you want one number describing the lot.',
  '<code>AVG(salary)</code> collapses every salary into one average. To do it by hand you would add every value, then divide by how many there were.',
  'The rows themselves are not returned. They are consumed and replaced by the summary.',
  'A function mapping a multiset of values to a single value.',
])}
<p>There are five, and they are the whole list.</p>
<pre><code><span class="cm">-- the least salary drawn by any instructor</span>
<span class="kw">SELECT</span> <span class="kw">MIN</span>(salary) <span class="kw">AS</span> least_salary <span class="kw">FROM</span> instructor;

<span class="cm">-- and all five at once</span>
<span class="kw">SELECT</span> <span class="kw">MIN</span>(salary), <span class="kw">MAX</span>(salary), <span class="kw">AVG</span>(salary),
       <span class="kw">SUM</span>(salary), <span class="kw">COUNT</span>(*)
<span class="kw">FROM</span>   instructor;</code></pre>
<p>Note the <code>AS least_salary</code>. Without it the result column is labelled with the function
call itself, so aggregates are almost always renamed.</p>
<p><code>COUNT</code> deserves care, because it has three forms answering three different
questions.</p>
<dl class="tight">
  <dt><code>COUNT(*)</code></dt>
  <dd><b>How many rows?</b> Nulls make no difference, since it counts rows rather than values.</dd>
  <dt><code>COUNT(column)</code></dt>
  <dd><b>How many rows have a value there?</b> Rows where it is NULL are skipped.</dd>
  <dt><code>COUNT(DISTINCT column)</code></dt>
  <dd><b>How many different values?</b> One student appearing in three rows counts once.</dd>
</dl>
${fig('f-agg',
`<div class="panel">
  <div class="cols">
    <div><div class="tname">takes, extract</div><table class="dt" id="ag-tbl"></table></div>
    <div style="flex:1;min-width:190px">
      <div class="tname">result</div>
      <table class="dt" id="ag-res"></table>
      <div class="msg" id="ag-work" style="margin-top:12px"></div>
    </div>
  </div>
</div>`,
'Fig 3.7, One column, seven summaries. Watch what the missing mark does to each.',
`<span class="lab">function:</span>${pills('ag', [['count*', 'COUNT(*)'], ['count', 'COUNT(marks)'], ['countd', 'COUNT(DISTINCT id)'], ['sum', 'SUM'], ['avg', 'AVG'], ['min', 'MIN'], ['max', 'MAX']], 0)}`,
'aggregates collapse many rows into one value')}
<p>One behaviour surprises everyone: <b><code>AVG</code> divides by the number of values it actually
found, not by the number of rows.</b> A missing mark is treated as absent, not as zero.</p>
</section>

<section>
<h2>10. GROUP BY and HAVING</h2>
<p>The question: <i>find the name and average capacity of each building whose average capacity is
greater than 25.</i></p>
<p>Averaging the whole <code>classroom</code> table would give one number for the university, which
is not what was asked. Watson&rsquo;s two rooms, 30 and 50, must be averaged <b>together</b> and
separately from everyone else.</p>
<pre><code><span class="kw">SELECT</span>   building, <span class="kw">AVG</span>(capacity) <span class="kw">AS</span> avg_capacity
<span class="kw">FROM</span>     classroom
<span class="kw">GROUP BY</span> building
<span class="kw">HAVING</span>   <span class="kw">AVG</span>(capacity) &gt; 25;</code></pre>
${teach('GROUP BY', 'split into piles, then summarise each', [
  'A clause that sorts rows into piles sharing the same value, then runs the aggregate once per pile.',
  'Because "the average" is nearly always meant per category, and without this you would run one query per building by hand.',
  'Sorting a basket of fruit into apples, oranges and pears, then weighing each heap separately.',
  '<code>GROUP BY building</code> gives one output row per building. Watson&rsquo;s two rows become one, averaging to 40.',
  'Buildings with only one classroom still work: Packard&rsquo;s average is 500, since the average of one number is that number.',
  'A partition of the relation into groups by equal values of the grouping attributes.',
])}
${teach('HAVING', 'WHERE, but for groups', [
  'A clause that keeps or discards whole <b>groups</b>, based on a condition about the group.',
  'Because <code>WHERE</code> runs before the groups exist. At that moment there are no averages to compare against, only individual rows.',
  'Weighing each heap of fruit, then throwing away every heap under a kilo. You cannot do that before the heaps exist.',
  '<code>HAVING AVG(capacity) &gt; 25</code> removes Painter, whose single room holds 10.',
  'Any condition mentioning an <b>aggregate function</b> must go in <code>HAVING</code>, never in <code>WHERE</code>.',
  'A predicate applied to groups after grouping, rather than to tuples before it.',
])}
<div class="eq"><span class="v">WHERE</span> filters rows <span class="op">&middot;</span> <span class="v">HAVING</span> filters groups
<span class="eqn">if the condition mentions an aggregate, it belongs in HAVING</span></div>
<p>Both can appear in one query, doing different jobs at different moments. And a rule from the
lecture that follows from what a group <i>means</i>:</p>
<p><b>Whatever you group by should appear in the <code>SELECT</code> list</b>, otherwise the result
never says which group each row belongs to. The stricter half of the rule is the one the database
enforces: <b>every column in <code>SELECT</code> must either be in the <code>GROUP BY</code> or
inside an aggregate</b>, because an output row now stands for a whole pile and a bare
<code>capacity</code> would have no single value.</p>
${wex('Counting with a group: courses per building',
'<p style="margin:0 0 8px"><i>From the section table, find the number of courses run in each building.</i></p>' +
'<pre style="margin:0 0 8px"><code><span class="kw">SELECT</span>   building, <span class="kw">COUNT</span>(course_id) <span class="kw">AS</span> course_count\n' +
'<span class="kw">FROM</span>     section\n<span class="kw">GROUP BY</span> building;</code></pre>' +
'<p style="margin:0"><code>building</code> is in the <code>SELECT</code> list even though the ' +
'question only asked for a number, because without it you could not tell which count belongs to ' +
'which building.</p>')}
${wex('Summing with a group: credits per department',
'<p style="margin:0 0 8px"><i>From the course table, find the total credits offered by each department.</i></p>' +
'<pre style="margin:0"><code><span class="kw">SELECT</span>   dept_name, <span class="kw">SUM</span>(credits) <span class="kw">AS</span> total_credits\n' +
'<span class="kw">FROM</span>     course\n<span class="kw">GROUP BY</span> dept_name;</code></pre>')}
${fig('f-grp',
`<div class="panel">
  <div class="phead"><span class="m" id="grp-stage"></span><span class="m" id="grp-cnt"></span></div>
  <table class="dt" id="grp-tbl"></table>
  <div class="msg" id="grp-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.8, The classroom query walked through the engine, in the order the engine runs it.',
`<button class="btn" id="grp-step">Step</button><button class="btn" id="grp-back">Back</button>
 <button class="btn" id="grp-reset">Reset</button><span class="lab" id="grp-lbl"></span>`,
'press Step to walk the query through the engine')}
</section>

<section>
<h2>11. The Full Order of Execution</h2>
<p>Now every clause can be placed in order. You <b>write</b> a query in one order and the engine
<b>runs</b> it in another, and almost every confusing result becomes obvious once these eight stages
are walked slowly.</p>
<div class="eq"><span class="v">FROM</span> <span class="op">&rarr;</span> <span class="v">WHERE</span> <span class="op">&rarr;</span> <span class="v">GROUP BY</span> <span class="op">&rarr;</span> <span class="v">HAVING</span> <span class="op">&rarr;</span> <span class="v">SELECT</span> <span class="op">&rarr;</span> <span class="v">DISTINCT</span> <span class="op">&rarr;</span> <span class="v">ORDER BY</span> <span class="op">&rarr;</span> <span class="v">LIMIT</span></div>
<p>This is the order of <b>execution</b>, not the order of writing. Reading it in order explains
several things at once:</p>
<ul>
  <li><b><code>WHERE</code> cannot use an aggregate</b>, because grouping has not happened yet. That
  is why <code>HAVING</code> exists.</li>
  <li><b><code>DISTINCT</code> runs after <code>SELECT</code></b>, so it removes duplicates from the
  chosen columns, not from the underlying rows.</li>
  <li><b><code>ORDER BY</code> can use an alias defined in <code>SELECT</code></b>, because
  <code>SELECT</code> has already run. <code>WHERE</code> cannot.</li>
  <li><b><code>LIMIT</code> runs last</b>, so it takes the first few rows of the finished, sorted
  answer, not the first few rows of the table. <code>OFFSET</code> skips rows before it.</li>
</ul>
<p>Writing the clauses in the wrong order is a syntax error. <b><code>HAVING</code> before
<code>GROUP BY</code> is wrong</b>, and it is the mistake people make most often.</p>
${cyu('Why can you write ORDER BY avg_capacity using an alias, but not WHERE avg_capacity &gt; 25?',
'Purely because of when each clause runs. <code>ORDER BY</code> is evaluated <b>after</b> <code>SELECT</code>, so the alias already exists. <code>WHERE</code> is evaluated long <b>before</b> <code>SELECT</code>, so at that moment neither the alias nor the average exists yet, which is exactly why that condition belongs in <code>HAVING</code>.')}
</section>

<section>
<h2>12. A Query Inside a Query</h2>
${teach('Nested subquery', 'a query used inside another query', [
  'A complete <code>SELECT</code> written inside another <code>SELECT</code>, whose result the outer query then uses.',
  'Because some questions need an answer before they can be asked. "Who earns more than the average?" needs the average first.',
  'Looking a word up in a dictionary to understand the sentence you are reading. The lookup is a small complete task done inside a bigger one.',
  'A <code>WHERE</code> clause testing membership: <code>course_id IN (SELECT course_id FROM section WHERE semester = &rsquo;Spring&rsquo;)</code>.',
  '<b>The inner query executes first</b>, produces a result, and the outer query uses it as though you had typed the answer in by hand.',
  'A nested <code>SELECT</code> expression appearing within an outer query.',
])}
<p>That rule, <b>innermost first</b>, is the whole technique. Whenever a nested query confuses you,
find the innermost one, work out what it returns, and mentally substitute the answer. Then do the
same one level out.</p>
<p>Subqueries in a <code>WHERE</code> clause perform three kinds of test: <b>set membership</b> (is
this value in that set?), <b>set comparison</b> (is this bigger than some or all of that set?), and
<b>set cardinality</b> (is that set empty, or free of duplicates?). The next three sections take
them in that order.</p>

<h3>Set membership with IN</h3>
<p><i>Find the courses offered in Fall 2009 and also in Spring 2010.</i></p>
<pre><code><span class="kw">SELECT DISTINCT</span> course_id
<span class="kw">FROM</span>   section
<span class="kw">WHERE</span>  semester = <span class="st">'Fall'</span> <span class="kw">AND</span> year = 2009
  <span class="kw">AND</span>  course_id <span class="kw">IN</span> (<span class="kw">SELECT</span> course_id <span class="kw">FROM</span> section
                       <span class="kw">WHERE</span> semester = <span class="st">'Spring'</span> <span class="kw">AND</span> year = 2010);</code></pre>
<p>Inner first: it returns the list of course ids taught in Spring 2010. The outer query then keeps
the Fall 2009 courses whose id appears in that list. This is the same question
<code>INTERSECT</code> answered in section 8, written a different way.</p>

<h3>NOT IN</h3>
<p>Swap the keyword and you get <i>courses taught in Fall 2009 but <b>not</b> in Spring 2010</i>. The
two sets are unchanged; only the test flips. That is the <code>EXCEPT</code> question, written a
third way.</p>

<h3>Combining IN and NOT IN</h3>
<p>Put both in one <code>WHERE</code> and you can express "did this, never did that" directly.</p>
<pre><code><span class="cm">-- departments that booked a hall in January but never in February</span>
<span class="kw">SELECT</span> deptName <span class="kw">FROM</span> deptsMaster
<span class="kw">WHERE</span>  deptID <span class="kw">IN</span>     (<span class="kw">SELECT</span> deptID <span class="kw">FROM</span> hallBooking <span class="kw">WHERE</span> monthBooking = <span class="st">'Jan'</span>)
  <span class="kw">AND</span>  deptID <span class="kw">NOT IN</span> (<span class="kw">SELECT</span> deptID <span class="kw">FROM</span> hallBooking <span class="kw">WHERE</span> monthBooking = <span class="st">'Feb'</span>);</code></pre>
<p>Read each half separately and then join them with the <code>AND</code>. The first says
<b>at least one</b> January booking, because <code>IN</code> asks only whether the id appears
<i>somewhere</i> in that list. The second says <b>no</b> February booking at all, because
<code>NOT IN</code> requires absence from the whole list.</p>
<p>So the answer is "booked <b>at least one</b> hall in January but <b>never</b> in February". It is
<b>not</b> "booked <b>all</b> halls in January", which would need the division pattern of section 14,
and it is not "in January <i>or</i> February", which would need <code>OR</code>.</p>

<h3>Both, not either: INTERSECT of two subqueries</h3>
<p>Now a question that catches almost everybody. <i>Find the departments that booked hall H0001 or
H0002, in <b>both</b> January and February.</i></p>
<p>The tempting answer is wrong:</p>
<pre><code><span class="cm">-- WRONG</span>
<span class="kw">WHERE</span> deptID <span class="kw">IN</span> (<span class="kw">SELECT</span> deptID <span class="kw">FROM</span> hallBooking
                <span class="kw">WHERE</span> hallID <span class="kw">IN</span> (<span class="st">'H0001'</span>, <span class="st">'H0002'</span>)
                  <span class="kw">AND</span> monthBooking <span class="kw">IN</span> (<span class="st">'Jan'</span>, <span class="st">'Feb'</span>));</code></pre>
<p>Why? Because <code>monthBooking IN ('Jan', 'Feb')</code> is applied to <b>one row at a time</b>,
and a single booking row has one month. So it means "January <b>or</b> February", not "both". A
department that only ever booked in January passes.</p>
<p>"Both" is a statement about the department <b>across several rows</b>, and the only way to say that
is to build the two sets separately and intersect them:</p>
<pre><code><span class="kw">SELECT</span> deptName <span class="kw">FROM</span> deptsMaster <span class="kw">WHERE</span> deptID <span class="kw">IN</span> (
    (<span class="kw">SELECT</span> deptID <span class="kw">FROM</span> hallBooking
     <span class="kw">WHERE</span> hallID <span class="kw">IN</span> (<span class="st">'H0001'</span>, <span class="st">'H0002'</span>) <span class="kw">AND</span> monthBooking = <span class="st">'Jan'</span>)
    <span class="kw">INTERSECT</span>
    (<span class="kw">SELECT</span> deptID <span class="kw">FROM</span> hallBooking
     <span class="kw">WHERE</span> hallID <span class="kw">IN</span> (<span class="st">'H0001'</span>, <span class="st">'H0002'</span>) <span class="kw">AND</span> monthBooking = <span class="st">'Feb'</span>)
);</code></pre>
<p>The general rule is worth extracting, because it recurs throughout this chapter: <b>a condition
inside one <code>WHERE</code> can only ever describe a single row. Any question about a group of rows
belonging to the same entity needs a set operation or a grouped subquery.</b></p>

<h3>Negating twice</h3>
<p>Occasionally the cleanest phrasing is a double negative. <i>Find the capitals of countries in Asia
or Europe.</i> The direct version is obvious:</p>
<pre><code><span class="kw">WHERE</span> countryID <span class="kw">IN</span> ( (<span class="kw">SELECT</span> countryID <span class="kw">FROM</span> country <span class="kw">WHERE</span> continent = <span class="st">'Asia'</span>)
                    <span class="kw">UNION</span>
                    (<span class="kw">SELECT</span> countryID <span class="kw">FROM</span> country <span class="kw">WHERE</span> continent = <span class="st">'Europe'</span>) )</code></pre>
<p>But this one is also correct, and reading it is a genuinely useful exercise:</p>
<pre><code><span class="kw">WHERE</span> countryID <span class="kw">NOT IN</span> ( (<span class="kw">SELECT</span> countryID <span class="kw">FROM</span> country <span class="kw">WHERE</span> continent &lt;&gt; <span class="st">'Asia'</span>)
                        <span class="kw">INTERSECT</span>
                        (<span class="kw">SELECT</span> countryID <span class="kw">FROM</span> country <span class="kw">WHERE</span> continent &lt;&gt; <span class="st">'Europe'</span>) )</code></pre>
<p>Work it from the inside. The intersection holds the countries that are <b>not Asian and not
European</b>. Excluding those leaves exactly the countries that <b>are</b> Asian or European. It is
the same answer by the opposite route, and questions often offer both as correct options.</p>

<h3>IN with more than one column</h3>
<p><i>Find the number of distinct students who took a section taught by the instructor with ID
10101.</i></p>
<pre><code><span class="kw">SELECT</span> <span class="kw">COUNT</span>(<span class="kw">DISTINCT</span> id)
<span class="kw">FROM</span>   takes
<span class="kw">WHERE</span>  (course_id, sec_id, semester, year) <span class="kw">IN</span>
       (<span class="kw">SELECT</span> course_id, sec_id, semester, year
        <span class="kw">FROM</span>   teaches
        <span class="kw">WHERE</span>  teaches.id = <span class="st">'10101'</span>);</code></pre>
<p>The left side of <code>IN</code> is a <b>tuple of four columns</b>, and the subquery returns four
columns to match. A section is only identified by all four together, so comparing on
<code>course_id</code> alone would wrongly match the same course in a different semester.</p>
<p><code>DISTINCT</code> inside <code>COUNT</code> is essential: a student taking two of that
instructor&rsquo;s sections would otherwise be counted twice.</p>
</section>

<section>
<h2>13. Set Comparison: SOME and ALL</h2>
<p><i>Find the names of instructors whose salary is greater than that of at least one instructor in
the Biology department.</i></p>
<p>The lecture gives two ways to write this, and comparing them teaches more than either alone.</p>

<h3>First way: join the table to itself</h3>
<pre><code><span class="kw">SELECT DISTINCT</span> t.name
<span class="kw">FROM</span>   instructor <span class="kw">AS</span> t, instructor <span class="kw">AS</span> s
<span class="kw">WHERE</span>  t.salary &gt; s.salary <span class="kw">AND</span> s.dept_name = <span class="st">'Biology'</span>;</code></pre>
<p>Why two copies of one table? Because the comparison is between <b>two rows of the same table</b>,
and a query cannot compare a row with itself unless it can name the two roles separately.
<code>t</code> is the instructor being tested; <code>s</code> ranges over the Biology
instructors.</p>
<p><code>DISTINCT</code> is needed because <code>t</code> qualifies once per Biology instructor it
beats, and without it a name would appear several times.</p>

<h3>Second way: a subquery with SOME</h3>
<pre><code><span class="kw">SELECT</span> name
<span class="kw">FROM</span>   instructor
<span class="kw">WHERE</span>  salary &gt; <span class="kw">SOME</span> (<span class="kw">SELECT</span> salary <span class="kw">FROM</span> instructor
                        <span class="kw">WHERE</span> dept_name = <span class="st">'Biology'</span>);</code></pre>
<p>The inner query returns the Biology salaries. <code>&gt; SOME</code> is then true if the
candidate beats <b>at least one</b> of them.</p>
<dl class="tight">
  <dt><code>&gt; SOME</code>, also spelled <code>ANY</code></dt>
  <dd>True if the value beats <b>at least one</b> member of the set, so it only has to clear the
  <b>smallest</b>.</dd>
  <dt><code>&gt; ALL</code></dt>
  <dd>True only if it beats <b>every</b> member, so it must clear the <b>largest</b>.</dd>
</dl>
${wex('The lecture&rsquo;s worked table',
mini(['name', 'dept', 'salary'],
  [['A', 'Comp. Sci.', '70000'], ['B', 'Biology', '80000'], ['C', 'Comp. Sci.', '60000'],
   ['D', 'Biology', '40000'], ['E', 'Comp. Sci.', '50000']]) +
'<p style="margin:8px 0 0">Biology salaries are <b>80000</b> and <b>40000</b>. Under ' +
'<code>&gt; SOME</code>, everyone who beats 40000 qualifies: A, B, C and E. Only <b>D fails</b>, ' +
'because 40000 is not greater than itself. Under <code>&gt; ALL</code>, everyone would have to ' +
'beat 80000, and nobody does, so the result is <b>empty</b>.</p>')}
<p>Two consequences that look like bugs and are not:</p>
<ul>
  <li>Under <code>SOME</code>, <b>Biology instructors can appear in their own answer</b>. B earns
  80,000 and beats colleague D on 40,000, so B qualifies. Only the lowest-paid Biology instructor
  cannot.</li>
  <li>Under <code>ALL</code>, <b>no Biology instructor can ever appear</b>, because even the
  highest-paid one does not earn more than themselves.</li>
</ul>
<p>Read as pure arithmetic on the set {0, 5, 6}, which is how the lecture checks it:</p>
<div class="tw"><table class="pt">
<thead><tr><th>Claim</th><th>Reading</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>5 &lt; <b>SOME</b> {0, 5, 6}</td><td>is 5 less than at least one of them?</td><td><b>true</b>, because 5 &lt; 6</td></tr>
<tr><td>5 &lt; <b>ALL</b> {0, 5, 6}</td><td>is 5 less than every one of them?</td><td><b>false</b>, because 5 is not less than 0</td></tr>
<tr><td>5 &lt; <b>ALL</b> {6, 10}</td><td>same test, different set</td><td><b>true</b></td></tr>
<tr><td>5 = <b>SOME</b> {0, 5, 6}</td><td>does it equal at least one?</td><td><b>true</b>, and this form is exactly <code>IN</code></td></tr>
<tr><td>5 &ne; <b>SOME</b> {0, 5, 6}</td><td>does it differ from at least one?</td><td><b>true</b>, because 5 &ne; 0</td></tr>
<tr><td>5 &ne; <b>ALL</b> {0, 5, 6}</td><td>does it differ from every one?</td><td><b>false</b>, and this form is exactly <code>NOT IN</code></td></tr>
</tbody></table></div>
<p>The last three are worth memorising: <code>= SOME</code> is <code>IN</code>, and
<code>&lt;&gt; ALL</code> is <code>NOT IN</code>. Note that <code>&ne; SOME</code> is <b>not</b>
<code>NOT IN</code>, which is a favourite trap.</p>
<p>In Chapter 4 these two turn out to be the <b>existential</b> and <b>universal quantifiers</b> of
logic, written &exist; and &forall;.</p>

<h3>Extremes: when to use an aggregate instead</h3>
<p><code>SOME</code> and <code>ALL</code> compare against a whole set. When you want the single
largest or smallest value, an aggregate in a scalar subquery is shorter and clearer.</p>
<pre><code><span class="cm">-- the designation of employees on the LOWEST salary in Purchase</span>
<span class="kw">SELECT DISTINCT</span> desgName
<span class="kw">FROM</span>   designation D1, department T1, employee E1
<span class="kw">WHERE</span>  E1.desgID = D1.desgID <span class="kw">AND</span> E1.deptID = T1.deptID
  <span class="kw">AND</span>  T1.deptName = <span class="st">'Purchase'</span>
  <span class="kw">AND</span>  salary <span class="hl">=</span> (<span class="kw">SELECT</span> <span class="hl">MIN</span>(salary)
               <span class="kw">FROM</span> designation D2, department T2, employee E2
               <span class="kw">WHERE</span> E2.desgID = D2.desgID <span class="kw">AND</span> E2.deptID = T2.deptID
                 <span class="kw">AND</span> T2.deptName = <span class="st">'Purchase'</span>);</code></pre>
<p>The two halves are worth taking separately, because that is how these are filled in.</p>
<dl class="tight">
  <dt>The aggregate: <code>MIN</code>, not <code>MAX</code></dt>
  <dd>The question asks for the <b>lowest</b>, so the inner query must compute the lowest. Choosing
  <code>MAX</code> here answers the opposite question.</dd>
  <dt>The comparison: <code>=</code>, not <code>&lt;</code> or <code>&lt;= ALL</code></dt>
  <dd>The inner query already returns <b>one value</b>, the minimum, so you compare against it with
  <code>=</code>. Writing <code>&lt; MIN(salary)</code> would return <b>nothing</b>, since no salary
  is below the minimum. <code>&lt;= ALL</code> would happen to work but is redundant against a
  single value.</dd>
</dl>
<p>Notice the inner query <b>repeats the whole three-table join and the department filter</b>. That
is not clumsiness: without it the inner query would find the minimum salary across the entire
company, not within Purchase, and the answer would be wrong in a way that produces no error.</p>
<p>The same shape with <code>MAX</code> answers "who earns the most in this department". And when
such a query is given with a blank to fill, the reliable method is: <b>read the superlative in the
question to fix the aggregate, then check whether the subquery returns one value to fix the
comparison operator.</b></p>
${fig('f-quant',
`<div class="panel">
  <div class="phead"><span class="m">Biology salaries, and one candidate</span><span class="m" id="q-verd"></span></div>
  <svg class="d" viewBox="0 0 520 122" id="q-svg"></svg>
  <div class="msg" id="q-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.9, Drag the candidate across the set and watch the two verdicts come apart.',
`${slider('q-v', 30, 100, 5, 70, 'candidate salary (thousands)')} ${pills('qm', [['some', '&gt; SOME'], ['all', '&gt; ALL']], 0)}`,
'SOME only has to beat the smallest; ALL has to beat the largest')}
</section>

<section>
<h2>14. EXISTS and NOT EXISTS</h2>
<p><code>EXISTS</code> does not care <b>what</b> the subquery returned, only <b>whether it returned
anything at all</b>. One row makes it true; no rows makes it false. <code>NOT EXISTS</code> is the
exact opposite.</p>
<p>The same Fall 2009 and Spring 2010 question, for the third time, now with
<code>EXISTS</code>:</p>
<pre><code><span class="kw">SELECT</span> course_id
<span class="kw">FROM</span>   section <span class="kw">AS</span> s
<span class="kw">WHERE</span>  semester = <span class="st">'Fall'</span> <span class="kw">AND</span> year = 2009
  <span class="kw">AND</span>  <span class="kw">EXISTS</span> (<span class="kw">SELECT</span> * <span class="kw">FROM</span> section <span class="kw">AS</span> t
                <span class="kw">WHERE</span> semester = <span class="st">'Spring'</span> <span class="kw">AND</span> year = 2010
                  <span class="kw">AND</span> <span class="hl">s.course_id = t.course_id</span>);</code></pre>
<p>Follow one course through it. Take <code>CS-102</code>, taught in Fall 2009 only. The inner query
looks for a Spring 2010 row with that same course id, finds none, and returns nothing. So
<code>EXISTS</code> is false, the <code>AND</code> fails, and CS-102 is not in the answer. A course
taught in both semesters does produce an inner row, so it survives.</p>
${teach('Correlated subquery', 'an inner query that depends on the outer row', [
  'A subquery referring to a column of the query containing it, so its answer changes from row to row.',
  'Because many questions are really "for each X, check something about X", and that check cannot be done once for everybody.',
  'Going down a guest list and, for each name, checking a separate RSVP pile for <i>that person</i>. Which pile you search depends on whose name you are on.',
  'The <code>s.course_id</code> above comes from the outer query, so the inner query means something different for each outer row.',
  'Unlike an ordinary subquery it <b>cannot be run once and reused</b>. The engine re-evaluates it for every row of the outer query.',
  'A nested query containing a free reference to a variable bound in an enclosing query.',
])}
${fig('f-ex',
`<div class="panel">
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">outer query rows</div><table class="dt" id="ex-out"></table></div>
    <div><div class="tname" id="ex-il"></div>
      <table class="dt" id="ex-in"></table></div>
  </div>
  <div class="msg" id="ex-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.10, The inner query re-run once per outer row. Step through and watch its result change.',
`<button class="btn" id="ex-step">Next outer row</button><button class="btn" id="ex-reset">Reset</button>
 <span class="lab">${pills('exm', [['not', 'NOT EXISTS'], ['ex', 'EXISTS']], 1)}</span>`,
'the inner query depends on the outer row, so it cannot be run just once')}

<h3>The &ldquo;all of&rdquo; pattern</h3>
<p><i>Find all students who have taken every course offered in the Biology department.</i></p>
<p>There is no <code>FOR ALL</code> in SQL. The trick is to turn "took all of them" into <b>"there
is nothing they missed"</b>, a double negative SQL can express. Take the set of all Biology courses,
subtract the courses this student has taken, and ask whether anything is left.</p>
<pre><code><span class="kw">SELECT</span> s.id, s.name
<span class="kw">FROM</span>   student <span class="kw">AS</span> s
<span class="kw">WHERE</span>  <span class="kw">NOT EXISTS</span> (
         (<span class="kw">SELECT</span> course_id <span class="kw">FROM</span> course <span class="kw">WHERE</span> dept_name = <span class="st">'Biology'</span>)
         <span class="kw">EXCEPT</span>
         (<span class="kw">SELECT</span> course_id <span class="kw">FROM</span> takes <span class="kw">WHERE</span> takes.id = <span class="hl">s.id</span>)
       );</code></pre>
<p>Work it as the lecture does, with Biology offering BIO-101, BIO-102 and BIO-103.</p>
<dl class="tight">
  <dt>A student who took BIO-101, BIO-102, BIO-103 and CS-319</dt>
  <dd>Subtracting cancels all three Biology courses. CS-319 does not matter, since subtraction only
  <b>removes</b>, never adds. Nothing is left, so <code>NOT EXISTS</code> is <b>true</b> and the
  student is in the answer.</dd>
  <dt>A student who took only BIO-101 and BIO-102</dt>
  <dd>BIO-103 survives the subtraction. Something is left, so <code>NOT EXISTS</code> is <b>false</b>
  and the student is dropped.</dd>
</dl>
<p>The general advice from the lecture: when you see a set-based question, <b>first identify what the
two sets are</b>. Once those are written down, the rest of the query is mechanical.</p>
${fig('f-div',
`<div class="panel">
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">required: Biology courses</div><table class="dt" id="dv-a"></table></div>
    <div><div class="tname" id="dv-bl"></div><table class="dt" id="dv-b"></table></div>
    <div><div class="tname">what is left over</div><table class="dt" id="dv-r"></table></div>
  </div>
  <div class="msg" id="dv-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.11, Three students against the same requirement. An empty leftover is what "took every one" looks like.',
`<span class="lab">student:</span>${pills('dv', [['x', 'Asha'], ['y', 'Ravi'], ['z', 'Meera']], 0)}`,
'nothing left over means nothing was missed')}
<p>In Chapter 4 this same idea has a single operator of its own, called division.</p>

<h3>UNIQUE</h3>
<p>A rarely used relative, testing whether a subquery returned any <b>duplicate</b> rows. It is true
when there are none.</p>
<pre><code><span class="cm">-- courses offered at most once in 2009</span>
<span class="kw">SELECT</span> t.course_id
<span class="kw">FROM</span>   course <span class="kw">AS</span> t
<span class="kw">WHERE</span>  <span class="kw">UNIQUE</span> (<span class="kw">SELECT</span> r.course_id <span class="kw">FROM</span> section <span class="kw">AS</span> r
                <span class="kw">WHERE</span> t.course_id = r.course_id <span class="kw">AND</span> r.year = 2009);</code></pre>
<p><b>"At most once" means zero or one</b>, and <code>UNIQUE</code> catches both, because a set of
zero rows contains no duplicate just as a set of one row does not. This is correlated again, since
the inner query mentions <code>t.course_id</code>.</p>
</section>

<section>
<h2>15. Subqueries in Other Places</h2>
<p>A subquery is not restricted to <code>WHERE</code>. It can stand anywhere a table or a value is
expected, which follows from the fact that a query <i>returns</i> a table.</p>

<h3>In FROM: a derived table</h3>
<p><i>Find the average instructor salary of those departments where the average salary is greater
than 42,000.</i></p>
<pre><code><span class="kw">SELECT</span> dept_name, avg_salary
<span class="kw">FROM</span>   (<span class="kw">SELECT</span> dept_name, <span class="kw">AVG</span>(salary) <span class="kw">AS</span> avg_salary
        <span class="kw">FROM</span> instructor <span class="kw">GROUP BY</span> dept_name) <span class="kw">AS</span> dept_avg
<span class="kw">WHERE</span>  avg_salary &gt; 42000;</code></pre>
<p>The inner query produces a two-column table of department names and their averages. The outer
query then treats that as an ordinary table.</p>
<p><b>No <code>HAVING</code> is needed</b>, and the reason is the useful part. By the time the outer
query runs there is no grouping happening any more, so <code>avg_salary</code> is just a normal
column and <code>WHERE</code> can test it. The rule generalises: <b><code>HAVING</code> belongs
wherever the aggregate function is</b>. Here the aggregate is inside, so a condition on it would go
inside too.</p>

<h3>WITH: naming a temporary relation</h3>
<p><i>Find all departments with the maximum budget.</i></p>
<pre><code><span class="kw">WITH</span> max_budget (value) <span class="kw">AS</span> (
  <span class="kw">SELECT</span> <span class="kw">MAX</span>(budget) <span class="kw">FROM</span> department
)
<span class="kw">SELECT</span> dept_name
<span class="kw">FROM</span>   department, max_budget
<span class="kw">WHERE</span>  department.budget = max_budget.value;</code></pre>
<p>Read it as a definition followed by a query. <code>max_budget</code> is the temporary table name,
<code>value</code> is its single column, and the inner <code>SELECT MAX(budget)</code> is what fills
it: a one-row, one-column table.</p>
<p>The word <b>temporary</b> is exact. The relation exists only while this query runs, and outside it
there is no such table at all. That is why both tables appear in the outer <code>FROM</code>: the
real <code>department</code> table and the temporary one, joined on the budget matching.</p>
<p>Using <code>=</code> rather than picking one row matters, since <b>several departments may share
the maximum budget</b> and all of them should be returned.</p>

<h3>Scalar subqueries: a query used as a single value</h3>
<p><i>List all departments along with the number of instructors in each.</i></p>
<pre><code><span class="kw">SELECT</span> dept_name,
       (<span class="kw">SELECT</span> <span class="kw">COUNT</span>(*) <span class="kw">FROM</span> instructor
        <span class="kw">WHERE</span> instructor.dept_name = <span class="hl">department.dept_name</span>) <span class="kw">AS</span> num_instructors
<span class="kw">FROM</span>   department;</code></pre>
<p>Note the comma after <code>dept_name</code>: the whole parenthesised subquery is simply
<b>another column</b> of the result. It is correlated, so the count is recomputed per department. If
it returns 5 for Comp. Sci., that is five instructor rows matching that department name.</p>
<p>A scalar subquery must return <b>exactly one row and one column</b>. Returning more makes the
query fail, since there is no sensible single value to substitute.</p>
</section>

<section>
<h2>16. Views</h2>
${teach('View', 'a stored query that behaves like a table', [
  'A named query saved in the database, which you can then select from as though it were a table.',
  'Because the same complicated query gets written again and again, and because some people should only ever see part of a table.',
  'A window cut in a fence. You see the part of the garden the window shows and nothing else, but the garden itself is unchanged.',
  '<code>CREATE VIEW faculty_contact AS SELECT id, fname, lname FROM faculty;</code>',
  'It stores the <b>query</b>, not the data. Every time you select from it the underlying query runs again, so a view is always up to date.',
  'A relation defined by a stored expression rather than by stored tuples.',
])}
<pre><code><span class="kw">CREATE VIEW</span> faculty_contact <span class="kw">AS</span>
  <span class="kw">SELECT</span> id, fname, lname, dept_code
  <span class="kw">FROM</span>   faculty;

<span class="kw">SELECT</span> * <span class="kw">FROM</span> faculty_contact <span class="kw">WHERE</span> dept_code = <span class="st">'ME'</span>;</code></pre>
<p>This is the <b>view level</b> of Chapter 1 made concrete: hand somebody exactly the columns and
rows they should see and nothing else, and give a complicated join a short name so everything built
on top stays readable.</p>

<h3>Triggers</h3>
<p>A view is a stored query. A <b>trigger</b> is stored <i>action</i>: code the database runs by
itself whenever something happens to a table.</p>
${teach('Trigger', 'code that fires on an event', [
  'A block of code attached to a table, which the database executes automatically whenever a specified event occurs on that table.',
  'Because some rules must hold no matter which program writes the data, and putting the code in the database means every program obeys it without being asked.',
  'A smoke alarm. Nobody presses it; it goes off by itself when the condition it watches for occurs.',
  'Automatically filling in a bonus column whenever a row is inserted into the employee table.',
  'You declare <b>when</b> it fires (before or after an insert, update or delete) and <b>how often</b> (for each row, or once per statement).',
  'A procedural block executed implicitly in response to a specified database event.',
])}
<pre><code><span class="cm">-- 1. the function the trigger will run</span>
<span class="kw">CREATE OR REPLACE FUNCTION</span> bonus_fun() <span class="kw">RETURNS TRIGGER AS</span> $$
<span class="kw">BEGIN</span>
    <span class="kw">IF</span> NEW.edept = <span class="st">'R/D'</span> <span class="kw">THEN</span>
        NEW.ebonus = NEW.esalary * .75;
    <span class="kw">END IF</span>;
    <span class="kw">RETURN</span> NEW;
<span class="kw">END</span>;
$$ <span class="kw">LANGUAGE</span> plpgsql;

<span class="cm">-- 2. attach it to the table</span>
<span class="kw">CREATE TRIGGER</span> bonus_trig
<span class="kw">BEFORE INSERT ON</span> Employee
<span class="kw">FOR EACH ROW</span>
<span class="kw">EXECUTE PROCEDURE</span> bonus_fun();</code></pre>
<p>Reading it in pieces:</p>
<dl class="tight">
  <dt><code>RETURNS TRIGGER</code> and <code>LANGUAGE plpgsql</code></dt>
  <dd>This is not ordinary SQL. It is a <b>procedural</b> language, with <code>IF</code>,
  <code>BEGIN</code> and <code>END</code>, because a rule sometimes needs branching.</dd>
  <dt><code>NEW</code></dt>
  <dd>The row being inserted. <code>BEFORE INSERT</code> means the trigger runs <b>before</b> the row
  is stored, so changing <code>NEW.ebonus</code> changes what actually gets written. An
  <code>AFTER</code> trigger would be too late for that.</dd>
  <dt><code>FOR EACH ROW</code></dt>
  <dd>The function runs once per affected row. The alternative, <code>FOR EACH STATEMENT</code>, runs
  once however many rows were touched.</dd>
</dl>
${wex('Worked: trace two inserts through that trigger',
'<pre style="margin:0 0 8px"><code><span class="kw">INSERT INTO</span> Employee <span class="kw">VALUES</span> (4, <span class="st">&rsquo;R/D&rsquo;</span>, <span class="st">&rsquo;Diksha&rsquo;</span>, 30000);\n' +
'<span class="kw">INSERT INTO</span> Employee <span class="kw">VALUES</span> (2, <span class="st">&rsquo;Accounts&rsquo;</span>, <span class="st">&rsquo;Raj&rsquo;</span>, 40000);\n' +
'<span class="kw">SELECT</span> ebonus <span class="kw">FROM</span> Employee;</code></pre>' +
mini(['row', 'department', 'condition met?', 'ebonus'],
  [['Diksha', 'R/D', ['yes', 'hi'], ['30000 &times; 0.75 = <b>22500</b>', 'hi']],
   ['Raj', 'Accounts', ['no', 'out'], ['<b>NULL</b>', 'lo']]]) +
'<p style="margin:8px 0 0">The trigger fires for <b>both</b> inserts, but the <code>IF</code> is ' +
'only satisfied by the first, so only Diksha&rsquo;s bonus is set. Raj&rsquo;s <code>ebonus</code> ' +
'was never given a value and no default exists, so it stays <b>NULL</b>. Not 0, and not the salary: ' +
'an untouched column is NULL, exactly as in Chapter 2, section 10.</p>')}
<p>Triggers are powerful and easy to overuse. Because they fire invisibly, a database with many of
them can behave in ways no single piece of application code explains.</p>
</section>

<section>
<h2>17. Joins, and the Natural Join Trap</h2>
<p>Section 3 joined two tables by writing the matching condition by hand. SQL also has join keywords
that build it in.</p>
${teach('Join', 'combining rows from two tables', [
  'An operation pairing each row of one table with the related rows of another, using a condition saying which rows belong together.',
  'Because facts are deliberately split across tables, so answering a real question means putting them back together.',
  'A library slip says "borrowed by member 4021". To print the borrower&rsquo;s name you must look 4021 up in the member list. That lookup is a join.',
  '<code>member JOIN book_issue ON member.mem_no = book_issue.mem_no</code>.',
  'The kinds differ in exactly one respect: <b>what happens to rows with no partner</b>.',
  'A Cartesian product followed by a selection on the join condition.',
])}
<dl class="tight">
  <dt>Inner join</dt>
  <dd><code>A INNER JOIN B ON A.x = B.y</code>. Keeps only matching pairs. Rows with no partner on
  either side <b>disappear</b>. Plain <code>JOIN</code> means this.</dd>
  <dt>Natural join</dt>
  <dd><code>A NATURAL JOIN B</code>. Finds every column the two tables share <b>by name</b>, matches
  on all of them at once, and shows each shared column only once.</dd>
  <dt>Left outer join</dt>
  <dd>Keeps <b>every</b> row of the left table, filling missing right-hand columns with NULL. Use it
  for "every member, with their loans if any".</dd>
  <dt>Right outer join</dt>
  <dd>The mirror image, keeping every row of the right table.</dd>
  <dt>Full outer join</dt>
  <dd>Keeps unmatched rows from <b>both</b> sides.</dd>
</dl>
${fig('f-join',
`<div class="panel">
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">member</div><table class="dt" id="j-l"></table></div>
    <div><div class="tname">book_issue</div><table class="dt" id="j-r"></table></div>
  </div>
  <div style="margin-top:12px"><div class="tname" id="j-rl"></div>
    <table class="dt" id="j-res"></table></div>
  <div class="msg" id="j-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.12, The same two tables under four joins. Meera borrowed nothing and loan m9 belongs to nobody; watch where each one goes.',
`<span class="lab">join type:</span>${pills('jn', [['inner', 'INNER'], ['left', 'LEFT OUTER'], ['right', 'RIGHT OUTER'], ['full', 'FULL OUTER']], 0)}`,
'an outer join keeps the unmatched rows and fills the gaps with NULL')}

<h3>Why natural join is dangerous</h3>
<p>Natural join is convenient and it causes real damage quietly, so it earns its own warning.</p>
<p><b>It matches on every shared column name, taken together as a combination, and you do not get to
choose.</b> With <code>INNER JOIN ... ON</code> you specify exactly which columns to match.</p>
<p>The reasoning from the lecture is worth following, because it explains <i>why</i> the failure is
always in the same direction. The more attributes you match on, the <b>harder</b> it is for two rows
to agree on all of them, so the more matches you lose. You are no longer comparing one value with one
value; you are comparing a set of values with a set of values.</p>
<ul>
  <li>Two shared names when you meant one: the extra column silently narrows the match and you get
  <b>too few</b> rows, with no error to warn you.</li>
  <li>No shared name at all: nothing to match on, so it degenerates into a plain Cartesian product and
  you get <b>far too many</b>.</li>
</ul>
<p>So: count the shared column names before using it. One shared name, natural join is safe and
short. More than one, use <code>INNER JOIN ... ON</code>.</p>
${fig('f-nat',
`<div class="panel">
  <div class="phead"><span class="m" id="nat-hd"></span><span class="m" id="nat-cnt"></span></div>
  <table class="dt" id="nat-tbl"></table>
  <div class="msg" id="nat-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.13, The same natural join as the number of shared column names changes. The query text never changes at all.',
`<span class="lab">columns shared by name:</span>${pills('nt', [['0', 'none'], ['1', 'one'], ['2', 'two']], 1)}`,
'natural join matches on all shared names at once, which is not always what you meant')}
</section>

<section>
<h2>18. Worked Practice Queries</h2>
<p>Five questions from the lecture, on two schemas. The method is the same every time: <b>decide
which tables are needed and how to travel between them, before writing a single keyword</b>.</p>
${fig('f-lib',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 118" id="lb-svg"></svg>
  <div class="msg" id="lb-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 3.14, The library schema. The path between two tables is what decides the joins.',
`<span class="lab">table:</span>${pills('lb', [['faculty', 'faculty'], ['member', 'member'], ['issue', 'book_issue'], ['copy', 'book_copy'], ['cat', 'book_catalog']], -1)}`,
'a faculty member and a book title are four joins apart')}

<h3>1. Teams that have played more than three matches</h3>
<p>A different schema: <code>teams(team_id, team_name)</code> and
<code>matches(match_no, hosting_team_id, guest_team_id)</code>. Only these two are needed, since
nothing about players was asked.</p>
<p>The difficulty is that a team can appear in <b>either</b> column. So build a single list of
appearances first, then count it.</p>
<pre><code><span class="kw">SELECT</span>   t.team_name
<span class="kw">FROM</span>     teams t
         <span class="kw">JOIN</span> ( <span class="kw">SELECT</span> hosting_team_id <span class="kw">AS</span> team_id <span class="kw">FROM</span> matches
                <span class="kw">UNION ALL</span>
                <span class="kw">SELECT</span> guest_team_id <span class="kw">FROM</span> matches ) <span class="kw">AS</span> m
         <span class="kw">ON</span> t.team_id = m.team_id
<span class="kw">GROUP BY</span> t.team_name
<span class="kw">HAVING</span>   <span class="kw">COUNT</span>(*) &gt; 3;</code></pre>
<p>Three things in there are doing real work.</p>
<ul>
  <li><b><code>UNION ALL</code>, not <code>UNION</code>.</b> The duplicates <i>are</i> the count. A
  team that played five matches must appear five times, and <code>UNION</code> would collapse it to
  one and destroy the answer.</li>
  <li><b>The alias only on the first branch.</b> <code>hosting_team_id AS team_id</code> names the
  single output column and the second branch inherits it. Union compatibility needs matching types
  and positions, not matching names.</li>
  <li><b><code>COUNT(*)</code> appears in <code>HAVING</code> but not in <code>SELECT</code>.</b> The
  question asked for names, not counts, so the count is used as a filter and never displayed.</li>
</ul>
${fig('f-team',
`<div class="panel">
  <div class="phead"><span class="m" id="tm-hd"></span><span class="m" id="tm-cnt"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">matches</div><table class="dt" id="tm-src"></table></div>
    <div><div class="tname" id="tm-ml"></div><table class="dt" id="tm-mid"></table></div>
    <div><div class="tname">counted</div><table class="dt" id="tm-out"></table></div>
  </div>
  <div class="msg" id="tm-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 3.15, Why it has to be UNION ALL. Switch to UNION and every count collapses to one.',
`<span class="lab">combine with:</span>${pills('tm', [['all', 'UNION ALL'], ['u', 'UNION']], 0)}`,
'the duplicates are the count, so removing them destroys the answer')}

<h3>2. Faculty of department ME who have issued at least one book</h3>
<p>Travel <code>faculty</code> &rarr; <code>member</code> &rarr; <code>book_issue</code>. The
<code>dept_code</code> is already in <code>faculty</code>, so no extra table is needed for it.</p>
<pre><code><span class="kw">SELECT DISTINCT</span> f.fname, f.lname
<span class="kw">FROM</span>   faculty f
       <span class="kw">JOIN</span> member m      <span class="kw">ON</span> f.id = m.id
       <span class="kw">JOIN</span> book_issue b  <span class="kw">ON</span> m.mem_no = b.mem_no
<span class="kw">WHERE</span>  f.dept_code = <span class="st">'ME'</span>;</code></pre>
<p>The elegant part is what is <b>not</b> written. There is no condition saying "has issued a book",
because <b>the join already does it</b>. Every faculty member has a row in <code>member</code>, but
only those who actually borrowed have a row in <code>book_issue</code>, so the inner join drops the
rest by itself.</p>
<p><code>DISTINCT</code> is needed because somebody who borrowed five books would otherwise appear
five times.</p>

<h3>3. How many book titles were issued on a given day</h3>
<pre><code><span class="kw">SELECT</span> <span class="kw">COUNT</span>(c.title)
<span class="kw">FROM</span>   book_catalog c
       <span class="kw">NATURAL JOIN</span> book_copy
       <span class="kw">NATURAL JOIN</span> book_issue
<span class="kw">WHERE</span>  date_of_issue = <span class="st">'2024-08-14'</span>;</code></pre>
<p>Natural join is safe here <b>only because</b> each pair shares exactly one column name:
<code>isbn_no</code> between catalog and copy, then <code>accession_no</code> between copy and issue.
Check that before using it, for the reason section 17 made visible.</p>

<h3>4. Faculty who have never issued a book</h3>
<p>"Never" is the signal for <code>NOT EXISTS</code>. An inner join cannot answer this, because the
rows you want are exactly the ones a join throws away.</p>
<pre><code><span class="kw">SELECT</span> f.fname, f.lname
<span class="kw">FROM</span>   faculty f
<span class="kw">WHERE</span>  <span class="kw">NOT EXISTS</span> (<span class="kw">SELECT</span> * <span class="kw">FROM</span> member m
                    <span class="kw">JOIN</span> book_issue b <span class="kw">ON</span> m.mem_no = b.mem_no
                    <span class="kw">WHERE</span> m.id = <span class="hl">f.id</span>);</code></pre>
<p>For a faculty member who never borrowed, the inner query finds no matching row, returns nothing,
and <code>NOT EXISTS</code> is true. A left outer join would also work, keeping every faculty row and
then testing for NULL.</p>

<h3>5. Titles issued to PG students but never to UG students</h3>
<p>"In this group but not that one" is set difference. Build each set with the same four-table chain,
changing only the member type, and subtract.</p>
<pre><code>(<span class="kw">SELECT DISTINCT</span> c.title
 <span class="kw">FROM</span> member m <span class="kw">JOIN</span> book_issue b <span class="kw">ON</span> m.mem_no = b.mem_no
      <span class="kw">JOIN</span> book_copy p    <span class="kw">ON</span> b.accession_no = p.accession_no
      <span class="kw">JOIN</span> book_catalog c <span class="kw">ON</span> p.isbn_no = c.isbn_no
 <span class="kw">WHERE</span> m.mem_type = <span class="st">'PG'</span>)
<span class="kw">EXCEPT</span>
(<span class="kw">SELECT DISTINCT</span> c.title
 <span class="kw">FROM</span> member m <span class="kw">JOIN</span> book_issue b <span class="kw">ON</span> m.mem_no = b.mem_no
      <span class="kw">JOIN</span> book_copy p    <span class="kw">ON</span> b.accession_no = p.accession_no
      <span class="kw">JOIN</span> book_catalog c <span class="kw">ON</span> p.isbn_no = c.isbn_no
 <span class="kw">WHERE</span> m.mem_type = <span class="st">'UG'</span>);</code></pre>
<p>Order matters here in a way it does not for <code>UNION</code>: swapping the halves asks the
opposite question.</p>
<p>And one trap the lecture calls out by name, because it catches almost everybody. <b>Whether
somebody is UG or PG is stored in <code>member.mem_type</code></b>, not in any table with "degree" in
its name. The three values are UG, PG and faculty. Before writing against an unfamiliar schema, read
what the columns actually contain.</p>
${cyu('Why does query 2 need DISTINCT but query 4 does not?',
'Query 2 travels <i>down</i> into <code>book_issue</code>, so a faculty member who borrowed five books produces five rows, which must be collapsed. Query 4 never joins to <code>book_issue</code> in the outer query at all: the chain lives inside a <code>NOT EXISTS</code> subquery, so the outer query still returns exactly one row per faculty member and there is nothing to collapse.')}
</section>

</article>` + cfoot('week-3');
}

function initWeek3() {
  /* ---- Fig 3.1 university schema ---- */
  (function () {
    const T = {
      classroom: ['classroom(building, room_number, capacity)',
        'Every teaching room. One <b>building</b> may hold several rooms, which is why building alone is not a key.'],
      department: ['department(dept_name, building, budget)',
        'One row per department, with the building it sits in and its budget.'],
      course: ['course(course_id, title, dept_name, credits)',
        'The catalogue of courses that exist, independent of when they are taught.'],
      instructor: ['instructor(ID, name, dept_name, salary)',
        'One row per member of teaching staff. Most examples in this chapter use this table.'],
      section: ['section(course_id, sec_id, semester, year, building, room_number)',
        'One actual offering of a course. <b>Four columns together</b> identify a section, which is why section 12 compares four columns at once.'],
      teaches: ['teaches(ID, course_id, sec_id, semester, year)',
        'Which instructor teaches which section. It links <i>instructor</i> to <i>section</i>.'],
      student: ['student(ID, name, dept_name, tot_cred)',
        'One row per student, with total credits earned so far.'],
      takes: ['takes(ID, course_id, sec_id, semester, year, grade)',
        'Which student took which section. A student taking three courses has three rows here.'],
    };
    const ROW1 = [['classroom', 6, 92], ['department', 108, 100], ['course', 218, 78],
      ['instructor', 306, 92], ['student', 408, 84]];
    const ROW2 = [['section', 150, 84], ['teaches', 250, 84], ['takes', 350, 76]];
    /* which tables each link joins, and on what */
    const LINKS = [
      ['course', 'section', 'course_id', 257, 60, 192, 96],
      ['instructor', 'teaches', 'ID', 352, 60, 292, 96],
      ['student', 'takes', 'ID', 450, 60, 388, 96],
      ['classroom', 'section', 'building, room_number', 56, 60, 150, 96],
      ['section', 'teaches', 'course_id, sec_id, semester, year', 234, 111, 250, 111],
      ['section', 'takes', 'course_id, sec_id, semester, year', 234, 111, 350, 111],
      ['department', 'course', 'dept_name', 158, 60, 240, 60],
      ['department', 'instructor', 'dept_name', 178, 55, 330, 55],
      ['department', 'student', 'dept_name', 198, 50, 430, 50],
    ];
    let picked = null, hovered = null;

    function draw() {
      const k = hovered || picked;
      const touches = id => k && (id === k || LINKS.some(l =>
        (l[0] === k && l[1] === id) || (l[1] === k && l[0] === id)));
      let s = '';
      LINKS.forEach(([a, b, on, x1, y1, x2, y2]) => {
        const lit = k && (a === k || b === k);
        s += DG.line(x1, y1, x2, y2,
          { stroke: lit ? 'var(--indigo)' : '#e0e0dd', sw: lit ? 1.6 : 1 });
      });
      ROW1.concat(ROW2).forEach(([id, x, w], i) => {
        const self = id === k, near = touches(id) && !self;
        s += DG.box(x, i < ROW1.length ? 30 : 96, w, 30, id, null, {
          fill: self ? 'var(--indigo-tint)' : near ? 'var(--card)' : '#fff',
          stroke: self ? 'var(--indigo)' : near ? '#8f8f89' : '#e5e5e3', r: 4, cls: 'm',
        });
      });
      s += DG.txt(DG.PAD, 20, 'the things that exist', { cls: 'm mu' });
      s += DG.txt(DG.PAD, 142, 'the tables that connect them', { cls: 'm mu' });
      s += DG.txt(DG.PAD, 164, k
        ? 'lit: everything ' + k + ' can reach in one join'
        : 'every example in this chapter runs against these eight tables', { cls: 'm mu' });
      $('#un-svg').innerHTML = s;

      /* transparent hit areas on top, so hovering a box lights its joins */
      const hit = ROW1.map(([id, x, w]) => [id, x, 30, w])
        .concat(ROW2.map(([id, x, w]) => [id, x, 96, w]));
      $('#un-svg').innerHTML += hit.map(([id, x, y, w]) =>
        `<rect class="uhit" data-t="${id}" x="${x}" y="${y}" width="${w}" height="30" ` +
        `fill="transparent" style="cursor:pointer"/>`).join('');
      $$('#un-svg .uhit').forEach(r => {
        r.onmouseenter = () => { hovered = r.dataset.t; draw(); };
        r.onmouseleave = () => { hovered = null; draw(); };
        r.onclick = () => { picked = picked === r.dataset.t ? null : r.dataset.t; hovered = null; draw(); };
      });

      if (k) {
        const joins = LINKS.filter(l => l[0] === k || l[1] === k)
          .map(l => '<b>' + (l[0] === k ? l[1] : l[0]) + '</b> on <code>' + l[2] + '</code>');
        $('#un-note').innerHTML = '<b>' + T[k][0] + '</b><br>' + T[k][1] +
          '<br><span style="color:var(--muted)">joins directly to:</span> ' +
          (joins.length ? joins.join(', ') : 'nothing directly');
      } else {
        $('#un-note').innerHTML = 'Hover or pick a table to see its columns and every table it ' +
          'joins to in one step. The top row holds the entities; the bottom row holds the tables ' +
          'that link them together.';
      }
    }
    setPills($('#f-uni'), 'un', k => { picked = k; hovered = null; draw(); });
    draw();
  })();

  /* ---- Fig 3.2 DISTINCT ---- */
  (function () {
    const R = [['Packard', '101', 500], ['Painter', '514', 10], ['Taylor', '3128', 70],
      ['Watson', '100', 30], ['Watson', '120', 50]];
    let mode = 'dist';
    function draw() {
      const c = +$('#ds-c').value;
      $('#ds-c-v').textContent = c;
      const kept = R.filter(r => r[2] < c);
      const out = mode === 'dist' ? [...new Set(kept.map(r => r[0]))] : kept.map(r => r[0]);
      $('#ds-src').innerHTML = '<thead><tr><th>building</th><th>room_number</th><th>capacity</th></tr></thead><tbody>' +
        R.map(r => `<tr class="${r[2] < c ? 'hi' : 'out'}">` +
          r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      $('#ds-out').innerHTML = '<thead><tr><th>building</th></tr></thead><tbody>' +
        (out.length ? out.map(v => `<tr><td>${v}</td></tr>`).join('')
          : '<tr><td class="nul">no rows</td></tr>') + '</tbody>';
      $('#ds-q').innerHTML = 'SELECT ' + (mode === 'dist' ? 'DISTINCT ' : '') +
        'building FROM classroom WHERE capacity &lt; ' + c;
      $('#ds-cnt').textContent = out.length + ' rows';
      const dupes = kept.length - new Set(kept.map(r => r[0])).size;
      $('#ds-note').innerHTML = mode === 'dist'
        ? (dupes ? 'Watson has two qualifying rooms, so it would appear twice. <b>DISTINCT collapses them to one.</b> The stored table is untouched; only the answer is de-duplicated.'
          : 'At this threshold no building qualifies more than once, so DISTINCT has nothing to remove and the two keywords agree.')
        : (dupes ? 'Without DISTINCT, <b>Watson appears ' + (dupes + 1) + ' times</b>, once per qualifying room. That is the default: SQL keeps duplicates unless you ask it not to.'
          : 'No duplicates arise at this threshold, so plain SELECT happens to give the right answer. That is luck, not correctness.');
      const m = $('#f-dist-msg');
      m.className = 'msg ' + (mode === 'dist' ? 'good' : dupes ? 'bad' : '');
      m.textContent = mode === 'dist' && c === 100
        ? 'At the lecture threshold of 100 this returns Painter, Taylor and Watson: exactly the buildings whose every room is under 100.'
        : 'DISTINCT removes duplicates from the answer, not from the table.';
    }
    setPills($('#f-dist'), 'ds', v => { mode = v; draw(); });
    $('#ds-c').oninput = draw;
    draw();
  })();

  /* ---- Fig 3.3 Cartesian product ---- */
  (function () {
    const S = [['Asha', 'Comp. Sci.'], ['Ravi', 'Biology'], ['Meera', 'Comp. Sci.'], ['Vikram', 'Physics']];
    const D = [['Comp. Sci.', 'Taylor', 90000], ['Biology', 'Watson', 80000], ['Physics', 'Watson', 120000]];
    const ST = [
      ['the two tables, before anything happens', 'student has 4 rows and department has 3.'],
      ['FROM student, department', 'The <b>Cartesian product</b>: 4 &times; 3 = <b>12</b> rows, every student paired with every department. Most are nonsense, such as Asha paired with Physics.'],
      ['WHERE student.dept_name = department.dept_name', 'The first condition keeps only the pairs whose department names agree. <b>This is the join, written by hand.</b> Eight rows fall away.'],
      ['AND budget &lt; 100000', 'The second condition then drops Physics, whose budget is 120000. Two answers remain.'],
    ];
    let k = 0;
    function draw() {
      let html;
      if (k === 0) {
        html = '<thead><tr><th>name</th><th>dept_name</th><th></th><th>dept_name</th><th>building</th><th>budget</th></tr></thead><tbody>' +
          [0, 1, 2, 3].map(i => '<tr>' +
            [S[i] ? S[i][0] : '', S[i] ? S[i][1] : '', '',
              D[i] ? D[i][0] : '', D[i] ? D[i][1] : '', D[i] ? D[i][2] : '']
              .map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      } else {
        const rows = [];
        S.forEach(s => D.forEach(d => {
          const match = s[1] === d[0], budget = d[2] < 100000;
          let cls = '';
          if (k === 2) cls = match ? 'hi' : 'out';
          if (k === 3) { if (!match) return; cls = budget ? 'hi' : 'out'; }
          rows.push([s[0], s[1], d[0], d[1], d[2], cls]);
        }));
        html = '<thead><tr><th>name</th><th>s.dept_name</th><th>d.dept_name</th><th>building</th><th>budget</th></tr></thead><tbody>' +
          rows.map(r => `<tr class="${r[5]}">` + r.slice(0, 5).map(v => `<td>${v}</td>`).join('') +
            '</tr>').join('') + '</tbody>';
      }
      $('#ca-tbl').innerHTML = html;
      $('#ca-hd').innerHTML = ST[k][0];
      $('#ca-cnt').textContent = k === 0 ? '4 rows and 3 rows'
        : k === 1 ? '12 rows' : k === 2 ? '4 of 12 match' : '2 answers';
      $('#ca-lbl').textContent = 'stage ' + (k + 1) + ' of 4';
      $('#ca-note').innerHTML = ST[k][1];
      $('#ca-step').disabled = k >= 3;
      $('#ca-back').disabled = k <= 0;
      $('#f-cart-msg').textContent = k === 1
        ? 'Every pairing exists at this point, including the meaningless ones. Nothing has been filtered yet.'
        : 'the product is formed first, and only then is it filtered';
    }
    $('#ca-step').onclick = () => { if (k < 3) k++; draw(); };
    $('#ca-back').onclick = () => { if (k > 0) k--; draw(); };
    $('#ca-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 3.4 LIKE ---- */
  (function () {
    const C = [['BIO-101', 'Intro. to Biology'], ['BIO-301', 'Genetics'],
      ['CS-101', 'Intro. to Computer Science'], ['CS-319', 'Image Processing'],
      ['FIN-201', 'Investment Banking'], ['HIS-351', 'World History'],
      ['PHY-101', 'Physical Principles']];
    const P = {
      a: ['___-%', 'exactly three characters, a hyphen, then anything',
        'The lecture&rsquo;s answer. Three underscores force a three-letter department code, so <b>CS-101 and CS-319 are excluded</b>: their code is only two letters, and the third underscore would have to consume the hyphen.'],
      b: ['__-%', 'exactly two characters, a hyphen, then anything',
        'The mirror image: now only the <b>two-letter</b> codes match, and every three-letter one is excluded.'],
      c: ['%-%', 'anything, a hyphen, anything',
        'Everything matches, because every course id contains a hyphen. A percent on both sides is almost always too loose to be useful.'],
      d: ['____%', 'at least four characters',
        'Four underscores force four characters to exist and the percent allows any number more, so this matches <b>everything</b> here. It is the shape to use for "at least N characters".'],
      e: ['%1%', 'a 1 anywhere in the string',
        'Position-free matching. It catches BIO-101, CS-101 and CS-319, since each contains a 1 somewhere.'],
    };
    function draw(k) {
      const [pat, gloss, note] = P[k];
      const rx = new RegExp('^' + pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/_/g, '.').replace(/%/g, '.*') + '$');
      const hits = C.filter(c => rx.test(c[0]));
      $('#lk-tbl').innerHTML = '<thead><tr><th>course_id</th><th>title</th><th>matches?</th></tr></thead><tbody>' +
        C.map(c => {
          const ok = rx.test(c[0]);
          return `<tr class="${ok ? 'hi' : 'out'}"><td>${c[0]}</td><td>${c[1]}</td>` +
            `<td>${ok ? 'yes' : 'no'}</td></tr>`;
        }).join('') + '</tbody>';
      $('#lk-p').innerHTML = "course_id LIKE '" + pat + "'  &middot; " + gloss;
      $('#lk-cnt').textContent = hits.length + ' of ' + C.length + ' match';
      $('#lk-note').innerHTML = note;
      const m = $('#f-like-msg');
      m.className = 'msg ' + (k === 'a' ? 'good' : '');
      m.textContent = k === 'a'
        ? 'Four titles come back: the Biology, Finance, History and Physics ones. Exactly what the question asked for.'
        : 'an underscore matches exactly one character; a percent matches any number, including none';
    }
    setPills($('#f-like'), 'lk', draw);
    draw('a');
  })();

  /* ---- Fig 3.5 ORDER BY ---- */
  (function () {
    const R = [['Zhang', 'Comp. Sci.', 102], ['Shankar', 'Comp. Sci.', 32],
      ['Brandt', 'Comp. Sci.', 58], ['Chavez', 'Comp. Sci.', 54],
      ['Peltier', 'Biology', 8], ['Levy', 'Physics', 46], ['Williams', 'Biology', 54]];
    const S = {
      n: [null, 'stored order', 'No <code>ORDER BY</code>, so the rows arrive in whatever order the engine finds them. <b>That is not a guarantee</b>: without ORDER BY, no order is promised at all.'],
      a: [(a, b) => a[1].localeCompare(b[1]), 'dept_name ASC',
        'Sorted by department alphabetically. Within Comp. Sci. the credits are in no particular order, because nothing was said about them.'],
      b: [(a, b) => a[1].localeCompare(b[1]) || b[2] - a[2], 'dept_name ASC, tot_cred DESC',
        'The lecture&rsquo;s query. Departments alphabetically, and <b>within</b> each department the highest credits first: 102, 58, 54, 32 for Comp. Sci.'],
      c: [(a, b) => a[1].localeCompare(b[1]) || a[2] - b[2], 'dept_name ASC, tot_cred ASC',
        'Only the second key changed, and only the order <b>within</b> each department changed with it. The department ordering is untouched, which is the whole point of a tie-breaker.'],
      d: [(a, b) => b[2] - a[2], 'tot_cred DESC',
        'Credits alone. Departments are now scattered, because nothing is sorting them.'],
    };
    function draw(k) {
      const [cmp, hd, note] = S[k];
      const rows = cmp ? [...R].sort(cmp) : R;
      let prev = null;
      $('#or-tbl').innerHTML = '<thead><tr><th>name</th><th>dept_name</th><th>tot_cred</th></tr></thead><tbody>' +
        rows.map(r => {
          const nd = (k === 'a' || k === 'b' || k === 'c') && r[1] !== prev;
          prev = r[1];
          return `<tr class="${nd ? 'cu' : ''}">` + r.map(v => `<td>${v}</td>`).join('') + '</tr>';
        }).join('') + '</tbody>';
      $('#or-hd').innerHTML = cmp ? 'ORDER BY ' + hd : hd;
      $('#or-cnt').textContent = rows.length + ' rows';
      $('#or-note').innerHTML = note;
    }
    setPills($('#f-ord'), 'or', draw);
    draw('n');
  })();

  /* ---- Fig 3.6 set operations ---- */
  (function () {
    const I = [['Srinivasan', 'Comp. Sci.', 65000], ['Wu', 'Finance', 90000],
      ['Katz', 'Comp. Sci.', 75000], ['Singh', 'Finance', 80000],
      ['Brandt', 'Comp. Sci.', 92000], ['Crick', 'Biology', 72000], ['Gold', 'Physics', 87000]];
    const A = I.filter(r => r[1] === 'Comp. Sci.' || r[1] === 'Finance');
    const B = I.filter(r => r[2] < 90000 && r[2] > 70000);
    const OP = {
      u: ['UNION', 'rows in either set, duplicates removed'],
      ua: ['UNION ALL', 'rows in either set, duplicates kept'],
      i: ['INTERSECT', 'rows in both sets'],
      e: ['EXCEPT', 'rows in A that are not in B'],
    };
    function draw(k) {
      const an = A.map(r => r[0]), bn = B.map(r => r[0]);
      let res;
      if (k === 'u') res = [...new Set([...an, ...bn])];
      else if (k === 'ua') res = [...an, ...bn];
      else if (k === 'i') res = an.filter(x => bn.includes(x));
      else res = an.filter(x => !bn.includes(x));
      const t = (id, arr, cls) => $(id).innerHTML = '<thead><tr><th>name</th></tr></thead><tbody>' +
        (arr.length ? arr.map(v => `<tr class="${cls || ''}"><td>${v}</td></tr>`).join('')
          : '<tr><td class="nul">empty</td></tr>') + '</tbody>';
      t('#st-a', an); t('#st-b', bn); t('#st-r', res, 'hi');
      $('#st-la').textContent = 'A: in Comp. Sci. or Finance';
      $('#st-lb').textContent = 'B: salary between 70k and 90k';
      $('#st-hd').innerHTML = 'A ' + OP[k][0] + ' B  &middot;  ' + OP[k][1];
      $('#st-cnt').textContent = res.length + ' rows';
      $('#st-note').innerHTML = k === 'e'
        ? 'The lecture&rsquo;s query. Set B is the <b>middle</b> of the salary range, and subtracting it leaves exactly the people at the two ends: <b>' +
          res.join(', ') + '</b>. Srinivasan is at 65000, below 70k; Wu at 90000 and Brandt at 92000 are at or above 90k. Katz and Singh sat in the gap and were removed.'
        : k === 'ua'
          ? 'Katz and Singh are in <b>both</b> sets, so UNION ALL lists each of them twice. UNION would collapse those to one apiece, and would also be slower for having to check.'
          : k === 'u'
            ? 'Every name once, however many sets it came from. This is the default behaviour of a set operation.'
            : 'Only the names present in both: the Comp. Sci. and Finance instructors whose salary falls in the middle band.';
      const m = $('#f-set-msg');
      m.className = 'msg ' + (k === 'e' ? 'good' : '');
      m.textContent = k === 'e'
        ? 'Building the gap and subtracting it is far easier than writing an outward range directly.'
        : 'subtracting the middle leaves the two ends';
    }
    setPills($('#f-set'), 'st', draw);
    draw('e');
  })();

  /* ---- Fig 3.7 aggregates ---- */
  (function () {
    const R = [['s1', 'BIO-101', 78], ['s2', 'BIO-101', 91], ['s1', 'CS-319', 78],
      ['s3', 'BIO-101', null], ['s4', 'CS-319', 64]];
    const marks = R.map(r => r[2]).filter(v => v !== null);
    const sum = marks.reduce((a, b) => a + b, 0);
    const F = {
      'count*': ['COUNT(*)', R.length, 'Counts <b>rows</b>, so the row with no mark is included. Five rows in, five out.'],
      count: ['COUNT(marks)', marks.length, 'Counts <b>non-null values</b>. The missing mark is skipped, so this is 4 and not 5.'],
      countd: ['COUNT(DISTINCT id)', new Set(R.map(r => r[0])).size, 's1 appears twice but counts once. Four <b>different</b> students.'],
      sum: ['SUM(marks)', sum, 'Adds the non-null values: 78 + 91 + 78 + 64.'],
      avg: ['AVG(marks)', (sum / marks.length).toFixed(2),
        'Divides by <b>4</b>, not 5. A missing mark is absent, not zero; this is the one that surprises people.'],
      min: ['MIN(marks)', Math.min(...marks), 'Smallest non-null value.'],
      max: ['MAX(marks)', Math.max(...marks), 'Largest non-null value.'],
    };
    function draw(k) {
      const ignoresNull = k !== 'count*' && k !== 'countd';
      $('#ag-tbl').innerHTML = '<thead><tr><th>id</th><th>course_id</th><th>marks</th></tr></thead><tbody>' +
        R.map(r => `<tr class="${r[2] === null && ignoresNull ? 'out' : ''}">` +
          `<td>${r[0]}</td><td>${r[1]}</td>` +
          `<td${r[2] === null ? ' class="nul"' : ''}>${r[2] === null ? 'NULL' : r[2]}</td></tr>`).join('') +
        '</tbody>';
      $('#ag-res').innerHTML = `<thead><tr><th>${F[k][0]}</th></tr></thead><tbody>` +
        `<tr class="hi"><td>${F[k][1]}</td></tr></tbody>`;
      $('#ag-work').innerHTML = F[k][2];
    }
    setPills($('#f-agg'), 'ag', draw);
    draw('count*');
  })();

  /* ---- Fig 3.8 group by pipeline on classroom ---- */
  (function () {
    const R = [['Packard', '101', 500], ['Painter', '514', 10], ['Taylor', '3128', 70],
      ['Watson', '100', 30], ['Watson', '120', 50]];
    const ST = ['1 · FROM classroom', '2 · WHERE (none in this query)',
      '3 · GROUP BY building', '4 · HAVING AVG(capacity) > 25',
      '5 · SELECT building, AVG(capacity)', '6 · the finished answer'];
    const NOTE = [
      'The whole stored table is fetched: every row, every column. Nothing has been filtered or computed yet.',
      'This query has no <code>WHERE</code>, so nothing is removed. The stage still happens; it simply passes everything through.',
      'Rows are gathered into piles sharing a building name. <b>Watson&rsquo;s two rooms join one pile.</b> Nothing has been computed yet; the piles simply exist.',
      'Each pile is reduced to its average and the <b>whole pile</b> is kept or dropped. Watson averages (30 + 50) / 2 = 40, which survives. Painter is 10, so it goes.',
      'Only now are the output columns chosen: one row per surviving group.',
      'Three buildings come back. Packard and Taylor had a single room each, so their "average" is just that room&rsquo;s capacity.',
    ];
    let k = 0;
    function draw() {
      let html = '', cnt = '';
      if (k <= 1) {
        html = '<thead><tr><th>building</th><th>room_number</th><th>capacity</th></tr></thead><tbody>' +
          R.map(r => '<tr>' + r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
        cnt = R.length + ' rows';
      } else {
        const g = {};
        R.forEach(r => { (g[r[0]] = g[r[0]] || []).push(r); });
        const keys = Object.keys(g);
        const avg = d => g[d].reduce((a, r) => a + r[2], 0) / g[d].length;
        if (k === 2) {
          html = '<thead><tr><th>group</th><th>rows in this pile</th></tr></thead><tbody>' +
            keys.map(d => `<tr class="cu"><td>${d}</td><td>` +
              g[d].map(r => 'room ' + r[1] + ', capacity ' + r[2]).join(' · ') + '</td></tr>').join('') +
            '</tbody>';
          cnt = keys.length + ' groups';
        } else {
          let ks = keys.map(d => [d, avg(d) > 25]);
          if (k >= 4) ks = ks.filter(x => x[1]);
          html = '<thead><tr><th>building</th><th>avg_capacity</th></tr></thead><tbody>' +
            ks.map(x => `<tr class="${k === 3 ? (x[1] ? 'hi' : 'out') : ''}">` +
              `<td>${x[0]}</td><td>${avg(x[0])}</td></tr>`).join('') + '</tbody>';
          cnt = ks.length + ' groups';
        }
      }
      $('#grp-tbl').innerHTML = html;
      $('#grp-stage').textContent = ST[k];
      $('#grp-cnt').textContent = cnt;
      $('#grp-lbl').textContent = 'stage ' + (k + 1) + ' of 6';
      $('#grp-note').innerHTML = NOTE[k];
      $('#grp-step').disabled = k >= 5;
      $('#grp-back').disabled = k <= 0;
    }
    $('#grp-step').onclick = () => { if (k < 5) k++; draw(); };
    $('#grp-back').onclick = () => { if (k > 0) k--; draw(); };
    $('#grp-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 3.9 SOME vs ALL ---- */
  (function () {
    const SET = [40, 80];
    let mode = 'some';
    function draw() {
      const v = +$('#q-v').value;
      $('#q-v-v').textContent = v;
      const x = s => 46 + (s - 25) * ((DG.W - 92) / 80);
      let g = DG.line(30, 74, DG.W - 26, 74, { stroke: '#e5e5e3' });
      SET.forEach(s => {
        const beaten = v > s;
        g += `<circle cx="${x(s)}" cy="74" r="6" fill="${beaten ? 'var(--green-tint)' : 'var(--terra-tint)'}" ` +
          `stroke="${beaten ? 'var(--green)' : 'var(--terra)'}"/>` +
          DG.txt(x(s), 96, String(s), { anchor: 'middle', cls: 'm mu' });
      });
      g += DG.line(x(v), 40, x(v), 88, { stroke: 'var(--indigo)', sw: 1.6 });
      g += DG.txt(x(v), 32, String(v), { anchor: 'middle', cls: 'm', fill: 'var(--indigo)' });
      g += DG.txt(DG.PAD, 116, 'the two Biology salaries, in thousands', { cls: 'm mu' });
      $('#q-svg').innerHTML = g;
      const nBeat = SET.filter(s => v > s).length;
      const ok = mode === 'some' ? nBeat >= 1 : nBeat === SET.length;
      $('#q-verd').textContent = (mode === 'some' ? '> SOME' : '> ALL') + ' is ' + (ok ? 'TRUE' : 'FALSE');
      $('#q-note').innerHTML = mode === 'some'
        ? 'SOME needs the candidate to beat <b>at least one</b> value, so it only has to clear the smallest, ' +
          Math.min(...SET) + '. It currently beats ' + nBeat + ' of ' + SET.length + '.'
        : 'ALL needs the candidate to beat <b>every</b> value, so it must clear the largest, ' +
          Math.max(...SET) + '. It currently beats ' + nBeat + ' of ' + SET.length + '.';
      const m = $('#f-quant-msg');
      m.className = 'msg ' + (ok ? 'good' : 'bad');
      m.textContent = v === 40 && mode === 'some'
        ? 'This is instructor D from the worked table. 40000 is not greater than itself, so the lowest-paid Biology instructor is the one person SOME excludes.'
        : v === 80 && mode === 'all'
          ? 'This is instructor B, the highest-paid in Biology. Even B fails ALL, which is why no Biology instructor can ever appear in that answer.'
          : 'SOME only has to beat the smallest; ALL has to beat the largest.';
    }
    $('#q-v').oninput = draw;
    setPills($('#f-quant'), 'qm', v => { mode = v; draw(); });
    draw();
  })();

  /* ---- Fig 3.10 correlated EXISTS ---- */
  (function () {
    const OUT = [['CS-101', 'Fall 2009'], ['CS-102', 'Fall 2009'], ['CS-347', 'Fall 2009'],
      ['PHY-101', 'Fall 2009']];
    const SPRING = { 'CS-101': ['sec 1'], 'CS-347': ['sec 1', 'sec 2'], 'CS-102': [], 'PHY-101': [] };
    let i = 0, mode = 'ex';
    function draw() {
      const f = OUT[i], hits = SPRING[f[0]] || [];
      $('#ex-out').innerHTML = '<thead><tr><th>course_id</th><th>outer row</th></tr></thead><tbody>' +
        OUT.map((r, j) => `<tr class="${j === i ? 'cu' : ''}"><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') +
        '</tbody>';
      $('#ex-il').innerHTML = 'inner query, with s.course_id = ' + f[0];
      $('#ex-in').innerHTML = '<thead><tr><th>Spring 2010 rows</th></tr></thead><tbody>' +
        (hits.length ? hits.map(t => `<tr class="hi"><td>${t}</td></tr>`).join('')
          : '<tr><td class="nul">no rows</td></tr>') + '</tbody>';
      const val = hits.length > 0, keep = mode === 'not' ? !val : val;
      $('#ex-note').innerHTML = 'For <b>' + f[0] + '</b> the inner query returns ' +
        (val ? hits.length + ' row' + (hits.length > 1 ? 's' : '') : 'nothing') +
        ', so <code>EXISTS</code> is <b>' + val + '</b> and <code>' +
        (mode === 'not' ? 'NOT EXISTS' : 'EXISTS') + '</code> is <b>' + keep + '</b>, so ' +
        f[0] + ' is ' + (keep ? '<b>kept</b>' : 'dropped') + '.';
      $('#f-ex-msg').textContent = mode === 'ex'
        ? 'EXISTS keeps the Fall 2009 courses that were also taught in Spring 2010. The inner query never has to say which section, only whether there was one.'
        : 'NOT EXISTS flips it, giving the courses taught in Fall 2009 but never in Spring 2010. Step through: the inner table changes every time, because it is re-run per outer row.';
    }
    $('#ex-step').onclick = () => { i = (i + 1) % OUT.length; draw(); };
    $('#ex-reset').onclick = () => { i = 0; draw(); };
    setPills($('#f-ex'), 'exm', v => { mode = v; draw(); });
    draw();
  })();

  /* ---- Fig 3.11 division ---- */
  (function () {
    const REQ = ['BIO-101', 'BIO-102', 'BIO-103'];
    const S = { x: ['BIO-101', 'BIO-102', 'BIO-103', 'CS-319'], y: ['BIO-101', 'BIO-102'],
      z: ['BIO-103', 'BIO-101', 'BIO-102', 'PHY-100'] };
    const NM = { x: 'Asha', y: 'Ravi', z: 'Meera' };
    function draw(k) {
      const taken = S[k], left = REQ.filter(c => !taken.includes(c));
      const t = (id, arr, mark) => $(id).innerHTML = '<thead><tr><th>course_id</th></tr></thead><tbody>' +
        (arr.length ? arr.map(v => `<tr class="${mark && REQ.includes(v) ? 'hi' : ''}"><td>${v}</td></tr>`).join('')
          : '<tr><td class="nul">empty</td></tr>') + '</tbody>';
      t('#dv-a', REQ); t('#dv-b', taken, true);
      $('#dv-r').innerHTML = '<thead><tr><th>course_id</th></tr></thead><tbody>' +
        (left.length ? left.map(v => `<tr class="lo"><td>${v}</td></tr>`).join('')
          : '<tr class="hi"><td>empty</td></tr>') + '</tbody>';
      $('#dv-bl').textContent = 'taken by ' + NM[k];
      $('#dv-note').innerHTML = left.length
        ? '<code>NOT EXISTS</code> is <b>false</b>: ' + left.length + ' course' +
          (left.length > 1 ? 's are' : ' is') + ' left over, so ' + NM[k] + ' is not in the answer.'
        : '<code>NOT EXISTS</code> is <b>true</b>: nothing is left over, so ' + NM[k] +
          ' took every Biology course.';
      const m = $('#f-div-msg');
      m.className = 'msg ' + (left.length ? 'bad' : 'good');
      m.textContent = left.length
        ? NM[k] + ' is missing ' + left.join(' and ') + '. Extra courses outside Biology do no harm: subtraction only removes, it never adds.'
        : NM[k] + ' covered the whole requirement. The extra non-Biology course is irrelevant, because it is not in the set being subtracted from.';
    }
    setPills($('#f-div'), 'dv', draw);
    draw('x');
  })();

  /* ---- Fig 3.12 joins ---- */
  (function () {
    const L = [['m1', 'Asha'], ['m2', 'Ravi'], ['m3', 'Meera']];
    const Rr = [['m1', 'Ulysses'], ['m1', 'Dune'], ['m2', 'Emma'], ['m9', 'Hamlet']];
    const N = {
      inner: 'Only matching pairs survive. <b>Meera</b> borrowed nothing so she vanishes, and loan <b>m9</b> belongs to no member so it vanishes too.',
      left: 'Every member is kept. Meera has no loan, so the title comes back as NULL. This is how you ask "everyone, <i>with</i> their loans if any".',
      right: 'Every loan is kept. Loan m9 has no matching member, so the name is NULL, which usually signals data that should not exist.',
      full: 'Both sides kept in full. Unmatched rows appear from either direction, padded with NULL.',
    };
    function draw(kind) {
      $('#j-l').innerHTML = '<thead><tr><th>mem_no</th><th>name</th></tr></thead><tbody>' +
        L.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
      $('#j-r').innerHTML = '<thead><tr><th>mem_no</th><th>title</th></tr></thead><tbody>' +
        Rr.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + '</tbody>';
      const out = [];
      if (kind === 'right') {
        Rr.forEach(r => {
          const l = L.find(x => x[0] === r[0]);
          out.push([r[0], l ? l[1] : null, r[1], l ? '' : 'lo']);
        });
      } else {
        L.forEach(l => {
          const hits = Rr.filter(r => r[0] === l[0]);
          if (hits.length) hits.forEach(h => out.push([l[0], l[1], h[1], '']));
          else if (kind === 'left' || kind === 'full') out.push([l[0], l[1], null, 'lo']);
        });
        if (kind === 'full') {
          Rr.filter(r => !L.some(l => l[0] === r[0]))
            .forEach(r => out.push([r[0], null, r[1], 'lo']));
        }
      }
      $('#j-res').innerHTML = '<thead><tr><th>mem_no</th><th>name</th><th>title</th></tr></thead><tbody>' +
        out.map(r => `<tr class="${r[3]}">` + r.slice(0, 3).map(v =>
          `<td${v === null ? ' class="nul"' : ''}>${v === null ? 'NULL' : v}</td>`).join('') +
          '</tr>').join('') + '</tbody>';
      $('#j-rl').textContent = 'result of ' + kind.toUpperCase() + ' join (' + out.length + ' rows)';
      $('#j-note').innerHTML = N[kind];
    }
    setPills($('#f-join'), 'jn', draw);
    draw('inner');
  })();

  /* ---- Fig 3.13 natural join trap ---- */
  (function () {
    const A = [['1', 'CS', 'Katz'], ['2', 'CS', 'Brandt'], ['3', 'BIO', 'Crick']];
    const B = [['1', 'CS', 'Taylor'], ['2', 'BIO', 'Watson'], ['3', 'BIO', 'Painter']];
    const N = {
      0: 'No column names in common, so natural join has nothing to match on and quietly becomes a <b>full Cartesian product</b>: nine rows from three and three.',
      1: 'One shared name, <code>id</code>. Rows match on id alone, giving the three sensible pairs.',
      2: 'Now <code>dept</code> is shared too, so it matches on <b>id AND dept together</b>. One row disappears because its two departments disagree, and the query text never changed.',
    };
    function draw(n) {
      n = +n;
      const out = [];
      A.forEach(a => B.forEach(b => {
        if (n >= 1 && a[0] !== b[0]) return;
        if (n >= 2 && a[1] !== b[1]) return;
        out.push([a[0], a[1], a[2], b[0], b[1], b[2]]);
      }));
      const heads = n === 0 ? ['a.id', 'a.dept', 'name', 'b.id', 'b.dept', 'building']
        : n === 1 ? ['id', 'a.dept', 'name', 'b.dept', 'building']
          : ['id', 'dept', 'name', 'building'];
      $('#nat-tbl').innerHTML = '<thead><tr>' + heads.map(h => `<th>${h}</th>`).join('') +
        '</tr></thead><tbody>' + out.map(r => {
        const cells = n === 0 ? r : n === 1 ? [r[0], r[1], r[2], r[4], r[5]] : [r[0], r[1], r[2], r[5]];
        return '<tr class="hi">' + cells.map(v => `<td>${v}</td>`).join('') + '</tr>';
      }).join('') + '</tbody>';
      $('#nat-hd').textContent = 'instructor NATURAL JOIN office' +
        (n === 0 ? '  (nothing shared)' : n === 1 ? '  (shared: id)' : '  (shared: id, dept)');
      $('#nat-cnt').textContent = out.length + ' rows';
      $('#nat-note').innerHTML = N[n];
      const m = $('#f-nat-msg');
      m.className = 'msg ' + (n === 1 ? 'good' : 'bad');
      m.textContent = n === 1
        ? 'This is the case you meant. The other two are what happens when the column names do not match your intention.'
        : 'natural join matches on all shared names at once, which is not always what you meant';
    }
    setPills($('#f-nat'), 'nt', draw);
    draw('1');
  })();

  /* ---- Fig 3.14 library schema ---- */
  (function () {
    const T = {
      faculty: ['faculty(id, fname, lname, dept_code)', 'One row per member of staff. Joins to <i>member</i> on <code>id</code>.'],
      member: ['member(id, mem_no, mem_type)', 'The library card. <b>mem_type</b> is where UG / PG / faculty is recorded, not in any table with "degree" in its name.'],
      issue: ['book_issue(mem_no, accession_no, date_of_issue)', 'One row per loan. Somebody who never borrowed has <b>no row here at all</b>, which is what makes inner joins filter them out.'],
      copy: ['book_copy(accession_no, isbn_no)', 'One row per physical copy. A library may hold six copies of one title.'],
      cat: ['book_catalog(isbn_no, title, author)', 'One row per title. This is the <b>only</b> place the title lives.'],
    };
    const BOX = [['faculty', 6, 84], ['member', 106, 78], ['issue', 202, 92], ['copy', 314, 76], ['cat', 410, 100]];
    const LINK = [[90, 'id'], [184, 'mem_no'], [294, 'accession_no'], [390, 'isbn_no']];
    function draw(k) {
      let s = '';
      BOX.forEach(([id, x, w]) => {
        const on = id === k;
        s += DG.box(x, 34, w, 32, id, null, {
          fill: on ? 'var(--indigo-tint)' : '#fff',
          stroke: on ? 'var(--indigo)' : '#e5e5e3', cls: 'm',
        });
      });
      LINK.forEach(([x, lab]) => {
        s += DG.line(x, 50, x + 16, 50);
        s += DG.txt(x + 8, 82, lab, { anchor: 'middle', cls: 'm mu' });
      });
      s += DG.txt(DG.PAD, 20, 'a faculty member and a book title are four joins apart', { cls: 'm mu' });
      s += DG.txt(DG.PAD, 106, 'there is no direct link between the two ends', { cls: 'm mu' });
      $('#lb-svg').innerHTML = s;
      $('#lb-note').innerHTML = k ? '<b>' + T[k][0] + '</b><br>' + T[k][1]
        : 'Pick a table to see what it holds and how it connects.';
    }
    setPills($('#f-lib'), 'lb', draw);
    draw(null);
  })();

  /* ---- Fig 3.15 teams and matches ---- */
  (function () {
    const M = [[1, 'T1', 'T2'], [2, 'T1', 'T3'], [3, 'T2', 'T1'], [4, 'T3', 'T1'],
      [5, 'T2', 'T3'], [6, 'T1', 'T2']];
    const NAME = { T1: 'Rovers', T2: 'Strikers', T3: 'United' };
    function draw(k) {
      $('#tm-src').innerHTML = '<thead><tr><th>match_no</th><th>hosting</th><th>guest</th></tr></thead><tbody>' +
        M.map(r => '<tr>' + r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</tbody>';
      let app = [];
      M.forEach(r => { app.push(r[1]); app.push(r[2]); });
      if (k === 'u') app = [...new Set(app)];
      $('#tm-mid').innerHTML = '<thead><tr><th>team_id</th></tr></thead><tbody>' +
        app.map(v => `<tr><td>${v}</td></tr>`).join('') + '</tbody>';
      const cnt = {};
      app.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; });
      const rows = Object.keys(cnt).sort().map(t => [NAME[t], cnt[t], cnt[t] > 3]);
      $('#tm-out').innerHTML = '<thead><tr><th>team_name</th><th>COUNT(*)</th></tr></thead><tbody>' +
        rows.map(r => `<tr class="${r[2] ? 'hi' : 'out'}"><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') +
        '</tbody>';
      $('#tm-ml').textContent = k === 'u' ? 'after UNION' : 'after UNION ALL';
      $('#tm-hd').textContent = 'six matches, three teams';
      $('#tm-cnt').textContent = app.length + ' appearance rows';
      const win = rows.filter(r => r[2]).map(r => r[0]);
      $('#tm-note').innerHTML = k === 'all'
        ? 'Each match contributes <b>two</b> rows, one per side, so the appearance list has ' + app.length +
          ' rows for 6 matches. Counting them gives each team its true number of matches, and <b>' +
          (win.join(', ') || 'nobody') + '</b> clears the threshold of 3.'
        : 'UNION removed the duplicates, so every team now appears <b>exactly once</b> and every count is 1. The <code>HAVING COUNT(*) &gt; 3</code> filter now matches <b>nobody</b>, and the query silently returns nothing.';
      const m = $('#f-team-msg');
      m.className = 'msg ' + (k === 'all' ? 'good' : 'bad');
      m.textContent = k === 'all'
        ? 'The duplicates are the count. This is the one place where UNION ALL is not merely faster but the only correct choice.'
        : 'A wrong answer with no error message: the query runs perfectly and returns an empty result.';
    }
    setPills($('#f-team'), 'tm', draw);
    draw('all');
  })();
}
</script>
